// Mock Todo Loop for server startup
export function initializeTodoLoop(todoManager) {
  console.log("[TodoLoop] Mock initialized");
  return {
    start: () => {},
    stop: () => {},
    getStatus: () => ({ running: false })
  };
}