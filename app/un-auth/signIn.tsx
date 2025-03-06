import { useAuth } from "@context/authContext";
import { MaterialIcons, Octicons } from "@expo/vector-icons";
import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { hp } from "@utils/scale";
import * as Notifications from "expo-notifications";
import { useFocusEffect } from "expo-router";
import { setStatusBarStyle } from "expo-status-bar";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const key = process.env.EXPO_PUBLIC_API_KEY;
const apiUrl = process.env.EXPO_PUBLIC_API_URL;

GoogleSignin.configure({
  webClientId:
    "733897115739-qqm1p5cj11n1ut1f8bf60l0v2tlsvtic.apps.googleusercontent.com",
});

const SignIn = () => {
  const { loading, login } = useAuth();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

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

  const signInWithFirebase = useCallback(() => {
    if (!email || !password) {
      Alert.alert("Alert", "Missing user info");
      return;
    }
    login(email, password);
  }, [email, login, password]);

  const signInWithGoogle = useCallback(() => {
    onGoogleButtonPress().then(() => console.log("Signed in with Google!"));
  }, [onGoogleButtonPress]);

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

  // render
  return (
    <View className="flex-1 bg-white">
      <ScrollView
        contentContainerStyle={{ flex: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 mx-4 mt-8">
          <Text className="text-center">{key}</Text>
          <Text className="text-center">{apiUrl}</Text>
          <Text
            className="mt-20 font-bold text-center"
            style={{ fontSize: hp(4) }}
          >
            Sign In
          </Text>
          <View className="flex-row bg-gray-300 py-4 px-4 mt-8 rounded-lg">
            <Octicons name="mail" size={hp(2.7)} />
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Enter user email"
              className="ml-2 flex-1"
              numberOfLines={1}
            />
          </View>
          <View className="flex-row bg-gray-300 py-4 px-4 mt-4 rounded-lg">
            <MaterialIcons name="password" size={hp(2.7)} />
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Enter user password"
              className="ml-2 flex-1"
              numberOfLines={1}
              secureTextEntry
            />
          </View>
          <TouchableOpacity
            className="bg-red-500 justify-center items-center rounded-lg mt-6"
            style={{ height: hp(6) }}
            onPress={signInWithFirebase}
          >
            {loading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text
                className="color-white tracking-wider font-bold"
                style={{ fontSize: hp(2) }}
              >
                Sign in using Firebase
              </Text>
            )}
          </TouchableOpacity>
        </View>
        <View className="mb-8 mx-4">
          <TouchableOpacity
            className="bg-black justify-center items-center rounded-lg"
            style={{ height: hp(6) }}
            onPress={signInWithGoogle}
          >
            <Text className="color-white tracking-wider font-semibold">
              Sign in using Google
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="mt-4 bg-blue-500 justify-center items-center rounded-lg"
            style={{ height: hp(6) }}
            onPress={sendNotification}
          >
            <Text className="color-white tracking-wider font-semibold">
              Send Notification
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default SignIn;
