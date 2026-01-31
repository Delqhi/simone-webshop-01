/**
 * Session Persistence Module for Browserless CDP Connections
 * 
 * This module provides session management logic to maintain browser state
 * across reconnections and disconnects for the 2Captcha Worker.
 * 
 * Features:
 * - Cookie persistence (save/restore)
 * - LocalStorage/SessionStorage backup
 * - Page state restoration (URL, scroll position, form data)
 * - Automatic session recovery after disconnect
 * - Auto-save every 30 seconds
 * 
 * @module session-persistence
 * @version 1.0.0
 */

import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
const unlink = promisify(fs.unlink);
const readdir = promisify(fs.readdir);

/**
 * Session data structure for storing browser state
 */
export interface SessionData {
  /** Unique session identifier */
  sessionId: string;
  /** Timestamp of last save */
  timestamp: number;
  /** Current page URL */
  url: string;
  /** Browser cookies */
  cookies: Array<{
    name: string;
    value: string;
    domain: string;
    path: string;
    expires?: number;
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: string;
  }>;
  /** LocalStorage data */
  localStorage: Record<string, string>;
  /** SessionStorage data */
  sessionStorage: Record<string, string>;
  /** Page scroll position */
  scrollPosition: { x: number; y: number };
  /** Form field data */
  formData: Record<string, string>;
  /** Additional metadata */
  metadata?: {
    userAgent?: string;
    viewport?: { width: number; height: number };
    timezone?: string;
    language?: string;
  };
}

/**
 * Configuration options for SessionPersistence
 */
export interface SessionPersistenceConfig {
  /** Directory to store session data */
  dataDir: string;
  /** Auto-save interval in milliseconds (default: 30000) */
  autoSaveInterval: number;
  /** Maximum number of session files to keep (default: 10) */
  maxSessions: number;
  /** Enable encryption for sensitive data (default: false) */
  encryptSensitiveData: boolean;
  /** Fields to exclude from persistence */
  excludedFields: string[];
}

/**
 * Default configuration
 */
const DEFAULT_CONFIG: SessionPersistenceConfig = {
  dataDir: './session-data',
  autoSaveInterval: 30000,
  maxSessions: 10,
  encryptSensitiveData: false,
  excludedFields: ['password', 'token', 'secret', 'apiKey', 'auth'],
};

/**
 * CDP Client interface for type safety
 */
export interface CDPClient {
  send: (method: string, params?: Record<string, unknown>) => Promise<unknown>;
  on: (event: string, callback: (...args: unknown[]) => void) => void;
  removeListener: (event: string, callback: (...args: unknown[]) => void) => void;
}

/**
 * Session Persistence Manager
 * 
 * Manages browser session state persistence for CDP connections.
 * Provides methods to save, restore, and clear session data.
 */
export class SessionPersistence {
  private config: SessionPersistenceConfig;
  private currentSessionId: string | null = null;
  private autoSaveTimer: NodeJS.Timeout | null = null;
  private cdpClient: CDPClient | null = null;
  private isInitialized = false;

