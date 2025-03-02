import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { IMAGES } from '../constants/Images';
import { COLORS } from '../constants/theme';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { closeDrawer } from '../redux/actions/drawerAction';
import { GlobalStyleSheet } from '../constants/StyleSheet';
import { defaultUser, useUser } from '../context/UserContext';

const MenuItems = [
    {
        id: "0",
        icon: 'home',
        name: "Home",
        navigate: "Home",
    },
    {
        id: "1",
        icon: 'bag-handle',
        name: "Products",
        navigate: "Products",
    },
    {
        id: "2",
        icon: 'home',
        name: "Home",
        navigate: "Home",
    },
    {
        id: "3",
        icon: 'star',
        name: "Featured",
        navigate: "Writereview",
    },
    {
        id: "4",
        icon: 'heart',
        name: "Wishlist",
        navigate: "Wishlist",
    },
    {
        id: "5",
        icon: 'cube',
        name: "My Orders",
        navigate: 'Myorder',
    },
    {
        id: "6",
        icon: 'cart',
        name: "My Cart",
        navigate: 'MyCart',
    },
    {
        id: "7",
        icon: 'chatbox',
        name: "Chat List",
        navigate: 'Chat',
    },
    {
        id: "8",
        icon: 'person',
        name: "Profile",
        navigate: "Profile",
    },
    {
        id: '9',
        icon: 'log-out',
        name: 'Logout',
        navigate: 'SignIn',
    },
]

const DrawerMenu = ({ navigation }: any) => {

    const theme = useTheme();
    const dispatch = useDispatch();
    const {setUser } = useUser();
    const { colors }: { colors: any } = theme;

    const [active, setactive] = useState(MenuItems[0]);

    const handleSignOut = () => {
        // Perform any necessary sign-out logic here
        console.log("User signed out");

        // Reset the user to defaultUser
        setUser({ ...defaultUser });
    };

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View
                style={{
                    flex: 1,
                    backgroundColor: colors.background,
                    paddingHorizontal: 15,
                    paddingVertical: 15,
                }}
            >
                <View
                    style={{
                        alignItems: 'center',
                        paddingVertical: 30,
                        paddingRight: 10
                    }}
                >
                    <Image
                        style={{ height: 35, width: 114 }}
                        source={theme.dark ? IMAGES.appnamedark : IMAGES.appname}
                    />
                </View>
                <View
                    style={[GlobalStyleSheet.flex, {
                        paddingHorizontal: 15,
                        paddingBottom: 20
                    }]}
                >
                    <Text style={{ fontSize: 20, color: colors.title }}>Main Menus</Text>
                    <TouchableOpacity
                        onPress={() => navigation.closeDrawer()}
                        activeOpacity={0.5}
                    >
                        <Feather size={24} color={colors.title} name='x' />
                    </TouchableOpacity>
                </View>
                <View style={{ paddingBottom: 10 }}>
                    {MenuItems.map((data: any, index: any) => {
                        return (
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => { data.navigate === "DrawerNavigation" ? dispatch(closeDrawer()) : dispatch(closeDrawer()); navigation.navigate(data.navigate) }}
                                key={index}
                                style={[GlobalStyleSheet.flex, {
                                    paddingVertical: 5,
                                    marginBottom: 0,
                                }]}
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
                                    <View style={{ height: 45, width: 45, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}>
                                        <Ionicons size={24} color={colors.text} name={data.icon} />
                                    </View>
                                    <Text style={[{ color: colors.title, fontSize: 16, opacity: .6 }, data.id === '0' && { fontSize: 16, color: COLORS.primary }]}>{data.name}</Text>
                                </View>
                            </TouchableOpacity>
                        )
                    })}
                </View>
                {/* <View style={{ paddingHorizontal: 10 }}>
                    <ThemeBtn />
                </View> */}
                <View style={{ paddingVertical: 15, paddingHorizontal: 10 }}>
                    <Text style={{ fontSize: 16, color: '#868686' }}>Tags Rental App</Text>
                    <Text style={{ fontSize: 12, color: '#B1B1C3' }}>App Version 1.0.0</Text>
                </View>
            </View>
        </ScrollView>
    )
}

export default DrawerMenu