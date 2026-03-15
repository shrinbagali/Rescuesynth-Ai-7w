import React from 'react';
import { Bell, X, AlertTriangle, AlertCircle, Info, CheckCircle } from 'lucide-react';
import { Notification, formatNotificationTime } from '../utils/notifications';

interface NotificationPanelProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
  onClearAll: () => void;
  unreadCount: number;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({
  notifications,
  onDismiss,
  onClearAll,
  unreadCount,
}) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle size={18} className="text-red-400" />;
      case 'warning':
        return <AlertCircle size={18} className="text-amber-400" />;
      case 'info':
        return <Info size={18} className="text-blue-400" />;
      default:
        return <CheckCircle size={18} className="text-green-400" />;
    }
  };

  const getBackgroundColor = (type: string) => {
    switch (type) {
      case 'critical':
        return 'bg-red-900/20 border-red-800';
      case 'warning':
        return 'bg-amber-900/20 border-amber-800';
      case 'info':
        return 'bg-blue-900/20 border-blue-800';
      default:
        return 'bg-green-900/20 border-green-800';
    }
  };

  const getTextColor = (type: string) => {
    switch (type) {
      case 'critical':
        return 'text-red-400';
      case 'warning':
        return 'text-amber-400';
      case 'info':
        return 'text-blue-400';
      default:
        return 'text-green-400';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-96 max-h-96 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl flex flex-col z-50">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell size={20} className="text-blue-400" />
          <h3 className="font-semibold text-white">Notifications</h3>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        {notifications.length > 0 && (
          <button
            onClick={onClearAll}
            className="text-xs text-gray-400 hover:text-gray-300 transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto space-y-2 p-4">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-gray-400">
            <CheckCircle size={32} className="mb-2 opacity-50" />
            <p className="text-sm">No notifications</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-3 rounded-lg border ${getBackgroundColor(
                notif.type
              )} transition-all hover:shadow-lg`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-1">{getIcon(notif.type)}</div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className={`font-semibold text-sm ${getTextColor(notif.type)}`}>
                        {notif.title}
                      </h4>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {formatNotificationTime(notif.timestamp)}
                      </p>
                    </div>
                    <button
                      onClick={() => onDismiss(notif.id)}
                      className="text-gray-400 hover:text-gray-300 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <p className="text-sm text-gray-300 mt-1">{notif.message}</p>
                  {notif.disasterType && (
                    <div className="flex gap-4 mt-2 text-xs text-gray-400">
                      <span>Type: {notif.disasterType}</span>
                      {notif.region && <span>Region: {notif.region}</span>}
                      {notif.riskLevel && <span>Risk: {notif.riskLevel}</span>}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
