import React from 'react'
import { View, Text } from 'react-native'
import { COLORS } from '../../constants/theme';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootStackParamList';


type ProfileScreenProps = StackScreenProps<RootStackParamList, 'Profile'>
export const Profile = ({ navigation }: ProfileScreenProps) => {
    return (
        <View style={{ backgroundColor: COLORS.background, flex: 1 }}>
            <Text> PROFILE SCREEN</Text>
        </View>
    );
};
export default Profile