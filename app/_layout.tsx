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
import { PermissionsAndroid, Platform, useColorScheme } from "react-native";
import "react-native-reanimated";
import "../global.css";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { useAuth, AuthContextProvider } from "context/authContext";
import registerForPushNotificationsAsync from "@utils/noti-permission-request";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Set the animation options. This is optional.
SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

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

const queryClient = new QueryClient();

const MainLayout = () => {
  const { isAuthen } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    // Wait for auth state to be determined
    if (isAuthen === null) {
      return;
    }

    const inTabsGroup = segments[0] === "auth";

    // Redirect logic: If authenticated, navigate to (auth)/home
    if (isAuthen && !inTabsGroup) {
      router.replace("/auth/home"); // Redirect to home screen if authenticated
    } else if (!isAuthen) {
      router.replace("/un-auth/signIn"); // Redirect to signIn screen if not authenticated
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
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <GestureHandlerRootView>
            <BottomSheetModalProvider>
              <KeyboardProvider>
                <MainLayout />
              </KeyboardProvider>
            </BottomSheetModalProvider>
          </GestureHandlerRootView>
        </ThemeProvider>
      </QueryClientProvider>
    </AuthContextProvider>
  );
}
