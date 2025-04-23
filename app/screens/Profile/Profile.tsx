import { useTheme } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native'
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { COLORS } from '../../constants/theme';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootStackParamList';
import Header from '../../layout/Header';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useUser, defaultUser } from '../../context/UserContext';
import { countActivitiesByUser } from '../../services/BorrowingServices';
import { calculateBorrowingRatingByUser, calculateLendingRatingByUser } from '../../services/ReviewServices';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ProfileScreenProps = StackScreenProps<RootStackParamList, 'Profile'>;

const Profile = ({ navigation }: ProfileScreenProps) => {

    const theme = useTheme();
    const { user, updateUserData, setUser } = useUser();
    const { colors }: { colors: any } = theme;

    const [borrowingCount, setBorrowingCount] = useState<number>(0);
    const [lendingCount, setLendingCount] = useState<number>(0);
    const [lendingRating, setLendingRating] = useState<number>(0);
    const [borrowingRating, setBorrowingRating] = useState<number>(0);
    const [overallRating, setOverallRating] = useState<number>(0);

    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        if (user?.uid) {
            const count = await countActivitiesByUser(user.uid);
            setBorrowingCount(count.borrowingReviews ?? 0);
            setLendingCount(count.lendingReviews ?? 0);

            const borrowingRating = await calculateBorrowingRatingByUser(user.uid);
            setBorrowingRating(borrowingRating ?? 0);

            const lendingRating = await calculateLendingRatingByUser(user.uid);
            setLendingRating(lendingRating ?? 0);

            setBorrowingCount(count.borrowingReviews ?? 0);
            setLendingCount(count.lendingReviews ?? 0);

            const updatedBorrowingCount = count.borrowingReviews ?? 0;
            const updatedLendingCount = count.lendingReviews ?? 0;

            const overallRating = (updatedBorrowingCount + updatedLendingCount) > 0
                ? ((borrowingRating ?? 0) * updatedBorrowingCount + (lendingRating ?? 0) * updatedLendingCount) / (updatedBorrowingCount + updatedLendingCount)
                : 0;
            console.log('overallRating: ', overallRating);
            if (!isNaN(overallRating)) {
                setOverallRating(overallRating);
            } else {
                setOverallRating(0);
            }

        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchData().then(() => setRefreshing(false));
    }, [user?.uid]);

    const handleSignOut = async () => {
        try {
            if (user?.uid) {
                await updateUserData(user.uid, { 'isActive': false });
                navigation.navigate('SignIn')
                setUser(defaultUser)
                await AsyncStorage.removeItem('userUID');
            } else {
                console.error("User ID is undefined");
            }
        } catch (error) {
            console.error("Error updating user:", error);
        }
    };

    const handleSwitchAccountType = async () => {
        try {
            if (user?.uid) {
                await updateUserData(user.uid, { 'accountType': user.accountType === 'borrower' ? 'lender' : 'borrower' });
                navigation.navigate('BottomNavigation', { screen: 'HomeStack' });
            } else {
                console.error("User ID is undefined");
            }
        } catch (error) {
            console.error("Error updating user:", error);
        }
    };


    if (!user || !user.isActive) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ marginVertical: 10, fontSize: 14 }}>User is not active. Please sign in.</Text>
                <TouchableOpacity
                    style={{ padding: 10, paddingHorizontal: 30, backgroundColor: COLORS.primary, borderRadius: 20 }}
                    onPress={() => navigation.navigate('SignIn')}
                >
                    <Text style={{ color: COLORS.white, fontSize: 16 }}>Sign In</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <View style={{ backgroundColor: COLORS.background, flex: 1 }}>
            <View style={{ height: 60, borderBottomColor: COLORS.card, borderBottomWidth: 1 }}>
                <View
                    style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8, paddingHorizontal: 5 }}>
                    <View style={{ flex: 1, alignItems: 'flex-start' }}>
                        {/* <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            style={{
                                height: 45, width: 45, alignItems: 'center', justifyContent: 'center',
                            }}
                        >
                            <Ionicons size={30} color={COLORS.black} name='chevron-back-outline' />
                        </TouchableOpacity> */}
                    </View>
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.title, textAlign: 'center', marginVertical: 10 }}>Profile</Text>
                    </View>
                    <View style={{ flex: 1, alignItems: 'flex-end' }}>
                        {/* right header element */}
                    </View>
                </View>
            </View>
            <ScrollView
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1, paddingBottom: 50 }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }>
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 20 , paddingHorizontal: 20 }}>
                    <View
                        style={{
                            height: 80,
                            width: 80,
                            borderRadius: 50,
                            backgroundColor: COLORS.primary,
                            overflow: 'hidden',
                            marginRight: 20,
                        }}
                    >
                        {user?.profileImageUrl ? (
                            <Image source={{ uri: user?.profileImageUrl }} style={{ height: '100%', width: '100%' }} />
                        ) : (
                            <View style={{ height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }} >
                                <Ionicons name="person-outline" size={40} color={COLORS.black} />
                            </View>
                        )}
                    </View>  
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.title, paddingBottom: 10 }}>
                            {user?.firstName} {user?.lastName} <Text style={{ fontSize: 14, fontWeight: 'normal' }}>{overallRating.toFixed(2)} <Ionicons name="star" size={14} color={COLORS.placeholder} /></Text>
                        </Text>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontSize: 14, color: COLORS.blackLight }}>
                                    {borrowingRating.toFixed(2)} <Ionicons name="star" size={14} color={COLORS.placeholder} />
                                </Text>
                                <Text style={{ fontSize: 14, color: colors.text }}>Borrowings</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontSize: 14, color: COLORS.blackLight }}>
                                    {lendingRating.toFixed(2)} <Ionicons name="star" size={14} color={COLORS.placeholder} />
                                </Text>
                                <Text style={{ fontSize: 14, color: colors.text }}>Lendings</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontSize: 14, color: COLORS.blackLight }}>
                                    {borrowingCount + lendingCount}
                                </Text>
                                <Text style={{ fontSize: 14, color: colors.text }}>Reviews</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={[GlobalStyleSheet.container, { paddingHorizontal: 40, marginTop: 10 }]}>
                    <View style={[GlobalStyleSheet.line, { margin: 10 },]} />
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => navigation.navigate('PersonalDetails')}>
                        <View style={[GlobalStyleSheet.flexcenter, { width: '100%', gap: 20, justifyContent: 'space-between', marginBottom: 15, alignItems: 'center' }]} >
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }} >
                                <View style={[styles.cardimg, { backgroundColor: colors.card }]} >
                                    <Ionicons name='person' size={30} color={colors.title} />
                                </View>
                                <Text style={{ fontSize: 16, color: colors.title, fontWeight: 'bold' }}>Personal Details</Text>
                            </View>
                            <Ionicons name='chevron-forward-outline' size={30} color={COLORS.blackLight} />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => navigation.navigate('AddressBook')}>
                        <View style={[GlobalStyleSheet.flexcenter, { width: '100%', gap: 20, justifyContent: 'space-between', marginBottom: 15, alignItems: 'center' }]} >
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }} >
                                <View style={[styles.cardimg, { backgroundColor: colors.card }]} >
                                    <Ionicons name='compass' size={30} color={colors.title} />
                                </View>
                                <Text style={{ fontSize: 16, color: colors.title, fontWeight: 'bold' }}>Address Book</Text>
                            </View>
                            <Ionicons name='chevron-forward-outline' size={30} color={COLORS.blackLight} />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => navigation.navigate('PaymentInformation')}>
                        <View style={[GlobalStyleSheet.flexcenter, { width: '100%', gap: 20, justifyContent: 'space-between', marginBottom: 15, alignItems: 'center' }]} >
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }} >
                                <View style={[styles.cardimg, { backgroundColor: colors.card }]} >
                                    <Ionicons name='card' size={30} color={colors.title} />
                                </View>
                                <Text style={{ fontSize: 16, color: colors.title, fontWeight: 'bold' }}>Payment Information</Text>
                            </View>
                            <Ionicons name='chevron-forward-outline' size={30} color={COLORS.blackLight} />
                        </View>
                    </TouchableOpacity>
                    <View style={[GlobalStyleSheet.flexcenter, { width: '100%', gap: 20, justifyContent: 'flex-start', marginBottom: 15, alignItems: 'center' }]} >
                        <View style={[styles.cardimg, { backgroundColor: colors.card }]} >
                            <Ionicons name='settings' size={30} color={colors.title} />
                        </View>
                        <Text style={{ fontSize: 16, color: colors.title, fontWeight: 'bold' }}>Settings</Text>
                    </View>
                    <View style={[GlobalStyleSheet.line, { margin: 10 },]} />
                    <View style={[GlobalStyleSheet.flexcenter, { width: '100%', gap: 20, justifyContent: 'flex-start', marginBottom: 15, alignItems: 'center' }]} >
                        <View style={[styles.cardimg, { backgroundColor: colors.card }]} >
                            <Ionicons name='clipboard' size={30} color={colors.title} />
                        </View>
                        <Text style={{ fontSize: 16, color: colors.title, fontWeight: 'bold' }}>Request an Item</Text>
                    </View>
                    <View style={[GlobalStyleSheet.line, { margin: 10 },]} />
                    <View style={[GlobalStyleSheet.flexcenter, { width: '100%', gap: 20, justifyContent: 'flex-start', marginBottom: 15, alignItems: 'center' }]} >
                        <View style={[styles.cardimg, { backgroundColor: colors.card }]} >
                            <Ionicons name='help-circle' size={30} color={colors.title} />
                        </View>
                        <Text style={{ fontSize: 16, color: colors.title, fontWeight: 'bold' }}>FAQs</Text>
                    </View>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        // onPress={() => dispatch(openDrawer())}
                        onPress={() => { }}
                    >
                        <View style={[GlobalStyleSheet.flexcenter, { width: '100%', gap: 20, justifyContent: 'flex-start', marginBottom: 15, alignItems: 'center' }]} >
                            <View style={[styles.cardimg, { backgroundColor: colors.card }]} >
                                <Ionicons name='menu' size={30} color={colors.title} />
                            </View>
                            <Text style={{ fontSize: 16, color: colors.title, fontWeight: 'bold' }}>Menu</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => navigation.navigate('Profile')}
                    >
                        <View style={[GlobalStyleSheet.flexcenter, { width: '100%', gap: 20, justifyContent: 'flex-start', marginBottom: 15, alignItems: 'center' }]} >
                            <View style={[styles.cardimg, { backgroundColor: colors.card }]} >
                                <Ionicons name='notifications' size={30} color={colors.title} />
                            </View>
                            <Text style={{ fontSize: 16, color: colors.title, fontWeight: 'bold' }}>Notification</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={{ gap: 10, paddingTop: 30 }}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={{
                                padding: 20,
                                backgroundColor: COLORS.primary,
                                borderRadius: 30,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 10
                            }}
                            onPress={() => handleSwitchAccountType()}
                        >
                            <Text style={{ fontSize: 18, color: COLORS.card, lineHeight: 21 }}>
                                {user?.accountType === 'borrower' ? 'Switch to Owner Profile' : 'Switch to Borrower Profile'}
                            </Text>
                        </TouchableOpacity>
                        {/* {
                            user?.isActive === true && (
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    style={{
                                        padding: 10,
                                        paddingHorizontal: 20,
                                        borderRadius: 30,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: 10
                                    }}
                                    onPress={() => handleSignOut()}
                                >
                                    <Text style={{ fontSize: 18, color: COLORS.black, lineHeight: 21, fontWeight: 'bold', textDecorationLine: 'underline' }}>Sign Out</Text>
                                </TouchableOpacity>
                            )
                        } */}
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={{
                                padding: 10,
                                paddingHorizontal: 20,
                                borderRadius: 30,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 10
                            }}
                            onPress={() => handleSignOut()}
                        >
                            <Text style={{ fontSize: 18, color: COLORS.black, lineHeight: 21, fontWeight: 'bold', textDecorationLine: 'underline' }}>Sign Out</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    cardimg: {
        height: 54,
        width: 54,
        borderRadius: 10,
        backgroundColor: COLORS.card,
        shadowColor: "rgba(0,0,0,0.5)",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 20.27,
        elevation: 5,
        alignItems: 'center',
        justifyContent: 'center'
    },
})

export default Profile