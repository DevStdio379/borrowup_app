import { View, Text, SafeAreaView, TouchableOpacity, Image, ScrollView, Alert } from 'react-native'
import React, { useState } from 'react'
import { COLORS } from '../../constants/theme'
import { GlobalStyleSheet } from '../../constants/StyleSheet'
import { useTheme } from '@react-navigation/native'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { StackScreenProps } from '@react-navigation/stack'
import { RootStackParamList } from '../../navigation/RootStackParamList'
import Input from '../../components/Input/Input'

import { useUser, User } from '../../context/UserContext'
import { createUserWithEmailAndPassword } from "firebase/auth"
// import { auth } from '../../services/firebaseConfig'

type SignUpScreenProps = StackScreenProps<RootStackParamList, 'SignUp'>;

const SignUp = ({ navigation }: SignUpScreenProps) => {

    const theme = useTheme();
    const { colors }: { colors: any } = theme;

    const [isFocused, setisFocused] = useState(false);
    const [isFocused2, setisFocused2] = useState(false);
    const [isFocused3, setisFocused3] = useState(false);

    const { createUser } = useUser();
    const [username, setUserName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    // sign up with email and password
    const handleSignUp = async () => {
        // try {
        //     // Firebase authentication: create user profile
        //     const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        //     const user = userCredential.user;

        //     const userData: User = {
        //         uid: user.uid,
        //         email: user.email || '',
        //         userName: username,
        //         isActive: true,
        //         firstName: '',
        //         lastName: '',
        //         phoneNumber: '',
        //         accountType: 'borrower',
        //         createAt: new Date(),
        //         updatedAt: new Date(),
        //     };

        //     // Call the context function to create the user in Firestore and update context
        //     await createUser(userData);

        //     Alert.alert("Success!", "Account created successfully.");
        //     navigation.navigate('DrawerNavigation', { screen: 'Home' });
        // } catch (error: any) {
        //     Alert.alert("Error", error.message);
        // }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.card }}>
            <View style={[GlobalStyleSheet.container, { paddingVertical: 30, paddingHorizontal: 30 }]}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.5}
                    style={{
                        height: 46,
                        width: 46,
                        borderRadius: 10,
                        borderWidth: 2,
                        borderColor: COLORS.blackLight,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#F6F6F6',
                        zIndex: 99
                    }}
                >
                    <Ionicons name='chevron-back-outline' size={24} color={COLORS.title} />
                </TouchableOpacity>
            </View>
            <ScrollView style={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
                <View style={[GlobalStyleSheet.container, { flexGrow: 1, paddingBottom: 0, paddingHorizontal: 30, paddingTop: 0 }]}>
                    <View>
                        <View style={{ marginBottom: 30 }}>
                            <Text style={{ fontSize: 24, color: COLORS.title, marginBottom: 5, fontWeight: 'bold' }}>Hello! Register to get {'\n'}started</Text>
                        </View>
                        <View style={[GlobalStyleSheet.container, { padding: 0 }]}>
                            <Text style={{ fontSize: 14, color: '#8A8A8A' }}>Username</Text>
                        </View>
                        <View style={{ marginBottom: 20, marginTop: 0 }}>
                            <Input
                                onFocus={() => setisFocused(true)}
                                onBlur={() => setisFocused(false)}
                                onChangeText={setUserName}
                                isFocused={isFocused}
                                inputBorder
                            />
                        </View>
                        <View style={[GlobalStyleSheet.container, { padding: 0 }]}>
                            <Text style={{ fontSize: 14, color: '#8A8A8A' }}>Email</Text>
                        </View>
                        <View style={{ marginBottom: 20, marginTop: 0 }}>
                            <Input
                                onFocus={() => setisFocused2(true)}
                                onBlur={() => setisFocused2(false)}
                                backround={colors.card}
                                onChangeText={setEmail}
                                isFocused={isFocused2}
                                inputBorder
                            />
                        </View>
                        <View style={[GlobalStyleSheet.container, { padding: 0 }]}>
                            <Text style={{ fontSize: 14, color: '#8A8A8A' }}>Password</Text>
                        </View>
                        <View style={{ marginBottom: 10, marginTop: 0 }}>
                            <Input
                                onFocus={() => setisFocused3(true)}
                                onBlur={() => setisFocused3(false)}
                                backround={colors.card}
                                onChangeText={setPassword}
                                isFocused={isFocused3}
                                type={'password'}
                                inputBorder
                            />
                        </View>
                    </View>
                    <View style={{ marginTop: 30 }}>
                        <TouchableOpacity
                            onPress={() => handleSignUp()}
                            style={{ backgroundColor: COLORS.primary, borderRadius: 20, padding: 15, alignItems: 'center' }}
                        >
                            <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Register</Text>
                        </TouchableOpacity>
                        <View style={{ marginTop: 10 }}>
                            <Text style={{ fontSize: 14, color: theme.dark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)', textAlign: 'center' }}>By tapping “Sign Up” you accept our <Text style={{ marginBottom: 5, fontSize: 14, color: COLORS.primary }}>terms</Text> and <Text style={{ marginBottom: 5, fontSize: 14, color: COLORS.primary }}>condition</Text></Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>
                        <View style={{ flex: 1, height: 2, backgroundColor: '#ddd' }} />
                        <Text style={{ marginHorizontal: 10, fontSize: 16, color: '#666' }}>Or Register with</Text>
                        <View style={{ flex: 1, height: 2, backgroundColor: '#ddd' }} />
                    </View>
                    <View style={{ alignItems: 'center', marginTop: 30 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                            <TouchableOpacity style={{
                                borderRadius: 12,
                                padding: 15,
                                borderColor: COLORS.blackLight,
                                borderWidth: 2,
                                alignItems: 'center',
                                width: 100,
                                height: 60,
                                justifyContent: 'center',
                                shadowColor: '#000',
                                shadowOpacity: 0.1,
                                shadowRadius: 8,
                                marginHorizontal: 10,
                                backgroundColor: '#F6F6F6',
                            }}>
                                <Image
                                    source={{ uri: 'https://cdn-icons-png.flaticon.com/512/124/124010.png' }}
                                    style={{ width: 32, height: 32, resizeMode: 'contain' }}
                                />
                            </TouchableOpacity>

                            <TouchableOpacity style={{
                                borderRadius: 12,
                                padding: 15,
                                borderColor: COLORS.blackLight,
                                borderWidth: 2,
                                alignItems: 'center',
                                width: 100,
                                height: 60,
                                justifyContent: 'center',
                                shadowColor: '#000',
                                shadowOpacity: 0.1,
                                shadowRadius: 8,
                                marginHorizontal: 10,
                                backgroundColor: '#F6F6F6',
                            }} onPress={() => { }}>
                                <Image
                                    source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2991/2991148.png' }}
                                    style={{ width: 32, height: 32, resizeMode: 'contain' }}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity style={{
                                borderRadius: 12,
                                padding: 15,
                                borderColor: COLORS.blackLight,
                                borderWidth: 2,
                                alignItems: 'center',
                                width: 100,
                                height: 60,
                                justifyContent: 'center',
                                shadowColor: '#000',
                                shadowOpacity: 0.1,
                                shadowRadius: 8,
                                marginHorizontal: 10,
                                backgroundColor: '#F6F6F6',
                            }}>
                                <Image
                                    source={{ uri: 'https://cdn-icons-png.flaticon.com/512/831/831276.png' }}
                                    style={{ width: 32, height: 32, resizeMode: 'contain' }}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View style={{ marginBottom: 15, marginTop: 20, flexDirection: 'row', justifyContent: 'center' }}>
                    <Text style={{ color: colors.title, fontSize: 16, textAlign: 'center' }}>Already have an account?</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('SignIn')} activeOpacity={0.5}>
                        <Text style={{ fontSize: 16, color: COLORS.primary, fontWeight: 'bold' }}> Login Now</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default SignUp
