import { useFocusEffect } from "expo-router";
import { setStatusBarStyle } from "expo-status-bar";
import { useCallback } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import auth from "@react-native-firebase/auth";
import * as Notifications from "expo-notifications";

GoogleSignin.configure({
  webClientId:
    "733897115739-qqm1p5cj11n1ut1f8bf60l0v2tlsvtic.apps.googleusercontent.com",
});

export default function HomeScreen() {
  const key = process.env.EXPO_PUBLIC_API_KEY;
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  const onGoogleButtonPress = useCallback(async () => {
    // Check if your device supports Google Play
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    // Get the users ID token
    const signInResult = await GoogleSignin.signIn();

    // Try the new style of google-sign in result, from v13+ of that module
    let idToken = signInResult.data?.idToken;

    if (!idToken) {
      throw new Error("No ID token found");
    }

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(
      signInResult?.data?.idToken as string
    );

    // Sign-in the user with the credential
    return auth().signInWithCredential(googleCredential);
  }, []);

  const signInWithGoogle = useCallback(() => {
    onGoogleButtonPress().then(() => console.log("Signed in with Google!"));
  }, []);

  const sendNotification = useCallback(() => {
    Notifications.scheduleNotificationAsync({
      content: {
        title: "Noti title",
        body: "This is the body of the noti asdasdsdasdasdasdasdasdasdasdasdadasda",
        data: ["Hello"],
      },
      trigger: null,
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      setStatusBarStyle("dark", true); // Set dark status bar
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text>{key}</Text>
      <Text>{apiUrl}</Text>
      <TouchableOpacity style={styles.signInBtn} onPress={signInWithGoogle}>
        <Text style={styles.signInTxt}>Sign in with Google</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.signInBtn} onPress={sendNotification}>
        <Text style={styles.signInTxt}>Send Notificiation</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  signInBtn: {
    backgroundColor: "red",
    padding: 16,
    marginTop: 16,
    borderRadius: 8,
  },
  signInTxt: { color: "white" },
});
