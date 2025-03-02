import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LenderBottomTabParamList } from './LenderBottomTabParamList';
import { useTheme } from '@react-navigation/native';
import LenderBottomMenu from '../layout/LenderBottomMenu';
import LenderDashboard from '../screens/LenderPanel/LenderDashboard';
import MyCalendarScreen from '../screens/LenderPanel/MyCalendar';
import ListingsScreen from '../screens/LenderPanel/Listings';
import MessagesScreen from '../screens/LenderPanel/Messages';
import ProfileScreen from '../screens/Profile/Profile';



const Tab = createBottomTabNavigator<LenderBottomTabParamList>();


const LenderBottomNavigation = () => {

    const theme = useTheme();
    const {colors}:{colors : any} = theme;

    return (
        <Tab.Navigator
            initialRouteName='LenderDashboard'
            screenOptions={{
            headerShown : false
            }}
            tabBar={(props:any) => <LenderBottomMenu {...props}/>}
        >
            <Tab.Screen 
            name='MyCalendar'
            component={MyCalendarScreen}
            />
            <Tab.Screen 
            name='Listings'
            component={ListingsScreen}
            />
            <Tab.Screen 
            name='LenderDashboard'
            component={LenderDashboard}
            />
            <Tab.Screen 
            name='Messages'
            component={MessagesScreen}
            />
            <Tab.Screen 
            name='Profile'
            component={ProfileScreen}
            />
        </Tab.Navigator>
    )
}

export default LenderBottomNavigation;