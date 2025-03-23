import { useTheme } from '@react-navigation/native';
import React from 'react'
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native'
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { IMAGES } from '../../constants/Images';
import { COLORS } from '../../constants/theme';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootStackParamList';
import Header from '../../layout/Header';
import { useDispatch } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useUser, defaultUser } from '../../context/UserContext';
import { openDrawer } from '../../redux/actions/drawerAction';

type ProfileScreenProps = StackScreenProps<RootStackParamList, 'Profile'>;

const Profile = ({ navigation }: ProfileScreenProps) => {

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

    const handleSwitchAccountType = async () => {
        try {
            if (user?.uid) {
                await updateUserData(user.uid, { 'accountType': user.accountType === 'borrower' ? 'lender' : 'borrower' });
                navigation.navigate('DrawerNavigation', { screen: 'Home' });
            } else {
                console.error("User ID is undefined");
            }
        } catch (error) {
            console.error("Error updating user:", error);
        }
    };


    return (
        <View style={{ backgroundColor: colors.card, flex: 1 }}>
            <Header
                title='Profile'
            />
            <ScrollView showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, paddingBottom: 50 }}>
                <View style={{ flexDirection: 'row', width: '100%', paddingTop: 20 }}>
                    <View style={{ width: '40%' }}>
                        <View style={{ alignItems: 'center' }}>
                            <View
                                style={{
                                    height: 80,
                                    width: 80,
                                    borderRadius: 150,
                                    backgroundColor: COLORS.primary,
                                    overflow: 'hidden',
                                }}
                            >

                                {user?.profileImageUrl ? (
                                    <Image source={{ uri: user?.profileImageUrl }} style={{ height: '100%', width: '100%', borderRadius: 45 }} />
                                ) : (
                                    <View style={{ height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }} >
                                        <Ionicons name="person-outline" size={24} color={COLORS.black} />
                                    </View>
                                )}
                            </View>
                        </View>
                    </View>
                    <View style={{ width: '60%' }}>
                        <Text style={{ fontSize: 24, color: colors.title }}>{user?.firstName} {user?.lastName}</Text>
                        {/* add star rating here */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                            {[...Array(5)].map((_, index) => (
                                <Ionicons
                                    key={index}
                                    name={index < user?.rating ? 'star' : 'star-outline'}
                                    size={20}
                                    color={COLORS.primary}
                                    style={{ marginRight: 5 }}
                                />
                            ))}
                            <Text style={{ fontSize: 16, color: COLORS.blackLight }}>4.8</Text>
                        </View>
                        {/* Right side content */}
                    </View>
                </View>
                <View style={{ marginHorizontal: 35, marginVertical: 10, paddingHorizontal: 20, borderRadius: 20, borderWidth: 1, borderColor: COLORS.blackLight }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingVertical: 20 }}>
                        <View style={{ alignItems: 'center', flex: 1 }}>
                            <Text style={{ fontSize: 18, color: colors.title, fontWeight: 'bold' }}>{user?.borrowingsCount || 0}</Text>
                            <Text style={{ fontSize: 14, color: colors.text }}>Borrowings</Text>
                        </View>
                        <View style={{ width: 2, backgroundColor: COLORS.blackLight, marginHorizontal: 10 }} />
                        <View style={{ alignItems: 'center', flex: 1 }}>
                            <Text style={{ fontSize: 18, color: colors.title, fontWeight: 'bold' }}>{user?.lendingsCount || 0}</Text>
                            <Text style={{ fontSize: 14, color: colors.text }}>Lendings</Text>
                        </View>
                        <View style={{ width: 2, backgroundColor: COLORS.blackLight, marginHorizontal: 10 }} />
                        <View style={{ alignItems: 'center', flex: 1 }}>
                            <Text style={{ fontSize: 18, color: colors.title, fontWeight: 'bold' }}>{user?.reviewsCount || 0}</Text>
                            <Text style={{ fontSize: 14, color: colors.text }}>Reviews</Text>
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
                            <Ionicons name='heart' size={30} color={colors.title} />
                        </View>
                        <Text style={{ fontSize: 16, color: colors.title, fontWeight: 'bold' }}>Favorites</Text>
                    </View>
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
                        onPress={() => dispatch(openDrawer())}
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
                                {user?.accountType === 'borrower' ? 'Switch to Lender Profile' : 'Switch to Borrower Profile'}
                            </Text>
                        </TouchableOpacity>
                        {
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
                        }
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