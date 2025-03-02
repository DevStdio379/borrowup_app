import React from 'react'
import { View, Text, TouchableOpacity  } from 'react-native'
import { COLORS } from '../../constants/theme';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootStackParamList';

type ListingsScreenProps = StackScreenProps<RootStackParamList, 'Listings'>;

const Listings = ({ navigation }: ListingsScreenProps) => {


    return (
        <View style={{ backgroundColor: COLORS.background, flex: 1 }}>
            <TouchableOpacity
            onPress={ () => navigation.navigate('AddListing', { listingId: 'newListing' }) }
            >
                <Text> LISTINGS SCREEN</Text>
            </TouchableOpacity>
        </View>
    )
}

export default Listings