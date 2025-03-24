import React from 'react';
// import * as React from 'react';
import { SafeAreaView, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useUser } from '../context/UserContext';
import SideMenu from 'react-native-side-menu-updated';
import BottomNavigation from './BottomNavigation';
import { useDispatch, useSelector } from 'react-redux';

const DrawerNavigation = () => {
    const { colors } = useTheme();
    return (
        <>
            <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
                {/* <SideMenu
                    isOpen={isOpen}
                    menu={
                        <View style={{ flex: 1 }}>
                            <DrawerMenu />
                        </View>
                    }
                    // onChange={(e) => console.log(e)}
                    onChange={(e) => { (e === false) ? dispatch(closeDrawer()) : null }}
                /> */}
                <BottomNavigation />
            </SafeAreaView >
        </>
    );
};


export default DrawerNavigation;