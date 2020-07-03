import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, BackHandler } from 'react-native';

import RNAndroidNotificationListener from 'react-native-android-notification-listener';
import BackgroundTimer from 'react-native-background-timer';
import DialogInput from 'react-native-dialog-input';

const HomeScreen = ({ navigation }) => {
  const [expoToken, setExpoToken] = useState("ExponentPushToken[blahblahblah]");
  const [notiList, setNotiList] = useState([]);
  const [isDialogVisible, setIsDialogVisible] = useState(false);

  useEffect(() => {
    (async () => {
      // check notification listener permission
      const status = await RNAndroidNotificationListener.getPermissionStatus();
      // request permission if no permission
      console.log(status);
      if (status == "denied") {
        RNAndroidNotificationListener.requestPermission();
      }
      // attach notification listener
      RNAndroidNotificationListener.onNotificationReceived(handleIncomingNotifications)

      // background service to keep the app alive
      BackgroundTimer.runBackgroundTimer(() => {
        console.log("still alive");
      }, 30 * 1000);

      navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity onPress={() => setIsDialogVisible(true)}>
            <Text style={{ fontWeight: "bold", paddingHorizontal: 16 }}>TOKEN</Text>
          </TouchableOpacity>
        )
      });

      // remove back button functionality to avoid accidentally 
      // back button closes
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        () => true
      );

      return () => backHandler.remove();
    })();
  }, []);

  const handleIncomingNotifications = async ({ app, title, text }) => {
    // console.log(app + " " + title + " " + text);
    var now = new Date();
    var uuid = require("uuid");
    var split = app.split('.');

    // ignore system messages
    if (split[split.length - 1] == "android") return;
    if (split[split.length - 1] == "systemui") return;

    // construct the message
    const message = {
      to: expoToken,
      sound: 'default',
      title: title + ' via ' + split[split.length - 1],
      body: text,
    };

    // send the token to expo notification dispatch service
    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    // push the notifications to the list
    setNotiList([...notiList, { app, title, text, date: now.toString(), key: uuid.v4() }]);
  }

  return (
    <View>
      <Text style={styles.text}>Expo Token: {expoToken}</Text>
      <FlatList
        data={notiList}
        keyExtractor={item => item?.key}
        renderItem={item => (
          <Text style={styles.text}>
            {item?.item?.date + "\n" + item?.item?.app + " " + item?.item?.title + " " + item?.item?.text}
          </Text>
        )}
      />
      {/* for changing the token in run-time, the token will be overwritten on app restart */}
      <DialogInput
        isDialogVisible={isDialogVisible}
        title={"Input new Expo Token"}
        hintInput={expoToken}
        submitInput={inputText => setExpoToken(inputText)}
        closeDialog={() => setIsDialogVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
  }
});

export default HomeScreen;