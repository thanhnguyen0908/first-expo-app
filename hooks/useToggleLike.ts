import { useMutation, useQueryClient } from "@tanstack/react-query";
import firestore from "@react-native-firebase/firestore";
import { Collection } from "@constants/RootConstants";

export const useToggleLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      postId,
      userId,
    }: {
      postId: string;
      userId: string;
    }) => {
      const likeRef = firestore()
        .collection(Collection.POSTS)
        .doc(postId)
        .collection(Collection.LIKED_BY)
        .doc(userId);

      const postRef = firestore().collection(Collection.POSTS).doc(postId);

      const doc = await likeRef.get();

      if (doc.exists) {
        // Unlike
        await likeRef.delete();
        await postRef.update({ likeCount: firestore.FieldValue.increment(-1) });
        return { liked: false };
      } else {
        // Like
        await likeRef.set({ likedAt: firestore.FieldValue.serverTimestamp() });
        await postRef.update({ likeCount: firestore.FieldValue.increment(1) });
        return { liked: true };
      }
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: [Collection.POSTS] });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [Collection.POSTS] }); // Ensure Firestore updates are synced
    },
  });
};
