import { db } from './firebaseConfig';
import { collection, addDoc, query, where, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';

export interface Borrowing {
  id?: string;
  userId: string;
  status: number;
  startDate: string;
  endDate: string;
  // user copy
  firstName: string,
  lastName: string,
  // owner copy
  ownerFirstName: string,
  ownerLastName: string,
  // products copy
  productId: string;
  productOwnerId: string;
  productTitle: string;
  productDescription: string;
  productCategory: string;
  productImageUrls: string[];
  productLendingRate: number;
  productCollectionTime: string;
  productReturnTime: string;
  productAvailableDays: string[];
  productBorrowingNotes: string;
  productPickupInstructions: string;
  productReturnInstructions: string;
  productAddressID: string;
  productIsCollectDeposit: boolean;
  productDepositAmount: number;
  // end products copy
  // address copy
  latitude: number;
  longitude: number;
  addressName: string;
  address: string;
  buildingType: string;
  additionalDetails: string;
  postcode: string;
  addressLabel: string;
  instruction: string;
  // end address copy
  total: number;
  deliveryMethod: string;
  paymentMethod: string;
  // collection and return code
  collectionCode: string;
  returnCode: string;
  createAt: any;
  updatedAt: any;
}

export const createBorrowing = async (borrowingData: Borrowing) => {
  try {
    const borrowingRef = collection(db, 'borrowings');
    const docRef = await addDoc(borrowingRef, borrowingData);
    console.log('Borrowing created with ID: ', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error placing borrowing: ', error);
  }
};


const mapBorrowingData = (doc: any): Borrowing => {
  const data = doc.data();
  return {
    id: doc.id,
    userId: data.userId,
    status: data.status,
    startDate: data.startDate,
    endDate: data.endDate,
    // user copy
    firstName: data.firstName,
    lastName: data.lastName,
    // owner copy
    ownerFirstName: data.ownerFirstName,
    ownerLastName: data.ownerLastName,
    // products copy
    productId: data.productId,
    productOwnerId: data.productOwnerId,
    productTitle: data.productTitle,
    productDescription: data.productDescription,
    productCategory: data.productCategory,
    productImageUrls: data.productImageUrls,
    productLendingRate: data.productLendingRate,
    productCollectionTime: data.productCollectionTime,
    productReturnTime: data.productReturnTime,
    productAvailableDays: data.productAvailableDays,
    productBorrowingNotes: data.productBorrowingNotes,
    productPickupInstructions: data.productPickupInstructions,
    productReturnInstructions: data.productReturnInstructions,
    productAddressID: data.productAddressID,
    productIsCollectDeposit: data.productIsCollectDeposit,
    productDepositAmount: data.productDepositAmount,
    // end products copy
    // address copy
    latitude: data.latitude,
    longitude: data.longitude,
    addressName: data.addressName,
    address: data.address,
    buildingType: data.buildingType,
    additionalDetails: data.additionalDetails,
    postcode: data.postcode,
    addressLabel: data.addressLabel,
    instruction: data.instruction,
    // end address copy
    total: data.total,
    deliveryMethod: data.deliveryMethod,
    paymentMethod: data.paymentMethod,
    // collection and return code
    collectionCode: data.collectionCode,
    returnCode: data.returnCode,
    createAt: data.createAt,
    updatedAt: data.updatedAt,
  };
};

// Function to fetch products for a specific user from Firestore
export const fetchBorrowingsByUser = async (userID: string): Promise<Borrowing[]> => {
  try {
    const userMyBorrowingsList: Borrowing[] = [];
    const snapshot = await getDocs(collection(db, 'borrowings')); // Fetch products from 'products' collection
    snapshot.forEach(doc => {
      const borrowingData = doc.data();
      if (borrowingData.userId === userID) {  // Check if the product belongs to the user
        userMyBorrowingsList.push(mapBorrowingData(doc));  // Push the formatted product to the list
      }
    });
    return userMyBorrowingsList;
  } catch (error) {
    console.error('Error fetching user borrowings: ', error);
    throw error;  // Throwing the error to handle it at the call site
  }
};

export const fetchSelectedBorrowing = async (borrowingId: string): Promise<Borrowing | null> => {
  try {
    const borrowingRef = doc(db, 'borrowings', borrowingId);
    const borrowingDoc = await getDoc(borrowingRef);

    if (borrowingDoc.exists() && borrowingDoc.data()) {
      return mapBorrowingData(borrowingDoc);
    } else {
      console.log('No such selected borrowing exists.');
      return null;
    }
  } catch (error) {
    console.error('Error fetching selected borrowing: ', error);
    throw error;  // Throwing the error to handle it at the call site
  }
};

// Function to fetch products for a specific user from Firestore
export const fetchLendingsByUser = async (userID: string): Promise<Borrowing[]> => {
  try {
    const userMyLendingsList: Borrowing[] = [];
    const snapshot = await getDocs(collection(db, 'borrowings')); // Fetch products from 'products' collection
    snapshot.forEach(doc => {
      const lendingData = doc.data();
      if (lendingData.productOwnerId === userID) {  // Check if the product belongs to the user
        userMyLendingsList.push(mapBorrowingData(doc));  // Push the formatted product to the list
      }
    });
    return userMyLendingsList;
  } catch (error) {
    console.error('Error fetching user lendings: ', error);
    throw error;  // Throwing the error to handle it at the call site
  }
};

export const updateBorrowing = async (borrowingId: string, updatedData: Partial<Borrowing>) => {
  try {
    const borrowingRef = doc(db, 'borrowings', borrowingId);
    await updateDoc(borrowingRef, updatedData);
    console.log('Borrowing updated with ID: ', borrowingId);
  } catch (error) {
    console.error('Error updating borrowing: ', error);
    throw error;  // Throwing the error to handle it at the call site
  }
};