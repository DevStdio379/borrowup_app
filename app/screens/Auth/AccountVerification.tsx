import React from 'react';
import { View, Text } from 'react-native';
import { COLORS } from '../../constants/theme';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootStackParamList';

type AccountVerificationScreenProps = StackScreenProps<RootStackParamList, 'AccountVerification'>

const AccountVerification = ({ navigation }: AccountVerificationScreenProps) => {
    return (
    <View style={{ backgroundColor: COLORS.background, flex: 1 }}>
        <Text> Account Verification SCREEN</Text>
    </View>
    );
};

export default AccountVerification;