import React, { useEffect, useState, useCallback, useRef } from 'react'
import { View, Text, TouchableOpacity, Image, ScrollView, ActivityIndicator, RefreshControl, Alert, BackHandler } from 'react-native'
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { COLORS } from '../../constants/theme';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootStackParamList';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { fetchSelectedUser, User, useUser } from '../../context/UserContext';
import { fetchBorrowingDates, fetchSelectedProduct } from '../../services/ProductServices';
import { Calendar, DateData } from 'react-native-calendars';
import { format, set } from 'date-fns';
import MapView, { Circle, Marker } from 'react-native-maps';
import { Address, fetchUserAddresses } from '../../services/AddressServices';
import { createBorrowing } from '../../services/BorrowingServices';
import { getReviewsByProductId } from '../../services/ReviewServices';
import { getOrCreateChat } from '../../services/ChatServices';

type ProductDetailsScreenProps = StackScreenProps<RootStackParamList, 'ProductDetails'>;
const ProductDetails = ({ navigation, route }: ProductDetailsScreenProps) => {
  const { user } = useUser();
  const mapRef = useRef<MapView>(null);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const [product, setProduct] = useState(route.params.product);
  // const [productAddress, setProductAddress] = useState<Address>();
  const [addresses, setAddresses] = useState<{ [key: string]: any; id: string; }[]>([]);
  const [owner, setOwner] = useState<User>();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [bookedDates, setBookedDates] = useState<{ [key: string]: any }>({});
  const [selectedDates, setSelectedDates] = useState<{ [key: string]: any }>({});
  const [range, setRange] = useState<{ start: string | null; end: string | null }>({
    start: null,
    end: null,
  });

  const [reviews, setReviews] = useState<any[]>([]);
  const [startDate, setStartDate] = useState(today.toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(today.toISOString().split('T')[0]);
  const [index, setIndex] = useState(0);
  const [accordionOpen, setAccordionOpen] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<{ [key: string]: any; id: string; address: string } | null>(null);
  const [numberOfDays, setNumberOfDays] = useState<number>();
  const [total, setTotal] = useState<number>();

  const paymentMethods = [
    {
      image: "wallet",
      title: "Cash on Pickup",
      text: 'Renter directly pays the owner upon pickup meetup',
    },
    {
      image: "card",
      title: "Credit / Debit Card",
      text: "Card not supported. Will available in the future release.",
    },
    {
      image: "logo-apple",
      title: "Apple Pay",
      text: "Apple Pay not supported. Will available in the future release.",
    },
    {
      image: "logo-google",
      title: "Google Pay",
      text: "Google Pay not supported. Will available in the future release.",
    },
    {
      image: "wallet",
      title: "Wallet",
      text: "Balance: £50.00",
    },
  ]

  const getDateRange = (start: string, end: string) => {
    const range: string[] = [];
    let currentDate = new Date(start);
    const endDate = new Date(end);

    while (currentDate <= endDate) {
      range.push(currentDate.toISOString().split('T')[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return range;
  };

  const fetchSelectedProductData = async () => {
    if (product) {
      try {
        const selectedProduct = await fetchSelectedProduct(product.id || 'undefined');
        if (selectedProduct) {
          setProduct(selectedProduct);
          // fetch Owner details
          try {
            const fetchedOwner = await fetchSelectedUser(selectedProduct.ownerID);
            if (fetchedOwner) {
              setOwner(fetchedOwner);
            }
          } catch (error) {
            console.error('Failed to fetch owner details:', error);
          }
          // fetch Booked Dates on Calendar
          try {
            const fetchedDates = await getBookedDates(product.id || 'undefined');
            // setBookedDates(fetchedDates);
            setSelectedDates(fetchedDates);
          } catch (error) {
            Alert.alert("Error", "Failed to fetch booked dates.");
          }

          // fetch Reviews
          try {
            const fetchedReviews = await getReviewsByProductId(product.id || 'undefined');
            const reviewsWithUserDetails = await Promise.all(
              fetchedReviews.map(async (review) => {
                const reviewer = await fetchSelectedUser(review.borrowerReviewerId);
                return {
                  ...review,
                  borrowerFirstName: reviewer?.firstName || '',
                  borrowerLastName: reviewer?.lastName || '',
                  borrowerProfilePicture: reviewer?.profileImageUrl || '',
                };
              })
            );
            setReviews(reviewsWithUserDetails);
            console.log('Fetched reviews:', fetchedReviews);
          } catch (error) {
            console.error('Failed to fetch reviews', error);
          }
        }
      } catch (error) {
        console.error('Failed to fetch product details:', error);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    const backAction = () => {
      // Handle the back press with an alert, or simply do nothing
      Alert.alert("Hold on!", "Are you sure you want to go back?", [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel"
        },
        { text: "YES", onPress: () => navigation.goBack() }
      ]);
      return true; // This prevents the default back button behavior
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, []);

  const handleChat = async (user: User, otherUser: User) => {
    const chatId = await getOrCreateChat(user, otherUser);
    if (chatId) {
      navigation.navigate("Chat", { chatId: chatId });
    }
  };

  const handleDayPress = (day: DateData) => {
    if (selectedDates[day.dateString]?.disabled) {
      Alert.alert("Unavailable", "This date is already booked.");
      return;
    }

    let newRange = { ...range };

    if (!range.start || (range.start && range.end)) {
      // First tap: Set start date
      newRange = { start: day.dateString, end: null };
    } else {
      // Second tap: Set end date
      newRange.end = day.dateString;

      if (newRange.start && newRange.end && new Date(newRange.start) > new Date(newRange.end)) {
        // Swap start and end if necessary
        newRange = { start: newRange.end, end: newRange.start };
      }


      // Check if any booked dates exist in this range
      const conflictDates = getConflictDates(newRange.start!, newRange.end!);

      if (conflictDates.length > 0) {
        Alert.alert(
          "Selected Range Includes Booked Dates",
          "Your selected range contains booked dates. Please select a different range."
        );
        return; // Stop further processing
      }
    }

    if (newRange.start && newRange.end) {
      setStartDate(newRange.start);
      setEndDate(newRange.end);
    }
    setRange(newRange);
    setSelectedDates({
      ...bookedDates, // Preserve booked dates
      ...getHighlightedDates(newRange.start, newRange.end),
    });

  };

  const getConflictDates = (start: string, end: string) => {
    let conflicts: string[] = [];
    let date = new Date(start);

    while (date <= new Date(end)) {
      const dateString = date.toISOString().split("T")[0];

      if (selectedDates[dateString]?.disabled) {
        conflicts.push(dateString);
      }

      date.setDate(date.getDate() + 1);
    }

    return conflicts;
  };



  const getHighlightedDates = (start: string | null, end: string | null) => {
    let markedDates: any = {};

    if (!start) return markedDates;

    if (!end) {
      markedDates[start] = {
        selected: true,
        startingDay: true,
        color: COLORS.primary,
        textColor: "white",
      };
      return markedDates;
    }

    let date = new Date(start);
    while (date <= new Date(end)) {
      const dateString = date.toISOString().split("T")[0];

      if (bookedDates[dateString]) {
        markedDates[dateString] = bookedDates[dateString]; // Keep booked dates red
      } else {
        markedDates[dateString] = {
          selected: true,
          color: COLORS.primary,
          textColor: "white",
        };
      }

      date.setDate(date.getDate() + 1);
    }

    markedDates[start] = { ...markedDates[start], startingDay: true };
    markedDates[end] = { ...markedDates[end], endingDay: true };

    return markedDates;
  };

  const getAddresses = async () => {
    if (user?.uid) {
      const fetchedAddresses = await fetchUserAddresses(user.uid);
      setAddresses(fetchedAddresses);
      setLoading(false);
    }
  };

  const getBookedDates = async (productId: string) => {
    let markedDates: any = {};

    const availableDays = getAvailableDays(new Date().getFullYear(), new Date().getMonth() + 1, product.availableDays);
    Object.keys(availableDays).forEach((sunday) => {
      markedDates[sunday] = { disabled: true, disableTouchEvent: true, textColor: "red" };
    });

    console.log('Available days:', availableDays);

    const bookedDateRanges = await fetchBorrowingDates(productId);

    bookedDateRanges.forEach(({ startDate, endDate }) => {
      let date = new Date(startDate);
      while (date <= new Date(endDate)) {
        const dateString = date.toISOString().split("T")[0];

        markedDates[dateString] = {
          disabled: true,
          disableTouchEvent: true,
          color: COLORS.blackLight,
          textColor: "white",
        };

        date.setDate(date.getDate() + 1);
      }

      markedDates[startDate] = { ...markedDates[startDate], startingDay: true };
      markedDates[endDate] = { ...markedDates[endDate], endingDay: true };
    });
    return markedDates;
  };

  useEffect(() => {
    const fetchOwner = async () => {
      if (product) {
        const fetchedOwner = await fetchSelectedUser(product.ownerID);
        if (fetchedOwner) {
          setOwner(fetchedOwner);
        }
      }
    };

    const fetchBookedDates = async () => {
      if (product) {
        const fetchedDates = await getBookedDates(product.id || 'undefined');
        setBookedDates(fetchedDates);
        setSelectedDates(fetchedDates);
      }
    };

    const fetchReviews = async () => {
      if (product) {
        const fetchedReviews = await getReviewsByProductId(product.id || 'undefined');
        const reviewsWithUserDetails = await Promise.all(
          fetchedReviews.map(async (review) => {
            const reviewer = await fetchSelectedUser(review.borrowerReviewerId);
            return {
              ...review,
              borrowerFirstName: reviewer?.firstName || '',
              borrowerLastName: reviewer?.lastName || '',
              borrowerProfilePicture: reviewer?.profileImageUrl || '',
            };
          })
        );
        setReviews(reviewsWithUserDetails);
      }
    };

    fetchOwner();
    fetchBookedDates();
    fetchReviews();
  }, [product]);

  useEffect(() => {
    if (startDate && endDate && product) {
      const days = getDateRange(startDate, endDate).length;
      setNumberOfDays(days);
      const totalAmount = Number(days * product.lendingRate) + Number(product.depositAmount);
      setTotal(totalAmount);
    }
  }, [startDate, endDate, product]);

  useEffect(() => {
    if (product) {
      setImages(product.imageUrls);
      setSelectedImage(product.imageUrls[0]);
      getAddresses();
    }
  }, [product]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchSelectedProductData().then(() => setRefreshing(false));
  }, []);

  const handleCheckout = async () => {
    if (total === undefined) {
      Alert.alert('Error', 'Total amount is not calculated.');
      return;
    }

    if (!deliveryMethod || !paymentMethod) {
      Alert.alert('Error', 'Please select delivery and payment methods.');
      return;
    }

    if (!product) {
      Alert.alert('Error', 'Product not found.');
      return;
    }

    // if (!productAddress) {
    //   Alert.alert('Error', 'Product address not found.');
    //   return;
    // }

    const borrowingData = {
      userId: user?.uid || '',
      status: 0,
      startDate: startDate,
      endDate: endDate,
      // user copy
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      // owner copy
      ownerFirstName: owner?.firstName || '',
      ownerLastName: owner?.lastName || '',
      // products copy

      product: product,

      // end products copy
      total: total,
      deliveryMethod: deliveryMethod,
      paymentMethod: paymentMethod,
      //generate random collection and return codes
      collectionCode: '',
      returnCode: '',
      updatedAt: new Date(),
      createAt: new Date(),
    };

    const borrowingId = await createBorrowing(borrowingData);
    if (borrowingId) {
      Alert.alert('Success', `Borrowings created successfully with ID: ${borrowingId}`);
      navigation.navigate('PaymentSuccess', {
        borrowingId: borrowingId,
        collectionCode: borrowingData.collectionCode,
        latitude: product.latitude,
        longitude: product.longitude,
        addressName: product.addressName,
        address: product.address,
        postcode: product.postcode
      });
    }
  };

  const screens = 4;

  const nextScreen = async () => {
    if (index === 0 && (!startDate || !endDate)) {
      Alert.alert('Please set start date and end date');
      return;
    }
    if (index === 1 && !deliveryMethod) {
      Alert.alert('Please select a delivery method');
      return;
    }
    if (index === 2 && !paymentMethod) {
      Alert.alert('Please select a payment method');
      return;
    }
    if (index === 3) {
      handleCheckout();
      Alert.alert('order created')
      return;
    }
    setIndex((prev) => (prev + 1) % screens);
  }

  const prevScreen = () =>
    setIndex((prev) => (prev - 1 + screens) % screens);

  // Function to get available days dynamically based on product.availableDays
  const getAvailableDays = (year: number, month: number, availableDays: string[]) => {
    console.log('Available days:', availableDays);
    const availableDates: { [key: string]: { disabled: boolean } } = {};
    const daysInMonth = new Date(year, month, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      if (!availableDays.includes(dayName)) {
        const formattedDate = date.toISOString().split('T')[0];
        availableDates[formattedDate] = { disabled: true };
      }
    }
    return availableDates;
  };


  return (
    <View style={{ backgroundColor: COLORS.background, flex: 1 }}>
      <View
        style={{ height: 60, borderBottomColor: COLORS.card, borderBottomWidth: 1 }}>
        <View
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8, paddingHorizontal: 10 }}>
          <View style={{ flex: 1, alignItems: 'flex-start' }}>
            {index === 0 ? (
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{
                  height: 45, width: 45, borderColor: COLORS.blackLight, borderWidth: 1, borderRadius: 10, alignItems: 'center', justifyContent: 'center',
                }}
              >
                <Ionicons size={30} color={COLORS.blackLight} name='close' />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={prevScreen}
                style={{
                  height: 45, width: 45, borderColor: COLORS.blackLight, borderWidth: 1, borderRadius: 10, alignItems: 'center', justifyContent: 'center',
                }}
              >
                <Ionicons size={30} color={COLORS.blackLight} name='chevron-back-outline' />
              </TouchableOpacity>
            )}
          </View>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ width: 200, fontSize: 18, fontWeight: 'bold', color: COLORS.title, textAlign: 'center' }}>
              {[
                'Product Details',
                'Delivery Method',
                'Payment Method',
                'Checkout'][index] || ''}
            </Text>
          </View>
          <View style={{ flex: 1, alignItems: 'flex-end' }}>
            {index === 0 ? (
              <View style={{ flex: 1, alignItems: 'flex-end' }} />
            ) : (
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{
                  height: 45,
                  width: 45,
                  borderColor: COLORS.blackLight,
                  borderWidth: 1,
                  borderRadius: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Ionicons size={30} color={COLORS.blackLight} name='close' />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
      {product ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 15, paddingBottom: 70 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {index === 0 && (
            <View style={{ width: '100%', gap: 10 }}>
              {selectedImage ? (
                <View style={[]}>
                  <Image
                    source={{ uri: selectedImage }}
                    style={{
                      width: '100%',
                      height: 300,
                      borderRadius: 10,
                      marginBottom: 10,
                    }}
                    resizeMode="cover"
                  />
                  {/* Delete Button */}
                  <TouchableOpacity
                    onPress={() => { }}
                    style={{
                      position: 'absolute',
                      top: 250,
                      right: 10,
                      backgroundColor: 'rgba(0,0,0,0.6)',
                      padding: 8,
                      borderRadius: 20,
                    }}
                  >
                    <Ionicons name="heart-outline" size={24} color={COLORS.white} />
                  </TouchableOpacity>
                  {/* Thumbnail List */}
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {images.map((imageUri, index) => (
                      <TouchableOpacity key={index} onPress={() => setSelectedImage(imageUri)}>
                        <Image
                          source={{ uri: imageUri }}
                          style={{
                            width: 80,
                            height: 80,
                            marginRight: 10,
                            borderRadius: 10,
                            borderWidth: selectedImage === imageUri ? 3 : 0,
                            borderColor: selectedImage === imageUri ? '#007bff' : 'transparent',
                          }}
                        />
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              ) : (
                <View
                  style={{
                    width: '100%',
                    height: 300,
                    borderRadius: 10,
                    marginBottom: 10,
                    backgroundColor: COLORS.card,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ color: COLORS.blackLight }}>No image selected</Text>
                </View>
              )}
              <View>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', marginBottom: 10, marginTop: 20 }}>
                  <View style={{ flex: 1, alignItems: 'center' }}>
                    {
                      owner ? (
                        <Image
                          source={{ uri: owner.profileImageUrl }}
                          style={{
                            width: 60,
                            height: 60,
                            borderRadius: 40,
                          }}
                        />
                      ) : (
                        <View
                          style={{
                            width: 60,
                            height: 60,
                            borderRadius: 40,
                            marginBottom: 10,
                            backgroundColor: COLORS.card,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          <Ionicons name={'image-outline'} size={20} color={COLORS.blackLight} style={{ opacity: .5 }} />
                        </View>
                      )
                    }
                  </View>
                  <View style={{ flex: 7, paddingLeft: 20 }}>
                    <TouchableOpacity
                      // onPress={() => navigation.navigate('ProductDetails', { product: borrowing.product })}>
                      onPress={() => { }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: COLORS.black, textDecorationLine: 'underline' }}>{product.title}</Text>
                        <Ionicons name="link" size={20} color={COLORS.blackLight} style={{ marginLeft: 5 }} />
                      </View>
                    </TouchableOpacity>
                    <Text style={{ fontSize: 14, color: COLORS.blackLight }}>by {owner?.firstName} {owner?.lastName} </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => { if (user && owner) handleChat(user, owner) }}
                    style={{
                      bottom: 10,
                      right: 10,
                      backgroundColor: COLORS.placeholder,
                      padding: 10,
                      borderRadius: 10,
                    }}
                  >
                    <Ionicons name="chatbubble-ellipses-outline" size={24} color={COLORS.white} />
                  </TouchableOpacity>
                </View>
                <Text style={{ fontSize: 24, fontWeight: 'bold', color: COLORS.black, paddingTop: 10 }}>£ {product.lendingRate} / day</Text>
                <Text style={{ fontSize: 18, fontWeight: 'semibold', color: COLORS.black }}>{product.address}</Text>
                <Text style={{ fontSize: 14, color: COLORS.blackLight, paddingBottom: 20 }}>{product.description}</Text>
                <View style={GlobalStyleSheet.line} />
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: COLORS.black, paddingTop: 30 }}>Available Slots</Text>
                <Calendar
                  markedDates={selectedDates}
                  markingType={'period'}
                  onDayPress={handleDayPress}
                  minDate={new Date().toISOString().split('T')[0]} // Disable past dates
                  renderHeader={(date) => (
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.black }}>
                      {format(new Date(date), 'MMMM yyyy')}
                    </Text>
                  )}
                />
                <View style={GlobalStyleSheet.line} />
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: COLORS.black, paddingTop: 30 }}>Borrowing Conditions</Text>
                <Text style={{ fontSize: 14, color: COLORS.black, paddingBottom: 20 }}>{product.borrowingNotes}</Text>
                <View style={GlobalStyleSheet.line} />
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: COLORS.black, paddingTop: 30, paddingBottom: 10 }}>Location</Text>
                <View style={{ height: 200, borderRadius: 20, overflow: 'hidden', borderColor: COLORS.blackLight, borderWidth: 1, }}>
                  <MapView
                    ref={mapRef}
                    style={{ height: '100%' }}
                    region={{
                      latitude: product.latitude,
                      longitude: product.longitude,
                      latitudeDelta: 0.05, // Adjust zoom level
                      longitudeDelta: 0.05,
                    }}
                    scrollEnabled={false}
                    zoomEnabled={false}
                    rotateEnabled={false}
                    pitchEnabled={false}
                    toolbarEnabled={false}
                  >
                    <Circle
                      center={{ latitude: product.latitude, longitude: product.longitude }}
                      radius={1000} // Radius in meters (1000m = 1km)
                      strokeWidth={2}
                      strokeColor="rgba(0, 122, 255, 0.5)"
                      fillColor="rgba(0, 122, 255, 0.2)" // Light blue transparent fill
                    />
                  </MapView>
                  <View style={GlobalStyleSheet.line} />
                </View>
              </View>
              <Text style={{ fontSize: 14, color: COLORS.black, paddingBottom: 20, textAlign: 'center' }}>The exact location will be disclosed upon rental completion</Text>
              <View style={GlobalStyleSheet.line} />
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: COLORS.black, paddingTop: 30 }}>Reviews</Text>
              <View>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingBottom: 10 }}
                >
                  {reviews.map((review, index) => (
                    <TouchableOpacity key={index} onPress={() => { /* Handle review card press */ }}>
                      <View
                        style={{
                          backgroundColor: COLORS.card,
                          borderRadius: 10,
                          padding: 15,
                          marginRight: 10,
                          width: 250,
                        }}
                      >
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <Image
                            source={{ uri: review.borrowerProfilePicture }}
                            style={{ width: 60, height: 60, borderRadius: 60, marginRight: 10 }}
                          />
                          <View>
                            <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.title }}>
                              {`${review.borrowerFirstName} ${review.borrowerLastName}`}
                            </Text>
                            <Text style={{ fontSize: 14, color: COLORS.blackLight }}>
                              {new Date(review.borrowerUpdatedAt).toLocaleDateString()}
                            </Text>
                          </View>
                        </View>
                        <Text style={{ fontSize: 14, color: COLORS.black, marginVertical: 10 }}>
                          {review.borrowerPublicReview}
                        </Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          {Array.from({ length: 5 }, (_, i) => (
                            <Ionicons
                              key={i}
                              name="star"
                              size={16}
                              color={i < review.borrowerOverallRating ? COLORS.primary : COLORS.blackLight}
                            />
                          ))}
                          <Text style={{ fontSize: 14, color: COLORS.black, marginLeft: 5 }}>
                            {review.borrowerOverallRating}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
          )}
          {index === 1 && (
            <View style={{ width: '100%', paddingTop: 60, gap: 10 }}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={{
                  padding: 15,
                  borderColor: deliveryMethod === 'pickup' ? COLORS.primary : COLORS.blackLight,
                  borderRadius: 10,
                  borderWidth: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => setDeliveryMethod('pickup')}
              >
                <Ionicons name="home-outline" size={30} color={COLORS.blackLight} style={{ margin: 5 }} />
                <View style={{ flex: 1, paddingLeft: 10 }}>
                  <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.title }}>
                    Pickup
                  </Text>
                  <Text style={{ fontSize: 13, color: COLORS.black }}>
                    Address will be disclosed upon rental completion.
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                style={{
                  padding: 15,
                  borderColor: deliveryMethod === 'delivery' ? COLORS.primary : COLORS.blackLight,
                  borderRadius: 10,
                  borderWidth: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => {
                  setDeliveryMethod('delivery');
                }}
              >
                <Ionicons name="location-outline" size={30} color={COLORS.blackLight} style={{ margin: 5 }} />
                <View style={{ flex: 1, paddingLeft: 10 }}>
                  <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.title }}>
                    Delivery
                  </Text>
                  <Text style={{ fontSize: 13, color: COLORS.black }}>
                    {selectedAddress?.address || 'No address available'}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => setAccordionOpen((prev) => !prev)}
                  style={{
                    padding: 5,
                    borderRadius: 10,
                    backgroundColor: COLORS.card,
                  }}
                >
                  <Ionicons name={accordionOpen ? "chevron-up-outline" : "chevron-down-outline"} size={24} color={COLORS.blackLight} />
                </TouchableOpacity>
              </TouchableOpacity>
              {accordionOpen && (
                <View style={{ paddingLeft: 10 }}>
                  {addresses.map((address, index) => (
                    <TouchableOpacity
                      key={index}
                      activeOpacity={0.8}
                      style={{
                        padding: 15,
                        borderColor: selectedAddress?.id === address.id ? COLORS.primary : COLORS.blackLight,
                        borderRadius: 10,
                        borderWidth: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 10,
                      }}
                      onPress={() => setSelectedAddress({ id: address.id, address: address.address })}
                    >
                      <Ionicons name="location-outline" size={30} color={COLORS.blackLight} style={{ margin: 5 }} />
                      <View style={{ flex: 1, paddingLeft: 10 }}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.title }}>
                          {address.addressName || `Address ${index + 1}`}
                        </Text>
                        <Text style={{ fontSize: 13, color: COLORS.black }}>
                          {address.address}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          )}
          {index === 2 && (
            <View style={{ width: '100%', paddingTop: 60, gap: 10 }}>
              {paymentMethods.map((method, index) => (
                <TouchableOpacity
                  key={index}
                  activeOpacity={0.8}
                  style={{
                    padding: 15,
                    borderColor: paymentMethod === method.title ? COLORS.primary : COLORS.blackLight,
                    borderRadius: 10,
                    borderWidth: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onPress={() => setPaymentMethod(method.title)}
                >
                  <Ionicons name={'logo-apple'} size={30} color={COLORS.blackLight} style={{ margin: 5 }} />
                  <View style={{ flex: 1, paddingLeft: 10 }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.title }}>
                      {method.title}
                    </Text>
                    <Text style={{ fontSize: 13, color: COLORS.black }}>
                      {method.text}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
          {index === 3 && total && (
            <View style={{ width: '100%', paddingTop: 20, gap: 10 }}>
              {/* Product Info */}
              <View style={{ flexDirection: "row", marginBottom: 20 }}>
                <Image
                  source={{ uri: product.imageUrls[0] }}
                  style={{ width: 100, height: 100, borderRadius: 8, marginRight: 16 }}
                />
                <View style={{ flex: 1, marginTop: 5 }}>
                  <Text style={{ fontSize: 16, marginBottom: 5 }}>
                    <Text style={{ color: "#E63946", fontWeight: "bold" }}>£{product.lendingRate}</Text> / day{" "}
                    {/* <Text style={styles.originalPrice}>£40.20</Text> */}
                  </Text>
                  <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 5, color: COLORS.title }}>{product.title}</Text>
                  <Text style={{ fontSize: 14, color: COLORS.blackLight }}>{product.description}</Text>
                </View>
              </View>
              <View style={GlobalStyleSheet.line} />
              {/* Rental Period and Delivery Method */}
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
                <View style={{ paddingVertical: 10 }}>
                  <Text style={{ fontSize: 16, fontWeight: "bold", color: COLORS.title }}>Rental Period</Text>
                  <Text style={{ fontSize: 14, color: "#666", marginBottom: 20 }}>Day Rental</Text>
                  <Text style={{ fontSize: 14, fontWeight: "bold" }}>From:</Text>
                  <Text style={{ fontSize: 14, color: COLORS.title }}>{new Date(startDate).toLocaleDateString('en-GB')}</Text>
                  <Text style={{ fontSize: 14, color: COLORS.title }}>09:00 AM</Text>
                </View>
                <View style={{ marginHorizontal: 40, paddingTop: 60 }}>
                  <Ionicons name="arrow-forward" size={30} color={COLORS.title} />
                </View>
                <View style={{ paddingVertical: 10 }}>
                  <Text style={{ fontSize: 16, fontWeight: "bold", color: COLORS.title }}>Delivery Method</Text>
                  <Text style={{ fontSize: 14, color: "#666", marginBottom: 20 }}>{deliveryMethod}</Text>
                  <Text style={{ fontSize: 14, fontWeight: "bold" }}>Until:</Text>
                  <Text style={{ fontSize: 14, color: COLORS.title }}>{new Date(endDate).toLocaleDateString('en-GB')}</Text>
                  <Text style={{ fontSize: 14, color: COLORS.title }}>09:00 AM</Text>
                </View>
              </View>
              <Text style={{ fontSize: 12, color: "#666", textAlign: "center", marginBottom: 5 }}>
                The pickup location will be disclosed upon rental completion
              </Text>
              <View style={GlobalStyleSheet.line} />
              {/* Rental Rate Breakdown */}
              <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 5, color: COLORS.title, marginTop: 10 }}>Rental Rate Breakdown</Text>
              <Text style={{ fontSize: 14, color: COLORS.blackLight, marginBottom: 10 }}>Cash on Pickup</Text>
              <View style={{ marginBottom: 20 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
                  <Text style={{ fontSize: 14, color: "#333" }}>Rental rate</Text>
                  <Text style={{ fontSize: 14, color: "#333" }}>£{product.lendingRate} x {numberOfDays} day</Text>
                  <Text style={{ fontSize: 14, fontWeight: "bold" }}>£{total - Number(product.depositAmount)}</Text>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
                  <Text style={{ fontSize: 14, color: "#333" }}>Service Charge</Text>
                  <Text style={{ fontSize: 14, color: "#333" }}>FREE</Text>
                  <Text style={{ fontSize: 14, fontWeight: "bold" }}>£0.00</Text>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
                  <Text style={{ fontSize: 14, color: "#333" }}>Delivery Charge</Text>
                  <Text style={{ fontSize: 14, color: "#333" }}>FREE (PICKUP)</Text>
                  <Text style={{ fontSize: 14, fontWeight: "bold" }}>£0.00</Text>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
                  <Text style={{ fontSize: 14, color: "#333" }}>Deposit</Text>
                  <Text style={{ fontSize: 14, color: "#333" }}></Text>
                  <Text style={{ fontSize: 14, fontWeight: "bold" }}>{product.depositAmount}</Text>
                </View>
                <View style={[{ backgroundColor: COLORS.black, height: 1, margin: 10, width: '90%', alignSelf: 'center' },]} />
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
                  <Text style={{ fontSize: 14, fontWeight: "bold" }}>Total</Text>
                  <Text style={{ fontSize: 14, color: "#333", fontWeight: "bold" }}>£{total}</Text>
                </View>
              </View>
            </View>
          )}
        </ScrollView>
      ) : (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: COLORS.black }}>Product not found 404</Text>
        </View>
      )}
      {index === 0 ? (
        <View style={[GlobalStyleSheet.flex, { paddingVertical: 15, paddingHorizontal: 20, backgroundColor: COLORS.card, }]}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <View style={{ flexDirection: 'column' }}>
              <View style={{ flexDirection: 'row', gap: 5 }}>
                <Text style={{ fontSize: 24, color: COLORS.title, lineHeight: 30, fontWeight: 'bold' }}>
                  £{total} for {numberOfDays} days
                </Text>
              </View>
              <View style={{ flexDirection: 'row', gap: 5 }}>
                <Text>{startDate && endDate ? `${format(new Date(startDate), 'EEE, dd/MM/yy')} - ${format(new Date(endDate), 'EEE, dd/MM/yy')}` : ''}</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: COLORS.primary,
              width: 120,
              padding: 15,
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={nextScreen}
          >
            <Text style={{ color: COLORS.white, fontSize: 16, fontWeight: 'bold' }}>Borrow</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={[GlobalStyleSheet.flex, { paddingVertical: 15, paddingHorizontal: 20, backgroundColor: COLORS.card, }]}>
            {user?.isActive ? (
            <TouchableOpacity
              style={{
              backgroundColor: COLORS.primary,
              width: '100%',
              padding: 15,
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
              }}
              onPress={nextScreen}
            >
              <Text style={{ color: COLORS.white, fontSize: 16, fontWeight: 'bold' }}>{index === 3 ? 'Pay & Borrow' : 'Next'}</Text>
            </TouchableOpacity>
            ) : (
            <TouchableOpacity
              style={{
              backgroundColor: COLORS.primary,
              width: '100%',
              padding: 15,
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
              }}
              onPress={() => navigation.navigate('SignIn')}
            >
              <Text style={{ color: COLORS.white, fontSize: 16, fontWeight: 'bold' }}>Sign In to Borrow</Text>
            </TouchableOpacity>
            )}
        </View>
      )}
    </View>
  )
}

export default ProductDetails