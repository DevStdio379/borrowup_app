import { View, Text, Image, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Pressable } from 'react-native'
import React, { useState } from 'react'
import { COLORS } from '../../constants/theme'
import { IMAGES } from '../../constants/Images'
import { GlobalStyleSheet } from '../../constants/StyleSheet'
import { useTheme } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import { removeFromwishList } from '../../redux/reducer/wishListReducer'
import Ionicons from 'react-native-vector-icons/Ionicons';

type Props = {
    id: string;
    title: string;
    btntitle?: string;
    price: number;
    ownerID?: string;
    description?: string;
    location?: string;
    imageUrl?: any;
    product?: any;
    MyOrder?: any;
    completed?: any;
    reviewCount?: number;
    onPress?: (e: any) => void,
    onPress2?: any,
    onPress3?: (e: any) => void,
    onPress4?: (e: any) => void,
    onPress5?: (e: any) => void,
}

const Cardstyle4 = ({ id, title, imageUrl, description, reviewCount, price, onPress, ownerID, product, onPress2, MyOrder, btntitle, completed, location, onPress5, onPress3, onPress4 }: Props) => {

    const theme = useTheme();
    const { colors }: { colors: any } = theme;

    const [show, setshow] = useState(false)

    const dispatch = useDispatch();

    const wishList = useSelector((state: any) => state.wishList.wishList);

    const inWishlist = () => {
        var temp = [] as any;
        wishList.forEach((data: any) => {
            temp.push(data.id);
        });
        return temp;
    }

    const removeItemFromWishList = () => {
        dispatch(removeFromwishList(id as any));
    }

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPress}
            style={[styles.card, { flexDirection: 'column', width: 180, alignItems: 'flex-start', borderRadius: 22, padding: 5 }]}
        >
            <View style={{ width: '100%', alignItems: 'center' }}>
                <View
                    style={{
                        height: 200,
                        width: '100%',
                        backgroundColor: COLORS.primary,
                        borderRadius: 22,
                        aspectRatio: 1 / 1.2,
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden'
                    }}
                >
                    <Image
                        style={{ height: undefined, width: '100%', aspectRatio: 1 / 1.2, }}
                        source={{ uri: imageUrl }}
                    />
                    <View
                        style={{
                            position: 'absolute',
                            right: 10,
                            top: 10,
                        }}
                    >
                        <Pressable
                            accessible={true}
                            accessibilityLabel="Like Btn"
                            accessibilityHint="Like this item"
                            onPress={() => {}}
                            style={{
                                height: 30,
                                width: 30,
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: COLORS.white,
                                borderRadius: 15,
                            }}
                        >
                            {inWishlist().includes(id) ?
                                <Ionicons size={22} color={COLORS.black} name='heart-sharp' />
                                :
                                <Ionicons size={22} color={COLORS.black} name='heart-outline' />
                            }
                        </Pressable>
                    </View>
                </View>
                <View style={{ flex: 1, width: '100%' }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 18, color: colors.title }}>£{price} / day</Text>
                    <Text numberOfLines={1} ellipsizeMode="tail" style={ { fontSize: 16, color: COLORS.black }}>{title}</Text>
                    <Text style={{ fontSize: 12, color: COLORS.black }}>Deposit required</Text>
                    {MyOrder ? completed ?
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={onPress4}
                            style={{
                                padding: 10,
                                paddingHorizontal: 15,
                                backgroundColor: COLORS.primary,
                                borderRadius: 30,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 10
                            }}
                        >
                            <Text style={{ fontSize: 14, color: COLORS.card, lineHeight: 21 }}>{btntitle}</Text>
                        </TouchableOpacity>
                        :
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={onPress3}
                            style={{
                                padding: 10,
                                paddingHorizontal: 20,
                                backgroundColor: COLORS.primary,
                                borderRadius: 30,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 10
                            }}
                        >
                            <Text style={{ fontSize: 14, color: COLORS.card, lineHeight: 21 }}>{btntitle}</Text>
                        </TouchableOpacity>
                        :
                        <Text style={{ fontSize: 12, color: COLORS.blackLight }}>{reviewCount && reviewCount > 0 ? `${reviewCount} review` : 'No review' }</Text>
                    }
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    brandsubtitle3: {

        fontSize: 12,
        color: COLORS.title
    },
    buttonWrapper: {
        borderRadius: 30,
        overflow: 'hidden', // Prevent ripple from bleeding outside the button
    },
    button: {
        flexDirection: 'row',
        padding: 10,
        paddingHorizontal: 25,
        backgroundColor: COLORS.card,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10
    },
    card: {

    },
})



export default Cardstyle4

