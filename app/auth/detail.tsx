import AppImage from "@components/AppImage";
import { Ionicons } from "@expo/vector-icons";
import { scale } from "@utils/scale";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Post } from "models";
import React, { useCallback } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

type DetailNavigationParams = {
  userName?: string;
  userAvatar?: string;
};

const postCount = Math.floor(Math.random() * 100);
const followCount = Math.floor(Math.random() * 100);
const followingCount = Math.floor(Math.random() * 100);

const posts: Partial<Post>[] = [
  {
    id: "0",
    postImg: "https://picsum.photos/200/300",
  },
  {
    id: "1",
    postImg: "https://picsum.photos/200/300",
  },
  {
    id: "2",
    postImg: "https://picsum.photos/200/300",
  },
  {
    id: "3",
    postImg: "https://picsum.photos/200/300",
  },
  {
    id: "4",
    postImg: "https://picsum.photos/200/300",
  },
  {
    id: "5",
    postImg: "https://picsum.photos/200/300",
  },
];

const Detail = () => {
  const { userName, userAvatar } =
    useLocalSearchParams<DetailNavigationParams>();

  const router = useRouter();

  const goBack = useCallback(() => {
    router.back();
  }, [router]);

  const GeneralInfo = useCallback(() => {
    return (
      <View className=" flex-1 mt-8">
        <AppImage
          source={{ uri: userAvatar }}
          style={{
            width: scale(150),
            height: scale(150),
            borderRadius: 9999,
            alignSelf: "center",
          }}
        />
        <Text
          style={{ fontSize: scale(24) }}
          className="text-center font-bold tracking-wider mt-2"
        >
          @{userName}
        </Text>
        <View className="flex-row mt-4 border-b border-gray-200">
          <View className="flex-1 py-4 items-center">
            <Text className="tracking-wider">Posts</Text>
            <Text
              style={{ fontSize: scale(20) }}
              className="font-semibold tracking-wider"
            >
              {postCount}
            </Text>
          </View>
          <View className="flex-1 py-4 items-center">
            <Text className="tracking-wider">Follows</Text>
            <Text
              style={{ fontSize: scale(20) }}
              className="font-semibold tracking-wider"
            >
              {followCount}
            </Text>
          </View>
          <View className="flex-1 py-4 items-center">
            <Text className="tracking-wider">Following</Text>
            <Text
              style={{ fontSize: scale(20) }}
              className="font-semibold tracking-wider"
            >
              {followingCount}
            </Text>
          </View>
        </View>
      </View>
    );
  }, [userAvatar, userName]);

  const renderItem = useCallback(({ item }: { item: any }) => {
    return (
      <View className="flex-1 bg-red-300 " style={{ height: scale(300) }}>
        <AppImage
          source={{ uri: item.postImg }}
          style={{ width: "100%", height: "100%" }}
        />
      </View>
    );
  }, []);

  const PostSeparatorComponent = useCallback(() => {
    return <View className="bg-gray-200" style={{ height: 1 }} />;
  }, []);

  // render
  return (
    <View className="flex-1 bg-white">
      <View>
        <TouchableOpacity onPress={goBack} className="self-start mx-2 p-4">
          <Ionicons name="arrow-back" size={scale(20)} color="black" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id as string}
        renderItem={renderItem}
        ListHeaderComponent={GeneralInfo}
        ItemSeparatorComponent={PostSeparatorComponent}
        numColumns={3}
      />
    </View>
  );
};

export default Detail;
