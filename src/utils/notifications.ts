export interface Notification {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  disasterType?: string;
  region?: string;
  riskLevel?: string;
  read: boolean;
}

export const RISK_THRESHOLDS = {
  CRITICAL: 75,
  HIGH: 50,
  MODERATE: 25,
};

export const createNotification = (
  title: string,
  message: string,
  type: 'critical' | 'warning' | 'info' = 'info',
  disasterType?: string,
  region?: string,
  riskLevel?: string
): Notification => {
  return {
    id: `notif-${Date.now()}-${Math.random()}`,
    type,
    title,
    message,
    timestamp: new Date(),
    disasterType,
    region,
    riskLevel,
    read: false,
  };
};

export const getNotificationType = (riskScore: number): 'critical' | 'warning' | 'info' => {
  if (riskScore >= RISK_THRESHOLDS.CRITICAL) {
    return 'critical';
  } else if (riskScore >= RISK_THRESHOLDS.HIGH) {
    return 'warning';
  }
  return 'info';
};

export const formatNotificationTime = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  
  return date.toLocaleDateString();
};
