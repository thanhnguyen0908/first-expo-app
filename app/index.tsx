import React from "react";
import { ActivityIndicator, View } from "react-native";

const StartScreen = () => {
  // render
  return (
    <View className="flex-1 bg-white items-center justify-center">
      <ActivityIndicator size="large" color="red" />
    </View>
  );
};

export default StartScreen;
