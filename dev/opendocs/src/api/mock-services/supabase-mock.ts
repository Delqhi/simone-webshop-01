import { nanoid } from 'nanoid';

interface SupabaseTable {
  id: string;
  name: string;
  schema: string;
  columns: SupabaseColumn[];
  createdAt: string;
}

interface SupabaseColumn {
  name: string;
  type: string;
  nullable: boolean;
  default?: string;
}

interface SupabaseRule {
  id: string;
  tableId: string;
  name: string;
  trigger: string;
  actions: string[];
  enabled: boolean;
  createdAt: string;
}

interface SupabaseAutomation {
  id: string;
  ruleId: string;
  triggeredAt: string;
  status: 'success' | 'error' | 'pending';
  result: any;
}

const tables: Map<string, SupabaseTable> = new Map();
const rules: Map<string, SupabaseRule> = new Map();
const automations: Map<string, SupabaseAutomation> = new Map();

export const mockSupabaseService = {
  /**
   * Provision a new table in Supabase
   */
  async provisionTable(data: {
    name: string;
    schema?: string;
    columns?: SupabaseColumn[];
  }): Promise<SupabaseTable> {
    const table: SupabaseTable = {
      id: nanoid(),
      name: data.name,
      schema: data.schema || 'public',
      columns: data.columns || [
        {
          name: 'id',
          type: 'uuid',
          nullable: false,
          default: 'gen_random_uuid()',
        },
        {
          name: 'created_at',
          type: 'timestamp',
          nullable: false,
          default: 'now()',
        },
      ],
      createdAt: new Date().toISOString(),
    };

    tables.set(table.id, table);
    return table;
  },

  /**
   * List all provisioned tables
   */
  async listTables(): Promise<SupabaseTable[]> {
    return Array.from(tables.values());
  },

  /**
   * Get a specific table by ID
   */
  async getTable(tableId: string): Promise<SupabaseTable | null> {
    return tables.get(tableId) || null;
  },

  /**
   * Update table structure
   */
  async updateTable(
    tableId: string,
    data: Partial<SupabaseTable>
  ): Promise<SupabaseTable | null> {
    const table = tables.get(tableId);
    if (!table) return null;

    const updated: SupabaseTable = {
      ...table,
      ...data,
    };

    tables.set(tableId, updated);
    return updated;
  },

  /**
   * Delete a table
   */
  async deleteTable(tableId: string): Promise<boolean> {
    return tables.delete(tableId);
  },

  /**
   * Create an automation rule
   */
  async createRule(data: {
    tableId: string;
    name: string;
    trigger: string;
    actions: string[];
  }): Promise<SupabaseRule> {
    const rule: SupabaseRule = {
      id: nanoid(),
      tableId: data.tableId,
      name: data.name,
      trigger: data.trigger,
      actions: data.actions,
      enabled: true,
      createdAt: new Date().toISOString(),
    };

    rules.set(rule.id, rule);
    return rule;
  },

  /**
   * List all automation rules for a table
   */
  async listRules(tableId: string): Promise<SupabaseRule[]> {
    return Array.from(rules.values()).filter((r) => r.tableId === tableId);
  },

  /**
   * Update a rule
   */
  async updateRule(
    ruleId: string,
    data: Partial<SupabaseRule>
  ): Promise<SupabaseRule | null> {
    const rule = rules.get(ruleId);
    if (!rule) return null;

    const updated: SupabaseRule = {
      ...rule,
      ...data,
    };

    rules.set(ruleId, updated);
    return updated;
  },

  /**
   * Delete a rule
   */
  async deleteRule(ruleId: string): Promise<boolean> {
    return rules.delete(ruleId);
  },

  /**
   * Trigger an automation rule manually
   */
  async triggerAutomation(ruleId: string, data?: any): Promise<SupabaseAutomation> {
    const rule = rules.get(ruleId);
    if (!rule) {
      throw new Error(`Rule ${ruleId} not found`);
    }

    const automation: SupabaseAutomation = {
      id: nanoid(),
      ruleId,
      triggeredAt: new Date().toISOString(),
      status: 'pending',
      result: null,
    };

    automations.set(automation.id, automation);

    setTimeout(() => {
      const pending = automations.get(automation.id);
      if (pending) {
        pending.status = 'success';
        pending.result = {
          ruleId,
          triggeredActions: rule.actions,
          inputData: data,
          executedAt: new Date().toISOString(),
        };
      }
    }, 800);

    return automation;
  },

  /**
   * Get automation execution status
   */
  async getAutomation(automationId: string): Promise<SupabaseAutomation | null> {
    return automations.get(automationId) || null;
  },

  /**
   * List all automations for a rule
   */
  async listAutomations(ruleId: string): Promise<SupabaseAutomation[]> {
    return Array.from(automations.values()).filter((a) => a.ruleId === ruleId);
  },

  /**
   * Clear all mock data
   */
  async clearAll(): Promise<void> {
    tables.clear();
    rules.clear();
    automations.clear();
  },
};

export type { SupabaseTable, SupabaseRule, SupabaseAutomation, SupabaseColumn };
