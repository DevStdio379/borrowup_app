import React, { useEffect, useState, useCallback } from 'react';
import { View, Button, FlatList, RefreshControl, TouchableOpacity, Text, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootStackParamList';
import { fetchAllUsers, User, useUser } from '../../context/UserContext';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { auth, db } from '../../services/firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Avatar } from 'react-native-gifted-chat';

type ChatListScreenProps = StackScreenProps<RootStackParamList, 'ChatList'>

export const ChatList = ({ navigation }: ChatListScreenProps) => {
    const { user } = useUser();
    const [chats, setChats] = useState<{ id: string; participants: string[]; otherParticipantDetails?: User; lastMessage?: string }[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    const fetchUsersByIds = async (userIds: string[]): Promise<User[]> => {
        const usersQuery = query(collection(db, "users"), where("uid", "in", userIds));
        const snapshot = await getDocs(usersQuery);
        return snapshot.docs.map((doc) => doc.data() as User);
    };

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

        const users = await fetchUsersByIds(chatList.map((chat) => chat.participants[1]));
        const chatListWithOtherUserDetails = chatList.map((chat) => {
            const otherParticipantDetails = users.find((user) => user.uid === chat.participants[1]);
            return {
            ...chat,
            otherParticipantDetails,
            };
        });
        setChats(chatListWithOtherUserDetails);
    };

    useEffect(() => {
        fetchChats();
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchChats().then(() => setRefreshing(false));
    }, []);

    return (
        <View style={{ flex: 1, padding: 16 }}>
            <FlatList
                data={chats}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => navigation.navigate("Chat", { chatId: item.id })}
                        style={{ flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#ccc' }}
                    >
                        <Image source={{ uri: item.otherParticipantDetails?.profileImageUrl }} style={{ height: 60, width: 60, borderRadius: 45 }} />
                        <View style={{ marginLeft: 16 }}>
                            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{ item.otherParticipantDetails?.firstName } {item.otherParticipantDetails?.lastName }</Text>
                            <Text style={{ color: '#888' }}>{ item.lastMessage || 'Last message preview...' }</Text>
                        </View>
                    </TouchableOpacity>
                )}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            />
            <Button title="Start New Chat" onPress={() => navigation.navigate("NewChat")} />
        </View>
    );
};

export default ChatList;