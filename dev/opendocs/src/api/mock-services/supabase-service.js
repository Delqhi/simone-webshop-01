/**
 * Mock Supabase Service for OpenDocs
 * Provides realistic database operations when Supabase Docker container is DOWN
 */

const mockTables = [
  {
    id: 'table-1',
    name: 'documents',
    schema: 'public',
    columns: [
      { name: 'id', type: 'uuid', primary: true, nullable: false },
      { name: 'title', type: 'text', primary: false, nullable: false },
      { name: 'content', type: 'jsonb', primary: false, nullable: true },
      { name: 'created_at', type: 'timestamp', primary: false, nullable: false },
      { name: 'updated_at', type: 'timestamp', primary: false, nullable: false }
    ],
    rowCount: 42,
    data: [
      { id: 'doc-1', title: 'Test Document', content: { type: 'text', text: 'Mock content' }, created_at: '2026-02-10T10:00:00Z' },
      { id: 'doc-2', title: 'Another Document', content: { type: 'text', text: 'More mock content' }, created_at: '2026-02-10T11:00:00Z' }
    ]
  },
  {
    id: 'table-2',
    name: 'blocks',
    schema: 'public',
    columns: [
      { name: 'id', type: 'uuid', primary: true, nullable: false },
      { name: 'document_id', type: 'uuid', primary: false, nullable: false },
      { name: 'type', type: 'text', primary: false, nullable: false },
      { name: 'content', type: 'jsonb', primary: false, nullable: true },
      { name: 'position', type: 'integer', primary: false, nullable: false }
    ],
    rowCount: 156,
    data: []
  }
];

const mockRules = [
  {
    id: 'rule-1',
    table_name: 'test_table',
    when_column: 'status',
    when_equals: 'done',
    then_set_column: 'archived',
    then_set_value: 'true'
  }
];

export const mockSupabaseService = {
  async listTables() {
    return mockTables;
  },

  async getTable(id) {
    return mockTables.find(t => t.id === id) || null;
  },

  async provisionTable({ tableName, columns = [] }) {
    const table = {
      id: tableName,
      name: tableName,
      schema: 'public',
      columns: columns.map(c => {
        const colObj = typeof c === 'string' ? { name: c, type: 'text' } : c;
        return {
          name: colObj.name,
          type: colObj.type || 'text',
          primary: false,
          nullable: true
        };
      }),
      rowCount: 0,
      data: []
    };
    mockTables.push(table);
    return table;
  },

  async createRow({ tableName, data = {} }) {
    const row = {
      id: 'row-' + Date.now().toString(36),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...data
    };
    const table = mockTables.find(t => t.name === tableName);
    if (table) {
      table.data.push(row);
      table.rowCount++;
    }
    return row;
  },

  async upsertRow({ tableName, id, data = {} }) {
    let row;
    const table = mockTables.find(t => t.name === tableName);
    if (table) {
      row = table.data.find(r => r.id === id);
      if (row) {
        Object.assign(row, data);
        row.updated_at = new Date().toISOString();
      } else {
        row = {
          id: id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          ...data
        };
        table.data.push(row);
        table.rowCount++;
      }
    }
    return row;
  },

  async deleteRow({ tableName, id }) {
    const table = mockTables.find(t => t.name === tableName);
    if (table) {
      table.data = table.data.filter(r => r.id !== id);
      table.rowCount--;
    }
  },

  async dropTable({ tableName }) {
    const index = mockTables.findIndex(t => t.name === tableName);
    if (index !== -1) {
      mockTables.splice(index, 1);
    }
  },

  async createRule({ tableName, whenColumn, whenEquals, thenSetColumn, thenSetValue }) {
    const rule = {
      id: 'rule-' + Date.now().toString(36),
      table_name: tableName,
      when_column: whenColumn,
      when_equals: String(whenEquals),
      then_set_column: thenSetColumn,
      then_set_value: String(thenSetValue || ''),
      created_at: new Date().toISOString()
    };
    mockRules.push(rule);
    return rule;
  },

  async getRules({ tableName }) {
    return mockRules.filter(r => r.table_name === tableName);
  },

  async triggerAutomation({ tableName, rowId }) {
    const rules = await this.getRules({ tableName });
    let executed = 0;
    
    if (rules.length > 0) {
      // Find the row
      let row = null;
      const table = mockTables.find(t => t.name === tableName);
      if (table) {
        row = table.data.find(r => r.id === rowId);
      }
      
      if (row) {
        for (const rule of rules) {
          if (String(row[rule.when_column]) === rule.when_equals) {
            row[rule.then_set_column] = rule.then_set_value;
            executed++;
          }
        }
      }
    }
    
    return {
      id: 'execution-' + Date.now().toString(36),
      status: 'completed',
      executed,
      rowId
    };
  }
};
