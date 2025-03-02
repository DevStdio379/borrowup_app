import { View, Text,  ScrollView, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { useTheme } from '@react-navigation/native';
import Header from '../../layout/Header';
import { IMAGES } from '../../constants/Images';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { COLORS } from '../../constants/theme';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootStackParamList';

type ChatScreenProps = StackScreenProps<RootStackParamList, 'Chat'>

export const Chat = ({ navigation }: ChatScreenProps) => {
    return (
        <View style={{ backgroundColor: COLORS.background, flex: 1 }}>
            <Text> CHAT SCREEN</Text>
        </View>
    );
};

export default Chat