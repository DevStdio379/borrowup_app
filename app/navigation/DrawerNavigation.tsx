import React from 'react';
// import * as React from 'react';
import { SafeAreaView, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import DrawerMenu from '../layout/DrawerMenu';
import { useUser } from '../context/UserContext';
import SideMenu from 'react-native-side-menu-updated';
import BottomNavigation from './BottomNavigation';
import { useDispatch, useSelector } from 'react-redux';
import { closeDrawer } from '../redux/actions/drawerAction';

const DrawerNavigation = () => {

    const { isOpen } = useSelector((state: any) => state.drawer);
    const dispatch = useDispatch();
    const { colors } = useTheme();
    const { user } = useUser();

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