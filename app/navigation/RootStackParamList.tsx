import { NavigatorScreenParams } from "@react-navigation/native";
import { BottomTabParamList } from "./BottomTabParamList";
import { Borrowing } from "../services/BorrowingServices";
import { Product } from "../services/ProductServices";

export type RootStackParamList = {
    DrawerNavigation: NavigatorScreenParams<BottomTabParamList>;
    OnBoarding: undefined;
    SignUp: undefined;
    SignIn: undefined;

    Home: undefined;
    Products: undefined;
    ProductDetails: { product: Product };
    PaymentSuccess: { borrowingId: string, collectionCode: string, latitude: number, longitude: number, addressName: string, address: string, postcode: string };
    Map: undefined;
    MyBorrowings: undefined;
    MyBorrowingDetails: { borrowing: Borrowing };
    BorrowerAddReview: { reviewId: string, borrowing: Borrowing };

    ChatList: undefined;
    NewChat: undefined;
    Chat: { chatId: string };
    Profile: undefined;
    PersonalDetails: undefined;
    EditAttributes: { profileAttribute: { attributeName: string } };
    AddressBook: undefined;
    SearchAddress: undefined;
    AddAddress: { address: { latitude: any, longitude: any, addressName: string, address: string } }
    EditLocationPinPoint: { location: { latitude: any, longitude: any, addressName: string, address: string } }
    PaymentInformation: undefined;

    Search: undefined;
    SearchResults: { query: string, allSearchResults: any };

    // Lender Profile
    MyCalendar: undefined;
    LendingDetails: { lending: Borrowing };
    LenderAddReview: { reviewId: string, lending: Borrowing };
    Listings: undefined;
    AddListing: { listing: Borrowing };
    LenderDashboard: undefined;
    Messages: undefined;

    Temp: undefined;

};