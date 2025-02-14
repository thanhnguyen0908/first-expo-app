import { useColorScheme } from "@/hooks/useColorScheme";
import messaging from "@react-native-firebase/messaging";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import "expo-dev-client";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useRef } from "react";
import { Alert, PermissionsAndroid, Platform } from "react-native";
import "react-native-reanimated";
import * as Notifications from "expo-notifications";
import registerForPushNotificationsAsync from "./utils/noti-permission-request";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

if (Platform.OS === "android") {
  PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
}

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log("Background Noti Handled", remoteMessage);
});

// FCM Token to be used on Firebase Console
messaging()
  .getToken()
  .then((value) => console.log(value));

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    registerForPushNotificationsAsync();

    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      Notifications.scheduleNotificationAsync({
        content: {
          title: remoteMessage.notification?.title,
          body: remoteMessage.notification?.body,
          data: remoteMessage.data,
        },
        trigger: null,
      });
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
  );
}
