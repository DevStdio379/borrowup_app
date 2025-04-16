import React, { useEffect } from 'react';
import { View, Text, FlatList, ScrollView, RefreshControl, Touchable, TouchableOpacity } from 'react-native';
import { COLORS } from '../../constants/theme';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootStackParamList';
import Cardstyle4 from '../../components/Card/Cardstyle4';
import { useUser } from '../../context/UserContext';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { fetchFavorites } from '../../redux/favoriteSlice';

type FavouriteCollectionScreenProps = StackScreenProps<RootStackParamList, 'FavouriteCollection'>

const Map = ({ navigation }: FavouriteCollectionScreenProps) => {

  const { user } = useUser();
  const dispatch = useDispatch<AppDispatch>();
  const { favorites, loading } = useSelector((state: RootState) => state.favorites);

  useEffect(() => {
    dispatch(fetchFavorites(user?.uid || ''));
  }, [dispatch, user?.uid]);

  if (loading) return <Text style={{ textAlign: 'center', marginTop: 50 }}>Loading...</Text>;

  if (!favorites.length) return <Text style={{ textAlign: 'center', marginTop: 50, fontStyle: 'italic' }}>No favorite items yet.</Text>;

  if (!user || !user.isActive) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ marginVertical: 10, fontSize: 14 }}>User is not active. Please sign in.</Text>
        <TouchableOpacity
          style={{ padding: 10, paddingHorizontal: 30, backgroundColor: COLORS.primary, borderRadius: 20 }}
          onPress={() => navigation.navigate('SignIn')}
        >
          <Text style={{ color: COLORS.white, fontSize: 16 }}>Sign In</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ backgroundColor: COLORS.background, flex: 1 }}>
      <View style={{ height: 60, borderBottomColor: COLORS.card, borderBottomWidth: 1 }}>
        <View
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8, paddingHorizontal: 5 }}>
          <View style={{ flex: 1, alignItems: 'flex-start' }}>
            {/* left header element */}
          </View>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.title, textAlign: 'center', marginVertical: 10 }}>Saved Product</Text>
          </View>
          <View style={{ flex: 1, alignItems: 'flex-end' }}>
            {/* right header element */}
          </View>
        </View>
      </View>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View style={{ padding: 16, marginVertical: 8, marginHorizontal: 16, backgroundColor: '#eee', borderRadius: 8 }}>
            <Text style={{ fontSize: 16 }}>Product ID: {item}</Text>
          </View>
        )}
      />
    </View>
  );
};
export default Map;
