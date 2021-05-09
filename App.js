/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect} from 'react';
import {View, Text, Platform} from 'react-native';
import firebase from 'react-native-firebase';

const App = () => {
  const getToken = async () => {
    const firebaseToken = await firebase.messaging().getToken();
    console.log('Firebase token-->', firebaseToken);
    if (firebaseToken) {
      firebase.messaging().subscribeToTopic('topic');
    }
  };
  const createChannel = () => {
    const channel = new firebase.notifications.Android.Channel(
      'channelId',
      'channelName',
      firebase.notifications.Android.Importance.Max,
    ).setDescription('Descriptions');
    firebase.notifications().android.createChannel(channel);
  };
  const notificationListener = () => {
    firebase.notifications().onNotification(notification => {
      if (Platform.OS === 'android') {
        const localNotifications = new firebase.notifications.Notification({
          sound: 'default',
          show_in_foreground: true,
        })
          .setNotificationId(notification.notificationId)
          .setTitle(notification.title)
          .setSubtitle(notification.subtitle)
          .setSubtitle(notification.body)
          .setData(notification.data)
          .android.setChannelId('channelId')
          .android.setPriority(firebase.notifications.Android.Priority.High);
        firebase
          .notifications()
          .displayNotification(localNotifications)
          .catch(err => {
            console.log(err);
          });
      }
    });
  };
  useEffect(() => {
    getToken();
    createChannel();
    notificationListener();
  }, []);
  return (
    <View>
      <Text>Notification Service</Text>
    </View>
  );
};

export default App;
