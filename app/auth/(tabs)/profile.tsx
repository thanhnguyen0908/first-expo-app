import { useAuth } from "@context/authContext";
import { hp } from "@utils/scale";
import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";

const Profile = () => {
  const { logout, loading } = useAuth();

  // render
  return (
    <View className="flex-1 justify-center  bg-white">
      <Text
        style={{ fontSize: hp(2.7) }}
        className="text-center font-bold tracking-wider"
      >
        Profile
      </Text>
      <TouchableOpacity
        className="bg-red-500 justify-center items-center rounded-lg mt-6 mb-8 mx-4"
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

export default Profile;
