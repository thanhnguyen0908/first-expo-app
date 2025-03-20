import { Collection } from "@constants/RootConstants";
import firestore from "@react-native-firebase/firestore";
import { useQuery } from "@tanstack/react-query";
import { Comment } from "models";

// Firestore Query Function
const fetchComments = async (postId: string): Promise<Comment[]> => {
  if (!postId) {
    // doNothing
    Promise.reject();
  }
  const response = await firestore()
    .collection(Collection.POSTS)
    .doc(postId)
    .collection(Collection.COMMENTS)
    .get();

  const mappedDocs = response.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return mappedDocs as Comment[];
};

// React Query Hook
export const useComments = (postId: string) => {
  return useQuery<Comment[], Error>({
    queryKey: [Collection.COMMENTS, postId], // Unique key including `postId`
    queryFn: () => fetchComments(postId),
    staleTime: 10000, // Cache posts for 10s before refetching
  });
};
