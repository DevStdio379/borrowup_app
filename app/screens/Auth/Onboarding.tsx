import React, { useEffect, useRef, useState } from 'react';
import { Text, View, Image, ScrollView, Animated, Platform, SafeAreaView, TouchableOpacity } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { IMAGES } from '../../constants/Images';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootStackParamList';
import { COLORS, SIZES } from '../../constants/theme';
import { GlobalStyleSheet } from '../../constants/StyleSheet';


const DATA = [
    {
        title: "A community rental service",
        subtitle: "Rent almost anything from your neighbourhood"
    },
    {
        title: "Anything?",
        subtitle: "From household essentials, sports, party or tech.\nYou name it."
    },
    {
        title: "Give your belonging a community value - Tag Them",
        subtitle: "You own something that not in the “Tag Listing”? Rent them and earn while make your neighbourhood fun by sharing"
    },
]

type OnBoardingScreenProps = StackScreenProps<RootStackParamList, 'OnBoarding'>;

const OnBoarding = ({ navigation }: OnBoardingScreenProps) => {

    const theme = useTheme();
    const { colors }: { colors: any } = theme;

    const IndexData = ["01", "02", "03"]

    const IndexImage = [IMAGES.onbording1, IMAGES.onbording2, IMAGES.onbording3]

    const scrollRef = useRef<any>();

    const scrollX = useRef(new Animated.Value(0)).current;

    const [sliderIndex, setSliderIndex] = useState<any>(1);

    const onScroll = (event: any) => {
        scrollX.setValue(event.nativeEvent.contentOffset.x);
        const contentOffsetX = event.nativeEvent.contentOffset.x;
        setSliderIndex(Math.round(contentOffsetX / SIZES.width) + 1);
    };

    const scrollToIndex = (index: number) => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({ x: index * SIZES.width, animated: true });
        }
    };

    const [imageScale] = useState(new Animated.Value(0));

    useEffect(() => {
        Animated.sequence([
            Animated.timing(imageScale, {
                toValue: 0, // Scale up to 0
                duration: 100, // Animation duration
                useNativeDriver: true, // Add this line for better performance
            }),
            Animated.timing(imageScale, {
                toValue: 1, // Scale back to 1
                duration: 300, // Animation duration
                useNativeDriver: true, // Add this line for better performance
            }),
        ]).start();
    }, [sliderIndex]);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.card }}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={{ flex: 1 }}>
                    <View style={[GlobalStyleSheet.container, { marginTop: 160, padding: 0, flex: 1 }]}>
                        <Animated.View
                            style={{
                                transform: [{ scale: imageScale }], // Apply scale transform
                            }}
                        >
                            <Image
                                style={{
                                    width: '100%',
                                    height: undefined,
                                    aspectRatio: 1 / .6,
                                    //position:'absolute',
                                    left: 0,
                                    right: 0,
                                    top: 0,
                                    resizeMode: 'contain',
                                    //backgroundColor:COLORS.primary
                                    //bottom:0,
                                }}
                                source={IndexImage[sliderIndex - 1]}
                            />
                        </Animated.View>
                    </View>
                    <View style={[GlobalStyleSheet.container, { padding: 0, marginBottom: 55 }]}>
                        <ScrollView
                            ref={scrollRef}
                            horizontal
                            pagingEnabled
                            scrollEventThrottle={16}
                            decelerationRate="fast"
                            showsHorizontalScrollIndicator={false}
                            onScroll={onScroll}
                        >
                            {DATA.map((data: any, index) => (
                                <View style={{ width: SIZES.width, ...(Platform.OS === "ios" && { paddingBottom: 35 }) }} key={index}>
                                    <View style={{ paddingHorizontal: 30 }}>
                                        <Text style={[{
                                            fontSize: 24,
                                            textAlign: 'center',
                                            color: COLORS.title
                                        }, { color: colors.title }, Platform.OS === 'web' && { textAlign: 'center' }]}>{data.title}</Text>
                                        <Text style={[{
                                            fontSize: 14,
                                            textAlign: 'center',
                                            color: COLORS.text,
                                            paddingHorizontal: 10,
                                            marginTop: 5
                                        }, { color: colors.text }, Platform.OS === 'web' && { textAlign: 'center' }]}>{data.subtitle}</Text>
                                    </View>
                                </View>
                            ))
                            }
                        </ScrollView>
                        <View style={[{
                            alignSelf: 'center',
                            flexDirection: 'row',
                            top: 25,
                        }, Platform.OS === "ios" && {
                            bottom: 0
                        }]} pointerEvents="none">
                            {DATA.map((x: any, i: any) => (
                                <Indicator i={i} key={i} scrollValue={scrollX} />
                            ))}
                        </View>
                    </View>
                </View>
                <View style={[GlobalStyleSheet.container, { padding: 0, paddingHorizontal: 30, paddingBottom: 30 }]}>
                    <TouchableOpacity onPress={() => navigation.navigate('SignUp')} style={{
                        backgroundColor: COLORS.primary,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 20,
                        paddingHorizontal: 20,
                        paddingVertical: 20,
                    }}>
                        <Text style={{ fontWeight: 'bold', color: COLORS.white }}>Get Started</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

function Indicator({ i, scrollValue }: any) {

    const theme = useTheme();
    const translateX = scrollValue.interpolate({
        inputRange: [-SIZES.width + i * SIZES.width, i * SIZES.width, SIZES.width + i * SIZES.width],
        outputRange: [-20, 0, 20],
    });
    return (
        <View style={{
            height: 10,
            width: 10,
            borderRadius: 5,
            marginHorizontal: 5,
            borderWidth: 1,
            overflow: 'hidden',
            backgroundColor: theme.dark ? 'rgba(255,255,255,0.20)' : 'rgba(0, 0, 0, 0.20)', borderColor: theme.dark ? 'rgba(255,255,255,0.20)' : 'rgba(0, 0, 0, 0.20)'
        }}>
            <Animated.View
                style={{
                    height: '100%',
                    width: '100%',
                    borderRadius: 10, transform: [{ translateX }], backgroundColor: COLORS.primary
                }}
            />
        </View>
    );
}

export default OnBoarding