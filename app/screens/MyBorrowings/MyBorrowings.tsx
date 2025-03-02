import React from 'react'
import { View, Text } from 'react-native'
import { COLORS } from '../../constants/theme';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootStackParamList';

type MyBorrowingsScreenProps = StackScreenProps<RootStackParamList, 'MyBorrowings'>;

export const MyBorrowings = ({ navigation }: MyBorrowingsScreenProps) => {
    return (
        <View style={{ backgroundColor: COLORS.background, flex: 1 }}>
            <Text> MY BORROWINGS SCREEN</Text>
        </View>
    );
};

export default MyBorrowings