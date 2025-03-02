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
    AddressBook: undefined;
    SearchAddress: undefined;
    AddAddress: { address: { latitude: any, longitude: any, addressName: string, address: string } }
    EditLocationPinPoint: { location: { latitude: any, longitude: any, addressName: string, address: string } }
    PaymentInformation: undefined;

    // Lender Profile
    MyCalendar: undefined;
    Listings: undefined;
    AddListing: { listingId: string };
    LenderDashboard: undefined;
    Messages: undefined;

};