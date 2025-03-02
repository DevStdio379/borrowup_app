import { useTheme } from '@react-navigation/native';
import React from 'react'
import { View, Text } from 'react-native'
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootStackParamList';
import { useDispatch } from 'react-redux';
import { useUser, defaultUser } from '../../context/UserContext';

type LenderDashboardScreenProps = StackScreenProps<RootStackParamList, 'LenderDashboard'>;

const LenderDashboard = ({ navigation }: LenderDashboardScreenProps) => {
    return (
        <View style={GlobalStyleSheet.container}>
            <Text> LENDER DASHBOARD SCREEN</Text>
        </View>
    )
}

export default LenderDashboard