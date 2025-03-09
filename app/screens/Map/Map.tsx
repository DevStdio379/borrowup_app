import { useNavigation, useTheme } from '@react-navigation/native';
import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, ScrollView, Switch, Dimensions, Alert } from 'react-native';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import MapView, { Marker } from 'react-native-maps';
import { IMAGES } from '../../constants/Images';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { COLORS } from '../../constants/theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import Cardstyle2 from '../../components/Card/Cardstyle2';
import { fetchProducts, Product } from '../../services/ProductServices';
// import * as Location from "expo-location";

const CardSwiperData = [
  {
    id: "1",
    image: "https://firebasestorage.googleapis.com/v0/b/tags-1489a.appspot.com/o/products%2Fdrone.jpg-1726421726541?alt=media&token=4e58b7e1-4c2b-4432-9e74-0a5cd91b0f84",
    title: "Cordless Drill",
    price: "5.8",
    discount: "$8.0"
  },
  {
    id: "2",
    image: "https://firebasestorage.googleapis.com/v0/b/tags-1489a.appspot.com/o/products%2Fdrone.jpg-1726421726541?alt=media&token=4e58b7e1-4c2b-4432-9e74-0a5cd91b0f84",
    title: "Power Drill",
    price: "5.8",
    discount: "$8.0"
  },
];

