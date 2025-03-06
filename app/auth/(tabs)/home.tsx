import { hp } from "@utils/scale";
import { useRouter } from "expo-router";
import React, { useCallback } from "react";
import { Text, TouchableOpacity, View } from "react-native";

const Home = () => {
  const router = useRouter();

  const goToDetail = useCallback(() => {
    router.navigate("/auth/detail");
  }, [router]);

  // render
  return (
    <View className="flex-1 bg-white justify-center">
      <Text
        style={{ fontSize: hp(2.7) }}
        className="text-center font-bold tracking-wider"
      >
        Home
      </Text>
      <TouchableOpacity
        className="bg-red-500 justify-center items-center rounded-lg mt-6 mb-8 mx-4"
        style={{ height: hp(6) }}
        onPress={goToDetail}
      >
        <Text
          className="color-white tracking-wider font-bold"
          style={{ fontSize: hp(2) }}
        >
          Go To Detail
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Home;
