
import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BorrowerBottomTabParamList } from './BorrowerBottomTabParamList';
import ChatScreen from '../screens/Chat/Chat';
import HomeScreen from '../screens/Home/Home';
import MapScreen from '../screens/Map/Map';
import ProfileScreen from '../screens/Profile/Profile';
import BorrowerBottomMenu from '../layout/BorrowerBottomMenu';
import { useTheme } from '@react-navigation/native';
import MyBorrowings from '../screens/MyBorrowings/MyBorrowings';


const Tab = createBottomTabNavigator<BorrowerBottomTabParamList>();


const BorrowerBottomNavigation = () => {

    const theme = useTheme();
    const {colors}:{colors : any} = theme;

    return (
        <Tab.Navigator
        initialRouteName='Home'
        screenOptions={{
            headerShown : false
        }}
        tabBar={(props:any) => <BorrowerBottomMenu {...props}/>}
    >
        <Tab.Screen 
            name='Map'
            component={MapScreen}
        />
        <Tab.Screen 
            name='MyBorrowings'
            component={MyBorrowings}
        />
        <Tab.Screen 
            name='Home'
            component={HomeScreen}
        />
        <Tab.Screen 
            name='Chat'
            component={ChatScreen}
        />
        <Tab.Screen 
            name='Profile'
            component={ProfileScreen}
        />
    </Tab.Navigator>
    )
}

export default BorrowerBottomNavigation;