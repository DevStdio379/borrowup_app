// services/chatService.ts
import { db, auth } from "./firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";

/**
 * Get or create a chat between the logged-in user and another user.
 */
export const getOrCreateChat = async (otherUserId: string) => {
  if (!auth.currentUser) return null;

  const currentUserId = auth.currentUser.uid;
  const chatRef = collection(db, "chats");

  // Check if chat already exists
  const chatQuery = query(
    chatRef,
    where("participants", "array-contains", currentUserId)
  );

  try {
    const snapshot = await getDocs(chatQuery);
    for (const chat of snapshot.docs) {
      const data = chat.data();
      if (data.participants.includes(otherUserId)) {
        return chat.id; // Return existing chat ID
      }
    }

    // Create a new chat
    const newChatRef = await addDoc(chatRef, {
      participants: [currentUserId, otherUserId],
      createdAt: serverTimestamp(),
      lastMessage: "",
    });

    return newChatRef.id;
  } catch (error) {
    console.error("Error creating or fetching chat: ", error);
    return null;
  }
};
