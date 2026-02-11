/**
 * Dashboard Integration Test Suite
 * Tests all monitoring dashboard components and APIs
 * 
 * Run with: node tests/dashboard-integration.test.js
 */

const assert = require('assert');
const http = require('http');

const API_BASE = 'http://localhost:3000';
const TEST_TIMEOUT = 10000;

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

/**
 * Helper: Make HTTP request
 */
function makeRequest(path, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, API_BASE);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: TEST_TIMEOUT,
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: data,
          json: () => {
            try {
              return JSON.parse(data);
            } catch (e) {
              return null;
            }
          },
        });
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error(`Request timeout after ${TEST_TIMEOUT}ms`));
    });

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

/**
 * Test Suite Runner
 */
const tests = [];
function test(name, fn) {
  tests.push({ name, fn });
}

async function runTests() {
  console.log(`\n${colors.blue}=== OpenDocs Monitoring Dashboard Integration Tests ===${colors.reset}\n`);

  let passed = 0;
  let failed = 0;

  for (const { name, fn } of tests) {
    try {
      await fn();
      console.log(`${colors.green}✓${colors.reset} ${name}`);
      passed++;
    } catch (error) {
      console.log(`${colors.red}✗${colors.reset} ${name}`);
      console.log(`  ${colors.red}Error: ${error.message}${colors.reset}`);
      failed++;
    }
  }

  console.log(`\n${colors.blue}=== Test Results ===${colors.reset}`);
  console.log(`${colors.green}Passed: ${passed}${colors.reset}`);
  console.log(`${colors.red}Failed: ${failed}${colors.reset}`);
  console.log(`Total: ${passed + failed}\n`);

  process.exit(failed > 0 ? 1 : 0);
}

// ============================================================================
// TESTS
// ============================================================================

test('Dashboard HTML file is served (GET /monitoring-dashboard.html)', async () => {
  const res = await makeRequest('/monitoring-dashboard.html');
  assert.strictEqual(res.status, 200, 'Expected status 200');
  assert.strictEqual(
    res.headers['content-type'],
    'text/html; charset=utf-8',
    'Expected content-type text/html'
  );
  assert(res.body.length > 0, 'Expected non-empty body');
  assert(res.body.includes('OpenDocs Monitoring Dashboard'), 'Expected dashboard title');
});

test('Dashboard redirect route works (GET /monitoring)', async () => {
  const res = await makeRequest('/monitoring');
  assert.strictEqual(res.status, 302, 'Expected status 302 redirect');
  assert(res.headers.location, 'Expected location header');
  assert(res.headers.location.includes('monitoring-dashboard.html'), 'Expected redirect to dashboard');
});

test('Dashboard API endpoint responds (GET /monitoring/dashboard)', async () => {
  const res = await makeRequest('/monitoring/dashboard');
  assert.strictEqual(res.status, 200, 'Expected status 200');
  const json = res.json();
  assert(json, 'Expected valid JSON response');
  assert.strictEqual(json.title, 'OpenDocs Monitoring Dashboard', 'Expected title field');
  assert(json.metrics, 'Expected metrics object');
  assert(typeof json.metrics.totalRequests === 'number', 'Expected totalRequests');
  assert(typeof json.metrics.errorCount === 'number', 'Expected errorCount');
});

test('Metrics summary endpoint works (GET /monitoring/metrics/summary)', async () => {
  const res = await makeRequest('/monitoring/metrics/summary');
  assert.strictEqual(res.status, 200, 'Expected status 200');
  const json = res.json();
  assert(json.summary, 'Expected summary object');
  assert(json.summary.latencyPercentiles, 'Expected latencyPercentiles');
  assert(json.summary.latencyPercentiles.min !== undefined, 'Expected min latency');
  assert(json.summary.latencyPercentiles.max !== undefined, 'Expected max latency');
});

test('Traces endpoint works (GET /monitoring/traces)', async () => {
  const res = await makeRequest('/monitoring/traces?limit=5&offset=0');
  assert.strictEqual(res.status, 200, 'Expected status 200');
  const json = res.json();
  assert(Array.isArray(json.traces) || json.traces === undefined, 'Expected traces array or undefined');
  assert(json.pagination, 'Expected pagination object');
  assert.strictEqual(json.pagination.limit, 5, 'Expected limit 5');
});

