import { hp } from "@utils/scale";
import React from "react";
import { View, Text } from "react-native";

const Detail = () => {
  // render
  return (
    <View className="flex-1 bg-white justify-center">
      <Text
        style={{ fontSize: hp(2.7) }}
        className="text-center font-bold tracking-wider"
      >
        Detail
      </Text>
    </View>
  );
};

export default Detail;
