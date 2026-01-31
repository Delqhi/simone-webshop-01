/**
 * Auto-Healing CDP Connection Manager
 * 
 * This module provides resilient CDP (Chrome DevTools Protocol) connections
 * with automatic reconnection, session persistence, and health monitoring.
 * 
 * Features:
 * - Two-level WebSocket pattern (browser-level → target-level)
 * - Automatic reconnection with exponential backoff
 * - Session persistence integration
 * - Health monitoring and heartbeat
 * - Graceful error handling
 * 
 * @module auto-healing-cdp
 * @version 1.0.0
 */

import WebSocket from 'ws';
import { EventEmitter } from 'events';
import { SessionPersistence, SessionData } from './session-persistence';

/**
 * Configuration options for AutoHealingCDP
 */
export interface AutoHealingCDPConfig {
  /** Browserless WebSocket endpoint */
  browserWSEndpoint: string;
  /** Reconnection attempts before giving up (default: 5) */
  maxReconnectAttempts: number;
  /** Initial reconnection delay in ms (default: 1000) */
  reconnectDelay: number;
  /** Maximum reconnection delay in ms (default: 30000) */
  maxReconnectDelay: number;
  /** Heartbeat interval in ms (default: 30000) */
  heartbeatInterval: number;
  /** Connection timeout in ms (default: 10000) */
  connectionTimeout: number;
  /** Enable session persistence (default: true) */
  enableSessionPersistence: boolean;
  /** Session data directory */
  sessionDataDir: string;
}

/**
 * Default configuration
 */
const DEFAULT_CONFIG: AutoHealingCDPConfig = {
  browserWSEndpoint: 'ws://localhost:50070',
  maxReconnectAttempts: 5,
  reconnectDelay: 1000,
  maxReconnectDelay: 30000,
  heartbeatInterval: 30000,
  connectionTimeout: 10000,
  enableSessionPersistence: true,
  sessionDataDir: './session-data',
};

/**
 * Connection state enum
 */
export enum ConnectionState {
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  RECONNECTING = 'reconnecting',
  ERROR = 'error',
}

/**
 * CDP Target info
 */
export interface CDPTarget {
  targetId: string;
  type: string;
  title: string;
  url: string;
  attached: boolean;
  browserContextId?: string;
}

/**
 * Auto-Healing CDP Connection Manager
 * 
 * Manages CDP connections with automatic reconnection and session persistence.
 * Implements a two-level WebSocket pattern for browser and target connections.
 */
export class AutoHealingCDP extends EventEmitter {
  private config: AutoHealingCDPConfig;
  private browserSocket: WebSocket | null = null;
  private targetSocket: WebSocket | null = null;
  private state: ConnectionState = ConnectionState.DISCONNECTED;
  private reconnectAttempts = 0;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private connectionTimeoutTimer: NodeJS.Timeout | null = null;
  private sessionPersistence: SessionPersistence | null = null;
  private currentTargetId: string | null = null;
  private messageQueue: Array<{ method: string; params?: Record<string, unknown>; id?: number }> = [];
  private pendingMessages = new Map<number, { resolve: (value: unknown) => void; reject: (reason: Error) => void }>();
  private messageId = 0;

  /**
   * Creates a new AutoHealingCDP instance
   * @param config - Configuration options (partial, will be merged with defaults)
   */
  constructor(config: Partial<AutoHealingCDPConfig> = {}) {
    super();
    this.config = { ...DEFAULT_CONFIG, ...config };
    
    if (this.config.enableSessionPersistence) {
      this.sessionPersistence = new SessionPersistence({
        dataDir: this.config.sessionDataDir,
      });
    }
  }

  /**
   * Get current connection state
   * @returns Current state
   */
  getState(): ConnectionState {
    return this.state;
  }

  /**
   * Check if connected
   * @returns True if connected
   */
  isConnected(): boolean {
    return this.state === ConnectionState.CONNECTED && 
           this.browserSocket?.readyState === WebSocket.OPEN &&
           this.targetSocket?.readyState === WebSocket.OPEN;
  }

