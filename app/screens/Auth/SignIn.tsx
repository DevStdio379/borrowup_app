import { View, Text, SafeAreaView, TouchableOpacity, Image, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native'
import React, { useState } from 'react';
import { COLORS, SIZES } from '../../constants/theme'
import { GlobalStyleSheet } from '../../constants/StyleSheet'
import { useTheme } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import { RootStackParamList } from '../../navigation/RootStackParamList'
import Input from '../../components/Input/Input'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../services/firebaseConfig';
import { useUser } from '../../context/UserContext';

type SignInScreenProps = StackScreenProps<RootStackParamList, 'SignIn'>;

const SignIn = ({ navigation }: SignInScreenProps) => {

    const theme = useTheme();
    const { colors }: { colors: any } = theme;
    const { fetchUser, updateUserData } = useUser();

    const [isFocused, setisFocused] = useState(false);
    const [isFocused2, setisFocused2] = useState(false);

    const [email, setEmail] = useState<string>('farizah@gmail.com');
    const [password, setPassword] = useState<string>('12345678');

    const [loading, setLoading] = useState(false);

    const handleSignIn = async () => {
        setLoading(true);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Fetch user data and update global state
            await fetchUser(user.uid);
            await updateUserData(user.uid, { 'isActive': true });
            Alert.alert("Success!", "Signed in successfully.");
            navigation.navigate('DrawerNavigation', { screen: 'Home' });
        } catch (error: any) {
            switch (error.code) {
                case "auth/invalid-email":
                    Alert.alert("Error", "The email address is invalid.");
                    break;
                case "auth/user-not-found":
                    Alert.alert("Error", "No user found with this email.");
                    break;
                case "auth/wrong-password":
                    Alert.alert("Error", "Incorrect password.");
                    break;
                default:
                    Alert.alert("Error", error.message || "An error occurred.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <View>
            <View style={[GlobalStyleSheet.container, {height: '100%', backgroundColor: COLORS.backgroundColor, paddingHorizontal: 30, justifyContent: 'center', alignItems: 'center' }]}>
                <View style={{ width: '100%' }}>
                    <View style={{ paddingTop: 80, marginBottom: 30 }}>
                        <Text style={{ color: colors.title, fontWeight: 'bold', fontSize: 30, marginBottom: 5 }}>Welcome back! Glad to see you, Again!</Text>
                    </View>
                    <Text style={{ fontSize: 14, color: '#8A8A8A' }}>Email</Text>
                    <View style={{ marginBottom: 20, marginTop: 0 }}>
                        <Input
                            onFocus={() => setisFocused(true)}
                            onBlur={() => setisFocused(false)}
                            onChangeText={setEmail}
                            isFocused={isFocused}
                            inputBorder
                        />
                    </View>
                    <Text style={{ fontSize: 14, color: '#8A8A8A' }}>Password</Text>
                    <View style={{ marginBottom: 10, marginTop: 0 }}>
                        <Input
                            onFocus={() => setisFocused2(true)}
                            onBlur={() => setisFocused2(false)}
                            backround={colors.card}
                            onChangeText={setPassword}
                            isFocused={isFocused2}
                            type={'password'}
                            inputBorder
                        />
                    </View>
                    <View style={{ marginTop: 30 }}>
                        <TouchableOpacity
                            onPress={() => handleSignIn()}
                            style={{ backgroundColor: COLORS.primary, borderRadius: 20, padding: 15, alignItems: 'center' }}
                        >
                            <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Sign In</Text>
                        </TouchableOpacity>
                        <View
                            style={[GlobalStyleSheet.flex, {
                                marginBottom: 20,
                                marginTop: 10,
                                paddingHorizontal: 10,
                                justifyContent: 'flex-start',
                                gap: 5
                            }]}
                        >
                            <Text style={{ fontSize: 14, color: colors.title }}>Forgot Password?</Text>
                            <TouchableOpacity
                                activeOpacity={0.5}
                                onPress={() => navigation.navigate('SignIn')}
                            >
                                <Text style={{ fontSize: 14, color: COLORS.primary }}>Reset here</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>
                            <View style={{ flex: 1, height: 2, backgroundColor: '#ddd' }} />
                            <Text style={{ fontSize: 14, color: COLORS.title, marginHorizontal: 10 }}>Or Login with</Text>
                            <View style={{ flex: 1, height: 2, backgroundColor: '#ddd' }} />
                        </View>
                        <View style={{ alignItems: 'center', marginTop: 30 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                                <TouchableOpacity style={{ borderRadius: 10, padding: 10, borderColor: COLORS.blackLight, borderWidth: 2, alignItems: 'center', width: SIZES.width * 0.2, height: SIZES.height * 0.07, justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8, marginHorizontal: 10, backgroundColor: '#F6F6F6' }}>
                                    <Ionicons name='logo-facebook' size={24} color={COLORS.title} />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{ borderRadius: 10, padding: 10, borderColor: COLORS.blackLight, borderWidth: 2, alignItems: 'center', width: SIZES.width * 0.2, height: SIZES.height * 0.07, justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8, marginHorizontal: 10, backgroundColor: '#F6F6F6' }}
                                    onPress={() => {
                                        setEmail('afiq379@gmail.com');
                                        setPassword('12345678');
                                    }}>
                                    <Ionicons name='logo-google' size={24} color={COLORS.primary} />
                                </TouchableOpacity>
                                <TouchableOpacity style={{ borderRadius: 10, padding: 10, borderColor: COLORS.blackLight, borderWidth: 2, alignItems: 'center', width: SIZES.width * 0.2, height: SIZES.height * 0.07, justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8, marginHorizontal: 10, backgroundColor: '#F6F6F6' }}>
                                    <Ionicons name='logo-apple' size={24} color={COLORS.title} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{ marginBottom: 15, marginTop: 20, flexDirection: 'row', justifyContent: 'center' }}>
                            <Text style={{ fontSize: 16, color: colors.title, textAlign: 'center', }}>Don't have an account?</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('SignUp')} activeOpacity={0.5}>
                                <Text style={{ fontSize: 16, color: COLORS.primary, fontWeight: 'bold' }}> Register Now</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
            {loading && (
                <View style={GlobalStyleSheet.loadingOverlay}>
                    <ActivityIndicator size="large" color={ COLORS.primary } />
                </View>
            )}
        </View>
    )
}

export default SignIn
