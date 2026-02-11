import { useEffect, useState } from "react";
import { useNotifications } from "@/services/notifications";
import { X, Info, CheckCircle, AlertTriangle, AlertCircle } from "lucide-react";

interface NotificationToastProps {
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  maxNotifications?: number;
}

export function NotificationToast({ 
  position = "top-right", 
  maxNotifications = 5 
}: NotificationToastProps) {
  const notificationService = useNotifications();
  const [notifications, setNotifications] = useState(notificationService.getNotifications());

  useEffect(() => {
    // Listen for new notifications
    const handleNotification = (event: CustomEvent) => {
      const notification = event.detail;
      setNotifications(prev => [notification, ...prev].slice(0, maxNotifications));
      
      // Auto-dismiss after duration
      if (notification.duration) {
        setTimeout(() => {
          setNotifications(prev => prev.filter(n => n.id !== notification.id));
        }, notification.duration);
      }
    };

    const handleNotificationsCleared = () => {
      setNotifications([]);
    };

    window.addEventListener('opendocs-notification', handleNotification as EventListener);
    window.addEventListener('opendocs-notifications-cleared', handleNotificationsCleared);

    return () => {
      window.removeEventListener('opendocs-notification', handleNotification as EventListener);
      window.removeEventListener('opendocs-notifications-cleared', handleNotificationsCleared);
    };
  }, [maxNotifications]);

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getBackgroundColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200 dark:bg-green-950/50 dark:border-green-800";
      case "warning":
        return "bg-yellow-50 border-yellow-200 dark:bg-yellow-950/50 dark:border-yellow-800";
      case "error":
        return "bg-red-50 border-red-200 dark:bg-red-950/50 dark:border-red-800";
      default:
        return "bg-blue-50 border-blue-200 dark:bg-blue-950/50 dark:border-blue-800";
    }
  };

  const positionClasses = {
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4", 
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4"
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    notificationService.removeNotification(id);
  };

  if (notifications.length === 0) return null;

  return (
    <div className={`fixed z-50 ${positionClasses[position]} space-y-2`}>
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`flex items-start gap-3 rounded-lg border p-4 shadow-lg transition-all duration-300 animate-in slide-in-from-right-full ${getBackgroundColor(notification.type)}`}
          style={{ width: "320px" }}
        >
          <div className="flex-shrink-0 pt-0.5">
            {getIcon(notification.type)}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              {notification.title}
            </div>
            <div className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
              {notification.message}
            </div>
            
            {notification.action && (
              <button
                onClick={notification.action.onClick}
                className="mt-2 text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                {notification.action.label}
              </button>
            )}
          </div>
          
          <button
            onClick={() => dismissNotification(notification.id)}
            className="flex-shrink-0 rounded p-1 text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300"
            aria-label="Dismiss notification"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}