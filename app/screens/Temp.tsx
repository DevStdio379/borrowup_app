import { View, Text, ScrollView, TouchableOpacity, Image, Linking, Alert } from 'react-native'
import React from 'react'
import { useTheme } from '@react-navigation/native';
import Header from '../layout/Header';
import { IMAGES } from '../constants/Images';
import { GlobalStyleSheet } from '../constants/StyleSheet';
import { COLORS } from '../constants/theme';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/RootStackParamList';
import axios from 'axios';
import { useStripe } from '@stripe/stripe-react-native';

type ChatScreenProps = StackScreenProps<RootStackParamList, 'Temp'>

export const Temp = ({ navigation }: ChatScreenProps) => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  
  const handleCreateAccount = async () => {
    try {
      const response = await axios.post(
        'https://us-central1-tags-1489a.cloudfunctions.net/api/create-connected-account',
        { email: 'user@example.com' }, // You should pass the actual logged-in user email
        { headers: { 'Content-Type': 'application/json' } }
      );

      const { url } = response.data;

      if (url) {
        Linking.openURL(url); // opens Stripe onboarding link
      } else {
        Alert.alert('Error', 'No onboarding URL returned.');
      }
    } catch (error: any) {
      console.error(error);
      Alert.alert('Error', error.message || 'Failed to create Stripe account.');
    }
  };

  const handlePaymentSheet = async () => {
    try {
      const response = await axios.post(
        'https://us-central1-tags-1489a.cloudfunctions.net/api/payment-sheet',
        {
          amount: 1099,
          currency: 'GBP',
          connectedAccountId: 'acct_1RiaVN4gRYsyHwtX', // replace with real account
        }
      );

      const {
        paymentIntent,
        ephemeralKey,
        customer,
        publishableKey,
      } = response.data;

      // Step 1: Initialize the Payment Sheet
      const initResponse = await initPaymentSheet({
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: paymentIntent,
        merchantDisplayName: 'BorrowUp',
        allowsDelayedPaymentMethods: true,
      });

      if (initResponse.error) {
        Alert.alert('Error', initResponse.error.message);
        return;
      }

      // Step 2: Present the Payment Sheet
      const result = await presentPaymentSheet();

      if (result.error) {
        Alert.alert('Payment failed', result.error.message);
      } else {
        Alert.alert('Success', 'Payment complete!');
      }
    } catch (error: any) {
      console.error('Payment Sheet Error:', error.response?.data || error.message);
      Alert.alert('Error', error.response?.data?.error || 'Failed to load payment sheet.');
    }
  };


  
  return (
    <View style={{ backgroundColor: COLORS.background, flex: 1 }}>
      <TouchableOpacity
        onPress={handleCreateAccount}
        style={{ padding: 10, marginLeft: 10, marginTop: 10 }}>
        <Text style={{ color: COLORS.black, fontSize: 16 }}>Create Stripe Account</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handlePaymentSheet} style={{ padding: 12, backgroundColor: '#ddd', borderRadius: 8 }}>
        <Text style={{ color: COLORS.black, fontSize: 16 }}>Present Payment Sheet</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Temp