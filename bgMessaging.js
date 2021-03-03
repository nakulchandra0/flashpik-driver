import firebase, {Notification} from 'react-native-firebase';

export default async message => {
  
 
  // Build a channel
  const channel = new firebase.notifications.Android.Channel('ALL', 'Construct Ireland', firebase.notifications.Android.Importance.Max)
    .setDescription('Construct Ireland Notification');
    const badgeCount = await firebase.notifications().getBadge();
    const localNotification = new firebase.notifications.Notification()
        .setNotificationId(message.messageId)
        .setTitle(message.data.title)
        .setBody(message.data.message)
        .setData(message.data)
        .android.setChannelId(channel.channelId)
        .android.setAutoCancel(true)
        .android.setSmallIcon('ic_launcher')
        .android.setCategory(firebase.notifications.Android.Category.Alarm)
        .android.setPriority(firebase.notifications.Android.Priority.High);

     
  firebase.notifications().android.createChannel(channel);
  firebase.notifications().setBadge(badgeCount);
  firebase.notifications().displayNotification(localNotification);
return Promise.resolve();
};


