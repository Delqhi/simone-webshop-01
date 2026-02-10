import { nanoid } from 'nanoid';

interface N8nNode {
  name: string;
  displayName: string;
  description: string;
  credentials?: string[];
}

interface N8nWorkflow {
  id: string;
  name: string;
  description?: string;
  status: 'draft' | 'active' | 'disabled';
  nodes: any[];
  connections: any[];
  createdAt: string;
  updatedAt: string;
}

interface N8nExecution {
  id: string;
  workflowId: string;
  status: 'success' | 'error' | 'running';
  startTime: string;
  endTime?: string;
  data: any;
  error?: string;
}

// In-memory storage for mock data
const workflows: Map<string, N8nWorkflow> = new Map();
const executions: Map<string, N8nExecution> = new Map();

const availableNodes: N8nNode[] = [
  {
    name: 'HTTP Request',
    displayName: 'HTTP Request',
    description: 'Make HTTP requests to external APIs',
  },
  {
    name: 'Webhook',
    displayName: 'Webhook',
    description: 'Receive webhooks from external services',
  },
  {
    name: 'Conditional',
    displayName: 'If/Then',
    description: 'Execute different paths based on conditions',
  },
  {
    name: 'Function',
    displayName: 'Function',
    description: 'Execute custom JavaScript code',
  },
  {
    name: 'Merge',
    displayName: 'Merge',
    description: 'Merge data from multiple sources',
  },
  {
    name: 'Code',
    displayName: 'Code',
    description: 'Execute Node.js code',
  },
  {
    name: 'Set',
    displayName: 'Set',
    description: 'Set values and properties',
  },
  {
    name: 'Supabase',
    displayName: 'Supabase',
    description: 'Query and modify Supabase database',
    credentials: ['supabaseApi'],
  },
];

export const mockN8nService = {
  /**
   * Get all available nodes that can be used in workflows
   */
  async getNodes(): Promise<N8nNode[]> {
    return availableNodes;
  },

  /**
   * Get a specific node by name
   */
  async getNode(nodeName: string): Promise<N8nNode | null> {
    return availableNodes.find((n) => n.name === nodeName) || null;
  },

  /**
   * Create a new workflow
   */
  async createWorkflow(data: {
    name: string;
    description?: string;
  }): Promise<N8nWorkflow> {
    const workflow: N8nWorkflow = {
      id: nanoid(),
      name: data.name,
      description: data.description,
      status: 'draft',
      nodes: [],
      connections: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    workflows.set(workflow.id, workflow);
    return workflow;
  },

  /**
   * Get all workflows
   */
  async listWorkflows(): Promise<N8nWorkflow[]> {
    return Array.from(workflows.values());
  },

  /**
   * Get a specific workflow by ID
   */
  async getWorkflow(workflowId: string): Promise<N8nWorkflow | null> {
    return workflows.get(workflowId) || null;
  },

  /**
   * Update a workflow
   */
  async updateWorkflow(
    workflowId: string,
    data: Partial<N8nWorkflow>
  ): Promise<N8nWorkflow | null> {
    const workflow = workflows.get(workflowId);
    if (!workflow) return null;

    const updated: N8nWorkflow = {
      ...workflow,
      ...data,
      updatedAt: new Date().toISOString(),
    };

    workflows.set(workflowId, updated);
    return updated;
  },

  /**
   * Delete a workflow
   */
  async deleteWorkflow(workflowId: string): Promise<boolean> {
    return workflows.delete(workflowId);
  },

  /**
   * Execute a workflow
   */
  async executeWorkflow(
    workflowId: string,
    inputData?: any
  ): Promise<N8nExecution> {
    const workflow = workflows.get(workflowId);
    if (!workflow) {
      throw new Error(`Workflow ${workflowId} not found`);
    }

    const execution: N8nExecution = {
      id: nanoid(),
      workflowId,
      status: 'running',
      startTime: new Date().toISOString(),
      data: inputData || {},
    };

    executions.set(execution.id, execution);

    // Simulate execution delay and completion
    setTimeout(() => {
      const running = executions.get(execution.id);
      if (running) {
        running.status = 'success';
        running.endTime = new Date().toISOString();
        running.data = {
          ...inputData,
          result: 'Workflow executed successfully',
          timestamp: new Date().toISOString(),
        };
      }
    }, 1000);

    return execution;
  },

  /**
   * Get execution details
   */
  async getExecution(executionId: string): Promise<N8nExecution | null> {
    return executions.get(executionId) || null;
  },

  /**
   * List all executions for a workflow
   */
  async listExecutions(workflowId: string): Promise<N8nExecution[]> {
    return Array.from(executions.values()).filter(
      (e) => e.workflowId === workflowId
    );
  },

  /**
   * Clear all mock data (useful for testing)
   */
  async clearAll(): Promise<void> {
    workflows.clear();
    executions.clear();
  },
};

export type { N8nWorkflow, N8nNode, N8nExecution };
