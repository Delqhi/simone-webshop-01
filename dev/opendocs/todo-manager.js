// Mock Todo Manager for server startup
export default class TodoManager {
  constructor() {
    this.todos = new Map();
  }
  
  getTodos() {
    return [];
  }
  
  addTodo(todo) {
    return { id: 'mock-' + Date.now(), ...todo };
  }
  
  updateTodo(id, updates) {
    return { id, ...updates };
  }
  
  deleteTodo(id) {
    return true;
  }
}