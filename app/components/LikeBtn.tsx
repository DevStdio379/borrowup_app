import React, { useState } from 'react'
import { View, Text, Pressable } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../constants/theme';
import { useTheme } from '@react-navigation/native';

const LikeBtn = ({wishlist,onPress,inWishlist,id}: any) => {

    const theme = useTheme();
    const { colors } : {colors : any} = theme;

    return (
        <Pressable
            accessible={true}
            accessibilityLabel="Like Btn"
            accessibilityHint="Like this item"
            onPress={() =>  onPress ? onPress() : ""}
            style={{
                height: 30,
                width: 30,
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            {inWishlist().includes(id) ?
                <Ionicons size={22} color={wishlist ? COLORS.white : COLORS.primary } name="heart" />
                :
                <Ionicons size={22} color={wishlist ? COLORS.primary : COLORS.white } name="heart" />
            }
        </Pressable>
    );
}

export default LikeBtn