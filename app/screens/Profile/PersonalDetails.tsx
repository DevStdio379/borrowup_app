import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, Platform, Alert } from 'react-native'
import { useNavigation, useTheme } from '@react-navigation/native';
import Header from '../../layout/Header';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { COLORS } from '../../constants/theme';
import { useUser } from '../../context/UserContext';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { set } from 'date-fns';
import { RootStackParamList } from '../../navigation/RootStackParamList';
import { StackScreenProps } from '@react-navigation/stack';

type PersonalDetailsScreenProps = StackScreenProps<RootStackParamList, 'PersonalDetails'>;

const PersonalDetails = ({ navigation }: PersonalDetailsScreenProps) => {

    const theme = useTheme();
    const { colors }: { colors: any } = theme;
    const { user, updateUserData } = useUser();
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    useEffect(() => {
        setSelectedImage(user?.profileImageUrl ?? null);
    }, []);

    const selectImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Required', 'You need to grant gallery access to select image.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: false, // Set to false to allow only one image selection
            quality: 1,
        });

        if (!result.canceled) {
            const selectedImage = result.assets[0].uri; // Get the URI of the selected image
            setSelectedImage(selectedImage); // Set the selected image as the main preview
            if (user?.uid) {
                await updateUserData(user.uid, { profileImageUrl: selectedImage }); // Update the user profile image
            }
        }
    };

    const takePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Required', 'You need to grant camera access to take a photo.');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
        });

        if (!result.canceled) {
            const selectedImage = result.assets[0].uri; // Get the URI of the taken photo
            setSelectedImage(selectedImage); // Set the taken photo as the main preview
        }
    };

    const handleProfileAttributeClick = (profileAttribute: { attributeName: string }) => {
        navigation.navigate('EditAttributes', { profileAttribute });
    };

    return (
        <View style={{ backgroundColor: colors.background, flex: 1 }}>
            <Header
                title='Personal Details'
                leftIcon='back'
                titleRight
            />
            <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 15, marginBottom: 50 }}>
                <View style={[GlobalStyleSheet.container, { backgroundColor: theme.dark ? 'rgba(255,255,255,.1)' : colors.background, marginTop: 10, borderRadius: 15 }]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
                        <View style={{}}>
                            <View style={{
                                borderWidth: 2,
                                borderColor: COLORS.primary,
                                height: 90,
                                width: 90,
                                borderRadius: 50,
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {selectedImage ? (
                                    <Image source={{ uri: selectedImage }} style={{ height: 90, width: 90, borderRadius: 45 }} />
                                ) : (
                                    <Ionicons name="person-outline" size={24} color={COLORS.black} />
                                )}
                            </View>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => {
                                    Alert.alert(
                                        'Select Image',
                                        'Choose an option',
                                        [
                                            { text: 'Camera', onPress: () => takePhoto() },
                                            { text: 'Gallery', onPress: () => selectImage() },
                                            { text: 'Cancel', style: 'cancel' }
                                        ]
                                    );
                                }}
                                style={{
                                    height: 42,
                                    width: 42,
                                    borderRadius: 40,
                                    backgroundColor: COLORS.card,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 60
                                }}
                            >
                                <View style={{ height: 36, width: 36, borderRadius: 36, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.primary }}>
                                    <Ionicons name="pencil-outline" size={16} color={COLORS.white} />
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View>
                            <Text style={[{ fontSize: 19, color: colors.title }]}>{user?.userName}</Text>
                            <Text style={[{ fontSize: 14, color: colors.text }]}>{user?.isActive === true ? 'active' : 'inactive'}</Text>
                        </View>
                    </View>
                </View>
                <View style={[GlobalStyleSheet.container, { marginTop: 10, paddingVertical: 10, borderRadius: 15 }]}>
                    <Text style={{ fontSize: 16, color: COLORS.blackLight, fontWeight: 'bold' }}>About You</Text>
                    <View style={{ marginBottom: 15, marginTop: 30 }}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => navigation.navigate('EditAttributes', { profileAttribute: { attributeName: 'username' } })}>
                            <View style={[GlobalStyleSheet.flexcenter, { width: '100%', gap: 20, justifyContent: 'space-between', marginBottom: 15, alignItems: 'flex-start' }]} >
                                <Text style={{ fontSize: 16, color: colors.title, fontWeight: 'bold' }}>Username</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                    <Text style={{ fontSize: 16, color: colors.title, fontWeight: 'bold' }}>{user?.userName ? user?.userName : 'Unregistered'}</Text>
                                    <Ionicons name="chevron-forward-outline" size={24} color={colors.title} />
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{ marginBottom: 15 }}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => navigation.navigate('EditAttributes', { profileAttribute: { attributeName: 'firstName' } })}>
                            <View style={[GlobalStyleSheet.flexcenter, { width: '100%', gap: 20, justifyContent: 'space-between', marginBottom: 15, alignItems: 'flex-start' }]} >
                                <Text style={{ fontSize: 16, color: colors.title, fontWeight: 'bold' }}>First Name</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                    <Text style={{ fontSize: 16, color: user?.firstName ? COLORS.title : COLORS.blackLight, fontWeight: 'bold' }}>{user?.firstName ? user?.firstName : 'Add your first name'}</Text>
                                    <Ionicons name="chevron-forward-outline" size={24} color={user?.firstName ? COLORS.title : COLORS.blackLight} />
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{ marginBottom: 15 }}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => navigation.navigate('EditAttributes', { profileAttribute: { attributeName: 'lastName' } })}>
                            <View style={[GlobalStyleSheet.flexcenter, { width: '100%', gap: 20, justifyContent: 'space-between', marginBottom: 15, alignItems: 'flex-start' }]} >
                                <Text style={{ fontSize: 16, color: colors.title, fontWeight: 'bold' }}>Last Name</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                    <Text style={{ fontSize: 16, color: user?.lastName ? COLORS.title : COLORS.blackLight, fontWeight: 'bold' }}>{user?.lastName ? user?.lastName : 'Add your last name'}</Text>
                                    <Ionicons name="chevron-forward-outline" size={24} color={user?.lastName ? COLORS.title : COLORS.blackLight} />
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{ marginBottom: 15 }}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => navigation.navigate('EditAttributes', { profileAttribute: { attributeName: 'email' } })}>
                            <View style={[GlobalStyleSheet.flexcenter, { width: '100%', gap: 20, justifyContent: 'space-between', marginBottom: 15, alignItems: 'flex-start' }]} >
                                <Text style={{ fontSize: 16, color: colors.title, fontWeight: 'bold' }}>Email</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                    <Text style={{ fontSize: 16, color: user?.email ? COLORS.title : COLORS.blackLight, fontWeight: 'bold' }}>{user?.email ? user?.email : 'Unregistered'}</Text>
                                    <Ionicons name="chevron-forward-outline" size={24} color={user?.email ? COLORS.title : COLORS.blackLight} />
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{ marginBottom: 15 }}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => navigation.navigate('EditAttributes', { profileAttribute: { attributeName: 'phoneNumber' } })}>
                            <View style={[GlobalStyleSheet.flexcenter, { width: '100%', gap: 20, justifyContent: 'space-between', marginBottom: 15, alignItems: 'flex-start' }]} >
                                <Text style={{ fontSize: 16, color: colors.title, fontWeight: 'bold' }}>Phone Number</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                    <Text style={{ fontSize: 16, color: user?.phoneNumber ? COLORS.title : COLORS.blackLight, fontWeight: 'bold' }}>{user?.phoneNumber ? user?.phoneNumber : 'Add your phone number'}</Text>
                                    <Ionicons name="chevron-forward-outline" size={24} color={user?.phoneNumber ? COLORS.title : COLORS.blackLight} />
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

export default PersonalDetails