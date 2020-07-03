import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Share } from 'react-native';

import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [notiState, setNotiState] = useState({
    expoPushToken: '',
    notification: { request: { content: { body: '', title: '', data: {} } } },
  });

  // request for noti permission and get expo token
  registerForPushNotificationsAsync = async () => {
    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      const { data: token } = await Notifications.getExpoPushTokenAsync();
      console.log(token);
      setNotiState({ expoPushToken: token });
    } else {
      alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  };

  // add notification on receive listener
  useEffect(() => {
    registerForPushNotificationsAsync();
    Notifications.addNotificationReceivedListener(onReceived);
  }, []);

  const onReceived = notification => {
    setNotiState({ notification });
  }

  // when the token is pressed, open share menu
  const tokenOnPress = () => {
    try {
      Share.share({
        message: notiState.expoPushToken,
      });
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <View style={styles.container}>
      <Text>Expo Token</Text>
      <Text onPress={tokenOnPress}>
        {notiState.expoPushToken}
      </Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