  /**
   * Creates a new SessionPersistence instance
   * @param config - Configuration options (partial, will be merged with defaults)
   */
  constructor(config: Partial<SessionPersistenceConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Initialize the session persistence manager
   * Creates the data directory if it doesn't exist
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      await mkdir(this.config.dataDir, { recursive: true });
      this.isInitialized = true;
      console.log(`[SessionPersistence] Initialized with data directory: ${this.config.dataDir}`);
    } catch (error) {
      console.error('[SessionPersistence] Failed to initialize:', error);
      throw new Error(`Failed to initialize session persistence: ${error}`);
    }
  }

  /**
   * Set the CDP client for session operations
   * @param client - CDP client instance
   */
  setCDPClient(client: CDPClient): void {
    this.cdpClient = client;
  }

  /**
   * Generate a unique session ID
   * @returns Unique session identifier
   */
  generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Start a new session
   * @param sessionId - Optional session ID (will generate if not provided)
   * @returns The session ID
   */
  async startSession(sessionId?: string): Promise<string> {
    await this.initialize();
    
    this.currentSessionId = sessionId || this.generateSessionId();
    console.log(`[SessionPersistence] Started session: ${this.currentSessionId}`);
    
    // Start auto-save
    this.startAutoSave();
    
    return this.currentSessionId;
  }

  /**
   * Stop the current session and cleanup
   */
  async stopSession(): Promise<void> {
    this.stopAutoSave();
    
    if (this.currentSessionId) {
      console.log(`[SessionPersistence] Stopped session: ${this.currentSessionId}`);
      this.currentSessionId = null;
    }
  }

  /**
   * Get the current session ID
   * @returns Current session ID or null
   */
  getCurrentSessionId(): string | null {
    return this.currentSessionId;
  }

  /**
   * Save current browser session state
   * @param sessionId - Optional session ID (uses current if not provided)
   * @returns The saved session data
   */
  async saveSession(sessionId?: string): Promise<SessionData> {
    await this.initialize();
    
    const targetSessionId = sessionId || this.currentSessionId;
    if (!targetSessionId) {
      throw new Error('No active session to save');
    }

    if (!this.cdpClient) {
      throw new Error('CDP client not set');
    }

    try {
      const sessionData = await this.captureSessionState(targetSessionId);
      const filePath = this.getSessionFilePath(targetSessionId);
      
      // Filter out sensitive data
      const filteredData = this.filterSensitiveData(sessionData);
      
      await writeFile(filePath, JSON.stringify(filteredData, null, 2), 'utf8');
      console.log(`[SessionPersistence] Saved session: ${targetSessionId}`);
      
      // Cleanup old sessions
      await this.cleanupOldSessions();
      
      return filteredData;
    } catch (error) {
      console.error('[SessionPersistence] Failed to save session:', error);
      throw new Error(`Failed to save session: ${error}`);
    }
  }

  /**
   * Restore browser session state
   * @param sessionId - Session ID to restore
   * @returns The restored session data
   */
  async restoreSession(sessionId: string): Promise<SessionData> {
    await this.initialize();
    
    if (!this.cdpClient) {
      throw new Error('CDP client not set');
    }

    try {
      const filePath = this.getSessionFilePath(sessionId);
      const data = await readFile(filePath, 'utf8');
      const sessionData: SessionData = JSON.parse(data);
      
      await this.applySessionState(sessionData);
      
      this.currentSessionId = sessionId;
      console.log(`[SessionPersistence] Restored session: ${sessionId}`);
      
      // Restart auto-save
      this.startAutoSave();
      
      return sessionData;
    } catch (error) {
      console.error('[SessionPersistence] Failed to restore session:', error);
      throw new Error(`Failed to restore session: ${error}`);
    }
  }

  /**
   * Clear/delete a session
   * @param sessionId - Session ID to clear (uses current if not provided)
   */
  async clearSession(sessionId?: string): Promise<void> {
    const targetSessionId = sessionId || this.currentSessionId;
    if (!targetSessionId) {
      return;
    }

    try {
      const filePath = this.getSessionFilePath(targetSessionId);
      
      if (fs.existsSync(filePath)) {
        await unlink(filePath);
        console.log(`[SessionPersistence] Cleared session: ${targetSessionId}`);
      }
      
      if (targetSessionId === this.currentSessionId) {
        this.currentSessionId = null;
        this.stopAutoSave();
      }
    } catch (error) {
      console.error('[SessionPersistence] Failed to clear session:', error);
      throw new Error(`Failed to clear session: ${error}`);
    }
  }

  /**
   * List all available sessions
   * @returns Array of session IDs and their metadata
   */
  async listSessions(): Promise<Array<{ sessionId: string; timestamp: number; url: string }>> {
    await this.initialize();
    
    try {
      const files = await readdir(this.config.dataDir);
      const sessions: Array<{ sessionId: string; timestamp: number; url: string }> = [];
      
      for (const file of files) {
        if (file.endsWith('.json')) {
          try {
            const filePath = path.join(this.config.dataDir, file);
            const data = await readFile(filePath, 'utf8');
            const sessionData: SessionData = JSON.parse(data);
            sessions.push({
              sessionId: sessionData.sessionId,
              timestamp: sessionData.timestamp,
              url: sessionData.url,
            });
          } catch (error) {
            console.warn(`[SessionPersistence] Failed to read session file ${file}:`, error);
          }
        }
      }
      
      // Sort by timestamp (newest first)
      sessions.sort((a, b) => b.timestamp - a.timestamp);
      
      return sessions;
    } catch (error) {
      console.error('[SessionPersistence] Failed to list sessions:', error);
      return [];
    }
  }

  /**
   * Check if a session exists
   * @param sessionId - Session ID to check
   * @returns True if session exists
   */
  async sessionExists(sessionId: string): Promise<boolean> {
    const filePath = this.getSessionFilePath(sessionId);
    return fs.existsSync(filePath);
  }

  /**
   * Start auto-save timer
   */
  private startAutoSave(): void {
    this.stopAutoSave();
    
    this.autoSaveTimer = setInterval(async () => {
      if (this.currentSessionId && this.cdpClient) {
        try {
          await this.saveSession(this.currentSessionId);
        } catch (error) {
          console.error('[SessionPersistence] Auto-save failed:', error);
        }
      }
    }, this.config.autoSaveInterval);
    
    console.log(`[SessionPersistence] Auto-save started (${this.config.autoSaveInterval}ms interval)`);
  }

  /**
   * Stop auto-save timer
   */
  private stopAutoSave(): void {
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
      this.autoSaveTimer = null;
      console.log('[SessionPersistence] Auto-save stopped');
    }
  }

  /**
   * Capture current browser state via CDP
   * @param sessionId - Session ID
   * @returns Session data object
   */
  private async captureSessionState(sessionId: string): Promise<SessionData> {
    if (!this.cdpClient) {
      throw new Error('CDP client not set');
    }

    const sessionData: SessionData = {
      sessionId,
      timestamp: Date.now(),
      url: '',
      cookies: [],
      localStorage: {},
      sessionStorage: {},
      scrollPosition: { x: 0, y: 0 },
      formData: {},
    };

    try {
      // Get current URL
      const locationResult = await this.cdpClient.send('Runtime.evaluate', {
        expression: 'window.location.href',
      }) as { result: { value: string } };
      sessionData.url = locationResult.result.value;
    } catch (error) {
      console.warn('[SessionPersistence] Failed to get URL:', error);
    }

    try {
      // Get cookies
      const cookiesResult = await this.cdpClient.send('Storage.getCookies', {}) as { cookies: SessionData['cookies'] };
      sessionData.cookies = cookiesResult.cookies || [];
    } catch (error) {
      console.warn('[SessionPersistence] Failed to get cookies:', error);
    }

    try {
      // Get localStorage
      const localStorageResult = await this.cdpClient.send('Runtime.evaluate', {
        expression: 'JSON.stringify(localStorage)',
      }) as { result: { value: string } };
      sessionData.localStorage = JSON.parse(localStorageResult.result.value || '{}');
    } catch (error) {
      console.warn('[SessionPersistence] Failed to get localStorage:', error);
    }

    try {
      // Get sessionStorage
      const sessionStorageResult = await this.cdpClient.send('Runtime.evaluate', {
        expression: 'JSON.stringify(sessionStorage)',
      }) as { result: { value: string } };
      sessionData.sessionStorage = JSON.parse(sessionStorageResult.result.value || '{}');
    } catch (error) {
      console.warn('[SessionPersistence] Failed to get sessionStorage:', error);
    }

    try {
      // Get scroll position
      const scrollResult = await this.cdpClient.send('Runtime.evaluate', {
        expression: 'JSON.stringify({x: window.scrollX, y: window.scrollY})',
      }) as { result: { value: string } };
      sessionData.scrollPosition = JSON.parse(scrollResult.result.value || '{"x":0,"y":0}');
    } catch (error) {
      console.warn('[SessionPersistence] Failed to get scroll position:', error);
    }

    try {
      // Get form data (simple approach - gets values from input, textarea, select elements)
      const formDataResult = await this.cdpClient.send('Runtime.evaluate', {
        expression: `
          (function() {
            const data = {};
            const inputs = document.querySelectorAll('input, textarea, select');
            inputs.forEach((input, index) => {
              const name = input.name || input.id || 'field_' + index;
              if (input.type !== 'password' && input.type !== 'hidden') {
                data[name] = input.value;
              }
            });
            return JSON.stringify(data);
          })()
        `,
      }) as { result: { value: string } };
      sessionData.formData = JSON.parse(formDataResult.result.value || '{}');
    } catch (error) {
      console.warn('[SessionPersistence] Failed to get form data:', error);
    }

    return sessionData;
  }

  /**
   * Apply session state to browser via CDP
   * @param sessionData - Session data to apply
   */
  private async applySessionState(sessionData: SessionData): Promise<void> {
    if (!this.cdpClient) {
      throw new Error('CDP client not set');
    }

    // Navigate to URL
    if (sessionData.url) {
      try {
        await this.cdpClient.send('Page.navigate', { url: sessionData.url });
        // Wait for page load
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.warn('[SessionPersistence] Failed to navigate to URL:', error);
      }
    }

    // Restore cookies
    if (sessionData.cookies && sessionData.cookies.length > 0) {
      try {
        for (const cookie of sessionData.cookies) {
          await this.cdpClient.send('Network.setCookie', {
            name: cookie.name,
            value: cookie.value,
            domain: cookie.domain,
            path: cookie.path,
            expires: cookie.expires,
            httpOnly: cookie.httpOnly,
            secure: cookie.secure,
            sameSite: cookie.sameSite,
          });
        }
      } catch (error) {
        console.warn('[SessionPersistence] Failed to restore cookies:', error);
      }
    }

    // Restore localStorage
    if (sessionData.localStorage && Object.keys(sessionData.localStorage).length > 0) {
      try {
        const localStorageScript = Object.entries(sessionData.localStorage)
          .map(([key, value]) => `localStorage.setItem('${key}', '${value.replace(/'/g, "\\'")}');`)
          .join('');
        
        await this.cdpClient.send('Runtime.evaluate', {
          expression: localStorageScript,
        });
      } catch (error) {
        console.warn('[SessionPersistence] Failed to restore localStorage:', error);
      }
    }

    // Restore sessionStorage
    if (sessionData.sessionStorage && Object.keys(sessionData.sessionStorage).length > 0) {
      try {
        const sessionStorageScript = Object.entries(sessionData.sessionStorage)
          .map(([key, value]) => `sessionStorage.setItem('${key}', '${value.replace(/'/g, "\\'")}');`)
          .join('');
        
        await this.cdpClient.send('Runtime.evaluate', {
          expression: sessionStorageScript,
        });
      } catch (error) {
        console.warn('[SessionPersistence] Failed to restore sessionStorage:', error);
      }
    }

    // Restore scroll position
    if (sessionData.scrollPosition) {
      try {
        await this.cdpClient.send('Runtime.evaluate', {
          expression: `window.scrollTo(${sessionData.scrollPosition.x}, ${sessionData.scrollPosition.y});`,
        });
      } catch (error) {
        console.warn('[SessionPersistence] Failed to restore scroll position:', error);
      }
    }

    // Restore form data
    if (sessionData.formData && Object.keys(sessionData.formData).length > 0) {
      try {
        const formDataScript = Object.entries(sessionData.formData)
          .map(([key, value]) => {
            const escapedValue = value.replace(/'/g, "\\'").replace(/"/g, '\\"');
            return `
              (function() {
                const el = document.querySelector('[name="${key}"], [id="${key}"]');
                if (el) el.value = '${escapedValue}';
              })();
            `;
          })
          .join('');
        
        await this.cdpClient.send('Runtime.evaluate', {
          expression: formDataScript,
        });
      } catch (error) {
        console.warn('[SessionPersistence] Failed to restore form data:', error);
      }
    }
  }

  /**
   * Filter out sensitive data from session
   * @param sessionData - Raw session data
   * @returns Filtered session data
   */
  private filterSensitiveData(sessionData: SessionData): SessionData {
    const filtered = { ...sessionData };
    
    // Filter cookies
    filtered.cookies = sessionData.cookies.map(cookie => {
      const filteredCookie = { ...cookie };
      
      // Check if cookie name contains sensitive keywords
      const isSensitive = this.config.excludedFields.some(field => 
        cookie.name.toLowerCase().includes(field.toLowerCase())
      );
      
      if (isSensitive) {
        filteredCookie.value = '[FILTERED]';
      }
      
      return filteredCookie;
    });

    // Filter localStorage
    filtered.localStorage = {};
    for (const [key, value] of Object.entries(sessionData.localStorage)) {
      const isSensitive = this.config.excludedFields.some(field => 
        key.toLowerCase().includes(field.toLowerCase())
      );
      
      filtered.localStorage[key] = isSensitive ? '[FILTERED]' : value;
    }

    // Filter sessionStorage
    filtered.sessionStorage = {};
    for (const [key, value] of Object.entries(sessionData.sessionStorage)) {
      const isSensitive = this.config.excludedFields.some(field => 
        key.toLowerCase().includes(field.toLowerCase())
      );
      
      filtered.sessionStorage[key] = isSensitive ? '[FILTERED]' : value;
    }

    // Filter form data
    filtered.formData = {};
    for (const [key, value] of Object.entries(sessionData.formData)) {
      const isSensitive = this.config.excludedFields.some(field => 
        key.toLowerCase().includes(field.toLowerCase())
      );
      
      filtered.formData[key] = isSensitive ? '[FILTERED]' : value;
    }

    return filtered;
  }

  /**
   * Get the file path for a session
   * @param sessionId - Session ID
   * @returns Full file path
   */
  private getSessionFilePath(sessionId: string): string {
    return path.join(this.config.dataDir, `${sessionId}.json`);
  }

  /**
   * Cleanup old session files
   */
  private async cleanupOldSessions(): Promise<void> {
    try {
      const sessions = await this.listSessions();
      
      if (sessions.length > this.config.maxSessions) {
        const sessionsToDelete = sessions.slice(this.config.maxSessions);
        
        for (const session of sessionsToDelete) {
          try {
            const filePath = this.getSessionFilePath(session.sessionId);
            await unlink(filePath);
            console.log(`[SessionPersistence] Cleaned up old session: ${session.sessionId}`);
          } catch (error) {
            console.warn(`[SessionPersistence] Failed to cleanup session ${session.sessionId}:`, error);
          }
        }
      }
    } catch (error) {
      console.warn('[SessionPersistence] Failed to cleanup old sessions:', error);
    }
  }
}

/**
 * Create a singleton instance for global use
 */
let globalSessionPersistence: SessionPersistence | null = null;

/**
 * Get or create the global SessionPersistence instance
 * @param config - Optional configuration
 * @returns SessionPersistence instance
 */
export function getSessionPersistence(config?: Partial<SessionPersistenceConfig>): SessionPersistence {
  if (!globalSessionPersistence) {
    globalSessionPersistence = new SessionPersistence(config);
  }
  return globalSessionPersistence;
}

/**
 * Reset the global instance (useful for testing)
 */
export function resetSessionPersistence(): void {
  globalSessionPersistence = null;
}

// Export default
export default SessionPersistence;
