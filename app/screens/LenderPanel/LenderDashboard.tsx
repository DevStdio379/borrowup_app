import { useTheme } from '@react-navigation/native';
import React from 'react'
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native'
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { IMAGES } from '../../constants/Images';
import { COLORS, SIZES } from '../../constants/theme';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootStackParamList';
import Header from '../../layout/Header';
import { useDispatch } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useUser, defaultUser } from '../../context/UserContext';
import { openDrawer } from '../../redux/actions/drawerAction';
import CardInfoStyle from '../../components/Card/CardInfoStyle';
import PillStyle from '../../components/Pills/PillStyle';

type LenderDashboardScreenProps = StackScreenProps<RootStackParamList, 'LenderDashboard'>;

const LenderDashboard = ({ navigation }: LenderDashboardScreenProps) => {

    const theme = useTheme();
    const dispatch = useDispatch();
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
        <View style={GlobalStyleSheet.container}>
            <Header title='Lender Dashboard' />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, paddingBottom: 70, alignItems: 'flex-start' }}>
                <View style={[GlobalStyleSheet.container, { paddingTop: 20, paddingBottom: 30 }]}>
                    <View style={{ paddingHorizontal: 15 }}>
                        <Text style={[styles.brandsubtitle3, { fontSize: 22, fontWeight: 'semibold', color: colors.title }]}>Welcome back, {user?.userName}</Text>
                        <Text style={[styles.brandsubtitle3, { fontSize: 14, color: colors.title }]}>Your task highlights</Text>
                    </View>
                    <View style={{ paddingTop: 10, paddingHorizontal: 15 }}>
                        <CardInfoStyle
                            id={''}
                            title={'Add a payout method'}
                            subtitle={'Required to get paid'}
                            onPress={() => { }}
                        />
                    </View>
                </View>
                <View style={[GlobalStyleSheet.container, { paddingHorizontal: 15 }]}>
                    <Text style={[styles.brandsubtitle3, { fontSize: 20, fontWeight: 'semibold', color: colors.title }]}>Your recent lentings</Text>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, paddingBottom: 10 }}>
                    <View style={{ flexDirection: 'row', paddingTop: 10, paddingHorizontal: 15 }}>
                        {['Active (10)', 'Pending (5)', 'Completed (15)', 'Return (10)', 'Issues (0)'].map((title, index) => (
                            <View key={index} style={{ paddingHorizontal: 5 }}>
                                <PillStyle
                                    id={''}
                                    title={title}
                                    onPress={() => { }}
                                />
                            </View>
                        ))}
                    </View>
                </ScrollView>
                <View style={{ paddingHorizontal: 15, width: SIZES.width }}>
                    <View style={{ borderRadius: 10, borderColor: COLORS.black, borderWidth: 1 }}>
                        <Image
                            style={{ height: 100, width: "100%", borderTopLeftRadius: 10, borderTopRightRadius: 10 }}
                            source={IMAGES.pickupLocation}
                        />
                        <View style={{ paddingTop: 10, paddingHorizontal: 10 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Ionicons name="person-circle-outline" size={40} color={COLORS.primary} style={{ marginRight: 10 }} />
                                <View style={{ flexDirection: 'row', paddingVertical: 10 }}>
                                    <Text style={{ fontWeight: 'bold' }}>Afiq Ismail</Text>
                                    <Text> is borrowing </Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', paddingVertical: 3 }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 16 }} >DJI Drone Mavic Pro 3</Text>
                                <Text style={{ fontSize: 16 }} > for 3 days </Text>
                            </View>
                            <View>
                                <Text>13/2/24, Thursday - 14/2/24, Friday</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={{
                                    flex: 1,
                                    padding: 20,
                                    borderColor: COLORS.blackLight,
                                    borderBottomLeftRadius: 10,
                                    borderWidth: 1,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                                onPress={() => { }}
                            >
                                <Text style={{ fontSize: 12, lineHeight: 21 }}>
                                    Message
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={{
                                    flex: 1,
                                    padding: 20,
                                    borderColor: COLORS.blackLight,
                                    borderBottomRightRadius: 10,
                                    borderWidth: 1,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                                onPress={() => { }}
                            >
                                <Text style={{ fontSize: 12, lineHeight: 21 }}>
                                    Call
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View style={{ paddingHorizontal: 15 }}>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={{
                            paddingTop: 10,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 10
                        }}
                        onPress={() => handleSignOut()}
                    >
                        <Text style={{ fontSize: 14, color: COLORS.black, lineHeight: 21, textDecorationLine: 'underline' }}>Sign Out</Text>
                    </TouchableOpacity>
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