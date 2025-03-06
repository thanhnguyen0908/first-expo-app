import { Stack } from "expo-router";

const AuthLayout = () => {
  return (
    <Stack>
      {/* Tabs for main screens */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      {/* Detail screen (not part of tabs) */}
      <Stack.Screen
        name="detail"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default AuthLayout;
