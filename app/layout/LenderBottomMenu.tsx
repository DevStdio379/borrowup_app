import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Animated,
    StyleSheet,
    TouchableOpacity,
    Text,
    Image,
    Dimensions,
    Platform
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { GlobalStyleSheet } from '../constants/StyleSheet';
import { SIZES, COLORS } from '../constants/theme';
import { IMAGES } from '../constants/Images';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Ionicons } from '@expo/vector-icons';

type Props = {
    state: any,
    navigation: any,
    descriptors: any
}

const LenderBottomMenu = ({ state, navigation, descriptors }: Props) => {

    const theme = useTheme();
    const { colors }: { colors: any } = theme;

    const [tabWidth, setWidth] = useState(wp('100%'));

    const tabWD =
        tabWidth < SIZES.container ? tabWidth / 4 : SIZES.container / 4;

    Dimensions.addEventListener('change', val => {
        setWidth(val.window.width);
    });



    const onTabPress = (index: any) => {
        const tabW =
            tabWidth < SIZES.container ? tabWidth / 4 : SIZES.container / 4; // Adjust this according to your tab width
    };




    return (
        <>
            <View
                style={{
                    height: 60,
                    flexDirection: 'row',
                    backgroundColor: theme.dark ? colors.background : colors.card,
                    shadowColor: "rgba(2,81,53,.10)",
                    shadowOffset: {
                        width: 0,
                        height: 4,
                    },
                    shadowOpacity: 0.40,
                    shadowRadius: 4.65,
                    elevation: 10,
                }}
            >
                <View
                    style={[GlobalStyleSheet.container, {
                        flexDirection: 'row',
                        paddingHorizontal: 0,
                        paddingTop: 0,
                        paddingBottom: 0,
                    }]}
                >



                    {state.routes.map((route: any, index: string) => {
                        const { options } = descriptors[route.key];
                        const label =
                            options.tabBarLabel !== undefined
                                ? options.tabBarLabel
                                : options.title !== undefined
                                    ? options.title
                                    : route.name;

                        const isFocused = state.index === index;

                        const iconTranslateY = useRef(new Animated.Value(0)).current;
                        Animated.timing(iconTranslateY, {
                            toValue: isFocused ? -18 : 0,
                            duration: 100,
                            useNativeDriver: true,
                        }).start();

                        const onPress = () => {
                            const event = navigation.emit({
                                type: 'tabPress',
                                target: route.key,
                                canPreventDefault: true,
                            });

                            if (!isFocused && !event.defaultPrevented) {
                                navigation.navigate({ name: route.name, merge: true });
                                onTabPress(index);
                            }
                        };

                        return (
                            <View key={index} style={styles.tabItem}>
                                <TouchableOpacity onPress={onPress} style={styles.tabLink}>
                                    <Ionicons
                                        name={
                                            label === 'LenderDashboard'
                                                ? 'home-outline'
                                                : label === 'MyCalendar'
                                                    ? 'calendar-outline'
                                                    : label === 'Listings'
                                                        ? 'reader-outline'
                                                        : label === 'Messages'
                                                            ? 'chatbox-outline'
                                                            : label === 'Profile'
                                                                ? 'menu'
                                                                : 'alert-outline'
                                        }
                                        size={28}
                                        color={isFocused ? (theme.dark ? COLORS.card : colors.title) : COLORS.blackLight}
                                    />

                                    <Text style={[styles.navText, { color: isFocused ? COLORS.title : colors.blackLight }]}>
                                        {(() => {
                                            if (label === 'LenderDashboard') return 'Home';
                                            if (label === 'MyRental') return 'My Rental';
                                            if (label === 'Chat') return 'Messages';
                                            return label;
                                        })()}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        );
                    })}

                </View>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    tabBar: {
        height: 65,
        //borderTopWidth:1,
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: 60,
        //paddingTop:10
    },
    tabLink: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    navText: {
        fontSize: 13
    }
});

export default LenderBottomMenu;