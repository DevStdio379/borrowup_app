import React, { useState } from 'react'
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, Platform, Alert } from 'react-native'
import { useTheme } from '@react-navigation/native';
import Header from '../../layout/Header';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { IMAGES } from '../../constants/Images';
import Input from '../../components/Input/Input';
// import ImagePicker from 'react-native-image-crop-picker';
import { COLORS } from '../../constants/theme';
import { useUser } from '../../context/UserContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootStackParamList';
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../services/firebaseConfig";

type EditAttributesScreenProps = StackScreenProps<RootStackParamList, 'EditAttributes'>;

const EditAttributes = ({ navigation, route }: EditAttributesScreenProps) => {
    const { profileAttribute } = route.params
    const theme = useTheme();
    const { colors }: { colors: any } = theme;
    const { user, updateUserData } = useUser();

    const [isFocused, setisFocused] = useState(false)
    const [attributeData, setAttributeData] = useState<string>('');

    // attribute name placeholder
    const attribute =
        profileAttribute.attributeName.toLowerCase() === 'username' ? 'Username' :
            profileAttribute.attributeName.toLowerCase() === 'firstname' ? 'First Name' :
                profileAttribute.attributeName.toLowerCase() === 'lastname' ? 'Last Name' :
                    profileAttribute.attributeName.toLowerCase() === 'email' ? 'Email' :
                        profileAttribute.attributeName.toLowerCase() === 'phonenumber' ? 'Phone Number' : '';


    const initialAttribute = user?.isActive === true ?
        profileAttribute.attributeName.toLowerCase() === 'username' ? `${user?.userName}` :
            profileAttribute.attributeName.toLowerCase() === 'firstname' ? `${user?.firstName}` :
                profileAttribute.attributeName.toLowerCase() === 'lastname' ? `${user?.lastName}` :
                    profileAttribute.attributeName.toLowerCase() === 'email' ? `${user?.email}` :
                        profileAttribute.attributeName.toLowerCase() === 'phonenumber' ? `${user?.phoneNumber}` : ''
        : null;

    const handleUpdate = async () => {
        try {
            if (user?.uid) {
                await updateUserData(user.uid, { [profileAttribute.attributeName]: attributeData });
                navigation.goBack(); // Navigation after update
            } else {
                console.error("User ID is undefined");
            }
        } catch (error) {
            console.error("Error updating user:", error);
        }
    };

    return (
        <View style={{ backgroundColor: colors.background, flex: 1 }}>
            <Header
                title={`Edit ${attribute}`}
                leftIcon='back'
                saveButton
            />
            <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20, marginBottom: 50 }}>
                <Text style={{ fontSize: 16, color: colors.title, fontWeight: 'bold', marginBottom: 15 }}>{attribute}</Text>
                <Input
                    onFocus={() => setisFocused(true)}
                    onBlur={() => setisFocused(false)}
                    isFocused={isFocused}
                    onChangeText={setAttributeData}
                    backround={colors.card}
                    style={{ borderRadius: 12, backgroundColor: COLORS.input }}
                    inputicon
                    placeholder={initialAttribute === null ? `Enter your ${attribute}` : initialAttribute}
                    keyboardType={attribute === 'Phone Number' ? 'phone-pad' : 'default'}
                />
            </ScrollView>
            <View style={[GlobalStyleSheet.container]}>
                <TouchableOpacity
                    style={{ backgroundColor: COLORS.primary, borderRadius: 50, padding: 15, alignItems: 'center' }}
                    onPress={() => {
                        attributeData ? handleUpdate() : Alert.alert("Error", "Invalid attribute data")
                    }}
                >
                    <Text style={{ color: COLORS.card, fontWeight: 'bold' }}>Update Profile</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default EditAttributes