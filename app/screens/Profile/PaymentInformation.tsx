import React, { useState } from 'react'
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, Platform } from 'react-native'
import { useNavigation, useTheme } from '@react-navigation/native';
import Header from '../../layout/Header';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { IMAGES } from '../../constants/Images';
import { COLORS } from '../../constants/theme';
import { useUser } from '../../context/UserContext';
import { Ionicons } from '@expo/vector-icons';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootStackParamList';

type PaymentInformationScreenProps = StackScreenProps<RootStackParamList, 'PaymentInformation'>;

const PaymentInformation = ({ navigation }: PaymentInformationScreenProps) => {

    const theme = useTheme();
    const { colors }: { colors: any } = theme;
    const { user } = useUser();

    const [isFocused, setisFocused] = useState(false)
    const [isFocused1, setisFocused1] = useState(false)
    const [isFocused2, setisFocused2] = useState(false)
    const [isFocused3, setisFocused3] = useState(false)

    const [imageUrl, setImageUrl] = useState('');

    const [inputValue, setInputValue] = useState("");

    const handleChange = (text: any) => {
        const numericValue = text.replace(/[^0-9]/g, "");
        setInputValue(numericValue);
    };

    return (
        <View style={{ backgroundColor: colors.background, flex: 1 }}>
            <Header
                title='Payment Information'
                leftIcon='back'
            />
            <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 15, marginBottom: 50 }}>
                <View style={[GlobalStyleSheet.container, { marginTop: 10, paddingVertical: 10 }]}>
                    <View style={{ marginBottom: 15, marginTop: 30 }}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => {} }>
                            <View style={[GlobalStyleSheet.flexcenter, { width: '100%', gap: 20, justifyContent: 'space-between', marginBottom: 15, alignItems: 'flex-start' }]} >
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                    <Image source={IMAGES.appname} style={styles.icon} />
                                    <Text style={{ fontSize: 16, color: colors.title, fontWeight: 'bold' }}>Gift Card</Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                    <Text style={{ fontSize: 16, color: user?.isActive ? COLORS.title : COLORS.blackLight, fontWeight: 'bold' }}>{user?.isActive ? user?.firstName : 'Enter Code'}</Text>
                                    <Ionicons name="chevron-forward-outline" size={24} color={colors.title} />
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{ marginBottom: 15 }}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => {} }>
                            <View style={[GlobalStyleSheet.flexcenter, { width: '100%', gap: 20, justifyContent: 'space-between', marginBottom: 15, alignItems: 'flex-start' }]} >
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 30 }}>
                                    <Ionicons name="wallet" size={24} color={COLORS.title} />
                                    <Text style={{ fontSize: 16, color: colors.title, fontWeight: 'bold' }}>Wallet (£35.00)</Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                    <Text style={{ fontSize: 16, color: user?.isActive ? COLORS.title : COLORS.blackLight, fontWeight: 'bold' }}>{user?.isActive ? user?.firstName : 'Activate Now'}</Text>
                                    <Ionicons name="chevron-forward-outline" size={24} color={user?.isActive ? COLORS.title : COLORS.blackLight} />
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{ marginBottom: 15 }}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => {} }>
                            <View style={[GlobalStyleSheet.flexcenter, { width: '100%', gap: 20, justifyContent: 'space-between', marginBottom: 15, alignItems: 'flex-start' }]} >
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 30 }}>
                                    <Ionicons name="card" size={24} color={COLORS.title} />
                                    <Text style={{ fontSize: 16, color: colors.title, fontWeight: 'bold' }}>Credit or Debit Card</Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                    <Text style={{ fontSize: 16, color: user?.isActive ? COLORS.title : COLORS.blackLight, fontWeight: 'bold' }}>{user?.isActive ? user?.firstName : 'Add or Update Card'}</Text>
                                    <Ionicons name="chevron-forward-outline" size={24} color={user?.isActive ? COLORS.title : COLORS.blackLight} />
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{ marginBottom: 15 }}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => {} }>
                            <View style={[GlobalStyleSheet.flexcenter, { width: '100%', gap: 20, justifyContent: 'space-between', marginBottom: 15, alignItems: 'flex-start' }]} >
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                    <Ionicons name="logo-apple" size={24} color={colors.title} />
                                    <Text style={{ fontSize: 16, color: colors.title, fontWeight: 'bold' }}>Apple Pay</Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                    <Text style={{ fontSize: 16, color: user?.isActive ? COLORS.title : COLORS.blackLight, fontWeight: 'bold' }}>{user?.isActive ? user?.firstName : 'Activate Now'}</Text>
                                    <Ionicons name="chevron-forward-outline" size={24} color={colors.title} />
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{ marginBottom: 15 }}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => {} }>
                            <View style={[GlobalStyleSheet.flexcenter, { width: '100%', gap: 20, justifyContent: 'space-between', marginBottom: 15, alignItems: 'flex-start' }]} >
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                    <Ionicons name="logo-google" size={24} color={colors.title} />
                                    <Text style={{ fontSize: 16, color: colors.title, fontWeight: 'bold' }}>Google Pay</Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                    <Text style={{ fontSize: 16, color: user?.isActive ? COLORS.title : COLORS.blackLight, fontWeight: 'bold' }}>{user?.isActive ? user?.firstName : 'Activate Now'}</Text>
                                    <Ionicons name="chevron-forward-outline" size={24} color={colors.title} />
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    icon: {
        height: 30,
        width: 45,
        resizeMode: 'contain',
        backgroundColor: COLORS.primaryLight,
        borderColor: COLORS.primary,
        borderWidth: 0.5,
        borderRadius: 1
    },
    inputBox: {
        borderRadius: 12,
        backgroundColor: COLORS.input,
    },
    cardBackground: {
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.background,
        marginHorizontal: -15,
        paddingHorizontal: 15,
        paddingBottom: 15,
        marginBottom: 10
    },
    imageborder: {
        borderWidth: 2,
        borderColor: COLORS.primary,
        height: 90,
        width: 90,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center'
    },
    WriteIconBackground: {
        height: 42,
        width: 42,
        borderRadius: 40,
        backgroundColor: COLORS.card,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 0,
        left: 60
    },
    WriteIcon: {
        height: 36,
        width: 36,
        borderRadius: 36,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.primary
    },
    InputTitle: {

        fontSize: 13,
        color: COLORS.title,
        marginBottom: 5
    },
    bottomBtn: {
        height: 75,
        width: '100%',
        backgroundColor: COLORS.card,
        justifyContent: 'center',
        paddingHorizontal: 15,
        shadowColor: "#000",
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: .1,
        shadowRadius: 5,
    }
})


export default PaymentInformation