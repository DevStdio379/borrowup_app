import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from './RootStackParamList';
import { View } from 'react-native';

import OnBoarding from '../screens/Auth/Onboarding';
import SignUp from '../screens/Auth/SignUp';


const StackComponent = createStackNavigator<RootStackParamList>();

const StackNavigator = () => {
	return (
		<View style={{ width: '100%', flex: 1 }}>
			<StackComponent.Navigator
				initialRouteName='OnBoarding'
				screenOptions={{
					headerShown: false,
					cardStyle: { backgroundColor: "transparent" },
					// cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
				}}
			>
				<StackComponent.Screen name="OnBoarding" component={OnBoarding} />
				<StackComponent.Screen name="SignUp" component={SignUp} />
			</StackComponent.Navigator>
		</View>
	)
}

export default StackNavigator;