const Map = ({ navigation }: any) => {
  const [activeCard, setActiveCard] = useState<any>(null); // State to store active card
  const pills = ['No Deposit', 'Easy Rent', 'Newly Listed', 'Favorite'];
  const [dealsOnly, setDealsOnly] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [range, setRange] = useState([50, 200]);
  const [selected, setSelected] = useState<boolean>(false);
  const [backgroundColor, setBackgroundColor] = useState('transparent'); // Default background color
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [location, setLocation] = useState<any | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<{ latitude: number; longitude: number; address: string; addressName?: string } | null>(null);
  const mapRef = useRef<MapView | null>(null);


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

  const toggleCheckbox = () => {
    setIsChecked(!isChecked);
  };

  const handlePress = () => {
    setSelected(!selected);
  };

  const theme = useTheme();
  const { colors }: { colors: any } = theme;

  // useEffect(() => {
  //   (async () => {
  //     let { status } = await Location.requestForegroundPermissionsAsync();
  //     if (status !== "granted") {
  //       Alert.alert("Permission denied", "Allow location access to continue");
  //       return;
  //     }

  //     let currentLocation = await Location.getCurrentPositionAsync({});
  //     setLocation(currentLocation);
  //     setSelectedLocation({
  //       latitude: currentLocation.coords.latitude,
  //       longitude: currentLocation.coords.longitude,
  //       address: "Current Location",
  //     });
  //   })();
  //   if (location) {
  //     mapRef.current?.animateCamera({
  //       center: { latitude: location.coords.latitude, longitude: location.coords.longitude },
  //       zoom: 18, // Max zoom level for react-native-maps
  //       heading: 0,
  //       pitch: 0,
  //     });
  //   }
  //   bottomSheetRef.current?.snapToIndex(0);
  //   getProducts();
  // }, []);

  // Create a reference for the BottomSheet
  const bottomSheetRef = useRef<BottomSheet>(null);

  // Close the BottomSheet programmatically
  const handleClosePress = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  const handleValuesChange = (values: number[]) => {
    setRange(values);
  };

  const handleProductClick = (product: { id: string; imageUrl: string; ownerID: string; productName: string; description: string; rate: string; location: string }) => {
    navigation.navigate('ProductsDetails', { product });
  };

  const handleSheetChanges = useCallback((index: number) => {
    console.log('Snap point index:', index);
    if (index === 2) {
      setBackgroundColor('#ffffff');
    } else {
      setBackgroundColor('transparent'); // Reset background
    }
  }, []);

  return (
    <View style={styles.container}>
      {location ? (
        <MapView
          ref={mapRef}
          showsUserLocation={true}
          style={styles.map}
          initialRegion={{
            latitude: selectedLocation?.latitude || location.coords.latitude,
            longitude: selectedLocation?.longitude || location.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
        </MapView>
      ) : (
        <Text>Fetching location...</Text>
      )}
      <View style={[GlobalStyleSheet.container, { paddingBottom: 10 }]}>
        <View style={{ paddingHorizontal: 10, backgroundColor }}>
          <View style={styles.container1}>
            <Ionicons name='arrow-left' size={28} color={'transparent'} />
            <Text style={styles.title}>Map </Text>
            <TouchableOpacity style={styles.iconContainer} onPress={() => bottomSheetRef.current?.expand()}>
              <Ionicons name='filter' size={28} color={'#000000'} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={[GlobalStyleSheet.row, { alignItems: 'center' }]}>
          <View style={{ flex: 1, paddingHorizontal: 20, backgroundColor, paddingBottom: 8 }}>
            <TextInput
              placeholder='Search Best items for You'
              placeholderTextColor={COLORS.text}
              style={[styles.searchTextinput, {
                borderColor: colors.border,
                color: COLORS.title,
              }]}
            />
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollContainer}
            style={{ backgroundColor, paddingBottom: 20 }}
          >
            {pills.map((pill, index) => (
              <TouchableOpacity key={index} style={styles.pill}>
                <Text style={styles.pillText}>{pill}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
      <View style={styles.cardWrapper}>
        {/* <CardSwiper
          data={CardSwiperData}
          setActiveCard={setActiveCard} // Pass the function to update active card
        /> */}
      </View>
      {/* Bottom Sheet Component */}
      <View style={{ flex: 1, marginTop: -20 }}>
        <BottomSheet
          ref={bottomSheetRef}
          index={1} // Start at the middle snap point
          snapPoints={['5%', '40%', '100%']}
          onChange={handleSheetChanges}
        >
          <BottomSheetScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: products.length === 0 ? 'center' : 'flex-start', }}>
            <View style={[GlobalStyleSheet.container, { padding: 15, alignItems: 'center' }]}>
              <View>
                {products.map((data: any, index: any) => {
                  return (
                    <View key={index} style={{ marginBottom: 15 }}>
                      <Cardstyle2
                        id={data.id}
                        image={data.imageUrl}
                        price={data.rate}
                        title={data.productName}
                        description={data.description}
                        brand='N/A'
                        onPress={() => handleProductClick(data)}// onPress2={() => addItemToWishList(data)}                                
                      />
                    </View>
                  )
                })}
                {products.length === 0 &&
                  <View
                    style={{
                      flex: 1,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <View
                      style={{
                        height: 60,
                        width: 60,
                        borderRadius: 60,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: COLORS.primaryLight,
                        marginBottom: 20,
                      }}
                    >
                      <Ionicons color={COLORS.primary} size={24} name='heart' />
                    </View>
                    <Text style={{ color: colors.title, marginBottom: 8 }}>Your Wishlist is Empty!</Text>
                    <Text
                      style={{
                        color: colors.text,
                        textAlign: 'center',
                        paddingHorizontal: 40,
                        marginBottom: 30,
                      }}
                    >Add Product to you favourite and shop now.</Text>
                  </View>
                }
              </View>
            </View>
          </BottomSheetScrollView>
        </BottomSheet>
      </View>
      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={['1%', '97%']}
        enablePanDownToClose={true} // Allow swipe-down to close
        handleComponent={() => (
          <View style={styles.header}>
            <TouchableOpacity onPress={handleClosePress}>
              <Ionicons name='x' size={28} color={'#000000'} />
            </TouchableOpacity>
            <Text style={styles.headerText}>Filters</Text>
            <Text style={styles.headerText}>Reset</Text>
          </View>
        )}
      >
        <View style={styles.contentContainer1}>
          <Text style={styles.text}>Filters</Text>
          <View style={styles.square}>
            <View style={styles.filterOption}>
              <Text style={styles.label}>Show rented items</Text>
              <View style={styles.switchContainer}>
                <Switch
                  trackColor={{ false: "#ccc", true: "#007bff" }}
                  thumbColor={dealsOnly ? "#ffffff" : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={() => setDealsOnly((prev) => !prev)}
                  value={dealsOnly}
                />
              </View>
            </View>
            <View style={styles.filterOption}>
              <Text style={styles.label}>Pay at Meet Up only</Text>
              <View style={styles.switchContainer}>
                <Switch
                  trackColor={{ false: "#ccc", true: "#007bff" }}
                  thumbColor={dealsOnly ? "#ffffff" : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={() => setDealsOnly((prev) => !prev)}
                  value={dealsOnly}
                />
              </View>
            </View>
          </View>
          <View style={styles.square}>
            <View style={styles.filterOption}>
              <Text style={styles.label}>Electronics</Text>
              <View style={styles.switchContainer}>
                <TouchableOpacity style={styles.checkboxContainer} onPress={toggleCheckbox}>
                  <View style={[styles.checkbox, isChecked && styles.checkedCheckbox]}>
                    {isChecked && <Ionicons name="check" size={16} color="#fff" />}
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.filterOption}>
              <Text style={styles.label}>Home Essentials</Text>
              <View style={styles.switchContainer}>
                <TouchableOpacity style={styles.checkboxContainer} onPress={toggleCheckbox}>
                  <View style={[styles.checkbox, isChecked && styles.checkedCheckbox]}>
                    {isChecked && <Ionicons name="check" size={16} color="#fff" />}
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={styles.square}>
            <View style={styles.filterOption}>
              <View style={styles.container3}>
                <Text style={styles.label3}>Budget Range: ${range[0]} - ${range[1]}</Text>
                <MultiSlider
                  values={range}  // Initial min and max values
                  min={0}  // Minimum value for the range
                  max={500}  // Maximum value for the range
                  step={1}  // Step value for the slider
                  onValuesChange={handleValuesChange}  // Update the range values when changed
                  selectedStyle={styles.selectedTrack}  // Style for the selected track
                  unselectedStyle={styles.unselectedTrack}  // Style for the unselected track
                  markerStyle={styles.marker}  // Style for the slider markers (thumbs)
                  containerStyle={styles.sliderContainer3}  // Style for the container
                  trackStyle={styles.track}  // Style for the track
                />
              </View>
            </View>
          </View>

          <View style={styles.square2}>
            <View style={styles.filterOption2}>
              <TouchableOpacity style={styles.option} onPress={handlePress}>
                <View
                  style={[
                    styles.radioButton,
                    selected && styles.selectedRadioButton,
                  ]}
                />
                <Text style={styles.optionText}>Any</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.option} onPress={handlePress}>
                <View
                  style={[
                    styles.radioButton,
                    selected && styles.selectedRadioButton,
                  ]}
                />
                <Text style={styles.optionText}>4.5+</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.option} onPress={handlePress}>
                <View
                  style={[
                    styles.radioButton,
                    selected && styles.selectedRadioButton,
                  ]}
                />
                <Text style={styles.optionText}>3.5+</Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={handleClosePress}>
            <Text style={styles.buttonText}>Apply Filters</Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container1: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  iconContainer: {
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  square: {
    backgroundColor: "#F0F0F0", // Color of the square
    justifyContent: "center", // Center content vertically
    alignItems: "center", // Center content horizontally
    borderRadius: 8, // Optional: Add rounded corners
    paddingHorizontal: 20, // Optional: Add padding
    marginTop: 15, // Optional: Add margin
  },
  square2: {
    backgroundColor: "#F0F0F0", // Color of the square
    borderRadius: 8, // Optional: Add rounded corners
    paddingHorizontal: 20, // Optional: Add padding
    marginTop: 15, // Optional: Add margin
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomColor: "#ccc",
  },
  slider: {
    width: '100%',
    height: 40,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  closeText: {
    fontSize: 16,
    color: "#007bff",
  },
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderColor: "#121212",
    marginRight: 8,
  },
  checkedCheckbox: {
    backgroundColor: "#121212",
  },
  text: {
    fontSize: 30,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  contentContainer1: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 20,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    padding: 0,
  },
  openButton: {
    padding: 15,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  closeButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#FF0000',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  searchCard: {
    height: 45,
    width: 45,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background
  },
  searchTextinput: {
    height: 48,
    width: '100%',
    borderRadius: 30,
    paddingHorizontal: 20,
    color: COLORS.title,
    fontSize: 14,
    backgroundColor: COLORS.background
  },
  scrollContainer: {
    paddingHorizontal: 10,
  },
  pill: {
    backgroundColor: '#007BFF',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 5,
  },
  pillText: {
    color: '#fff',
    fontSize: 16,
  },
  cardWrapper: {
    position: 'absolute',
    bottom: 30,
    left: 0,
  },
  activeCardContent: {
    alignItems: 'center',
    padding: 20,
  },
  activeCardImage: {
    height: 100,
    width: 100,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  activeCardTitle: {
    fontSize: 20,
    color: COLORS.card,
  },
  activeCardPrice: {
    fontSize: 16,
    color: COLORS.primary,
  },
  activeCardDiscount: {
    fontSize: 16,
    color: COLORS.secondary,
  },
  filterOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  filterOption2: {
    paddingVertical: 20,
  },
  label: {
    fontSize: 16,
    flex: 1,
  },
  switchContainer: {
    width: 50, // Square dimensions
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#000',
    marginRight: 10,
  },
  selectedRadioButton: {
    backgroundColor: '#000',
  },
  optionText: {
    fontSize: 16,
  },
  selectedText: {
    marginTop: 20,
    fontSize: 16,
  },
  container3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
  },
  label3: {
    fontSize: 20,
    marginBottom: 10,
  },
  sliderContainer3: {
    width: '100%',
    height: 40,
  },
  selectedTrack: {
    backgroundColor: '#1EB1FC',
  },
  unselectedTrack: {
    backgroundColor: '#D3D3D3',
  },
  marker: {
    height: 20,
    width: 20,
    backgroundColor: '#1EB1FC',
    borderRadius: 10,
  },
  track: {
    height: 4,
    borderRadius: 2,
  },
});

export default Map;