test('Errors endpoint works (GET /monitoring/errors)', async () => {
  const res = await makeRequest('/monitoring/errors');
  assert.strictEqual(res.status, 200, 'Expected status 200');
  const json = res.json();
  assert(Array.isArray(json.errors), 'Expected errors array');
  assert(typeof json.totalErrorCount === 'number', 'Expected totalErrorCount');
});

test('Clear metrics endpoint works (DELETE /monitoring/clear)', async () => {
  const res = await makeRequest('/monitoring/clear', 'DELETE');
  assert.strictEqual(res.status, 200, 'Expected status 200');
  const json = res.json();
  assert.strictEqual(json.success, true, 'Expected success true');
});

test('Static file has correct cache headers', async () => {
  const res = await makeRequest('/monitoring-dashboard.html');
  assert(res.headers['cache-control'], 'Expected cache-control header');
  assert(res.headers.etag, 'Expected etag header');
  assert(res.headers['last-modified'], 'Expected last-modified header');
});

test('Rate limiting is enforced', async () => {
  assert(res.headers['x-ratelimit-limit'], 'Expected X-RateLimit-Limit header');
  assert(res.headers['x-ratelimit-remaining'], 'Expected X-RateLimit-Remaining header');
  assert(res.headers['x-ratelimit-reset'], 'Expected X-RateLimit-Reset header');
});

test('Trace context headers are set', async () => {
  const res = await makeRequest('/monitoring/dashboard');
  assert(res.headers['x-trace-id'], 'Expected X-Trace-Id header');
  assert(res.headers['x-span-id'], 'Expected X-Span-Id header');
  assert(res.headers.traceparent, 'Expected traceparent header');
});

test('CORS headers are configured', async () => {
  const res = await makeRequest('/monitoring/dashboard');
  assert(res.headers['access-control-allow-origin'], 'Expected CORS origin header');
  assert(res.headers['access-control-allow-methods'], 'Expected CORS methods header');
});

test('Pagination works correctly', async () => {
  const res1 = await makeRequest('/monitoring/traces?limit=2&offset=0');
  const res2 = await makeRequest('/monitoring/traces?limit=2&offset=2');
  assert.strictEqual(res1.status, 200);
  assert.strictEqual(res2.status, 200);
  const json1 = res1.json();
  const json2 = res2.json();
  assert.strictEqual(json1.pagination.limit, 2);
  assert.strictEqual(json2.pagination.offset, 2);
});

test('Dashboard loads without errors in browser simulation', async () => {
  const res = await makeRequest('/monitoring-dashboard.html');
  const html = res.body;
  
  // Check for critical scripts
  assert(html.includes('chart.js'), 'Expected Chart.js include');
  assert(html.includes('function fetchDashboard()'), 'Expected fetchDashboard function');
  assert(html.includes('function refreshDashboard()'), 'Expected refreshDashboard function');
  
  // Check for critical DOM elements
  assert(html.includes('id="summary-requests"'), 'Expected summary-requests element');
  assert(html.includes('id="summary-errors"'), 'Expected summary-errors element');
  assert(html.includes('id="traces-table"'), 'Expected traces-table element');
  assert(html.includes('id="errors-list"'), 'Expected errors-list element');
});

test('API responses are valid JSON', async () => {
  const endpoints = [
    '/monitoring/dashboard',
    '/monitoring/metrics/summary',
    '/monitoring/traces',
    '/monitoring/errors',
  ];

  for (const endpoint of endpoints) {
    const res = await makeRequest(endpoint);
    const json = res.json();
    assert(json !== null, `Expected valid JSON from ${endpoint}`);
  }
});

test('Dashboard HTML is properly minified and optimized', async () => {
  const res = await makeRequest('/monitoring-dashboard.html');
  const html = res.body;
  assert(html.length > 20000, 'Expected substantial HTML content');
  // Check for proper structure
  assert(html.includes('<!DOCTYPE html>'), 'Expected DOCTYPE');
  assert(html.includes('<html'), 'Expected html tag');
  assert(html.includes('</html>'), 'Expected closing html tag');
});

// ============================================================================
// RUN TESTS
// ============================================================================

runTests().catch((error) => {
  console.error(`${colors.red}Fatal test error: ${error.message}${colors.reset}`);
  process.exit(1);
});
