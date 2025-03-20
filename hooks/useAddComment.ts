import { useMutation, useQueryClient } from "@tanstack/react-query";
import firestore from "@react-native-firebase/firestore";
import { Collection } from "@constants/RootConstants";

export const useAddComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      postId,
      userName,
      userComment,
    }: {
      postId: string;
      userName: string;
      userComment: string;
    }) => {
      const commentRef = firestore()
        .collection(Collection.POSTS)
        .doc(postId)
        .collection(Collection.COMMENTS)
        .doc();

      const postRef = firestore().collection(Collection.POSTS).doc(postId);

      await commentRef.set({ username: userName, comment: userComment });
      await postRef.update({
        commentCount: firestore.FieldValue.increment(1),
      });
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: [Collection.COMMENTS] });
      await queryClient.cancelQueries({ queryKey: [Collection.POSTS] });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [Collection.COMMENTS] }); // Ensure Firestore updates are synced
      queryClient.invalidateQueries({ queryKey: [Collection.POSTS] }); // Ensure Firestore updates are synced
    },
  });
};
