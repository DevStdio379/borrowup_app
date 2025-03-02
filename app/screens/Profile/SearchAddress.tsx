import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Alert, FlatList, TextInput, TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import axios from "axios";
import { COLORS, SIZES } from "../../constants/theme";
import { GlobalStyleSheet } from "../../constants/StyleSheet";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/RootStackParamList";

const GOOGLE_PLACES_API_KEY = "AIzaSyB1wqLWl6aAosy_4qXuex_euKpu6aMoxbE"; // Replace with your Google API Key

type SearchAddressScreenProps = StackScreenProps<RootStackParamList, 'SearchAddress'>;
const SearchAddress = ({ navigation, route }: SearchAddressScreenProps) => {

  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [places, setPlaces] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<{ latitude: number; longitude: number; address: string; addressName?: string } | null>(null);
  const [isAddressSelected, setIsAddressSelected] = useState(false);

  const mapRef = useRef<MapView | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission denied", "Allow location access to continue");
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      setSelectedLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        address: "Current Location",
      });
    })();
  }, []);

  const handleBackToSearch = () => {
    setIsAddressSelected(false);
    setSelectedLocation(null);
    setSearchQuery("");
    setPlaces([]);
  };

  const fetchPlacesAutocomplete = async (input: string) => {
    if (!location) return;
    const { latitude, longitude } = location.coords;

    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&location=${latitude},${longitude}&radius=5000&key=${GOOGLE_PLACES_API_KEY}`;

    try {
      const response = await axios.get(url);
      if (response.data.status === "OK") {
        setPlaces(response.data.predictions);
      } else {
        setPlaces([]);
      }
    } catch (error) {
      console.error("Error fetching autocomplete:", error);
    }
  };

  const fetchPlaceDetails = async (placeId: string, description: string) => {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_PLACES_API_KEY}`;
    try {
      const response = await axios.get(url);
      if (response.data.status === "OK") {
        const { lat, lng } = response.data.result.geometry.location;
        const parts = description.split(",");
        const addressName = parts[0];
        const address = parts.slice(1).join(",").trim();

        const newLocation = {
          latitude: lat,
          longitude: lng,
          addressName,
          address,
        };

        setSelectedLocation(newLocation);
        setIsAddressSelected(true);

        mapRef.current?.animateToRegion({
          latitude: newLocation.latitude,
          longitude: newLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      } else {
        Alert.alert("Error", "Failed to fetch place details");
      }
    } catch (error) {
      console.error("Error fetching place details:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ position: 'absolute', zIndex: 99 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 10, paddingTop: 30, backgroundColor: "transparent" }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ position: 'absolute', left: 10, top: 20, backgroundColor: COLORS.card, borderRadius: 11, padding: 10, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5 }}>
            <Ionicons name="chevron-back" size={24} color={COLORS.title} />
          </TouchableOpacity>
          <View style={{ width: SIZES.width, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5 }}>Map</Text>
          </View>
        </View>
      </View>
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
          {selectedLocation && (
            <Marker
              coordinate={{
                latitude: selectedLocation.latitude,
                longitude: selectedLocation.longitude,
              }}
              title="Selected Location"
            />
          )}
        </MapView>
      ) : (
        <Text>Fetching location...</Text>
      )}

      {!isAddressSelected ? (
        <View style={styles.searchContainer}>
          <View style={styles.searchRow}>
            <Ionicons name="chevron-back" size={20} color={COLORS.title} />
            <TextInput
              style={styles.searchBar}
              placeholder="Search nearby places..."
              value={searchQuery}
              onChangeText={(text) => {
                setSearchQuery(text);
                fetchPlacesAutocomplete(text);
              }}
            />
          </View>
          <FlatList
            data={places}
            keyExtractor={(item) => item.place_id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.placeItem}
                onPress={() => fetchPlaceDetails(item.place_id, item.description)}
              >
                <Text>{item.description}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      ) : (
        <View style={[GlobalStyleSheet.container, { paddingHorizontal: 15, alignItems: 'center', justifyContent: 'center', paddingTop: 100, borderTopRightRadius: 22, borderTopLeftRadius: 22 }]}>
          <View style={[GlobalStyleSheet.flexcenter, { width: '100%', gap: 20, justifyContent: 'space-between', marginBottom: 15, alignItems: 'flex-start' }]} >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20, width: SIZES.width * 0.8 }}>
              <Ionicons name="location" size={26} color={COLORS.title} />
              <View style={{ width: SIZES.width * 0.7 }}>
                <Text style={{ fontSize: 16, color: COLORS.title, fontWeight: 'bold' }}>{selectedLocation?.addressName}</Text>
                <Text style={{ fontSize: 14, color: COLORS.title }}>{selectedLocation?.address}</Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleBackToSearch}>
                <Ionicons name="pencil" size={20} color={COLORS.title} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={[GlobalStyleSheet.flexcenter, { width: '100%', justifyContent: 'space-between', marginTop: 45, paddingVertical: 20, paddingHorizontal: 10, alignItems: 'flex-start', backgroundColor: COLORS.placeholder, borderRadius: 11 }]} >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, width: SIZES.width * 1 }}>
              <Ionicons name="information-circle" size={26} color={COLORS.title} />
              <View style={{ width: SIZES.width * 1 }}>
                <Text style={{ fontSize: 14, color: COLORS.title }}> Your order will be delivered to the pinned location.</Text>
              </View>
            </View>
          </View>
          <View style={{ marginTop: 10 }}>
            <TouchableOpacity
              style={{ borderRadius: 12, backgroundColor: COLORS.primary, padding: 20, alignItems: 'center', width: SIZES.width * 0.9 }}
              onPress={() => {
                if (selectedLocation) {
                  navigation.navigate('AddAddress', { address: { ...selectedLocation, addressName: selectedLocation?.addressName || '' } });
                } else {
                  Alert.alert("Error", "No location selected");
                }
              }}
            >
              <Text style={{ color: COLORS.white, fontWeight: 'bold' }}>Add Location Details</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  map: { width: "100%", height: "50%" },
  searchContainer: { paddingHorizontal: 10, marginBottom: 10, paddingTop: 20 },
  searchRow: { flexDirection: "row", alignItems: "center", marginBottom: 10, gap: 10 },
  searchBar: {
    flex: 1,
    padding: 10,
    backgroundColor: COLORS.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
  },
  placeItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  confirmationContainer: { padding: 20, alignItems: "center" },
  locationDetails: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  addressName: { fontSize: 16, fontWeight: "bold" },
  address: { fontSize: 14 },
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.placeholder,
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  infoText: { marginLeft: 10 },
  backButton: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 12,
    width: "90%",
    alignItems: "center",
  },
  backButtonText: { color: COLORS.white, fontWeight: "bold" },
});

export default SearchAddress