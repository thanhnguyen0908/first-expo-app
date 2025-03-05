import { AuthContextProvider, useAuth } from "@/context/authContext";
import { useColorScheme } from "@/hooks/useColorScheme";
import messaging from "@react-native-firebase/messaging";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import "expo-dev-client";
import { useFonts } from "expo-font";
import * as Notifications from "expo-notifications";
import { Slot, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { PermissionsAndroid, Platform } from "react-native";
import "react-native-reanimated";
import "../global.css";
import registerForPushNotificationsAsync from "../utils/noti-permission-request";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

if (Platform.OS === "android") {
  PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log("Background Noti Handled", remoteMessage);
});

// FCM Token to be used on Firebase Console
messaging()
  .getToken()
  .then((fcmToken) => console.log("FCM Token a:", fcmToken));

const MainLayout = () => {
  const { isAuthen } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    // Wait for auth state to be determined
    if (isAuthen === null) {
      router.replace("/start-screen");
      return;
    }

    // Redirect logic: If authenticated, navigate to (auth)/home
    if (isAuthen) {
      if (segments[0] !== "(auth)") {
        router.replace("/(auth)/home"); // Redirect to home screen if authenticated
      }
    } else {
      if (segments[0] !== "(un-auth)") {
        router.replace("/(un-auth)/signIn"); // Redirect to signIn screen if not authenticated
      }
    }
  }, [isAuthen, router, segments]);

  return <Slot />;
};

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
    <AuthContextProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <MainLayout />
      </ThemeProvider>
    </AuthContextProvider>
  );
}
