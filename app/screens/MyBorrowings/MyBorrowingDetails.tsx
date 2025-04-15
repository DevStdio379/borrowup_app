import { useTheme } from '@react-navigation/native';
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet, Platform, Alert, Animated, Easing, FlatList, Dimensions, ScrollView, RefreshControl, ActivityIndicator, TextInput } from 'react-native'
import { IMAGES } from '../../constants/Images';
import { COLORS, SIZES } from '../../constants/theme';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootStackParamList';
import { useDispatch } from 'react-redux';
import MapView, { Marker } from 'react-native-maps';
import Header from '../../layout/Header';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { fetchSelectedBorrowing, Borrowing, updateBorrowing } from '../../services/BorrowingServices';
import { fetchSelectedUser, User, useUser } from '../../context/UserContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createReview, getReviewByBorrowingId, Review } from '../../services/ReviewServices';

type MyBorrowingDetailsScreenProps = StackScreenProps<RootStackParamList, 'MyBorrowingDetails'>;


const MyBorrowingDetails = ({ navigation, route }: MyBorrowingDetailsScreenProps) => {

    const { user } = useUser();
    const mapRef = useRef<MapView | null>(null);
    const [borrowing, setBorrowing] = useState<Borrowing>(route.params.borrowing);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [owner, setOwner] = useState<User>();
    const [images, setImages] = useState<string[]>([]);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [status, setStatus] = useState<number>(borrowing.status);

    const CODE_LENGTH = 7;
    const [returnCode, setCollectionCode] = useState<string[]>(Array(CODE_LENGTH).fill(""));
    const [validationMessage, setValidationMessage] = useState<string | null>(null);
    const inputs = useRef<Array<TextInput | null>>(Array(CODE_LENGTH).fill(null));
    const [review, setReview] = useState<Review>();

    const handleChange = (text: string, index: number) => {
        if (/^\d?$/.test(text)) {
            const newPin = [...returnCode];
            newPin[index] = text;
            setCollectionCode(newPin);

            // Move focus to the next input if a digit is entered
            if (text && index < CODE_LENGTH - 1) {
                inputs.current[index + 1]?.focus();
            }

            // Validate when full PIN is entered
            if (newPin.every((digit) => digit !== "")) {
                validatePin(newPin.join(""));
            }
        }
    };

    const validatePin = async (enteredPin: string) => {
        const correctPin = borrowing.returnCode; // Replace with actual validation logic
        if (enteredPin === correctPin) {
            await updateBorrowing(borrowing.id || 'undefined', { status: status! + 1 });
            setStatus(status! + 1);
            setCollectionCode(Array(CODE_LENGTH).fill("")); // Reset input
            inputs.current[0]?.focus(); // Focus back to first input
            setValidationMessage("Success. PIN is correct!");
        } else {
            Alert.alert("Error", "Invalid PIN. Try again.");
            setCollectionCode(Array(CODE_LENGTH).fill("")); // Reset input
            inputs.current[0]?.focus(); // Focus back to first input
            setValidationMessage("Invalid PIN. Try again.");
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === "Backspace" && returnCode[index] === "" && index > 0) {
            inputs.current[index - 1]?.focus();
        }
    };

    const fetchSelectedBorrowingData = async () => {
        if (borrowing) {
            // Alert.alert('1 Borrowing found');
            try {
                const selectedBorrowing = await fetchSelectedBorrowing(borrowing.id || 'undefined');
                if (selectedBorrowing) {
                    setBorrowing(selectedBorrowing)
                    setStatus(selectedBorrowing.status);

                    const fetchedOwner = await fetchSelectedUser(selectedBorrowing.product.ownerID);
                    if (fetchedOwner) {
                        setOwner(fetchedOwner);
                    }

                    const fetchedReview = await getReviewByBorrowingId(selectedBorrowing.product.id || 'undefined', selectedBorrowing.id || 'unefined');
                    if (fetchedReview) {
                        // Alert.alert('B Review found');
                        setReview(fetchedReview);
                    } else {
                        // Alert.alert('B Review not found');
                    }
                }
            } catch (error) {
                console.error('Failed to fetch selected borrowing details:', error);
            }
        } else {
            // Alert.alert('B Borrowing not found');
        }
        setLoading(false);
    };

    useEffect(() => {
        const fetchData = async () => {
            if (borrowing) {
                // Alert.alert('2 Borrowing found');
                setImages(borrowing.product.imageUrls);
                setSelectedImage(borrowing.product.imageUrls[0]);
                setBorrowing(borrowing);

                const selectedBorrowing = await fetchSelectedBorrowing(borrowing.id || 'undefined');
                if (selectedBorrowing) {
                    const fetchedOwner = await fetchSelectedUser(selectedBorrowing.product.ownerID);
                    if (fetchedOwner) {
                        setOwner(fetchedOwner);
                    }

                    const fetchedReview = await getReviewByBorrowingId(selectedBorrowing.product.id || 'undefined', selectedBorrowing.id || 'undefined');
                    if (fetchedReview && fetchedReview.id) {
                        setReview(fetchedReview);
                    }
                }
            } else {
                // Alert.alert('B Borrowing not found');
            }
        };
        setStatus(borrowing.status);
        fetchData();
    }, [borrowing]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchSelectedBorrowingData().then(() => setRefreshing(false));
    }, []);

    const steps = [
        { label: "Rental\nCreated", date: "7/10/24, Mon\n09:00 AM", completed: (status ?? 0) >= 0 },
        { label: "Pickup\n", date: "Show pickup\ncode", completed: (status ?? 0) > 2 },
        { label: "Active\nRental", date: "\n", completed: (status ?? 0) > 2 },
        { label: "Return\n", date: "Enter return\ncode", completed: (status ?? 0) > 3 },
        { label: "Rental\nCompleted", date: "12/10/24, Sat\n09:00 AM", completed: (status ?? 0) > 5 },
    ];

    const actions = [
        { buttonTitle: 'Extend Rental', onPressAction: () => Alert.alert('Extend Rental Pressed') },
        { buttonTitle: 'Report Issue', onPressAction: () => Alert.alert('Report Issue Pressed') },
        { buttonTitle: 'Contact Support', onPressAction: () => Alert.alert('Contact Support Pressed') },
    ];


    const greetings = 'Hi there, thank you for your rent. We hope that you can take the advantage of this item during your rental period Beforehand, here’s the information that you might need during your rental terms.';

    return (
        <View style={{ backgroundColor: COLORS.background, flex: 1 }}>
            <Header title='My Borrowings Details' />
            {borrowing ? (
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1, paddingBottom: 70, alignItems: 'flex-start' }}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                >
                    <View style={[GlobalStyleSheet.container, { paddingHorizontal: 15, paddingBottom: 40 }]}>
                        {/* Progress Section */}
                        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", height: 50 }}>
                            {steps.map((step, index) => (
                                <View key={index} style={{ flexDirection: "row", alignItems: "center" }}>
                                    {/* Line Connector */}
                                    {index > 0 && <View style={{ width: 45, height: 2, backgroundColor: step.completed ? COLORS.primary : "#f3f3f3" }} />}
                                    {/* Circle or X */}
                                    <View style={{ alignItems: "center", justifyContent: "center" }}>
                                        {step.completed ? (
                                            <View style={{ height: 32, width: 32, backgroundColor: COLORS.primary, borderRadius: 16, alignItems: "center", justifyContent: "center" }}>
                                                <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>✓</Text>
                                            </View>
                                        ) : (
                                            <View style={{ backgroundColor: "#f3f3f3", height: 32, width: 32, borderRadius: 16, alignItems: "center", justifyContent: "center" }}>
                                                <Text style={{ color: "gray", fontSize: 18 }}>X</Text>
                                            </View>
                                        )}
                                    </View>
                                </View>
                            ))}
                        </View>
                        {/* Progress Section */}
                        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", height: 60 }}>
                            {steps.map((step, index) => (
                                <View style={{ alignItems: "center", paddingHorizontal: 10 }}>
                                    {/* Label */}
                                    <Text style={{ textAlign: "center", fontSize: 12, fontWeight: "600", marginTop: 8 }}>{step.label}</Text>
                                    {step.date && <Text style={{ textAlign: "center", fontSize: 10, color: "gray" }}>{step.date}</Text>}
                                </View>
                            ))}
                        </View>
                        {/* Collection Code Card */}
                        <View style={{ backgroundColor: "#f3f3f3", padding: 16, borderRadius: 12, alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, marginVertical: 20, marginHorizontal: 10 }}>
                            {status === 0 ? (
                                <View style={{ width: "100%", alignItems: "center", justifyContent: "center" }}>
                                    <Text style={{ fontSize: 16, fontWeight: "500", marginBottom: 4 }}>Awaiting for lender's confirmation</Text>
                                    <TouchableOpacity
                                        style={{
                                            backgroundColor: COLORS.primary,
                                            padding: 10,
                                            borderRadius: 10,
                                            marginVertical: 10,
                                            width: '80%',
                                            alignItems: 'center',
                                        }}
                                        onPress={async () => {
                                            console.log('LOG: ', borrowing.collectionCode);
                                            // await updateBorrowing(borrowing.id || 'undefined', { status: status! + 1 });
                                            // setStatus(status! + 1);
                                        }}
                                    >
                                        <Text style={{ color: 'white', fontWeight: 'bold' }}>Message lender</Text>
                                    </TouchableOpacity>
                                    <Text style={{ fontSize: 10, color: COLORS.black, textAlign: 'center' }}>The lender needs to confirm this borrowing.</Text>
                                </View>
                            ) : status === 1 ? (
                                <View style={{ width: "100%", alignItems: "center", justifyContent: "center" }}>
                                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Your collection code is</Text>
                                    <Text style={{ fontSize: 24, fontWeight: "bold", color: "indigo" }}>{borrowing.collectionCode}</Text>
                                </View>
                            ) : status === 2 ? (
                                <View style={{ width: "100%", alignItems: "center", justifyContent: "center" }}>
                                    <Text style={{ fontWeight: 'bold' }}>Please confirm this pickup?</Text>
                                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10 }}>
                                        <TouchableOpacity
                                            style={{
                                                backgroundColor: COLORS.primary,
                                                padding: 10,
                                                borderRadius: 10,
                                                marginVertical: 10,
                                                width: '40%',
                                                alignItems: 'center',
                                            }}
                                            onPress={() => { }}
                                        >
                                            <Text style={{ color: 'white', fontWeight: 'bold' }}>No</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={{
                                                backgroundColor: COLORS.primary,
                                                padding: 10,
                                                borderRadius: 10,
                                                marginVertical: 10,
                                                width: '40%',
                                                alignItems: 'center',
                                            }}
                                            onPress={async () => {
                                                await updateBorrowing(borrowing.id || 'undefined', { status: status! + 1 });
                                                setStatus(status! + 1);
                                            }}
                                        >
                                            <Text style={{ color: 'white', fontWeight: 'bold' }}>Yes</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ) : status === 3 ? (
                                <View style={{ width: "100%", alignItems: "center", justifyContent: "center" }}>
                                    <Text>Active Rental</Text>
                                    <Text style={{ fontSize: 16, fontWeight: "500", marginBottom: 4 }}>
                                        {borrowing?.endDate ? `${Math.ceil((new Date(borrowing.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days left` : "N/A"}
                                    </Text>
                                    <Text style={{ fontSize: 12, marginBottom: 4, marginTop: 10 }}>{borrowing.status}</Text>
                                    <TouchableOpacity
                                        style={{
                                            backgroundColor: COLORS.primary,
                                            padding: 10,
                                            borderRadius: 10,
                                            marginVertical: 10,
                                            width: '80%',
                                            alignItems: 'center',
                                        }}
                                        onPress={async () => {
                                            await updateBorrowing(borrowing.id || 'undefined', { status: status! + 1, returnCode: Math.floor(1000000 + Math.random() * 9000000).toString() });
                                            setStatus(status! + 1);
                                        }}
                                    >
                                        <Text style={{ color: 'white', fontWeight: 'bold' }}>Return Borrowing</Text>
                                    </TouchableOpacity>
                                    <Text style={{ fontSize: 10, color: COLORS.black, textAlign: 'center' }}>The code need to be showed to the borrower upon return</Text>
                                </View>
                            ) : status === 4 ? (
                                <View style={{ width: "100%", alignItems: "center", justifyContent: "center" }}>
                                    <Text style={{ fontSize: 16, fontWeight: "500", marginBottom: 4 }}>Your return code:</Text>
                                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10 }}>
                                        {returnCode.map((digit, index) => (
                                            <TextInput
                                                key={index}
                                                ref={(el) => { inputs.current[index] = el; }}
                                                style={{ width: 35, height: 50, borderWidth: 2, borderColor: COLORS.blackLight, textAlign: "center", fontSize: 20, borderRadius: 10 }}
                                                keyboardType="numeric"
                                                maxLength={1}
                                                value={digit}
                                                onChangeText={(text) => handleChange(text, index)}
                                                onKeyPress={(e) => handleKeyPress(e, index)}
                                                returnKeyType="done"
                                            />
                                        ))}
                                    </View>
                                    <Text style={{ fontSize: 12, marginBottom: 4, marginTop: 10 }}>{borrowing.status.toString()}</Text>
                                    <Text style={{ fontSize: 12, marginBottom: 4, marginTop: 10 }}>{borrowing.returnCode.toString()}</Text>
                                    <Text style={{ fontSize: 12, marginBottom: 4, marginTop: 10, color: COLORS.danger }}>{validationMessage}</Text>
                                </View>
                            ) : status === 5 ? (
                                <View style={{ width: "100%", alignItems: "center", justifyContent: "center" }}>
                                    <Text style={{ fontSize: 16, fontWeight: "500", marginBottom: 4 }}>Awaiting for lender's return confirmation</Text>
                                    <TouchableOpacity
                                        style={{
                                            backgroundColor: COLORS.primary,
                                            padding: 10,
                                            borderRadius: 10,
                                            marginVertical: 10,
                                            width: '80%',
                                            alignItems: 'center',
                                        }}
                                        onPress={async () => {
                                            await updateBorrowing(borrowing.id || 'undefined', { status: status! + 1 });
                                            setStatus(status! + 1);
                                        }}
                                    >
                                        <Text style={{ color: 'white', fontWeight: 'bold' }}>Message lender</Text>
                                    </TouchableOpacity>
                                    <Text style={{ fontSize: 10, color: COLORS.black, textAlign: 'center' }}>The lender needs to confirm this return.</Text>
                                </View>
                            ) : (
                                <View style={{ width: "100%", alignItems: "center", justifyContent: "center" }}>
                                    {review ? (
                                        review.borrowerStatus === 0 ? (
                                            <TouchableOpacity
                                                style={{
                                                    backgroundColor: COLORS.primary,
                                                    padding: 10,
                                                    borderRadius: 10,
                                                    marginVertical: 10,
                                                    width: '80%',
                                                    alignItems: 'center',
                                                }}
                                                onPress={() => {
                                                    console.log('Review found');
                                                    navigation.navigate('BorrowerAddReview', { reviewId: review.id || 'newReview', borrowing: borrowing });
                                                }}
                                            >
                                                <Text style={{ color: 'white', fontWeight: 'bold' }}>Edit Review</Text>
                                            </TouchableOpacity>
                                        ) : review.borrowerStatus ? (
                                            <TouchableOpacity
                                                style={{
                                                    backgroundColor: COLORS.primary,
                                                    padding: 10,
                                                    borderRadius: 10,
                                                    marginVertical: 10,
                                                    width: '80%',
                                                    alignItems: 'center',
                                                }}
                                                onPress={() => { }}
                                            >
                                                <Text style={{ color: 'white', fontWeight: 'bold' }}>Review Completed</Text>
                                            </TouchableOpacity>
                                        ) : (
                                            <TouchableOpacity
                                                style={{
                                                    backgroundColor: COLORS.primary,
                                                    padding: 10,
                                                    borderRadius: 10,
                                                    marginVertical: 10,
                                                    width: '80%',
                                                    alignItems: 'center',
                                                }}
                                                onPress={() => {
                                                    console.log('Review found');
                                                    navigation.navigate('BorrowerAddReview', { reviewId: review.id || 'newReview', borrowing: borrowing });
                                                }}
                                            >
                                                <Text style={{ color: 'white', fontWeight: 'bold' }}>Review</Text>
                                            </TouchableOpacity>
                                        )
                                    ) : (
                                        <TouchableOpacity
                                            style={{
                                                backgroundColor: COLORS.primary,
                                                padding: 10,
                                                borderRadius: 10,
                                                marginVertical: 10,
                                                width: '80%',
                                                alignItems: 'center',
                                            }}
                                            onPress={async () => {
                                                const newReview = await createReview({
                                                    borrowingId: borrowing.id || '',
                                                    borrowerReviewerId: user?.uid || '',
                                                    borrowerOverallRating: 0,
                                                    productId: borrowing.product.id || '',

                                                    borrowerCollectionRating: 0,
                                                    borrowerCollectionFeedback: [''],
                                                    borrowerOtherCollectionReview: '',
                                                    borrowerReturnRating: 0,
                                                    borrowerReturnFeedback:  [''],
                                                    borrowerOtherReturnReview: '',
                                                    borrowerListingMatch: '',
                                                    borrowerListingMatchFeedback: [''],
                                                    borrowerOtherListingMatchReview: '',
                                                    borrowerCommunicationRating: 0,
                                                    borrowerCommunicationFeedback: [''],
                                                    borrowerOtherCommunicationReview: '',
                                                    borrowerProductConditionRating: 0,
                                                    borrowerProductConditionFeedback: [''],
                                                    borrowerOtherProductConditionReview: '',
                                                    borrowerPriceWorthyRating: 0,
                                                    borrowerPublicReview: '',
                                                    borrowerPrivateNotesforLender: '',
                                                    borrowerUpdatedAt: new Date(),
                                                    borrowerCreateAt: new Date(),
                                                    borrowerStatus: 0,
                                                }, borrowing.product.id || 'undefined');
                                                console.log('Review not found');
                                                navigation.navigate('BorrowerAddReview', { reviewId: newReview, borrowing: borrowing });
                                            }}
                                        >
                                            <Text style={{ color: 'white', fontWeight: 'bold' }}>Review</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            )
                            }
                        </View>
                        {/* Images View */}
                        <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                            {/* Large Preview Image */}
                            {selectedImage ? (
                                <View style={[GlobalStyleSheet.container, { flex: 1 }]}>
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
                        </View>
                        {/* Borrowing Details */}
                        <View style={{ width: '100%', marginTop: 10 }}>
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
                                                <Text style={{ color: COLORS.blackLight }}>No image selected</Text>
                                            </View>
                                        )
                                    }
                                </View>
                                <View style={{ flex: 7, paddingLeft: 20 }}>
                                    <TouchableOpacity
                                        // onPress={() => navigation.navigate('ProductDetails', { product: borrowing.product })}>
                                        onPress={() => { }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Text style={{ fontSize: 20, fontWeight: 'bold', color: COLORS.black, textDecorationLine: 'underline' }}>{borrowing.product.title}</Text>
                                            <Ionicons name="link" size={20} color={COLORS.blackLight} style={{ marginLeft: 5 }} />
                                        </View>
                                    </TouchableOpacity>
                                    <Text style={{ fontSize: 14, color: COLORS.blackLight }}>by {owner?.firstName} {owner?.lastName} </Text>
                                </View>
                            </View>
                            <View style={GlobalStyleSheet.line} />
                            <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 20 }}>Borrowing Notes</Text>
                            <Text style={{ marginBottom: 30 }}>{greetings + '\n'}</Text>
                            <Text style={{ marginBottom: 30 }}>{borrowing.product.borrowingNotes}</Text>
                            <View style={GlobalStyleSheet.line} />
                            <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 20 }}>Pickup Instructions</Text>
                            <Text style={{ marginBottom: 30 }}>{borrowing.product.pickupInstructions}</Text>
                            <View style={GlobalStyleSheet.line} />
                            <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 20, marginBottom: 10 }}>Location</Text>
                            <View style={{ height: 200, borderRadius: 20, overflow: 'hidden', borderColor: COLORS.blackLight, borderWidth: 1, }}>
                                <MapView
                                    ref={mapRef}
                                    style={{ height: '100%' }}
                                    initialRegion={{
                                        latitude: borrowing.product.latitude,
                                        longitude: borrowing.product.longitude,
                                        latitudeDelta: 0.0005,
                                        longitudeDelta: 0.0005,
                                    }}
                                    scrollEnabled={false}
                                    zoomEnabled={false}
                                    rotateEnabled={false}
                                    pitchEnabled={false}
                                    toolbarEnabled={false}
                                >
                                    <Marker
                                        coordinate={{
                                            latitude: borrowing.product.latitude,
                                            longitude: borrowing.product.longitude,
                                        }}
                                        title="Selected Location"
                                    />
                                </MapView>
                                <View style={GlobalStyleSheet.line} />
                            </View>
                            <Text style={{ marginBottom: 30, marginTop: 5 }}>{borrowing.product.addressName}, {borrowing.product.address}</Text>
                            <View style={GlobalStyleSheet.line} />
                            <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 20 }}>Return Instructions</Text>
                            <Text style={{ marginBottom: 30 }}>{borrowing.product.returnInstructions}</Text>
                            <View style={GlobalStyleSheet.line} />
                            <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 20 }}>Additional Information</Text>
                            <FlatList
                                scrollEnabled={false}
                                data={actions}
                                keyExtractor={(item, index) => index.toString()}
                                numColumns={2}
                                columnWrapperStyle={{ justifyContent: 'space-between', marginTop: 20 }}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={{
                                            backgroundColor: COLORS.background,
                                            padding: 10,
                                            borderRadius: 10,
                                            borderWidth: 1,
                                            borderColor: COLORS.blackLight,
                                            width: '48%',
                                            alignItems: 'center',
                                        }}
                                        onPress={item.onPressAction}
                                    >
                                        <Text style={{ color: COLORS.black, fontWeight: 'bold' }}>{item.buttonTitle}</Text>
                                    </TouchableOpacity>
                                )}
                            />
                            <View style={{ marginTop: 40 }} >
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    style={{
                                        paddingHorizontal: 20,
                                        borderRadius: 30,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: 10
                                    }}
                                    onPress={() => { }}
                                >
                                    <Text style={{ fontSize: 14, color: COLORS.danger, lineHeight: 21, fontWeight: 'bold', textDecorationLine: 'underline' }}>Cancel Rental</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            ) : (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: COLORS.black }}>Product not found 404</Text>
                </View>
            )}
        </View>
    )
}

export default MyBorrowingDetails