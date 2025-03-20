import AppImage from "@components/AppImage";
import { Story } from "models";
import React, { FC } from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface Props {
  item: Story;
}

const StoryItem: FC<Props> = ({ item }) => {
  // render
  return (
    <View className="items-center mr-4" style={{ width: 75 }}>
      <TouchableOpacity
        style={{
          borderWidth: 3,
          borderColor: "#A3A3A3",
          borderRadius: 1000,
        }}
      >
        <AppImage
          source={{ uri: item.avatar }}
          style={{
            width: 70,
            height: 70,
            borderRadius: 35,
            margin: 2,
          }}
        />
      </TouchableOpacity>
      <Text className="mt-2" numberOfLines={1}>
        {item.username}
      </Text>
    </View>
  );
};

export default StoryItem;