  /**
   * Connect to browserless instance
   * @returns Promise that resolves when connected
   */
  async connect(): Promise<void> {
    if (this.state === ConnectionState.CONNECTED || this.state === ConnectionState.CONNECTING) {
      return;
    }

    this.setState(ConnectionState.CONNECTING);
    
    try {
      await this.connectBrowser();
      await this.attachToTarget();
      
      this.reconnectAttempts = 0;
      this.setState(ConnectionState.CONNECTED);
      
      // Start heartbeat
      this.startHeartbeat();
      
      // Restore session if available
      if (this.sessionPersistence) {
        await this.restoreSession();
      }
      
      // Process queued messages
      await this.processMessageQueue();
      
      this.emit('connected');
    } catch (error) {
      this.setState(ConnectionState.ERROR);
      this.emit('error', error);
      
      // Attempt reconnection
      await this.scheduleReconnect();
    }
  }

  /**
   * Disconnect from browserless
   */
  async disconnect(): Promise<void> {
    this.stopHeartbeat();
    this.clearReconnectTimer();
    this.clearConnectionTimeout();
    
    // Save session before disconnect
    if (this.sessionPersistence && this.isConnected()) {
      try {
        await this.sessionPersistence.saveSession();
      } catch (error) {
        console.warn('[AutoHealingCDP] Failed to save session on disconnect:', error);
      }
    }
    
    // Close target socket
    if (this.targetSocket) {
      this.targetSocket.close();
      this.targetSocket = null;
    }
    
    // Close browser socket
    if (this.browserSocket) {
      this.browserSocket.close();
      this.browserSocket = null;
    }
    
    this.currentTargetId = null;
    this.setState(ConnectionState.DISCONNECTED);
    this.emit('disconnected');
  }

  /**
   * Send CDP command
   * @param method - CDP method name
   * @param params - Method parameters
   * @returns Promise with result
   */
  async send(method: string, params?: Record<string, unknown>): Promise<unknown> {
    if (!this.isConnected()) {
      // Queue message if not connected
      return new Promise((resolve, reject) => {
        this.messageQueue.push({ method, params, resolve, reject } as unknown as typeof this.messageQueue[0]);
      });
    }

    const id = ++this.messageId;
    const message = { id, method, params };

    return new Promise((resolve, reject) => {
      this.pendingMessages.set(id, { resolve, reject });
      
      // Set timeout for response
      setTimeout(() => {
        if (this.pendingMessages.has(id)) {
          this.pendingMessages.delete(id);
          reject(new Error(`Timeout waiting for response to ${method}`));
        }
      }, this.config.connectionTimeout);

      if (this.targetSocket?.readyState === WebSocket.OPEN) {
        this.targetSocket.send(JSON.stringify(message));
      } else {
        reject(new Error('Target socket not connected'));
      }
    });
  }

  /**
   * Get list of available targets
   * @returns Array of targets
   */
  async getTargets(): Promise<CDPTarget[]> {
    const result = await this.send('Target.getTargets') as { targetInfos: CDPTarget[] };
    return result.targetInfos;
  }

  /**
   * Create a new target (page)
   * @param url - Initial URL
   * @returns Target ID
   */
  async createTarget(url: string): Promise<string> {
    const result = await this.send('Target.createTarget', { url }) as { targetId: string };
    return result.targetId;
  }

  /**
   * Close a target
   * @param targetId - Target ID to close
   */
  async closeTarget(targetId: string): Promise<void> {
    await this.send('Target.closeTarget', { targetId });
  }

  /**
   * Navigate to URL
   * @param url - URL to navigate to
   * @param waitUntil - When to consider navigation complete
   * @returns Navigation result
   */
  async navigate(url: string, waitUntil: 'load' | 'domcontentloaded' | 'networkidle0' | 'networkidle2' = 'load'): Promise<unknown> {
    // Enable Page domain
    await this.send('Page.enable');
    
    // Navigate
    const result = await this.send('Page.navigate', { url });
    
    // Wait for load event
    if (waitUntil === 'load' || waitUntil === 'domcontentloaded') {
      await this.waitForEvent('Page.loadEventFired', 30000);
    }
    
    return result;
  }

