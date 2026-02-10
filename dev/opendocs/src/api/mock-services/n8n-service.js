/**
 * Mock N8N Service for OpenDocs
 * Provides realistic n8n node data when n8n Docker container is DOWN
 */

const mockNodes = [
  {
    id: 'n8n-nodes-http-request',
    name: 'HTTP Request',
    type: 'n8n-nodes-base.httpRequest',
    description: 'Make HTTP requests to APIs and websites',
    category: ['Core'],
    icon: '🌐'
  },
  {
    id: 'n8n-nodes-code',
    name: 'Code',
    type: 'n8n-nodes-base.code',
    description: 'Execute custom JavaScript/Python code',
    category: ['Core'],
    icon: '💻'
  },
  {
    id: 'n8n-nodes-set',
    name: 'Set',
    type: 'n8n-nodes-base.set',
    description: 'Set values on items',
    category: ['Core'],
    icon: '📝'
  },
  {
    id: 'n8n-nodes-if',
    name: 'If',
    type: 'n8n-nodes-base.if',
    description: 'Conditional logic based on item data',
    category: ['Logic'],
    icon: '⚖️'
  },
  {
    id: 'n8n-nodes-delay',
    name: 'Delay',
    type: 'n8n-nodes-base.wait',
    description: 'Pause execution for specified time',
    category: ['Core'],
    icon: '⏱️'
  },
  {
    id: 'n8n-nodes-email',
    name: 'Email',
    type: 'n8n-nodes-base.email',
    description: 'Send emails via SMTP',
    category: ['Communication'],
    icon: '📧'
  },
  {
    id: 'n8n-nodes-database',
    name: 'Database',
    type: 'n8n-nodes-base.postgres',
    description: 'Execute SQL queries on PostgreSQL',
    category: ['Database'],
    icon: '🗄️'
  }
];

const mockWorkflows = [
  {
    id: 'workflow-001',
    name: 'Test Workflow',
    active: false,
    nodes: [
      {
        id: 'node-1',
        name: 'Webhook Trigger',
        type: 'n8n-nodes-base.webhook',
        position: [200, 200],
        parameters: {
          path: '/webhook/test',
          method: 'POST'
        },
        disabled: false
      },
      {
        id: 'node-2',
        name: 'HTTP Request',
        type: 'n8n-nodes-base.httpRequest',
        position: [300, 200],
        parameters: {
          url: 'https://api.example.com/data',
          method: 'GET'
        },
        disabled: false
      }
    ],
    connections: {
      'Webhook Trigger': {
        main: [[{ node: 'HTTP Request', type: 'main', index: 0 }]]
      },
      'HTTP Request': {
        main: []
      }
    },
    settings: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const mockN8nService = {
  async getNodes() {
    return mockNodes;
  },

  async createWorkflow({ name }) {
    const workflow = {
      id: 'workflow-' + Date.now().toString(36),
      name: name || 'New Workflow',
      active: false,
      nodes: [],
      connections: {},
      settings: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockWorkflows.push(workflow);
    return workflow;
  },

  async getWorkflow(id) {
    return mockWorkflows.find(w => w.id === id) || mockWorkflows[0];
  },

  async listWorkflows() {
    return mockWorkflows;
  },

  async updateWorkflow(workflowId, updates) {
    const index = mockWorkflows.findIndex(w => w.id === workflowId);
    if (index !== -1) {
      mockWorkflows[index] = { ...mockWorkflows[index], ...updates };
      return mockWorkflows[index];
    }
    return null;
  },

  async executeWorkflow(workflowId) {
    return {
      id: 'exec-' + Date.now().toString(36),
      status: 'success',
      data: {
        result: 'Mock workflow executed successfully',
        timestamp: new Date().toISOString(),
        executionTime: Math.floor(Math.random() * 500) + 100
      },
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + Math.random() * 500 + 100),
      mock: true
    };
  },

  async toggleNode(workflowId, nodeId, disabled) {
    const workflow = await this.getWorkflow(workflowId);
    if (!workflow) throw new Error('Workflow not found');
    
    const node = workflow.nodes.find(n => n.id === nodeId || n.name === nodeId);
    if (node) {
      node.disabled = disabled;
    }
    return workflow;
  },

  async connectNodes(workflowId, sourceNodeId, targetNodeId, index = 0) {
    const workflow = this.getWorkflow(workflowId);
    if (!workflow) throw new Error('Workflow not found');
    
    const source = workflow.nodes.find(n => n.id === sourceNodeId || n.name === sourceNodeId);
    const target = workflow.nodes.find(n => n.id === targetNodeId || n.name === targetNodeId);
    if (!source || !target) throw new Error('Nodes not found');
    
    if (!workflow.connections[source.name]) {
      workflow.connections[source.name] = { main: [] };
    }
    
    const sourceName = source.name;
    const targetName = target.name;
    
    if (!workflow.connections[sourceName]) {
      workflow.connections[sourceName] = { main: [] };
    }
    
    workflow.connections = {
      ...workflow.connections,
      [sourceName]: {
        main: [...(workflow.connections[sourceName]?.main || []), 
               { node: targetName, type: 'main', index: index }]
      }
    };
    
    return workflow;
  }
};
