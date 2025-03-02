import React from 'react';
import { View, Text } from 'react-native';
import { COLORS } from '../../constants/theme';
import { RootStackParamList } from '../../navigation/RootStackParamList';
import { StackScreenProps } from '@react-navigation/stack';

type MapScreenProps = StackScreenProps<RootStackParamList, 'Map'>
export const Map = ({ navigation }: MapScreenProps) => {
    return (
        <View style={{ backgroundColor: COLORS.background, flex: 1 }}>
            <Text> MAP SCREEN</Text>
        </View>
    );
};

export default Map;