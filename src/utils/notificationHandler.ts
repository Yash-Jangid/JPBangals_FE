import notifee, {
  AndroidStyle,
  TriggerType,
  RepeatFrequency,
} from '@notifee/react-native';

export async function requestUserPermission() {
  const settings = await notifee.requestPermission();
  return settings.authorizationStatus >= 1;
}

async function fetchDynamicContent() {
  try {
    const response = await fetch(
      'https://api.theoutpost.ai/api/news-story/top-stories',
    );
    const data = await response.json();
    return data && data[0];
  } catch (error) {
    throw error;
  }
}

export async function scheduleDailyNotification() {
  const notificationId = 'daily-reminder';

  const permissionGranted = await requestUserPermission();
  if (!permissionGranted) {
    console.log('Notification permission is not granted');
    return;
  }

  // Check if the notification is already scheduled
  const pendingNotifications = await notifee.getTriggerNotifications();
  const isAlreadyScheduled = pendingNotifications.some(
    notification => notification.notification.id === notificationId,
  );

  if (isAlreadyScheduled) {
    console.log('9 AM notification is already scheduled');
    return;
  }

  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
  });

  try {
    const newsStory = await fetchDynamicContent();
    if (!newsStory) {
      console.log('No top story found');
      return;
    }

    // Get the current date
    const date = new Date();

    // Set the time to 9:00:00 AM
    date.setHours(9, 0, 0, 0);

    // If it's already past 9 AM today, schedule for tomorrow
    if (date.getTime() < Date.now()) {
      date.setDate(date.getDate() + 1);
    }

    await notifee.createTriggerNotification(
      {
        title: newsStory?.title,
        body: newsStory?.description,
        android: {
          channelId,
          style: {
            type: AndroidStyle.BIGPICTURE,
            picture: newsStory?.images[0]?.url,
          },
        },
        ios: {
          attachments: [
            {
              url: newsStory?.images[0]?.url,
              thumbnailHidden: false,
            },
          ],
        },
      },
      {
        type: TriggerType.TIMESTAMP,
        timestamp: date.getTime(), // Convert to timestamp
        repeatFrequency: RepeatFrequency.DAILY,
      },
    );
  } catch (error) {
    console.log(error);
  }
}
