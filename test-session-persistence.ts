/**
 * Session Persistence Test Suite
 * 
 * Comprehensive tests for the Session Persistence module.
 * Tests cover session management, cookie persistence, storage backup,
 * page state restoration, and automatic recovery.
 * 
 * @module test-session-persistence
 * @version 1.0.0
 */

import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import {
  SessionPersistence,
  SessionData,
  SessionPersistenceConfig,
  CDPClient,
  getSessionPersistence,
  resetSessionPersistence,
} from './src/session-persistence';

const mkdir = promisify(fs.mkdir);
const rmdir = promisify(fs.rmdir);
const unlink = promisify(fs.unlink);
const readdir = promisify(fs.readdir);

/**
 * Test result tracking
 */
interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
  duration: number;
}

/**
 * Mock CDP Client for testing
 */
class MockCDPClient implements CDPClient {
  private mockData: {
    url: string;
    cookies: SessionData['cookies'];
    localStorage: Record<string, string>;
    sessionStorage: Record<string, string>;
    scrollPosition: { x: number; y: number };
    formData: Record<string, string>;
  };

  private eventHandlers: Map<string, Array<(...args: unknown[]) => void>> = new Map();

  constructor() {
    this.mockData = {
      url: 'https://example.com',
      cookies: [
        { name: 'session', value: 'abc123', domain: 'example.com', path: '/' },
        { name: 'user', value: 'john', domain: 'example.com', path: '/' },
      ],
      localStorage: { key1: 'value1', key2: 'value2' },
      sessionStorage: { temp1: 'tempValue1' },
      scrollPosition: { x: 100, y: 200 },
      formData: { username: 'john_doe', email: 'john@example.com' },
    };
  }

  async send(method: string, params?: Record<string, unknown>): Promise<unknown> {
    switch (method) {
      case 'Runtime.evaluate':
        const expression = params?.expression as string;
        
        if (expression.includes('window.location.href')) {
          return { result: { value: this.mockData.url } };
        }
        if (expression.includes('localStorage')) {
          return { result: { value: JSON.stringify(this.mockData.localStorage) } };
        }
        if (expression.includes('sessionStorage')) {
          return { result: { value: JSON.stringify(this.mockData.sessionStorage) } };
        }
        if (expression.includes('scrollX') || expression.includes('scrollY')) {
          return { result: { value: JSON.stringify(this.mockData.scrollPosition) } };
        }
        if (expression.includes('formData') || expression.includes('querySelectorAll')) {
          return { result: { value: JSON.stringify(this.mockData.formData) } };
        }
        return { result: { value: '1' } };

      case 'Storage.getCookies':
        return { cookies: this.mockData.cookies };

      case 'Network.setCookie':
        const { name, value, domain, path: cookiePath } = params as Record<string, string>;
        this.mockData.cookies.push({
          name,
          value,
          domain,
          path: cookiePath || '/',
        });
        return { success: true };

      case 'Page.navigate':
        this.mockData.url = (params as Record<string, string>).url;
        return { frameId: '12345' };

      default:
        return {};
    }
  }

  on(event: string, callback: (...args: unknown[]) => void): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event)!.push(callback);
  }

  removeListener(event: string, callback: (...args: unknown[]) => void): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      const index = handlers.indexOf(callback);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  setMockData(data: Partial<typeof this.mockData>): void {
    this.mockData = { ...this.mockData, ...data };
  }

  getMockData(): typeof this.mockData {
    return this.mockData;
  }
}

/**
 * Test runner
 */
class TestRunner {
  private results: TestResult[] = [];
  private testDataDir = './test-session-data';

  async setup(): Promise<void> {
    // Clean up test directory
    if (fs.existsSync(this.testDataDir)) {
      const files = await readdir(this.testDataDir);
      for (const file of files) {
        await unlink(path.join(this.testDataDir, file));
      }
      await rmdir(this.testDataDir);
    }
    await mkdir(this.testDataDir, { recursive: true });
    resetSessionPersistence();
  }

  async teardown(): Promise<void> {
    // Clean up test directory
    if (fs.existsSync(this.testDataDir)) {
      const files = await readdir(this.testDataDir);
      for (const file of files) {
        await unlink(path.join(this.testDataDir, file));
      }
      await rmdir(this.testDataDir);
    }
  }

