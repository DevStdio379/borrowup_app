import { View, Text, ScrollView, TouchableOpacity, Image, Linking, Alert, ActivityIndicator, TextInput } from 'react-native'
import React, { useState } from 'react'
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

  const handleDepositSheet = async () => {
    try {
      const response = await axios.post(
        'https://us-central1-tags-1489a.cloudfunctions.net/api/create-deposit-intent',
        {
          amount: 2000, // deposit amount
          currency: 'GBP',
        }
      );

      const {
        paymentIntent,
        ephemeralKey,
        customer,
        publishableKey,
      } = response.data;

      const initResponse = await initPaymentSheet({
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: paymentIntent,
        merchantDisplayName: 'BorrowUp',
      });

      if (initResponse.error) {
        Alert.alert('Error', initResponse.error.message);
        return;
      }

      const result = await presentPaymentSheet();

      if (result.error) {
        Alert.alert('Deposit failed', result.error.message);
      } else {
        Alert.alert('Success', 'Deposit held!');
      }

    } catch (error: any) {
      console.error('Deposit Error:', error.response?.data || error.message);
      Alert.alert('Error', error.response?.data?.error || 'Deposit setup failed.');
    }
  };

  const handleRentalPaymentWithDeposit = async () => {
    try {
      const rentalAmount = 4000; // £40.00 in pence
      const depositAmount = 2000; // £20.00 in pence
      const currency = 'GBP';
      const connectedAccountId = 'acct_1RiaVN4gRYsyHwtX'; // Replace with Lender's real account ID

      // 1. --- Create & present rental payment sheet ---
      const rentalRes = await axios.post(
        'https://us-central1-tags-1489a.cloudfunctions.net/api/payment-sheet',
        { amount: rentalAmount, currency, connectedAccountId }
      );

      const {
        paymentIntent: rentalClientSecret,
        ephemeralKey: rentalEphemeralKey,
        customer: rentalCustomerId,
      } = rentalRes.data;

      const rentalInit = await initPaymentSheet({
        customerId: rentalCustomerId,
        customerEphemeralKeySecret: rentalEphemeralKey,
        paymentIntentClientSecret: rentalClientSecret,
        merchantDisplayName: 'BorrowUp',
      });

      if (rentalInit.error) {
        Alert.alert('Error', rentalInit.error.message);
        return;
      }

      const rentalResult = await presentPaymentSheet();
      if (rentalResult.error) {
        Alert.alert('Rental Payment Failed', rentalResult.error.message);
        return;
      }

      // 2. --- Create & present deposit sheet ---
      const depositRes = await axios.post(
        'https://us-central1-tags-1489a.cloudfunctions.net/api/create-deposit-intent',
        { amount: depositAmount, currency }
      );

      const {
        paymentIntent: depositClientSecret,
        ephemeralKey: depositEphemeralKey,
        customer: depositCustomerId,
      } = depositRes.data;

      const depositInit = await initPaymentSheet({
        customerId: depositCustomerId,
        customerEphemeralKeySecret: depositEphemeralKey,
        paymentIntentClientSecret: depositClientSecret,
        merchantDisplayName: 'BorrowUp',
      });

      if (depositInit.error) {
        Alert.alert('Error', depositInit.error.message);
        return;
      }

      const depositResult = await presentPaymentSheet();
      if (depositResult.error) {
        Alert.alert('Deposit Failed', depositResult.error.message);
      } else {
        Alert.alert('Success', 'Rental paid and deposit held successfully!');
      }

    } catch (error: any) {
      console.error('[Combined Payment Error]', error.response?.data || error.message);
      Alert.alert('Error', error.response?.data?.error || 'Something went wrong.');
    }
  };

  const handlePlatformPayment = async () => {
    try {
      // Step 1: Call your backend to create PaymentIntent for platform
      const response = await axios.post(
        'https://us-central1-tags-1489a.cloudfunctions.net/api/platform-payment',
        {
          amount: 200,        // £2.00 in pence
          currency: 'GBP',
        },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      const {
        paymentIntent,
        ephemeralKey,
        customer,
        publishableKey,
      } = response.data;

      // Step 2: Initialize the Stripe Payment Sheet
      const initResponse = await initPaymentSheet({
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: paymentIntent,
        merchantDisplayName: 'BorrowUp',
      });

      if (initResponse.error) {
        Alert.alert('Error', initResponse.error.message);
        return;
      }

      // Step 3: Present the Payment Sheet
      const result = await presentPaymentSheet();

      if (result.error) {
        Alert.alert('Payment Failed', result.error.message);
      } else {
        Alert.alert('Success', 'Your payment to BorrowUp is complete!');
      }
    } catch (error: any) {
      console.error('[Platform Payment Error]', error.response?.data || error.message);
      Alert.alert('Error', error.response?.data?.error || 'Payment failed.');
    }
  };

  const [rentalId] = useState('rental_test2'); // Normally generated dynamically
  const [connectedAccountId] = useState('acct_1RiaVN4gRYsyHwtX'); // Replace with real lender ID
  const [amount] = useState(6000); // £60.00
  const [currency] = useState('GBP');
  const [loading, setLoading] = useState(false);
  const [paymentIntentId, setPaymentIntentId] = useState('');
  const [refundAmount, setRefundAmount] = useState('');

  const handleHoldPayment = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        'https://us-central1-tags-1489a.cloudfunctions.net/api/hold-payment',
        {
          amount,
          currency,
          rentalId,
        }
      );

      const {
        paymentIntent,
        ephemeralKey,
        customer,
      } = response.data;

      const initResponse = await initPaymentSheet({
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: paymentIntent,
        merchantDisplayName: 'BorrowUp',
      });

      if (initResponse.error) {
        Alert.alert('Error', initResponse.error.message);
        setLoading(false);
        return;
      }

      const result = await presentPaymentSheet();

      if (result.error) {
        Alert.alert('Payment Failed', result.error.message);
      } else {
        Alert.alert('Success', 'Payment completed. Funds are held by BorrowUp.');
      }
    } catch (error: any) {
      console.error('[Hold Payment Error]', error.response?.data || error.message);
      Alert.alert('Error', error.response?.data?.error || 'Hold payment failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleReleasePayment = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        'https://us-central1-tags-1489a.cloudfunctions.net/api/release-to-lender',
        {
          amount,
          currency,
          connectedAccountId,
          rentalId,
        }
      );

      Alert.alert('Success', 'Funds released to Lender!');
    } catch (error: any) {
      console.error('[Release Transfer Error]', error.response?.data || error.message);
      Alert.alert('Error', error.response?.data?.error || 'Transfer failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefund = async () => {
    if (!paymentIntentId || !refundAmount) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    try {
      const amountInPence = Math.round(parseFloat(refundAmount) * 100);

      const response = await axios.post(
        'https://us-central1-tags-1489a.cloudfunctions.net/api/refund-deposit',
        {
          paymentIntentId,
          amountToRefundInPence: amountInPence,
        }
      );

      if (response.data.success) {
        Alert.alert('Success', `Refund of £${refundAmount} processed.`);
      } else {
        Alert.alert('Failed', 'Could not process the refund.');
      }
    } catch (error: any) {
      console.error('Refund error:', error);
      Alert.alert('Error', error.response?.data?.error || 'Something went wrong.');
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
      <TouchableOpacity onPress={handleDepositSheet} style={{ padding: 10, margin: 10, backgroundColor: '#ccf' }}>
        <Text style={{ fontSize: 16 }}>Hold Security Deposit</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleRentalPaymentWithDeposit} style={{ padding: 12, backgroundColor: '#6af', borderRadius: 8 }}>
        <Text style={{ fontSize: 16 }}>Pay £60: Rent + Deposit</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handlePlatformPayment}
        style={{
          padding: 14,
          borderRadius: 8,
          backgroundColor: '#4681f4',
        }}
      >
        <Text style={{ color: '#fff', fontSize: 16 }}>
          Pay £2 Protection Fee
        </Text>
      </TouchableOpacity>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ fontSize: 18, marginBottom: 20 }}>
          Simulate Rental Payment Flow
        </Text>

        <TouchableOpacity
          onPress={handleHoldPayment}
          style={{ padding: 14, backgroundColor: '#4681f4', borderRadius: 8, marginBottom: 20 }}
        >
          <Text style={{ color: 'white' }}>1️⃣ Pay & Hold Funds</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleReleasePayment}
          style={{ padding: 14, backgroundColor: '#4caf50', borderRadius: 8, marginBottom: 20 }}
        >
          <Text style={{ color: 'white' }}>2️⃣ Confirm Pickup (Release Payment)</Text>
        </TouchableOpacity>

        {loading && <ActivityIndicator size="large" color="#999" />}
      </View>
      <View style={{ padding: 20, flex: 1, justifyContent: 'center', backgroundColor: '#F9F9F9' }}>
        <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 20, color: '#000' }}>
          Refund Deposit Simulator
        </Text>

        <TextInput
          placeholder="PaymentIntent ID"
          value={paymentIntentId}
          onChangeText={setPaymentIntentId}
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            backgroundColor: '#fff',
            padding: 10,
            marginBottom: 15,
            borderRadius: 6,
          }}
        />

        <TextInput
          placeholder="Refund Amount (£)"
          value={refundAmount}
          onChangeText={setRefundAmount}
          keyboardType="decimal-pad"
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            backgroundColor: '#fff',
            padding: 10,
            marginBottom: 15,
            borderRadius: 6,
          }}
        />

        <TouchableOpacity
          onPress={handleRefund}
          style={{
            backgroundColor: '#007AFF',
            padding: 12,
            borderRadius: 8,
          }}
        >
          <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '600' }}>
            Submit Refund
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Temp