  /**
   * Wait for a CDP event
   * @param event - Event name
   * @param timeout - Timeout in ms
   * @returns Promise that resolves when event fires
   */
  waitForEvent(event: string, timeout = 30000): Promise<unknown> {
    return new Promise((resolve, reject) => {
      const handler = (params: unknown) => {
        this.off(event, handler);
        clearTimeout(timer);
        resolve(params);
      };
      
      const timer = setTimeout(() => {
        this.off(event, handler);
        reject(new Error(`Timeout waiting for event: ${event}`));
      }, timeout);
      
      this.on(event, handler);
    });
  }

  /**
   * Connect to browser WebSocket
   */
  private async connectBrowser(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.clearConnectionTimeout();
      
      this.connectionTimeoutTimer = setTimeout(() => {
        reject(new Error('Connection timeout'));
      }, this.config.connectionTimeout);

      this.browserSocket = new WebSocket(this.config.browserWSEndpoint);
      
      this.browserSocket.on('open', () => {
        this.clearConnectionTimeout();
        resolve();
      });
      
      this.browserSocket.on('error', (error) => {
        this.clearConnectionTimeout();
        reject(error);
      });
      
      this.browserSocket.on('close', () => {
        this.handleDisconnect();
      });
      
      this.browserSocket.on('message', (data) => {
        this.handleBrowserMessage(data);
      });
    });
  }

  /**
   * Attach to a target
   */
  private async attachToTarget(): Promise<void> {
    // Get or create a target
    const targets = await this.getTargets();
    const pageTarget = targets.find(t => t.type === 'page');
    
    if (pageTarget) {
      this.currentTargetId = pageTarget.targetId;
    } else {
      this.currentTargetId = await this.createTarget('about:blank');
    }

    // Attach to target
    const result = await this.send('Target.attachToTarget', {
      targetId: this.currentTargetId,
      flatten: true,
    }) as { sessionId: string };

    // Connect to target WebSocket
    const targetWsUrl = `${this.config.browserWSEndpoint}/devtools/page/${this.currentTargetId}`;
    
    return new Promise((resolve, reject) => {
      this.clearConnectionTimeout();
      
      this.connectionTimeoutTimer = setTimeout(() => {
        reject(new Error('Target connection timeout'));
      }, this.config.connectionTimeout);

      this.targetSocket = new WebSocket(targetWsUrl);
      
      this.targetSocket.on('open', () => {
        this.clearConnectionTimeout();
        resolve();
      });
      
      this.targetSocket.on('error', (error) => {
        this.clearConnectionTimeout();
        reject(error);
      });
      
      this.targetSocket.on('close', () => {
        this.handleDisconnect();
      });
      
      this.targetSocket.on('message', (data) => {
        this.handleTargetMessage(data);
      });
    });
  }

  /**
   * Handle browser WebSocket messages
   */
  private handleBrowserMessage(data: WebSocket.Data): void {
    try {
      const message = JSON.parse(data.toString());
      
      if (message.method) {
        this.emit(message.method, message.params);
      }
    } catch (error) {
      console.warn('[AutoHealingCDP] Failed to parse browser message:', error);
    }
  }

  /**
   * Handle target WebSocket messages
   */
  private handleTargetMessage(data: WebSocket.Data): void {
    try {
      const message = JSON.parse(data.toString());
      
      // Handle responses
      if (message.id !== undefined && this.pendingMessages.has(message.id)) {
        const { resolve, reject } = this.pendingMessages.get(message.id)!;
        this.pendingMessages.delete(message.id);
        
        if (message.error) {
          reject(new Error(message.error.message));
        } else {
          resolve(message.result);
        }
      }
      
      // Handle events
      if (message.method) {
        this.emit(message.method, message.params);
      }
    } catch (error) {
      console.warn('[AutoHealingCDP] Failed to parse target message:', error);
    }
  }

  /**
   * Handle disconnect event
   */
  private async handleDisconnect(): Promise<void> {
    if (this.state === ConnectionState.DISCONNECTED || this.state === ConnectionState.RECONNECTING) {
      return;
    }

    // Save session before disconnect
    if (this.sessionPersistence && this.isConnected()) {
      try {
        await this.sessionPersistence.saveSession();
        this.emit('sessionSaved');
      } catch (error) {
        console.warn('[AutoHealingCDP] Failed to save session on disconnect:', error);
      }
    }

    this.setState(ConnectionState.DISCONNECTED);
    this.emit('disconnected');
    
    // Attempt reconnection
    await this.scheduleReconnect();
  }

  /**
   * Schedule reconnection attempt
   */
  private async scheduleReconnect(): Promise<void> {
    if (this.reconnectAttempts >= this.config.maxReconnectAttempts) {
      this.setState(ConnectionState.ERROR);
      this.emit('reconnectFailed');
      return;
    }

    this.reconnectAttempts++;
    this.setState(ConnectionState.RECONNECTING);
    
    const delay = Math.min(
      this.config.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1),
      this.config.maxReconnectDelay
    );
    
    console.log(`[AutoHealingCDP] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${this.config.maxReconnectAttempts})`);
    
    this.clearReconnectTimer();
    
    this.reconnectTimer = setTimeout(async () => {
      try {
        await this.connect();
      } catch (error) {
        console.error('[AutoHealingCDP] Reconnection failed:', error);
      }
    }, delay);
  }

  /**
   * Restore session after reconnection
   */
  private async restoreSession(): Promise<void> {
    if (!this.sessionPersistence) {
      return;
    }

    try {
      await this.sessionPersistence.initialize();
      
      // Get last session
      const sessions = await this.sessionPersistence.listSessions();
      
      if (sessions.length > 0) {
        const lastSession = sessions[0];
        
        if (await this.sessionPersistence.sessionExists(lastSession.sessionId)) {
          console.log(`[AutoHealingCDP] Restoring session: ${lastSession.sessionId}`);
          
          // Set CDP client for session persistence
          this.sessionPersistence.setCDPClient({
            send: this.send.bind(this),
            on: this.on.bind(this),
            removeListener: this.removeListener.bind(this),
          });
          
          await this.sessionPersistence.restoreSession(lastSession.sessionId);
          this.emit('sessionRestored', lastSession);
        }
      }
    } catch (error) {
      console.warn('[AutoHealingCDP] Failed to restore session:', error);
    }
  }

  /**
   * Process queued messages
   */
  private async processMessageQueue(): Promise<void> {
    while (this.messageQueue.length > 0 && this.isConnected()) {
      const message = this.messageQueue.shift();
      if (message) {
        try {
          await this.send(message.method, message.params);
        } catch (error) {
          console.warn('[AutoHealingCDP] Failed to process queued message:', error);
        }
      }
    }
  }

  /**
   * Start heartbeat
   */
  private startHeartbeat(): void {
    this.stopHeartbeat();
    
    this.heartbeatTimer = setInterval(async () => {
      if (this.isConnected()) {
        try {
          // Simple health check
          await this.send('Runtime.evaluate', { expression: '1' });
          this.emit('heartbeat');
        } catch (error) {
          console.warn('[AutoHealingCDP] Heartbeat failed:', error);
          this.handleDisconnect();
        }
      }
    }, this.config.heartbeatInterval);
  }

  /**
   * Stop heartbeat
   */
  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  /**
   * Clear reconnect timer
   */
  private clearReconnectTimer(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  /**
   * Clear connection timeout
   */
  private clearConnectionTimeout(): void {
    if (this.connectionTimeoutTimer) {
      clearTimeout(this.connectionTimeoutTimer);
      this.connectionTimeoutTimer = null;
    }
  }

  /**
   * Set connection state
   */
  private setState(state: ConnectionState): void {
    const oldState = this.state;
    this.state = state;
    
    if (oldState !== state) {
      this.emit('stateChange', state, oldState);
    }
  }
}

/**
 * Create a singleton instance for global use
 */
let globalAutoHealingCDP: AutoHealingCDP | null = null;

/**
 * Get or create the global AutoHealingCDP instance
 * @param config - Optional configuration
 * @returns AutoHealingCDP instance
 */
export function getAutoHealingCDP(config?: Partial<AutoHealingCDPConfig>): AutoHealingCDP {
  if (!globalAutoHealingCDP) {
    globalAutoHealingCDP = new AutoHealingCDP(config);
  }
  return globalAutoHealingCDP;
}

/**
 * Reset the global instance (useful for testing)
 */
export function resetAutoHealingCDP(): void {
  globalAutoHealingCDP = null;
}

// Export default
export default AutoHealingCDP;
