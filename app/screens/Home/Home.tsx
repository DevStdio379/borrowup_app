import React from 'react';
import { View, Text } from 'react-native';
import { COLORS } from '../../constants/theme';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootStackParamList';

type HomeScreenProps = StackScreenProps<RootStackParamList, 'Home'>

export const Home = ({ navigation }: HomeScreenProps) => {
    return (
        <View style={{ backgroundColor: COLORS.background, flex: 1 }}>
            <Text> HOME SCREEN</Text>
        </View>
    );
};


export default Home;
