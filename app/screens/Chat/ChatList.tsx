import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Button, FlatList } from 'react-native';
import { List, Avatar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootStackParamList';
import { fetchAllUsers, User, useUser } from '../../context/UserContext';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { auth, db } from '../../services/firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';


type ChatListScreenProps = StackScreenProps<RootStackParamList, 'ChatList'>

export const ChatList = ({ navigation }: ChatListScreenProps) => {
    const { user } = useUser();
    const [chats, setChats] = useState<{ id: string; participants: string[] }[]>([]);

    useEffect(() => {
        const fetchChats = async () => {
            if (!auth.currentUser) return;
            const chatQuery = query(
                collection(db, "chats"),
                where("participants", "array-contains", auth.currentUser.uid)
            );

            const snapshot = await getDocs(chatQuery);
            const chatList = snapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                    id: doc.id,
                    participants: data.participants || [],
                    ...data,
                };
            });

            setChats(chatList);
        };

        fetchChats();
    }, []);

    return (
        <View style={{ flex: 1, padding: 16 }}>
            <FlatList
                data={chats}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => navigation.navigate("Chat", { chatId: item.id })}
                        style={{ padding: 16, borderBottomWidth: 1 }}
                    >
                        <Text>Chat with {item.participants.join(", ")}</Text>
                    </TouchableOpacity>
                )}
            />
            <Button title="Start New Chat" onPress={() => navigation.navigate("NewChat")} />
        </View>
    );
};

export default ChatList