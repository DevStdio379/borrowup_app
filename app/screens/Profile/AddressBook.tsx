import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, Platform, TextInput, FlatList } from 'react-native'
import { useNavigation, useTheme } from '@react-navigation/native';
import Header from '../../layout/Header';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { COLORS, SIZES } from '../../constants/theme';
import { useUser } from '../../context/UserContext';
import { Ionicons } from '@expo/vector-icons';
import { fetchUserAddresses } from '../../services/AddressServices';
import { RootStackParamList } from '../../navigation/RootStackParamList';
import { StackScreenProps } from '@react-navigation/stack';

type AddressBookScreenProps = StackScreenProps<RootStackParamList, 'AddressBook'>;

const AddressBook = ({ navigation }: AddressBookScreenProps) => {
  const theme = useTheme();
  const { colors }: { colors: any } = theme;
  const { user } = useUser();

  const [addresses, setAddresses] = useState<{ [key: string]: any; id: string; }[]>([]);
  const [loading, setLoading] = useState(true);

  const userId = user?.uid;
  useEffect(() => {
    const getAddresses = async () => {
      if (userId) {
        const fetchedAddresses = await fetchUserAddresses(userId);
        setAddresses(fetchedAddresses);
        setLoading(false);
      }
    };

    if (userId) getAddresses();
  }, [userId]);

  return (
    <View style={{ backgroundColor: colors.background, flex: 1 }}>
      <Header
        title='Addresss Book'
        leftIcon='back'
        titleRight
      />
      <FlatList
        data={addresses}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={() => (
          <View style={[GlobalStyleSheet.container, { marginTop: 10, paddingVertical: 10, borderRadius: 15 }]}>
            <Text style={{ fontSize: 18, color: COLORS.black, fontWeight: 'bold', marginBottom: 30 }}>My addresses</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <View style={{paddingVertical: 10}}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate('EditAttributes', { profileAttribute: { attributeName: 'username' } })}>
              <View style={[GlobalStyleSheet.flexcenter, { width: '100%', gap: 20, justifyContent: 'space-between', marginBottom: 15, alignItems: 'flex-start' }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20, width: SIZES.width * 0.8 }}>
                  <Ionicons name="location" size={24} color={colors.title} />
                  <View style={{ width: SIZES.width * 0.7 }}>
                    <Text style={{ fontSize: 16, color: colors.title, fontWeight: 'bold' }}>{item.addressName}</Text>
                    <Text style={{ fontSize: 14, color: colors.subtitle }}>{item.address}</Text>
                  </View>
                  <Ionicons name="pencil" size={20} color={colors.title} />
                </View>
              </View>
            </TouchableOpacity>
            <View style={GlobalStyleSheet.line} />
          </View>
        )}
        ListFooterComponent={() => (
          <View style={{ marginBottom: 15, marginTop: 10 }}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate('SearchAddress')}>
              <View style={[GlobalStyleSheet.flexcenter, { width: '100%', gap: 20, justifyContent: 'space-between', marginBottom: 15, alignItems: 'flex-start' }]} >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20, width: SIZES.width * 0.8 }}>
                  <Ionicons name="add" size={26} color={colors.title} />
                  <View>
                    <Text style={{ fontSize: 16, color: colors.title, fontWeight: 'bold' }}>Add a new address</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: 50 }}
      />
    </View>
  )
}

export default AddressBook;