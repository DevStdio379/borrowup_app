import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { COLORS } from '../../constants/theme';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootStackParamList';
import { useDispatch, useSelector } from 'react-redux';
import Cardstyle4 from '../../components/Card/Cardstyle4';
import { Product } from '../../services/ProductServices';
import { addTowishList } from '../../redux/reducer/wishListReducer';

type FavouriteCollectionScreenProps = StackScreenProps<RootStackParamList, 'FavouriteCollection'>

const Map = ({ navigation }: FavouriteCollectionScreenProps) => {

  const wishList = useSelector((state: any) => state.wishList.wishList);
  const dispatch = useDispatch();

  const addItemToWishList = (data: any) => {
    dispatch(addTowishList({
      id: data.id,
      image: data.imageUrls[0],
      title: data.title,
      price: data.lendingRate,
      brand: data.ownerID,
    } as any));
  }

  return (
    <View style={{ backgroundColor: COLORS.background, flex: 1 }}>
      <Text>READY TO EJECT EXPO</Text>
      <View>
        {wishList.length > 0 ? (
          <View>
            <FlatList
              data={wishList}
              keyExtractor={(item) => item.id.toString()}
              numColumns={2}
              renderItem={({ item }) => (
                <View style={{ flex: 1, margin: 5 }}>
                  <Cardstyle4
                    id={item.id}
                    imageUrl={item.image}
                    price={item.price}
                    title={item.title}
                    onPress5={() => addItemToWishList(item)}
                  />
                </View>
              )}
            />
          </View>
        ) : (
          <Text>Your wish list is empty.</Text>
        )}
      </View>
    </View>
  );
};
export default Map;
