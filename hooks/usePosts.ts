import firestore from "@react-native-firebase/firestore";
import { useQuery } from "@tanstack/react-query";
import { Post } from "models";

// Firestore Query Function
const fetchPosts = async (userId: string): Promise<Post[]> => {
  const postsSnapshot = await firestore().collection("posts").get();

  const posts: Post[] = await Promise.all(
    postsSnapshot.docs.map(async (doc) => {
      const postData = doc.data() as Post; // Cast Firestore data to `Post`
      const likedBySnapshot = await doc.ref
        .collection("likedBy")
        .doc(userId)
        .get();

      return {
        ...postData,
        id: doc.id, // Ensure each post has a unique ID
        isLiked: likedBySnapshot.exists, // Boolean flag if the user liked it
      };
    })
  );

  return posts;
};

// React Query Hook
export const usePosts = (userId: string) => {
  return useQuery<Post[], Error>({
    queryKey: ["posts", userId], // Unique key including `userId`
    queryFn: () => fetchPosts(userId),
    staleTime: 10000, // Cache posts for 10s before refetching
  });
};
