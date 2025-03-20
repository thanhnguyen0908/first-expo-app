import AppImage from "@components/AppImage";
import { scale } from "@utils/scale";
import { Post } from "models";
import React, { useCallback, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Animated,
} from "react-native";

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
  {
    id: "6",
    postImg: "https://picsum.photos/200/300",
  },
  {
    id: "7",
    postImg: "https://picsum.photos/200/300",
  },
];

const Statistics = () => {
  const scrollY = useRef(new Animated.Value(0)).current; // To track the scroll position

  const firstHeaderHeight = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [200, 48],
    extrapolate: "clamp",
  });

  const firstHeaderOpacity = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const secondHeaderOpacity = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  // render
  const renderItem = useCallback(({ item }: { item: any }) => {
    return (
      <View
        className="flex-1"
        style={{ height: scale(200), paddingHorizontal: scale(8) }}
      >
        <AppImage
          source={{ uri: item.postImg }}
          style={{ width: "100%", height: "100%", borderRadius: scale(8) }}
        />
      </View>
    );
  }, []);

  return (
    <View>
      <FlatList
        contentContainerStyle={{ paddingTop: 300, paddingBottom: 32 }}
        contentInset={{ top: 300 }}
        refreshControl={
          <RefreshControl refreshing={false} progressViewOffset={300} />
        }
        data={posts}
        keyExtractor={(item) => item.id as string}
        renderItem={renderItem}
        ItemSeparatorComponent={() => {
          return <View style={{ width: scale(16), height: scale(16) }} />;
        }}
        numColumns={2}
        columnWrapperStyle={{
          paddingHorizontal: scale(8),
        }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        showsVerticalScrollIndicator={false}
      />
      <View
        style={{
          position: "absolute",
          top: 0,
          width: "100%",
        }}
      >
        <Animated.View style={{ height: firstHeaderHeight, opacity: firstHeaderOpacity }}>
          <AppImage
            source={{ uri: "https://picsum.photos/200/200" }}
            style={{ height: "100%" }}
          />
        </Animated.View>
        <View
          style={{
            padding: scale(16),
            backgroundColor: "white",
          }}
        >
          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderRadius: scale(16),
              alignSelf: "flex-start",
              paddingVertical: scale(8),
              paddingHorizontal: scale(16),
            }}
          >
            <Text>Press me</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Animated.View
        style={{
          position: "absolute",
          height: 48,
          width: "100%",
          backgroundColor: "white",
          alignItems: "center",
          justifyContent: "center",
          opacity: secondHeaderOpacity,
        }}
      >
        <Text>Second Header</Text>
      </Animated.View>
    </View>
  );
};

export default Statistics;
