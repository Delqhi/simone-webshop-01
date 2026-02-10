/**
 * Mock Backend Services for OpenDocs
 * Since Docker containers are DOWN, these mocks provide realistic API responses
 * Best Practices February 2026 - Production Ready Mock Services
 */

const express = require('express');
const cors = require('cors');

const mockApp = express();

// Enable CORS for frontend
mockApp.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));

mockApp.use(express.json());

// Mock n8n Service
mockApp.get('/api/n8n/nodes', (req, res) => {
  console.log('📦 Mock n8n: GET /api/n8n/nodes');
  
  const mockNodes = [
    {
      id: 'node-1',
      name: 'HTTP Request',
      type: 'n8n-nodes-base.httpRequest',
      description: 'Make HTTP requests to any API',
      category: 'Core',
      icon: '🌐'
    },
    {
      id: 'node-2', 
      name: 'Database',
      type: 'n8n-nodes-base.postgres',
      description: 'Execute SQL queries on PostgreSQL',
      category: 'Database',
      icon: '🗄️'
    },
    {
      id: 'node-3',
      name: 'AI Agent',
      type: 'n8n-nodes-base.aiAgent',
      description: 'Execute AI commands and workflows',
      category: 'AI',
      icon: '🤖'
    },
    {
      id: 'node-4',
      name: 'Condition',
      type: 'n8n-nodes-base.if',
      description: 'Execute different branches based on conditions',
      category: 'Logic',
      icon: '⚖️'
    },
    {
      id: 'node-5',
      name: 'Delay',
      type: 'n8n-nodes-base.wait',
      description: 'Pause execution for specified time',
      category: 'Core',
      icon: '⏱️'
    }
  ];

  res.json({
    success: true,
    nodes: mockNodes,
    total: mockNodes.length,
    message: 'Mock n8n nodes loaded successfully'
  });
});

mockApp.post('/api/n8n/workflows/:id/execute', (req, res) => {
  console.log('🚀 Mock n8n: POST /api/n8n/workflows/:id/execute');
  
  const { id } = req.params;
  const { inputData } = req.body;
  
  res.json({
    success: true,
    executionId: `exec-${Date.now()}`,
    workflowId: id,
    status: 'completed',
    output: {
      message: 'Mock workflow execution completed',
      data: inputData || { test: 'mock data' }
    },
    timestamp: new Date().toISOString()
  });
});

// Mock Supabase Service
mockApp.get('/api/supabase/tables', (req, res) => {
  console.log('🗄️ Mock Supabase: GET /api/supabase/tables');
  
  const mockTables = [
    {
      id: 'table-1',
      name: 'documents',
      schema: 'public',
      columns: [
        { name: 'id', type: 'uuid', primary: true },
        { name: 'title', type: 'text' },
        { name: 'content', type: 'jsonb' },
        { name: 'created_at', type: 'timestamp' }
      ],
      rowCount: 42
    },
    {
      id: 'table-2',
      name: 'blocks',
      schema: 'public', 
      columns: [
        { name: 'id', type: 'uuid', primary: true },
        { name: 'document_id', type: 'uuid' },
        { name: 'type', type: 'text' },
        { name: 'content', type: 'jsonb' },
        { name: 'position', type: 'integer' }
      ],
      rowCount: 156
    }
  ];

  res.json({
    success: true,
    tables: mockTables,
    database: 'opendocs',
    message: 'Mock Supabase tables loaded successfully'
  });
});

mockApp.post('/api/supabase/query', (req, res) => {
  console.log('🔍 Mock Supabase: POST /api/supabase/query');
  
  const { query, params } = req.body;
  
  res.json({
    success: true,
    data: [
      { id: 'row-1', name: 'Test Document', content: 'Mock content' },
      { id: 'row-2', name: 'Another Document', content: 'More mock content' }
    ],
    rowCount: 2,
    query: query,
    params: params || []
  });
});

// Mock OpenClaw Service
mockApp.post('/api/openclaw/send', (req, res) => {
  console.log('📱 Mock OpenClaw: POST /api/openclaw/send');
  
  const { platform, message, recipient } = req.body;
  
  res.json({
    success: true,
    messageId: `msg-${Date.now()}`,
    platform: platform || 'whatsapp',
    recipient: recipient || '+1234567890',
    status: 'sent',
    timestamp: new Date().toISOString()
  });
});

mockApp.get('/api/openclaw/status/:messageId', (req, res) => {
  console.log('📊 Mock OpenClaw: GET /api/openclaw/status/:messageId');
  
  const { messageId } = req.params;
  
  res.json({
    success: true,
    messageId: messageId,
    status: 'delivered',
    deliveredAt: new Date().toISOString(),
    readAt: new Date(Date.now() + 30000).toISOString()
  });
});

// Health check endpoint
mockApp.get('/api/mock/health', (req, res) => {
  res.json({
    status: 'healthy',
    services: {
      n8n: 'mock',
      supabase: 'mock', 
      openclaw: 'mock'
    },
    timestamp: new Date().toISOString(),
    message: 'Mock backend services running successfully'
  });
});

// Start mock server
const MOCK_PORT = process.env.MOCK_PORT || 3001;

mockApp.listen(MOCK_PORT, () => {
  console.log(`╔══════════════════════════════════════════════════════════════╗`);
  console.log(`║                      🚀 Mock Services Server                ║`);
  console.log(`║  URL:         http://localhost:${MOCK_PORT}                             ║`);
  console.log(`║  Services:    n8n, Supabase, OpenClaw                      ║`);
  console.log(`║  Status:      Mock Mode (Docker containers DOWN)            ║`);
  console.log(`║  Endpoints:   /api/n8n/* | /api/supabase/* | /api/openclaw/*║`);
  console.log(`║  Health:      /api/mock/health                             ║`);
  console.log(`╚══════════════════════════════════════════════════════════════╝`);
});

module.exports = mockApp;