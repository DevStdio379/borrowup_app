import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomTabParamList } from './BottomTabParamList';
import MyBorrowingScreen from '../screens/MyBorrowings/MyBorrowings';
import ChatScreen from '../screens/Chat/Chat';
import HomeScreen from '../screens/Home/Home';
import MapScreen from '../screens/Map/Map';
import ProfileScreen from '../screens/Profile/Profile';
import BottomMenu from '../layout/BottomMenu';
import { useTheme } from '@react-navigation/native';


const Tab = createBottomTabNavigator<BottomTabParamList>();


const BottomNavigation = () => {

    const theme = useTheme();
    const {colors}:{colors : any} = theme;

    return (
        <Tab.Navigator
            initialRouteName='Home'
            screenOptions={{
                headerShown : false
            }}
            tabBar={(props:any) => <BottomMenu {...props}/>}
        >
            <Tab.Screen 
                name='Map'
                component={MapScreen}
            />
            <Tab.Screen 
                name='MyBorrowings'
                component={MyBorrowingScreen}
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

export default BottomNavigation;