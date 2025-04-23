import React, { useState, useEffect } from 'react';
import { View, Text, Button, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { COLORS } from '../../constants/theme';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootStackParamList';
import { auth } from '../../services/firebaseConfig';
import { sendEmailVerification } from 'firebase/auth';
import { useUser } from '../../context/UserContext';

type AccountVerificationScreenProps = StackScreenProps<RootStackParamList, 'AccountVerification'>;

const AccountVerification = ({ navigation }: AccountVerificationScreenProps) => {
  const [loading, setLoading] = useState(false);
  const { fetchUser, updateUserData } = useUser();
  const user = auth.currentUser;

  const checkEmailVerification = async () => {
    try {
      setLoading(true);
      await user?.reload(); // refresh user object
      if (user?.emailVerified) {
        updateUserData(user.uid, { 'isVerified': true });
        Alert.alert("Success", "Your email is verified.");
        navigation.reset({
          index: 0,
          routes: [{ name: 'BottomNavigation', params: { screen: 'HomeStack' } }],
        });
      } else {
        Alert.alert("Still Not Verified", "Please check your email and try again.");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Could not check verification status.");
    } finally {
      setLoading(false);
    }
  };

  const resendEmail = async () => {
    try {
      setLoading(true);
      if (user) {
        await sendEmailVerification(user);
      } else {
        throw new Error("User is not logged in.");
      }
      Alert.alert("Email Sent", "Please check your inbox (or spam folder).");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to send email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background, padding: 20, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: COLORS.title }}>
        Verify Your Email
      </Text>
      <Text style={{ textAlign: 'center', fontSize: 16, color: COLORS.text, marginBottom: 30 }}>
        A verification link has been sent to:
        {'\n'}
        <Text style={{ fontWeight: '600' }}>{user?.email}</Text>
        {'\n\n'}
        Please verify your email and then click "Continue".
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} />
      ) : (
        <>
          <TouchableOpacity
            onPress={resendEmail}
            style={{
              backgroundColor: COLORS.primary,
              paddingVertical: 12,
              paddingHorizontal: 30,
              borderRadius: 10,
              marginBottom: 15,
            }}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Resend Verification Email</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={checkEmailVerification}
            style={{
              borderColor: COLORS.primary,
              borderWidth: 2,
              paddingVertical: 12,
              paddingHorizontal: 30,
              borderRadius: 10,
            }}
          >
            <Text style={{ color: COLORS.primary, fontWeight: 'bold', fontSize: 16 }}>Continue</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default AccountVerification;
