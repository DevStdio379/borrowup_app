import { NavigatorScreenParams } from "@react-navigation/native";
import { BorrowerBottomTabParamList } from "./BorrowerBottomTabParamList";
import { Borrowing } from "../services/BorrowingServices";

export type RootStackParamList = {
    DrawerNavigation: NavigatorScreenParams<BorrowerBottomTabParamList>;
    OnBoarding: undefined;
    SignUp: undefined;
    SignIn: undefined;

    Home: undefined;
    Products: undefined;
    ProductDetails: { productId: string };
    PaymentSuccess: { borrowingId: string, collectionCode: string, latitude: number, longitude: number, addressName: string, address: string, postcode: string };
    Map: undefined;
    MyBorrowings: undefined;
    MyBorrowingDetails: { borrowingId: string };
    AddReview: { borrowing: Borrowing };
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
    LendingDetails: { lendingId: string };
    Listings: undefined;
    AddListing: { listingId: string };
    LenderDashboard: undefined;
    Messages: undefined;

};