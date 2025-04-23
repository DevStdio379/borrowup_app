import { Borrowing } from "../services/BorrowingServices";

export type BottomTabParamList = {

    FavouriteStack: undefined;
    HomeStack: undefined;
    MyBorrowingsStack: undefined;
    MyBorrowingDetails: { borrowing: Borrowing };
    ChatList: undefined;
    Category: undefined;
    ProfileStack: undefined;

    LenderDashboard: undefined;
    MyLendings: undefined;
    LendingDetails: { lending: Borrowing };
    Listings: undefined;
    // ChatList: undefined;
    // Profile: undefined;
};