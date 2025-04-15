import React from 'react';
import { View, Text, FlatList, ScrollView, RefreshControl, Touchable, TouchableOpacity } from 'react-native';
import { COLORS } from '../../constants/theme';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootStackParamList';
import { useDispatch, useSelector } from 'react-redux';
import Cardstyle4 from '../../components/Card/Cardstyle4';
import { Product } from '../../services/ProductServices';
import { addTowishList } from '../../redux/reducer/wishListReducer';
import { useUser } from '../../context/UserContext';
import { addFavouriteToFirestore, removeFavouriteFromFirestore } from '../../services/FavouriteServices';

type FavouriteCollectionScreenProps = StackScreenProps<RootStackParamList, 'FavouriteCollection'>

const Map = ({ navigation }: FavouriteCollectionScreenProps) => {

  const wishList = useSelector((state: any) => state.wishList.wishList);
  const dispatch = useDispatch();

  const addItemToWishList = async (data: any) => {
    if (!user) return;

    const existingItem = wishList.find((item: any) => item.id === data.id);
    
    if (existingItem) {
      console.log('Item already in wishlist:', data);
      dispatch(addTowishList({ ...data, quantity: existingItem.quantity + 1 }));
      await removeFavouriteFromFirestore(user.uid, data.id);
    } else {
      dispatch(addTowishList(data));
      console.log('Adding to wishlist:', data);
      await addFavouriteToFirestore(user.uid, data.id);
    }
  }

  const { user } = useUser();

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
      {wishList.length > 0 ? (
        <View style={{ paddingTop: 10, paddingHorizontal: 20 }}>
          <FlatList
            data={wishList}
            refreshControl={
              <RefreshControl
                refreshing={false}
                onRefresh={() => {
                  // Handle refresh logic here
                }}
              />
            }
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: 'flex-start', marginBottom: 10, gap: 10 }}
            renderItem={({ item }) => (
              <Cardstyle4
                id={item.id}
                imageUrl={item.image}
                price={item.price}
                title={item.title}
                onPress5={() => addItemToWishList(item)}
              />
            )}
          />
        </View>
      ) : (
        <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
          <Text>No product saved</Text>
        </View>
      )}
    </View>
  );
};
export default Map;
