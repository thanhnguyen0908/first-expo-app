import AppImage from "@components/AppImage";
import { useAuth } from "@context/authContext";
import { AntDesign, Entypo, Feather, FontAwesome } from "@expo/vector-icons";
import { useToggleLike } from "@hooks/useToggleLike";
import { formatNumber } from "@utils/number";
import { hp } from "@utils/scale";
import { formatRelativeTime } from "@utils/time";
import { Post } from "models";
import React, { FC, useCallback, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface Props {
  item: Post;
  onOpenComment: (postId: string) => void;
  onUserImgPress: (item: Post) => void;
}

const PostItem: FC<Props> = ({ item, onOpenComment, onUserImgPress }) => {
  const { user } = useAuth();
  const { mutateAsync: toggleLike } = useToggleLike();

  const [liked, setLiked] = useState(item.isLiked);
  const [likes, setLikes] = useState(item.likeCount);

  const likePost = useCallback(async () => {
    const likedState = await toggleLike({
      postId: item.id,
      userId: user?.uid || "",
    });

    setLiked(likedState.liked);

    setLikes((prev) => (likedState.liked ? prev + 1 : prev - 1));
  }, [item, toggleLike, user]);

  const handleUserImgPress = useCallback(() => {
    onUserImgPress(item);
  }, [item, onUserImgPress]);

  // render
  return (
    <View className="mb-6">
      <View className="flex-row items-center px-4 pb-4">
        <TouchableOpacity
          className="flex-row items-center flex-1"
          onPress={handleUserImgPress}
        >
          <AppImage
            source={{ uri: item.avatar }}
            style={{ width: 32, height: 32, borderRadius: 16 }}
          />
          <Text className="font-semibold pl-4">{item.username}</Text>
        </TouchableOpacity>
        <Entypo name="dots-three-vertical" size={20} />
      </View>
      <AppImage
        source={{ uri: item.postImg }}
        style={{ width: "100%", height: hp(50) }}
      />
      <View className="flex-row items-center p-4">
        <View className="flex-1 flex-row">
          <TouchableOpacity
            className="flex-row items-center mr-6"
            onPress={likePost}
          >
            {liked ? (
              <AntDesign name="heart" size={24} color="red" />
            ) : (
              <AntDesign name="hearto" size={24} color="black" />
            )}
            <Text className="ml-2 font-semibold" style={{ fontSize: 24 }}>
              {formatNumber(likes)}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-row items-center mr-6"
            onPress={() => onOpenComment(item.id)}
          >
            <FontAwesome name="comment-o" size={24} color="black" />
            <Text className="ml-2 font-semibold" style={{ fontSize: 24 }}>
              {formatNumber(item.commentCount)}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center">
            <AntDesign name="sharealt" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity>
          <Feather name="bookmark" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <Text className="ml-4">
        {formatRelativeTime(item.dateCreated.seconds)}
      </Text>
    </View>
  );
};

export default PostItem;
