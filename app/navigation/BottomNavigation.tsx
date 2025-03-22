import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomTabParamList } from './BottomTabParamList';
import MyBorrowingScreen from '../screens/MyBorrowings/MyBorrowings';
import ChatListScreen from '../screens/Chat/ChatList';
import HomeScreen from '../screens/Home/Home';
import MapScreen from '../screens/Map/Map';
import ProfileScreen from '../screens/Profile/Profile';
import BottomMenu from '../layout/BottomMenu';
import { useUser } from '../context/UserContext';
import LenderDashboard from '../screens/LenderPanel/LenderDashboard';
import MyCalendarScreen from '../screens/LenderPanel/MyCalendar';
import ListingsScreen from '../screens/LenderPanel/Listings';
import HomeStack from './HomeStack';
import ProfileStack from './ProfileStack';


const Tab = createBottomTabNavigator<BottomTabParamList>();


const BottomNavigation = () => {
    const { user } = useUser();

    if (!user) {
        return null;
    }
    
    return (
        user.accountType === 'borrower' ? (
            <Tab.Navigator
                initialRouteName='Home'
                screenOptions={{
                    headerShown: false
                }}
                tabBar={(props: any) => <BottomMenu {...props} />}
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
                    component={HomeStack}  // Use HomeStack here
                />
                <Tab.Screen
                    name='ChatList'
                    component={ChatListScreen}
                />
                <Tab.Screen
                    name='Profile'
                    component={ProfileStack}
                />
            </Tab.Navigator>
        ) : (
            <Tab.Navigator
                initialRouteName='LenderDashboard'
                screenOptions={{
                    headerShown: false
                }}
                tabBar={(props: any) => <BottomMenu {...props} />}
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
                    name='ChatList'
                    component={ChatListScreen}
                />
                <Tab.Screen
                    name='Profile'
                    component={ProfileScreen}
                />
            </Tab.Navigator>
        )
    )
}

export default BottomNavigation;