import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from './RootStackParamList';
import { View } from 'react-native';

import OnBoarding from '../screens/Auth/Onboarding';
import SignUp from '../screens/Auth/SignUp';
import SignIn from '../screens/Auth/SignIn';
import DrawerNavigation from './DrawerNavigation';
import MyCalendar from '../screens/LenderPanel/MyCalendar';
import LenderDashboard from '../screens/LenderPanel/LenderDashboard';
import Listings from '../screens/LenderPanel/Listings';
import AddListing from '../screens/LenderPanel/AddListing';
import EditAttributes from '../screens/Profile/EditAttributes';
import PersonalDetails from '../screens/Profile/PersonalDetails';
import AddressBook from '../screens/Profile/AddressBook';
import Profile from '../screens/Profile/Profile';
import SearchAddress from '../screens/Profile/SearchAddress';
import AddAddress from '../screens/Profile/AddAddress';
import EditLocationPinPoint from '../screens/Profile/EditLocationPinPoint';
import PaymentInformation from '../screens/Profile/PaymentInformation';


const StackComponent = createStackNavigator<RootStackParamList>();

const StackNavigator = () => {
	return (
		<View style={{ width: '100%', flex: 1 }}>
			<StackComponent.Navigator
				initialRouteName='SignIn'
				screenOptions={{
					headerShown: false,
					cardStyle: { backgroundColor: "transparent" },
					// cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
				}}
			>
				<StackComponent.Screen name="OnBoarding" component={OnBoarding} />
				<StackComponent.Screen name="SignUp" component={SignUp} />
				<StackComponent.Screen name="SignIn" component={SignIn} />

				<StackComponent.Screen name="DrawerNavigation" component={DrawerNavigation} />
				<StackComponent.Screen name="Profile" component={Profile} />
				<StackComponent.Screen name="PersonalDetails" component={PersonalDetails} />
				<StackComponent.Screen name="EditAttributes" component={EditAttributes} />
				<StackComponent.Screen name="AddressBook" component={AddressBook} />
				<StackComponent.Screen name="SearchAddress" component={SearchAddress} />
				<StackComponent.Screen name="AddAddress" component={AddAddress} />
				<StackComponent.Screen name="EditLocationPinPoint" component={EditLocationPinPoint} />
				<StackComponent.Screen name="PaymentInformation" component={PaymentInformation} />

				<StackComponent.Screen name="LenderDashboard" component={LenderDashboard} />
				<StackComponent.Screen name="Listings" component={Listings} />
				<StackComponent.Screen name="AddListing" component={AddListing} />
				<StackComponent.Screen name="MyCalendar" component={MyCalendar} />
			</StackComponent.Navigator>
		</View>
	)
}

export default StackNavigator;