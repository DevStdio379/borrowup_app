import { NavigatorScreenParams } from "@react-navigation/native";
import { BorrowerBottomTabParamList } from "./BorrowerBottomTabParamList";

export type RootStackParamList = {
    DrawerNavigation: NavigatorScreenParams<BorrowerBottomTabParamList>;
    OnBoarding: undefined;
    SignUp: undefined;
    SignIn: undefined;

    Home: undefined;
    Map: undefined;
    MyBorrowings: undefined;
    Chat: undefined;
    Profile: undefined;
    PersonalDetails: undefined;
    EditAttributes: { profileAttribute: { attributeName: string } };

    // Lender Profile
    MyCalendar: undefined;
    Listings: undefined;
    AddListing: { listingId: string };
    LenderDashboard: undefined;
    Messages: undefined;

};