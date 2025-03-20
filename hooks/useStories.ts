import firestore from "@react-native-firebase/firestore";
import { useQuery } from "@tanstack/react-query";
import { Story } from "models";

// Firestore Query Function
const fetchStories = async (): Promise<Story[]> => {
  const response = await firestore().collection("user-stories").get();
  return response.docs.map((doc) => ({
    ...(doc.data() as Story), // Ensure correct typing
    id: doc.id, // Ensure each post has a unique ID
  }));
};

// React Query Hook
export const useStories = () => {
  return useQuery<Story[], Error>({
    queryKey: ["user-stories"],
    queryFn: fetchStories,
    staleTime: 10000, // Data remains fresh for 10 seconds
  });
};
