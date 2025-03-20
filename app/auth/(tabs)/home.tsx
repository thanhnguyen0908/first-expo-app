import PostItem from "@components/Home/PostItem";
import StoryItem from "@components/Home/StoryItem";
import { useAuth } from "@context/authContext";
import { MaterialIcons } from "@expo/vector-icons";
import {
  BottomSheetBackdrop,
  BottomSheetFlatList,
  BottomSheetFooter,
  BottomSheetModal,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import { BottomSheetDefaultBackdropProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types";
import { BottomSheetDefaultFooterProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetFooter/types";
import { useAddComment } from "@hooks/useAddComment";
import { useComments } from "@hooks/useComments";
import { usePosts } from "@hooks/usePosts";
import { useStories } from "@hooks/useStories";
import { scale } from "@utils/scale";
import { useRouter } from "expo-router";
import { Comment, Post, Story } from "models";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  FlatList,
  Keyboard,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const keyExtractor = (item: Comment) => item.id;

const getFirstLetter = (name?: string | null): string => {
  return name?.trim().split(" ").pop()?.charAt(0) || "";
};

const Home = () => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const inputRef = useRef<TextInput>(null);

  const inputTextRef = useRef<string>("");

  const { user } = useAuth();

  const router = useRouter();

  const [currentPostId, setCurrentPostId] = useState<string>("");

  const { data: stories } = useStories();

  const { data: posts, isLoading, error } = usePosts(user?.uid || "");

  const { data: comments, isLoading: isLoadingComment } =
    useComments(currentPostId);

  const { mutateAsync: addComment } = useAddComment();

  const snapPoints = useMemo(() => ["75%"], []);

  // callbacks
  const onAddComment = useCallback(async () => {
    Keyboard.dismiss();

    const userComment = inputTextRef.current;

    await addComment({
      postId: currentPostId,
      userName: "miles",
      userComment: userComment,
    });

    inputRef.current?.clear();
  }, [addComment, currentPostId]);

  const onOpenComment = useCallback((postId: string) => {
    bottomSheetModalRef.current?.present();

    setCurrentPostId(postId);
  }, []);

  const onUserImgPress = useCallback(
    (post: Post) => {
      if (post.username === "miles") {
        router.navigate("/auth/(tabs)/profile");
        return;
      }

      router.navigate({
        pathname: "/auth/detail",
        params: {
          userName: post.username,
          userAvatar: post.avatar,
        },
      });
    },
    [router]
  );

  const renderUserStory = useCallback(({ item }: { item: Story }) => {
    return <StoryItem item={item} />;
  }, []);

  const PostsHeader = () => {
    return (
      <View className="mb-4">
        <FlatList
          data={stories}
          keyExtractor={(story) => story.id}
          renderItem={renderUserStory}
          horizontal
          contentContainerStyle={{
            paddingHorizontal: 16,
          }}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    );
  };

  const renderPost = useCallback(
    ({ item }: { item: Post }) => {
      return (
        <PostItem
          item={item}
          onOpenComment={onOpenComment}
          onUserImgPress={onUserImgPress}
        />
      );
    },
    [onOpenComment, onUserImgPress]
  );

  const ListEmptyPost = () => {
    if (isLoading) return <Text>Loading...</Text>;
    if (error) return <Text>Error loading posts.</Text>;
    return <Text>No post found.</Text>;
  };

  const renderBackdrop = useCallback(
    (props: BottomSheetDefaultBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    []
  );

  const renderComments = useCallback(({ item }: { item: Comment }) => {
    return (
      <View className="px-4 pb-4">
        <View className="flex-row">
          <View className="bg-green-400 w-10 h-10 rounded-full items-center justify-center">
            <Text className="text-white font-semibold">
              {getFirstLetter(item.username)}
            </Text>
          </View>
          <View className="pl-4 flex-1">
            <View className="flex-row w-full">
              <Text className="font-bold" style={{ fontSize: 14 }}>
                {item.username}
              </Text>
              <Text className="pl-2" style={{ fontSize: 14 }}>
                {item.comment}
              </Text>
            </View>
            <Text className="mt-1 text-gray-500" style={{ fontSize: 12 }}>
              2d
            </Text>
          </View>
        </View>
      </View>
    );
  }, []);

  const renderFooter = useCallback(
    (props: BottomSheetDefaultFooterProps) => (
      <BottomSheetFooter
        animatedFooterPosition={props.animatedFooterPosition}
        bottomInset={0}
        style={{ backgroundColor: "white" }}
      >
        <View className="p-4 border-t border-gray-400">
          <View
            className="px-4 flex-row items-center"
            style={{
              borderWidth: 1,
              borderRadius: 16,
              borderColor: "gray",
            }}
          >
            <BottomSheetTextInput
              ref={inputRef as any}
              placeholder="Add a comment..."
              style={{
                height: 48,
                flex: 1,
                marginRight: 16,
              }}
              multiline={false}
              autoFocus
              onChangeText={(text) => {
                inputTextRef.current = text;
              }}
            />
            <TouchableOpacity onPress={onAddComment}>
              <MaterialIcons name="input" size={20} color="gray" />
            </TouchableOpacity>
          </View>
        </View>
      </BottomSheetFooter>
    ),
    [onAddComment]
  );

  const EmptyCommentComponent = useCallback(() => {
    if (isLoadingComment) {
      return (
        <Text className="text-gray-500 self-center">Loading comments...</Text>
      );
    }
    return <Text className="text-gray-500 self-center">No comments found</Text>;
  }, [isLoadingComment]);

  // render
  return (
    <View className="flex-1 bg-white ">
      <StatusBar barStyle="dark-content" />
      <View className="flex-1">
        <FlatList
          data={posts}
          keyExtractor={(post) => post.id}
          renderItem={renderPost}
          ListHeaderComponent={PostsHeader}
          ListEmptyComponent={ListEmptyPost}
          showsVerticalScrollIndicator={false}
        />
      </View>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        enableDynamicSizing={false}
        enablePanDownToClose
        footerComponent={renderFooter}
        onDismiss={() => {
          setCurrentPostId("");
        }}
      >
        <Text className="text-center py-2 font-bold" style={{ fontSize: 18 }}>
          Comments
        </Text>
        <BottomSheetFlatList
          data={comments}
          keyExtractor={keyExtractor}
          renderItem={renderComments}
          contentContainerStyle={{ paddingBottom: scale(70) }}
          ListEmptyComponent={EmptyCommentComponent}
        />
      </BottomSheetModal>
    </View>
  );
};

export default Home;
