
import notifee, { AndroidImportance } from '@notifee/react-native';
import { Platform } from 'react-native';

class NotificationService {
  private static instance: NotificationService;

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  async requestUserPermission() {
    try {
      // Use notifee to request permission instead of Firebase
      const permission = await notifee.requestPermission();
      const enabled = permission.authorizationStatus >= 1; // AuthorizationStatus.AUTHORIZED
      
      if (enabled) {
        console.log('Notification permission granted');
        return true;
      }
      return false;
    } catch (error) {
      console.log('Error requesting notification permission:', error);
      return false;
    }
  }

  async setupNotifications() {
    try {
      // Request permission
      const hasPermission = await this.requestUserPermission();
      if (!hasPermission) {
        console.log('Notification permission denied');
        return;
      }

      // Create notification channel for Android
      if (Platform.OS === 'android') {
        await notifee.createChannel({
          id: 'default',
          name: 'Default Channel',
          importance: AndroidImportance.HIGH,
        });
      }

      console.log('Local notifications setup completed');

    } catch (error) {
      console.log('Error setting up notifications:', error);
    }
  }

  async displayLocalNotification(title: string, body: string, data?: any) {
    try {
      // Create notification channel for Android
      if (Platform.OS === 'android') {
        await notifee.createChannel({
          id: 'default',
          name: 'Default Channel',
          importance: AndroidImportance.HIGH,
        });
      }

      // Display local notification
      await notifee.displayNotification({
        title: title || 'New Notification',
        body: body || 'You have a new message',
        data: data,
        android: {
          channelId: 'default',
          importance: AndroidImportance.HIGH,
          pressAction: {
            id: 'default',
          },
        },
        ios: {
          foregroundPresentationOptions: {
            badge: true,
            sound: true,
            banner: true,
            list: true,
          },
        },
      });
    } catch (error) {
      console.log('Error displaying local notification:', error);
    }
  }

  handleNotificationOpen(data: any) {
    // Handle navigation based on notification data
    if (data?.type === 'course') {
      // Navigate to course detail
      // You'll need to implement navigation logic here
      console.log('Navigate to course:', data.courseId);
    } else if (data?.type === 'message') {
      // Navigate to messages
      console.log('Navigate to messages');
    }
  }

  async scheduleLocalNotification(title: string, body: string, delay: number = 5000) {
    try {
      await notifee.displayNotification({
        title,
        body,
        android: {
          channelId: 'default',
          importance: AndroidImportance.HIGH,
        },
      });
    } catch (error) {
      console.log('Error scheduling local notification:', error);
    }
  }
}

export const useNotificationService = () => {
  const service = NotificationService.getInstance();
  
  return {
    setupNotifications: () => service.setupNotifications(),
    scheduleLocalNotification: (title: string, body: string, delay?: number) => 
      service.scheduleLocalNotification(title, body, delay),
    displayLocalNotification: (title: string, body: string, data?: any) =>
      service.displayLocalNotification(title, body, data),
  };
};

