import { useDocsStore } from "@/store/useDocsStore";
import { nanoid } from "nanoid";

/**
 * Real-time Notification Service
 * Handles browser notifications, in-app toasts, and real-time updates
 */

export interface Notification {
  id: string;
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
  duration?: number; // ms until auto-dismiss
}

export interface NotificationPreferences {
  browserNotifications: boolean;
  sounds: boolean;
  vibration: boolean;
  desktopAlerts: boolean;
  emailDigests: boolean;
}

class NotificationService {
  private notifications: Notification[] = [];
  private preferences: NotificationPreferences = {
    browserNotifications: true,
    sounds: false,
    vibration: false,
    desktopAlerts: false,
    emailDigests: false,
  };
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  constructor() {
    this.initializeWebSocket();
    this.requestNotificationPermission();
  }

  // WebSocket connection for real-time updates
  private initializeWebSocket(): void {
    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws/notifications`;
      
      this.ws = new WebSocket(wsUrl);
      
      this.ws.onopen = () => {
        console.log('WebSocket connected for real-time notifications');
        this.reconnectAttempts = 0;
        this.notify({
          type: 'success',
          title: 'Connected',
          message: 'Real-time updates enabled',
        });
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleWebSocketMessage(data);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.attemptReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } catch (error) {
      console.error('Failed to initialize WebSocket:', error);
    }
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('Max reconnection attempts reached');
      return;
    }

    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
    this.reconnectAttempts++;

    setTimeout(() => {
      this.initializeWebSocket();
    }, delay);
  }

  private handleWebSocketMessage(data: any): void {
    switch (data.type) {
      case 'collaboration':
        this.handleCollaborationNotification(data);
        break;
      case 'page_update':
        this.handlePageUpdateNotification(data);
        break;
      case 'comment':
        this.handleCommentNotification(data);
        break;
      case 'workflow':
        this.handleWorkflowNotification(data);
        break;
      default:
        console.warn('Unknown WebSocket message type:', data.type);
    }
  }

  // Notification creation and display
  notify(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): string {
    const fullNotification: Notification = {
      ...notification,
      id: nanoid(),
      timestamp: new Date().toISOString(),
      read: false,
    };

    this.notifications.unshift(fullNotification);
    
    // Limit notifications to 100
    if (this.notifications.length > 100) {
      this.notifications = this.notifications.slice(0, 100);
    }

    // Show browser notification if enabled
    if (this.preferences.browserNotifications && Notification.permission === 'granted') {
      this.showBrowserNotification(fullNotification);
    }

    // Dispatch event for UI components
    this.dispatchNotificationEvent(fullNotification);

    return fullNotification.id;
  }

  private showBrowserNotification(notification: Notification): void {
    if ('Notification' in window && Notification.permission === 'granted') {
      const browserNotification = new Notification(notification.title, {
        body: notification.message,
        icon: '/icon-192.png',
        tag: notification.id,
      });

      browserNotification.onclick = () => {
        window.focus();
        this.markAsRead(notification.id);
        
        if (notification.action) {
          notification.action.onClick();
        }
      };

      // Auto-close after 8 seconds
      setTimeout(() => {
        browserNotification.close();
      }, 8000);
    }
  }

  private dispatchNotificationEvent(notification: Notification): void {
    const event = new CustomEvent('opendocs-notification', {
      detail: notification,
    });
    window.dispatchEvent(event);
  }

  // Notification management
  markAsRead(id: string): void {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      this.dispatchNotificationEvent(notification);
    }
  }

  markAllAsRead(): void {
    this.notifications.forEach(notification => {
      notification.read = true;
    });
    window.dispatchEvent(new CustomEvent('opendocs-notifications-cleared'));
  }

  removeNotification(id: string): void {
    this.notifications = this.notifications.filter(n => n.id !== id);
  }

  clearAll(): void {
    this.notifications = [];
    window.dispatchEvent(new CustomEvent('opendocs-notifications-cleared'));
  }

  // Getters
  getNotifications(): Notification[] {
    return this.notifications;
  }

  getUnreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  getPreferences(): NotificationPreferences {
    return { ...this.preferences };
  }

  updatePreferences(newPreferences: Partial<NotificationPreferences>): void {
    this.preferences = { ...this.preferences, ...newPreferences };
    
    // Save to localStorage
    localStorage.setItem('opendocs-notification-preferences', JSON.stringify(this.preferences));
  }

  // Permission handling
  async requestNotificationPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      return false;
    }

    if (Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return Notification.permission === 'granted';
  }

  // Specific notification handlers
  private handleCollaborationNotification(data: any): void {
    const { user, action, pageTitle } = data;
    
    this.notify({
      type: 'info',
      title: 'Collaboration Update',
      message: `${user} ${action} ${pageTitle}`,
      action: data.pageId ? {
        label: 'View Page',
        onClick: () => {
          useDocsStore.getState().actions.selectPage(data.pageId);
        },
      } : undefined,
    });
  }

  private handlePageUpdateNotification(data: any): void {
    const { user, pageTitle, changeType } = data;
    
    this.notify({
      type: 'success',
      title: 'Page Updated',
      message: `${pageTitle} was ${changeType} by ${user}`,
      action: data.pageId ? {
        label: 'View Changes',
        onClick: () => {
          useDocsStore.getState().actions.selectPage(data.pageId);
        },
      } : undefined,
    });
  }

  private handleCommentNotification(data: any): void {
    const { user, pageTitle, commentPreview } = data;
    
    this.notify({
      type: 'info',
      title: 'New Comment',
      message: `${user} commented on ${pageTitle}: "${commentPreview}"`,
      action: data.pageId ? {
        label: 'View Comment',
        onClick: () => {
          useDocsStore.getState().actions.selectPage(data.pageId);
          // Would scroll to comment in real implementation
        },
      } : undefined,
    });
  }

  private handleWorkflowNotification(data: any): void {
    const { workflowName, status, result } = data;
    
    let type: Notification['type'] = 'info';
    if (status === 'completed') type = 'success';
    if (status === 'failed') type = 'error';
    if (status === 'warning') type = 'warning';

    this.notify({
      type,
      title: `Workflow ${status}`,
      message: `${workflowName}: ${result || status}`,
      action: data.workflowId ? {
        label: 'View Workflow',
        onClick: () => {
          // Would navigate to workflow in real implementation
          console.log('Navigate to workflow:', data.workflowId);
        },
      } : undefined,
    });
  }

  // Utility methods for specific notification types
  notifyPageCreated(pageId: string, pageTitle: string): void {
    this.notify({
      type: 'success',
      title: 'Page Created',
      message: `"${pageTitle}" has been created`,
      action: {
        label: 'Open Page',
        onClick: () => {
          useDocsStore.getState().actions.selectPage(pageId);
        },
      },
    });
  }

  notifyPageUpdated(pageId: string, pageTitle: string): void {
    this.notify({
      type: 'info',
      title: 'Page Saved',
      message: `Changes to "${pageTitle}" have been saved`,
      action: {
        label: 'View Page',
        onClick: () => {
          useDocsStore.getState().actions.selectPage(pageId);
        },
      },
    });
  }

  notifyError(title: string, message: string): void {
    this.notify({
      type: 'error',
      title,
      message,
    });
  }

  notifySuccess(title: string, message: string): void {
    this.notify({
      type: 'success',
      title,
      message,
    });
  }

  notifyWarning(title: string, message: string): void {
    this.notify({
      type: 'warning',
      title,
      message,
    });
  }

  // Cleanup
  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

// Singleton instance
export const notificationService = new NotificationService();

// Export for React hook usage
export const useNotifications = () => {
  return notificationService;
};