import { useAuth } from "@/context/authContext";
import { hp } from "@/utils/scale";
import { useNavigation } from "expo-router";
import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";

const Home = () => {
  const { logout, loading } = useAuth();

  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  // render
  return (
    <View className="flex-1 bg-white justify-center px-4">
      <Text style={{fontSize: hp(2.7)}} className="text-center font-bold tracking-wider">Home</Text>
      <TouchableOpacity
        className="bg-red-500 justify-center items-center rounded-lg mt-6"
        style={{ height: hp(6) }}
        onPress={logout}
      >
        {loading ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Text
            className="color-white tracking-wider font-bold"
            style={{ fontSize: hp(2) }}
          >
            Sign out
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default Home;