  async runTest(name: string, testFn: () => Promise<void>): Promise<void> {
    const startTime = Date.now();
    try {
      await testFn();
      this.results.push({
        name,
        passed: true,
        duration: Date.now() - startTime,
      });
      console.log(`✅ ${name} (${Date.now() - startTime}ms)`);
    } catch (error) {
      this.results.push({
        name,
        passed: false,
        error: error instanceof Error ? error.message : String(error),
        duration: Date.now() - startTime,
      });
      console.log(`❌ ${name} (${Date.now() - startTime}ms)`);
      console.log(`   Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  getResults(): TestResult[] {
    return this.results;
  }

  getSummary(): { total: number; passed: number; failed: number } {
    const passed = this.results.filter(r => r.passed).length;
    return {
      total: this.results.length,
      passed,
      failed: this.results.length - passed,
    };
  }
}

/**
 * Assertion helpers
 */
function assertEqual(actual: unknown, expected: unknown, message?: string): void {
  if (actual !== expected) {
    throw new Error(message || `Expected ${expected}, got ${actual}`);
  }
}

function assertTrue(value: boolean, message?: string): void {
  if (!value) {
    throw new Error(message || 'Expected true, got false');
  }
}

function assertFalse(value: boolean, message?: string): void {
  if (value) {
    throw new Error(message || 'Expected false, got true');
  }
}

function assertExists(value: unknown, message?: string): void {
  if (value === null || value === undefined) {
    throw new Error(message || 'Expected value to exist');
  }
}

function assertArrayLength(actual: unknown[], expected: number, message?: string): void {
  if (actual.length !== expected) {
    throw new Error(message || `Expected array length ${expected}, got ${actual.length}`);
  }
}

/**
 * Run all tests
 */
async function runTests(): Promise<void> {
  const runner = new TestRunner();
  
  console.log('\n🧪 Session Persistence Test Suite\n');
  console.log('================================\n');

  await runner.setup();

  // Test 1: SessionPersistence initialization
  await runner.runTest('SessionPersistence initializes correctly', async () => {
    const sp = new SessionPersistence({ dataDir: './test-session-data' });
    await sp.initialize();
    assertTrue(fs.existsSync('./test-session-data'), 'Data directory should exist');
  });

  // Test 2: Generate session ID
  await runner.runTest('Generate unique session IDs', async () => {
    const sp = new SessionPersistence({ dataDir: './test-session-data' });
    const id1 = sp.generateSessionId();
    const id2 = sp.generateSessionId();
    
    assertTrue(id1.startsWith('session_'), 'Session ID should start with "session_"');
    assertTrue(id1 !== id2, 'Session IDs should be unique');
  });

  // Test 3: Start and stop session
  await runner.runTest('Start and stop session', async () => {
    const sp = new SessionPersistence({ dataDir: './test-session-data' });
    const sessionId = await sp.startSession();
    
    assertExists(sessionId, 'Session ID should exist');
    assertEqual(sp.getCurrentSessionId(), sessionId, 'Current session should match');
    
    await sp.stopSession();
    assertEqual(sp.getCurrentSessionId(), null, 'Session should be null after stop');
  });

  // Test 4: Save session with mock CDP client
  await runner.runTest('Save session captures browser state', async () => {
    const sp = new SessionPersistence({ dataDir: './test-session-data' });
    const mockCDP = new MockCDPClient();
    
    sp.setCDPClient(mockCDP);
    await sp.initialize();
    
    const sessionId = await sp.startSession();
    const sessionData = await sp.saveSession();
    
    assertEqual(sessionData.sessionId, sessionId, 'Session ID should match');
    assertEqual(sessionData.url, 'https://example.com', 'URL should be captured');
    assertArrayLength(sessionData.cookies, 2, 'Should capture 2 cookies');
    assertEqual(Object.keys(sessionData.localStorage).length, 2, 'Should capture localStorage');
    assertEqual(Object.keys(sessionData.sessionStorage).length, 1, 'Should capture sessionStorage');
    assertEqual(sessionData.scrollPosition.x, 100, 'Should capture scroll X');
    assertEqual(sessionData.scrollPosition.y, 200, 'Should capture scroll Y');
    assertEqual(Object.keys(sessionData.formData).length, 2, 'Should capture form data');
    assertTrue(sessionData.timestamp > 0, 'Timestamp should be set');
  });

  // Test 5: Restore session
  await runner.runTest('Restore session applies browser state', async () => {
    const sp = new SessionPersistence({ dataDir: './test-session-data' });
    const mockCDP = new MockCDPClient();
    
    sp.setCDPClient(mockCDP);
    await sp.initialize();
    
    // First save a session
    const sessionId = await sp.startSession();
    await sp.saveSession();
    await sp.stopSession();
    
    // Now restore it
    sp.setCDPClient(mockCDP);
    const restoredData = await sp.restoreSession(sessionId);
    
    assertEqual(restoredData.sessionId, sessionId, 'Restored session ID should match');
    assertEqual(restoredData.url, 'https://example.com', 'URL should be restored');
  });

  // Test 6: List sessions
  await runner.runTest('List sessions returns all sessions', async () => {
    const sp = new SessionPersistence({ dataDir: './test-session-data' });
    const mockCDP = new MockCDPClient();
    
    sp.setCDPClient(mockCDP);
    await sp.initialize();
    
    // Create multiple sessions
    const sessionId1 = await sp.startSession();
    await sp.saveSession();
    await sp.stopSession();
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const sessionId2 = await sp.startSession();
    await sp.saveSession();
    await sp.stopSession();
    
    const sessions = await sp.listSessions();
    
    assertTrue(sessions.length >= 2, 'Should have at least 2 sessions');
    assertTrue(sessions.some(s => s.sessionId === sessionId1), 'Should include session 1');
    assertTrue(sessions.some(s => s.sessionId === sessionId2), 'Should include session 2');
  });

  // Test 7: Session exists check
  await runner.runTest('Session exists check works correctly', async () => {
    const sp = new SessionPersistence({ dataDir: './test-session-data' });
    const mockCDP = new MockCDPClient();
    
    sp.setCDPClient(mockCDP);
    await sp.initialize();
    
    const sessionId = await sp.startSession();
    await sp.saveSession();
    
    assertTrue(await sp.sessionExists(sessionId), 'Session should exist');
    assertFalse(await sp.sessionExists('non-existent-session'), 'Non-existent session should return false');
  });

  // Test 8: Clear session
  await runner.runTest('Clear session removes session file', async () => {
    const sp = new SessionPersistence({ dataDir: './test-session-data' });
    const mockCDP = new MockCDPClient();
    
    sp.setCDPClient(mockCDP);
    await sp.initialize();
    
    const sessionId = await sp.startSession();
    await sp.saveSession();
    
    assertTrue(await sp.sessionExists(sessionId), 'Session should exist before clear');
    
    await sp.clearSession(sessionId);
    
    assertFalse(await sp.sessionExists(sessionId), 'Session should not exist after clear');
  });

  // Test 9: Sensitive data filtering
  await runner.runTest('Sensitive data is filtered from session', async () => {
    const sp = new SessionPersistence({
      dataDir: './test-session-data',
      excludedFields: ['password', 'token', 'secret'],
    });
    const mockCDP = new MockCDPClient();
    
    mockCDP.setMockData({
      localStorage: { password: 'secret123', normalKey: 'normalValue' },
      sessionStorage: { token: 'abc123', tempKey: 'tempValue' },
      formData: { secret: 'mySecret', username: 'john' },
    });
    
    sp.setCDPClient(mockCDP);
    await sp.initialize();
    
    const sessionId = await sp.startSession();
    const sessionData = await sp.saveSession();
    
    assertEqual(sessionData.localStorage.password, '[FILTERED]', 'Password should be filtered');
    assertEqual(sessionData.localStorage.normalKey, 'normalValue', 'Normal key should not be filtered');
    assertEqual(sessionData.sessionStorage.token, '[FILTERED]', 'Token should be filtered');
    assertEqual(sessionData.sessionStorage.tempKey, 'tempValue', 'Temp key should not be filtered');
    assertEqual(sessionData.formData.secret, '[FILTERED]', 'Secret should be filtered');
    assertEqual(sessionData.formData.username, 'john', 'Username should not be filtered');
  });

  // Test 10: Auto-save functionality
  await runner.runTest('Auto-save saves session periodically', async () => {
    const sp = new SessionPersistence({
      dataDir: './test-session-data',
      autoSaveInterval: 100, // 100ms for testing
    });
    const mockCDP = new MockCDPClient();
    
    sp.setCDPClient(mockCDP);
    await sp.initialize();
    
    const sessionId = await sp.startSession();
    
    // Wait for auto-save to trigger
    await new Promise(resolve => setTimeout(resolve, 250));
    
    assertTrue(await sp.sessionExists(sessionId), 'Session should be auto-saved');
    
    await sp.stopSession();
  });

  // Test 11: Session persistence singleton
  await runner.runTest('Session persistence singleton works', async () => {
    resetSessionPersistence();
    
    const sp1 = getSessionPersistence({ dataDir: './test-session-data' });
    const sp2 = getSessionPersistence({ dataDir: './test-session-data' });
    
    assertEqual(sp1, sp2, 'Should return same instance');
  });

  // Test 12: Error handling - save without CDP client
  await runner.runTest('Error when saving without CDP client', async () => {
    const sp = new SessionPersistence({ dataDir: './test-session-data' });
    await sp.initialize();
    
    const sessionId = await sp.startSession();
    
    try {
      await sp.saveSession();
      throw new Error('Should have thrown error');
    } catch (error) {
      assertTrue(error instanceof Error, 'Should throw Error');
      assertTrue((error as Error).message.includes('CDP client not set'), 'Error message should mention CDP client');
    }
  });

  // Test 13: Error handling - save without session
  await runner.runTest('Error when saving without active session', async () => {
    const sp = new SessionPersistence({ dataDir: './test-session-data' });
    const mockCDP = new MockCDPClient();
    
    sp.setCDPClient(mockCDP);
    await sp.initialize();
    
    try {
      await sp.saveSession();
      throw new Error('Should have thrown error');
    } catch (error) {
      assertTrue(error instanceof Error, 'Should throw Error');
      assertTrue((error as Error).message.includes('No active session'), 'Error message should mention no active session');
    }
  });

  // Test 14: Cookie persistence
  await runner.runTest('Cookie persistence saves and restores cookies', async () => {
    const sp = new SessionPersistence({ dataDir: './test-session-data' });
    const mockCDP = new MockCDPClient();
    
    const testCookies = [
      { name: 'test1', value: 'value1', domain: 'example.com', path: '/' },
      { name: 'test2', value: 'value2', domain: '.example.com', path: '/path' },
    ];
    
    mockCDP.setMockData({ cookies: testCookies });
    
    sp.setCDPClient(mockCDP);
    await sp.initialize();
    
    const sessionId = await sp.startSession();
    const sessionData = await sp.saveSession();
    
    assertArrayLength(sessionData.cookies, 2, 'Should save 2 cookies');
    assertEqual(sessionData.cookies[0].name, 'test1', 'First cookie name should match');
    assertEqual(sessionData.cookies[0].value, 'value1', 'First cookie value should match');
    assertEqual(sessionData.cookies[1].domain, '.example.com', 'Second cookie domain should match');
  });

  // Test 15: Scroll position persistence
  await runner.runTest('Scroll position persistence', async () => {
    const sp = new SessionPersistence({ dataDir: './test-session-data' });
    const mockCDP = new MockCDPClient();
    
    mockCDP.setMockData({
      scrollPosition: { x: 500, y: 1000 },
    });
    
    sp.setCDPClient(mockCDP);
    await sp.initialize();
    
    const sessionId = await sp.startSession();
    const sessionData = await sp.saveSession();
    
    assertEqual(sessionData.scrollPosition.x, 500, 'Scroll X should be 500');
    assertEqual(sessionData.scrollPosition.y, 1000, 'Scroll Y should be 1000');
  });

  // Test 16: Form data persistence
  await runner.runTest('Form data persistence', async () => {
    const sp = new SessionPersistence({ dataDir: './test-session-data' });
    const mockCDP = new MockCDPClient();
    
    mockCDP.setMockData({
      formData: {
        username: 'testuser',
        email: 'test@example.com',
        phone: '123-456-7890',
      },
    });
    
    sp.setCDPClient(mockCDP);
    await sp.initialize();
    
    const sessionId = await sp.startSession();
    const sessionData = await sp.saveSession();
    
    assertEqual(sessionData.formData.username, 'testuser', 'Username should match');
    assertEqual(sessionData.formData.email, 'test@example.com', 'Email should match');
    assertEqual(sessionData.formData.phone, '123-456-7890', 'Phone should match');
  });

  // Test 17: Session cleanup (max sessions)
  await runner.runTest('Old sessions are cleaned up when max exceeded', async () => {
    const sp = new SessionPersistence({
      dataDir: './test-session-data',
      maxSessions: 3,
    });
    const mockCDP = new MockCDPClient();
    
    sp.setCDPClient(mockCDP);
    await sp.initialize();
    
    // Create 5 sessions
    const sessionIds: string[] = [];
    for (let i = 0; i < 5; i++) {
      const sessionId = await sp.startSession();
      await sp.saveSession();
      await sp.stopSession();
      sessionIds.push(sessionId);
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    const sessions = await sp.listSessions();
    assertTrue(sessions.length <= 3, `Should have at most 3 sessions, got ${sessions.length}`);
  });

  // Test 18: Timestamp validation
  await runner.runTest('Session timestamp is valid', async () => {
    const sp = new SessionPersistence({ dataDir: './test-session-data' });
    const mockCDP = new MockCDPClient();
    
    sp.setCDPClient(mockCDP);
    await sp.initialize();
    
    const beforeSave = Date.now();
    const sessionId = await sp.startSession();
    const sessionData = await sp.saveSession();
    const afterSave = Date.now();
    
    assertTrue(sessionData.timestamp >= beforeSave, 'Timestamp should be after start');
    assertTrue(sessionData.timestamp <= afterSave, 'Timestamp should be before end');
  });

  // Test 19: Multiple save operations
  await runner.runTest('Multiple save operations update session', async () => {
    const sp = new SessionPersistence({ dataDir: './test-session-data' });
    const mockCDP = new MockCDPClient();
    
    sp.setCDPClient(mockCDP);
    await sp.initialize();
    
    const sessionId = await sp.startSession();
    const data1 = await sp.saveSession();
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    mockCDP.setMockData({ url: 'https://updated.com' });
    const data2 = await sp.saveSession();
    
    assertTrue(data2.timestamp > data1.timestamp, 'Second save should have later timestamp');
    assertEqual(data2.url, 'https://updated.com', 'URL should be updated');
  });

  // Test 20: Session data structure validation
  await runner.runTest('Session data has all required fields', async () => {
    const sp = new SessionPersistence({ dataDir: './test-session-data' });
    const mockCDP = new MockCDPClient();
    
    sp.setCDPClient(mockCDP);
    await sp.initialize();
    
    const sessionId = await sp.startSession();
    const sessionData = await sp.saveSession();
    
    assertExists(sessionData.sessionId, 'Session ID should exist');
    assertExists(sessionData.timestamp, 'Timestamp should exist');
    assertExists(sessionData.url, 'URL should exist');
    assertExists(sessionData.cookies, 'Cookies should exist');
    assertExists(sessionData.localStorage, 'LocalStorage should exist');
    assertExists(sessionData.sessionStorage, 'SessionStorage should exist');
    assertExists(sessionData.scrollPosition, 'Scroll position should exist');
    assertExists(sessionData.formData, 'Form data should exist');
    assertExists(sessionData.scrollPosition.x, 'Scroll X should exist');
    assertExists(sessionData.scrollPosition.y, 'Scroll Y should exist');
  });

  await runner.teardown();

  // Print summary
  console.log('\n================================');
  console.log('📊 Test Summary\n');
  
  const summary = runner.getSummary();
  console.log(`Total: ${summary.total}`);
  console.log(`✅ Passed: ${summary.passed}`);
  console.log(`❌ Failed: ${summary.failed}`);
  
  const totalDuration = runner.getResults().reduce((sum, r) => sum + r.duration, 0);
  console.log(`\n⏱️  Total Duration: ${totalDuration}ms`);
  
  if (summary.failed > 0) {
    console.log('\n❌ FAILED TESTS:\n');
    runner.getResults()
      .filter(r => !r.passed)
      .forEach(r => {
        console.log(`  • ${r.name}`);
        console.log(`    Error: ${r.error}`);
      });
    process.exit(1);
  } else {
    console.log('\n🎉 All tests passed!\n');
    process.exit(0);
  }
}

// Run tests
runTests().catch(error => {
  console.error('Test suite failed:', error);
  process.exit(1);
});
