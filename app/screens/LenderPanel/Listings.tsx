import React from 'react'
import { View, Text  } from 'react-native'
import { COLORS } from '../../constants/theme';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootStackParamList';

type ListingsScreenProps = StackScreenProps<RootStackParamList, 'Listings'>;

const Listings = ({ navigation }: ListingsScreenProps) => {


    return (
        <View style={{ backgroundColor: COLORS.background, flex: 1 }}>
            <Text> LISTINGS SCREEN</Text>
        </View>
    )
}

export default Listings