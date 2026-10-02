// Local and Browser Notification Service

export type AppNotificationPermission = 'granted' | 'denied' | 'default' | 'unsupported';

export function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export function getNotificationPermission(): AppNotificationPermission {
  if (!isNotificationSupported()) {
    return 'unsupported';
  }
  return Notification.permission as AppNotificationPermission;
}

export async function requestNotificationPermission(): Promise<AppNotificationPermission> {
  if (!isNotificationSupported()) {
    return 'unsupported';
  }
  try {
    const res = await Notification.requestPermission();
    return res as AppNotificationPermission;
  } catch (err) {
    console.warn('Notification permission request error:', err);
    return 'denied';
  }
}

export interface ShowNotificationOptions {
  title: string;
  body: string;
  tag?: string;
  icon?: string;
  badge?: string;
  data?: Record<string, any>;
  onClick?: () => void;
}

export function sendLocalBrowserNotification({
  title,
  body,
  tag,
  icon,
  onClick
}: ShowNotificationOptions): Notification | null {
  if (!isNotificationSupported() || Notification.permission !== 'granted') {
    return null;
  }

  try {
    const notif = new Notification(title, {
      body,
      tag: tag || 'evolve-reminder',
      icon: icon || '/favicon.ico',
      requireInteraction: false
    });

    if (onClick) {
      notif.onclick = () => {
        window.focus();
        onClick();
        notif.close();
      };
    }

    return notif;
  } catch (err) {
    console.debug('Failed to construct browser notification:', err);
    return null;
  }
}
