// services/chatService.ts
import { User } from "../context/UserContext";
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
export const getOrCreateChat = async (user: User, otherUser: User) => {

  const chatRef = collection(db, "chats");

  // Check if chat already exists
  const chatQuery = query(
    chatRef,
    where("participants", "array-contains", user.uid)
  );

  try {
    const snapshot = await getDocs(chatQuery);
    for (const chat of snapshot.docs) {
      const data = chat.data();
      if (data.participants.includes(otherUser.uid)) {
        return chat.id; // Return existing chat ID
      }
    }

    // Create a new chat
    const newChatRef = await addDoc(chatRef, {
      participants: [user.uid, otherUser.uid],
      createdAt: serverTimestamp(),
      lastMessage: "",
    });

    return newChatRef.id;
  } catch (error) {
    console.error("Error creating or fetching chat: ", error);
    return null;
  }
};
