import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, TextInput, StyleSheet, Animated, FlatList, RefreshControl } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { COLORS, SIZES } from '../../constants/theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch } from 'react-redux';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootStackParamList';
import { addTowishList } from '../../redux/reducer/wishListReducer';
import Cardstyle4 from '../../components/Card/Cardstyle4';
import { useUser } from '../../context/UserContext';
import { fetchProducts, Product } from '../../services/ProductServices';
import { Banner, fetchBanners } from '../../services/BannerServices';
import TabButtonStyleHome from '../../components/Tabs/TabButtonStyleHome';
import Carousel from '../../components/Carousel';

type HomeScreenProps = StackScreenProps<RootStackParamList, 'Home'>

export const Home = ({ navigation }: HomeScreenProps) => {

    // const wishList = useSelector((state:any) => state.wishList.wishList);
    const [products, setProducts] = useState<Product[]>([]);
    const [banners, setBanners] = useState<Banner[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [refreshing, setRefreshing] = useState(false);
    const scrollY = useRef(0); // Track scroll position

    const dispatch = useDispatch();

    const theme = useTheme();
    const { colors }: { colors: any; } = theme;
    const { user } = useUser();

    const handleProductClick = (productId: string) => {
        console.log('Product ID: ', productId);
        navigation.navigate('ProductDetails', { productId });
    };

    const renderItem = ({ item }: { item: any }) => {
        if (item.empty) {
            // Render an invisible spacer if the item is marked as "empty"
            return <View style={{ flex: 1, margin: 5, backgroundColor: 'transparent' }} />;
        }

        return (
            <View style={{ flex: 1, margin: 5 }}>
                <Cardstyle4
                    id={item.id}
                    imageUrl={item.imageUrls[0]}
                    price={item.lendingRate}
                    ownerID={item.ownerID}
                    description={item.description}
                    location={item.location}
                    title={item.title}
                    onPress={() => handleProductClick(item.id)}
                    onPress5={() => addItemToWishList(item)}
                    product={true}
                />
            </View>
        );
    };

    const renderItemHorizontal = ({ item }: { item: any }) => {
        if (item.empty) {
            // Render an invisible spacer if the item is marked as "empty"
            return <View style={{ flex: 1, margin: 5, backgroundColor: 'transparent' }} />;
        }
        return (
            <View style={{ flex: 1, margin: 5 }} >
                <Cardstyle4
                    id={item.id}
                    imageUrl={item.imageUrls[0]}
                    price={item.rate}
                    ownerID={item.ownerID}
                    description={item.description}
                    location={item.addressID}
                    title={item.title}
                    onPress={() => handleProductClick(item.id)}
                    onPress5={() => addItemToWishList(item)}
                    product={true}
                />
            </View>
        );
    };

    // Fetch products from Firestore using the separated model function
    const getProducts = async () => {
        try {
            const productList = await fetchProducts();
            setProducts(productList);
        } catch (error) {
            console.error('Error fetching products: ', error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch products from Firestore using the separated model function
    const getBanners = async () => {
        try {
            const bannerList = await fetchBanners();
            setBanners(bannerList);
        } catch (error) {
            console.error('Error fetching banners: ', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getProducts();
        getBanners();
    }, []);

    useEffect(() => {
        if (products) {
            setProducts(products);
        }
    }, [products]);

    const onRefresh = useCallback(() => {
        if (scrollY.current > 0) { // Prevent refresh if not at the top
            setRefreshing(true);
            getProducts().then(() => setRefreshing(false));
        }
    }, []);

    const addItemToWishList = (data: any) => {
        dispatch(addTowishList({
            id: data.id,
            image: data.imageUrl,
            title: data.productName,
            price: data.rate,
            brand: data.ownerID,
        } as any));
    }

    const scrollViewHome = useRef<any>(null);

    // Local machine to repo migration


    const buttons = ['All', 'Electronic Gadgets', 'DIY & Hand Tools', 'Sport Equipments', 'Gadgets', 'Party & Celebrations', 'Cooking', 'Outdoors', 'Others'];

    const scrollX = useRef(new Animated.Value(0)).current;
    const onCLick = (i: any) => scrollViewHome.current.scrollTo({ x: i * SIZES.width });

    return (
        <View style={{ backgroundColor: COLORS.background, flex: 1 }}>
            <View style={[GlobalStyleSheet.container, { paddingHorizontal: 30, padding: 0, paddingTop: 50, paddingBottom: 10 }]}>
                <View style={[GlobalStyleSheet.flex, { paddingBottom: 10 }]}>
                    <View>
                        <Text style={{ fontSize: 30, fontWeight: 'bold', color: colors.title }}>Hello {user?.userName}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity
                            onPress={() => { }}
                            activeOpacity={0.5}
                            style={[GlobalStyleSheet.background3, {}]}
                        >
                            <Ionicons name='search' size={28} color={COLORS.black} />
                        </TouchableOpacity>
                    </View>
                </View>
                <TabButtonStyleHome
                    buttons={buttons}
                    onClick={onCLick}
                    scrollX={scrollX}
                />
            </View>
            <View style={[GlobalStyleSheet.container, { paddingHorizontal: 5, padding: 0, paddingTop: 0, paddingBottom: 10 }]}>
                <ScrollView
                    ref={scrollViewHome}
                    //ref={(e:any) => {console.log(e)}}
                    horizontal
                    pagingEnabled
                    scrollEventThrottle={16}
                    scrollEnabled={false}
                    decelerationRate="fast"
                    showsHorizontalScrollIndicator={false}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                        { useNativeDriver: false },
                    )}
                >
                    {buttons.map((button, index) => {
                        if (button === 'All') {
                            return (
                                <ScrollView
                                    showsVerticalScrollIndicator={false}
                                    style={[styles.tabBody]}
                                    key={index}
                                    refreshControl={
                                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                                    }
                                >
                                    <View style={[GlobalStyleSheet.container, { paddingHorizontal: 0, paddingTop: 30, paddingBottom: 10 }]}>
                                        <View style={[GlobalStyleSheet.flex, { paddingHorizontal: 15 }]}>
                                            <Text style={[styles.brandsubtitle3, { fontSize: 24, fontWeight: 'bold', color: colors.title }]}>What's new</Text>
                                            <TouchableOpacity
                                            // onPress={() => navigation.navigate('Products')}
                                            >
                                                <Text style={[styles.brandsubtitle3, { fontSize: 16, color: COLORS.blackLight }]}>More</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <Carousel data={banners} />
                                    <View style={[GlobalStyleSheet.container, { paddingHorizontal: 0, paddingTop: 0, paddingBottom: 0 }]}>
                                        <View style={[GlobalStyleSheet.flex, { paddingHorizontal: 15 }]}>
                                            <Text style={[styles.brandsubtitle3, { fontSize: 18, color: colors.title, fontWeight: 'bold' }]}>Neighborhood Offers</Text>
                                            <TouchableOpacity
                                                onPress={() => navigation.navigate('Products')}
                                            >
                                                <Text style={[styles.brandsubtitle3, { fontSize: 16, color: COLORS.blackLight }]}>More</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <View style={[GlobalStyleSheet.container]}>
                                        <FlatList
                                            data={products}
                                            renderItem={renderItemHorizontal}
                                            keyExtractor={(item) => item.id ? item.id.toString() : ''}
                                            horizontal
                                            showsHorizontalScrollIndicator={false}
                                            contentContainerStyle={[{ paddingVertical: 16 }]}
                                        />
                                    </View>
                                    <View style={[GlobalStyleSheet.container, { paddingBottom: 20 }]}>
                                        <FlatList
                                            data={products}
                                            scrollEnabled={false}
                                            renderItem={renderItem} // Assign renderItem function
                                            keyExtractor={(item) => item.id?.toString() ?? ''} // Unique key for each item
                                            numColumns={2} // Set number of columns to 2
                                            columnWrapperStyle={{ justifyContent: 'space-between' }} // Space between columns
                                            showsVerticalScrollIndicator={false} // Hide the scroll indicator
                                            contentContainerStyle={{ paddingBottom: 150 }} // Ensure space at the bottom
                                        />
                                    </View>
                                </ScrollView>
                            );
                        }
                        else {
                            return (
                                <ScrollView
                                    showsVerticalScrollIndicator={false}
                                    style={[styles.tabBody]}
                                    key={index}
                                    refreshControl={
                                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                                    }
                                >
                                    <View style={[GlobalStyleSheet.container, { paddingBottom: 20 }]}>
                                        <FlatList
                                            data={products.filter(product => product.category === button)}
                                            scrollEnabled={false}
                                            renderItem={renderItem} // Assign renderItem function
                                            keyExtractor={(item) => item.id?.toString() ?? ''} // Unique key for each item
                                            numColumns={2} // Set number of columns to 2
                                            columnWrapperStyle={{ justifyContent: 'space-between' }} // Space between columns
                                            showsVerticalScrollIndicator={false} // Hide the scroll indicator
                                            contentContainerStyle={{ paddingBottom: 150 }} // Ensure space at the bottom
                                        />
                                    </View>
                                </ScrollView>
                            )
                        }
                    })}

                </ScrollView>

            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    profilecard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        marginRight: 10,
        marginBottom: 20
    },
    flex: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'center'
    },
    tabBody: {
        width: SIZES.width,
    },
    TextInput: {

        fontSize: 16,
        color: COLORS.title,
        height: 60,
        borderRadius: 61,
        paddingHorizontal: 40,
        paddingLeft: 30,
        borderWidth: 1,
        borderColor: '#EBEBEB',
        backgroundColor: '#FAFAFA'
    },
    brandsubtitle3: {
        fontSize: 12,
        color: COLORS.title
    },
    title3: {
        fontSize: 24,
        color: '#8ABE12',
        //textAlign:'right'
    },
    text: {
        color: 'black',
    },
    colorCardTitle: {
        fontSize: 12,
        color: COLORS.title,
        lineHeight: 20,
        textAlign: 'center'
    },
    profilecard2: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginRight: 10,
        marginBottom: 20,
    },
    arrivaldata: {
        backgroundColor: COLORS.card,
        borderRadius: 18,
        width: 199,
        paddingHorizontal: 10,
        paddingLeft: 25,
        paddingVertical: 15,
        borderWidth: 1,
        borderColor: '#EFEFEF',
        shadowColor: "rgba(4,118,78,.6)",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.34,
        shadowRadius: 18.27,
        elevation: 4,
    }
})

export default Home;
