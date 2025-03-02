import React from 'react';
// import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { SafeAreaView } from 'react-native';
import { useTheme } from '@react-navigation/native';
import DrawerMenu from '../layout/DrawerMenu';
import BorrowerBottomNavigation from './BorrowerBottomNavigation';
import { useUser } from '../context/UserContext';

const Drawer = createDrawerNavigator();
const DrawerNavigation = () => {

    const { colors } = useTheme();
    const {user} = useUser();

    return (
        <>
            {/* <BottomNavigation/> */}
            <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
                <Drawer.Navigator
                    initialRouteName= {  user?.accountType === 'borrower' ? 'BorrowerBottomNavigation' : 'BorrowerBottomNavigation' }
                    screenOptions={{
                        headerShown: false,
                        drawerType:'slide',
                        overlayColor:'transparent',
                    }}
                    drawerContent={(props) => {
                        return <DrawerMenu navigation={props.navigation} />
                    }}
                    >
                    <Drawer.Screen name={  user?.accountType === 'borrower' ? 'BorrowerBottomNavigation' : 'BorrowerBottomNavigation' } component={user?.accountType === 'borrower' ? BorrowerBottomNavigation: BorrowerBottomNavigation} />
                </Drawer.Navigator>
            </SafeAreaView>
        </>
    );
};


export default DrawerNavigation;