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
import { getOrCreateChat } from '../../services/ChatServices';


type NewChatScreenProps = StackScreenProps<RootStackParamList, 'NewChat'>

export const NewChat = ({ navigation }: NewChatScreenProps) => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersRef = collection(db, "users");
      const snapshot = await getDocs(usersRef);
      const userList = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          uid: data.uid,
          email: data.email,
          userName: data.userName,
          isActive: data.isActive,
          firstName: data.firstName,
          lastName: data.lastName,
          phoneNumber: data.phoneNumber,
          accountType: data.accountType,
          createAt: data.createAt,
          updatedAt: data.updatedAt,
        };
      });
      setUsers(userList);
    };

    fetchUsers();
  }, []);

  const handleChat = async (otherUserId: string) => {
    const chatId = await getOrCreateChat(otherUserId);
    if (chatId) {
      navigation.navigate("Chat", { chatId: chatId });
    }
  };

  return (
    <FlatList
      data={users}
      keyExtractor={(item) => item.uid}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => handleChat(item.uid)}>
          <View style={{ padding: 16, borderBottomWidth: 1 }}>
            <Text>{item.userName}</Text>
          </View>
        </TouchableOpacity>
      )}
    />
  );
};

export default NewChat