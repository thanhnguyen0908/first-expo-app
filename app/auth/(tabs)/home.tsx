import PostItem from "@components/Home/PostItem";
import StoryItem from "@components/Home/StoryItem";
import { useAuth } from "@context/authContext";
import { usePosts } from "@hooks/usePosts";
import { useStories } from "@hooks/useStories";
import { Post, Story } from "models";
import React, { useCallback, useEffect } from "react";
import { FlatList, StatusBar, Text, View } from "react-native";
import firestore from "@react-native-firebase/firestore";

const Home = () => {
  const { data: stories } = useStories();

  const { user } = useAuth();

  const { data: posts, isLoading, error } = usePosts(user?.uid || "");

  useEffect(() => {
    const a = async () => {
      const snapshot = await firestore()
        .collectionGroup("likes") // Query across all posts
        .where(firestore.FieldPath.documentId(), "==", user?.uid) // Get only this user's likes
        .get();

      const b = new Set(snapshot.docs.map((doc) => doc.ref.parent.parent?.id));

      console.log("AAAA", b);
    };

    a();
  }, [user]);

  const renderUserStory = useCallback(({ item }: { item: Story }) => {
    return <StoryItem item={item} />;
  }, []);

  const ListEmptyPost = () => {
    if (isLoading) return <Text>Loading...</Text>;
    if (error) return <Text>Error loading posts.</Text>;
    return <Text>No post found.</Text>;
  };

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

  const renderPost = useCallback(({ item }: { item: Post }) => {
    return <PostItem item={item} />;
  }, []);

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
    </View>
  );
};

export default Home;
