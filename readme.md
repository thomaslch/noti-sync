# Noti-Sync
This project lets you sync notifications from an android device to another device (ios or android). It contains two separate react-native projects: noti-sync-android for gathering and publishing notifications, and noti-sync-client for receiving the ones that get published.

## noti-sync-android
This is a bare-workflow react-native project that would only work on android.
In order to read notifications from android, it will need to access to native APIs. Luckily, there are existing libraries for the exact purpose. `react-native-android-notification-listener` listens to whenever a new notification comes in, and send it to the other device using expo notification. The reason of choosing expo notification for delivering notifications is simplicity and the fact that it is free. This app must be kept running in order to listen and forward notifications. `react-native-background-timer` is employed to do such, but it may not be the best solution. In the future this may be re-written as a service.

## noti-sync-client
This is a expo-managed project that would work on as many platforms as expo-notification supports. 
In order for notifications to be delivered to the desired device, the expo notification token must be known. This project's sole purpose is to extract the notification token. After the token is obtained, the client need not be opened anymore but the expo app must not be uninstalled. Notifications would only arrive if the expo app is present. 

## Installation
The below process assumes a properly set up react-native dev environment.

1. Clone the repostory

2. `cd noti-sync-client`
    1. `expo start`
    2. Copy your token and save it somewhere else.

3. `cd ../noti-sync-android`
    1. Inside `src/HomeScreen.js`, change the default state value your own push token.
    2. connect your phone and `adb connect usb`
    3. `yarn android`
