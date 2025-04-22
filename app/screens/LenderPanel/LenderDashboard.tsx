import { useTheme } from '@react-navigation/native';
import React from 'react'
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native'
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { IMAGES } from '../../constants/Images';
import { COLORS, SIZES } from '../../constants/theme';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootStackParamList';
import Header from '../../layout/Header';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useUser, defaultUser } from '../../context/UserContext';
import CardInfoStyle from '../../components/Card/CardInfoStyle';
import PillStyle from '../../components/Pills/PillStyle';

type LenderDashboardScreenProps = StackScreenProps<RootStackParamList, 'LenderDashboard'>;

const LenderDashboard = ({ navigation }: LenderDashboardScreenProps) => {

    const theme = useTheme();
    const { user, updateUserData, setUser } = useUser();
    const { colors }: { colors: any } = theme;

    const handleSignOut = async () => {
        try {
            if (user?.uid) {
                await updateUserData(user.uid, { 'isActive': false });
                navigation.navigate('SignIn')
                setUser(defaultUser)
            } else {
                console.error("User ID is undefined");
            }
        } catch (error) {
            console.error("Error updating user:", error);
        }
    };


    return (
        <View style={{ flex: 1, backgroundColor: colors.background, paddingHorizontal: 15 }}>
            <View style={{ paddingTop: 50, paddingBottom: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                {user?.isActive ? (
                    <View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ fontSize: 14, color: COLORS.title }}>{user.currentAddress?.addressName}</Text>
                        </View>
                        <Text style={{ fontSize: 30, fontWeight: 'bold', color: COLORS.title }}>Owner Dashboard</Text>
                    </View>
                ) : (
                    <View>
                        <Text style={{ fontSize: 30, fontWeight: 'bold', color: COLORS.title }}>BorrowNest</Text>
                        <Text style={{ fontSize: 16, color: COLORS.title }}>Borrow & lend items around you.</Text>
                    </View>
                )}
                <TouchableOpacity
                    onPress={() => navigation.navigate('Profile')}
                    activeOpacity={0.5}
                    style={{ justifyContent: 'center', alignItems: 'center' }}
                >
                    <Image
                        source={{ uri: user?.profileImageUrl || 'https://via.placeholder.com/150' }}
                        style={{
                            width: 60,
                            height: 60,
                            borderRadius: 60,
                        }}
                    />
                </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={{ paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
                <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={[styles.arrivaldata, { flex: 1, marginRight: 10, padding: 15 }]}>
                        <View>
                            <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.title }}>
                                Total Earnings
                            </Text>
                            <Text style={{ fontSize: 14, color: COLORS.title }}>
                                $500.00
                            </Text>
                        </View>
                        <Ionicons name="wallet-outline" size={30} color={COLORS.primary} />
                    </View>
                    <View style={[styles.arrivaldata, { flex: 1, marginLeft: 10, padding: 15 }]}>
                        <View>
                            <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.title }}>
                                Pending Balance
                            </Text>
                            <Text style={{ fontSize: 14, color: COLORS.title }}>
                                $150.00
                            </Text>
                        </View>
                        <Ionicons name="time-outline" size={30} color={COLORS.primary} />
                    </View>
                </View>
                <View style={{ marginTop: 20 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: COLORS.title }}>
                            Recent Lendings
                        </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('MyLendings')}>
                            <Text style={{ fontSize: 14, color: COLORS.primary }}>
                                View All
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView contentContainerStyle={{ justifyContent: 'center' }} style={{ backgroundColor: COLORS.card, borderRadius: 10 }} showsHorizontalScrollIndicator={false}>
                        <View style={[styles.LenderDashboardcard, { flex: 1, padding: 5 }]}>
                            <View style={styles.cardimg}>
                                <Image
                                    source={{ uri: 'https://via.placeholder.com/150' }}
                                    style={{ width: 50, height: 50, borderRadius: 10 }}
                                />
                            </View>
                            <View>
                                <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.title }}>
                                    Sample Item
                                </Text>
                                <Text style={{ fontSize: 14, color: COLORS.title }}>
                                    Borrower Name
                                </Text>
                                <Text style={{ fontSize: 12, color: COLORS.title }}>
                                    Due: 2023-12-31
                                </Text>
                            </View>
                        </View>
                        <View style={[styles.LenderDashboardcard, { flex: 1, padding: 5 }]}>
                            <View style={styles.cardimg}>
                                <Image
                                    source={{ uri: 'https://via.placeholder.com/150' }}
                                    style={{ width: 50, height: 50, borderRadius: 10 }}
                                />
                            </View>
                            <View>
                                <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.title }}>
                                    Sample Item
                                </Text>
                                <Text style={{ fontSize: 14, color: COLORS.title }}>
                                    Borrower Name
                                </Text>
                                <Text style={{ fontSize: 12, color: COLORS.title }}>
                                    Due: 2023-12-31
                                </Text>
                            </View>
                        </View>
                    </ScrollView>
                </View>
                <View style={{ marginTop: 20 }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: COLORS.title, marginBottom: 10 }}>
                        Owner Resources and Tips
                    </Text>
                    <ScrollView showsHorizontalScrollIndicator={false}>
                        <View style={[styles.LenderDashboardcard, { width: 200, padding: 10 }]}>
                            <View style={styles.cardimg}>
                                <Image
                                    source={{ uri: 'https://via.placeholder.com/150' }}
                                    style={{ width: 50, height: 50, borderRadius: 10 }}
                                />
                            </View>
                            <View>
                                <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.title }}>
                                    Resource 1
                                </Text>
                                <Text style={{ fontSize: 12, color: COLORS.title }}>
                                    Learn how to maximize your earnings.
                                </Text>
                            </View>
                        </View>
                        <View style={[styles.LenderDashboardcard, { width: 200, padding: 10 }]}>
                            <View style={styles.cardimg}>
                                <Image
                                    source={{ uri: 'https://via.placeholder.com/150' }}
                                    style={{ width: 50, height: 50, borderRadius: 10 }}
                                />
                            </View>
                            <View>
                                <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.title }}>
                                    Resource 2
                                </Text>
                                <Text style={{ fontSize: 12, color: COLORS.title }}>
                                    Tips for safe lending practices.
                                </Text>
                            </View>
                        </View>
                        <View style={[styles.LenderDashboardcard, { width: 200, padding: 10 }]}>
                            <View style={styles.cardimg}>
                                <Image
                                    source={{ uri: 'https://via.placeholder.com/150' }}
                                    style={{ width: 50, height: 50, borderRadius: 10 }}
                                />
                            </View>
                            <View>
                                <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.title }}>
                                    Resource 3
                                </Text>
                                <Text style={{ fontSize: 12, color: COLORS.title }}>
                                    How to attract more borrowers.
                                </Text>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    arrivaldata: {
        backgroundColor: COLORS.card,
        borderRadius: 20,
        //width:'100%',
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: '#EFEFEF',
    },
    sectionimg: {
        height: 104,
        width: 104,
        borderRadius: 150,
        backgroundColor: COLORS.primary,
        overflow: 'hidden',
        marginBottom: 25
    },
    brandsubtitle2: {
        fontSize: 12
    },
    brandsubtitle3: {
        fontSize: 12,
        color: COLORS.title
    },
    LenderDashboardcard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
        marginRight: 10,
        marginBottom: 20
    },
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

export default LenderDashboard