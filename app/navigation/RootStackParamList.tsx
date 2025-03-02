import { NavigatorScreenParams } from "@react-navigation/native";
import { BorrowerBottomTabParamList } from "./BorrowerBottomTabParamList";

export type RootStackParamList = {
    DrawerNavigation: NavigatorScreenParams<BorrowerBottomTabParamList>;
    OnBoarding: undefined;
    SignUp: undefined;

    Home: undefined;
    Map: undefined;
    MyBorrowings: undefined;
    Chat: undefined;
    Profile: undefined;
    
};