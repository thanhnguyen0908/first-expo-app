import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";

const projectId =
  Constants?.expoConfig?.extra?.eas?.projectId ??
  Constants?.easConfig?.projectId;

async function handleRegistrationError(errorMessage: string) {
  console.log(errorMessage);
  throw new Error(errorMessage);
}

async function registerForPushNotificationsAsync() {
  if (!Device.isDevice) {
    handleRegistrationError(
      "Must use a physical device for push notifications"
    );
    return;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    handleRegistrationError(
      "Permission not granted to get push token for push notifications!"
    );
    return;
  }

  // Ensure `projectId` is available
  if (!projectId) {
    handleRegistrationError("Project ID not found");
    return;
  }
}

export default registerForPushNotificationsAsync;
