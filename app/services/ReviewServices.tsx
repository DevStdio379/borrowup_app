import { db, storage } from './firebaseConfig';  // Import the Firestore instance
import { collection, getDocs, addDoc, doc, updateDoc, getDoc } from 'firebase/firestore';  // Firestore functions
import { getStorage, ref, uploadBytes, getDownloadURL, uploadBytesResumable } from 'firebase/storage';  // Import Firebase storage functions

// Define the Review interface
export interface Review {
  id?: string;  // Add an optional id field
  reviewerId: string;
  borrowingId: string;

  overallRating: number;
  collectionRating: number;
  collectionFeedback: string[];
  otherCollectionReview: string;
  returnRating: number;
  returnFeedback: string[];
  otherReturnReview: string;
  listingMatch: string;
  listingMatchFeedback: string[];
  otherListingMatchReview: string;
  communicationRating: number;
  communicationFeedback: string[];
  otherCommunicationReview: string;
  productConditionRating: number;
  productConditionFeedback: string[];
  otherProductConditionReview: string;
  priceWorthyRating: number;
  publicReview: string;
  privateNotesforLender: string;
  status: number;

  createAt: any;  // Use the Firebase Timestamp object for createAt
  updatedAt: any;  // Use the Firebase Timestamp object for updatedAt
}

// Function to fetch a review based on borrowingId
export const getReviewByBorrowingId = async (productId: string ,borrowingId: string) => {
  try {
    const reviewsRef = collection(db, 'products', productId, 'reviews');
    const querySnapshot = await getDocs(reviewsRef);
    const reviews = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Review[];

    const review = reviews.find(review => review.borrowingId === borrowingId);
    if (review) {
      return review;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching review: ', error);
    throw error;  // Throwing the error to handle it at the call site
  }
};

// Function to save a product to Firestore
export const createReview = async (review: Review, productId: string ) => {
  try {
    const productRef = collection(db, 'products', productId, 'reviews' );
    await addDoc(productRef, review);

    console.log('Review saved successfully');
  } catch (error) {
    console.error('Error saving review: ', error);
    throw error;  // Throwing the error to handle it at the call site
  }
};

// Function to update a product in Firestore
export const updateReview = async (productId: string, reviewId: string, updatedReview: Partial<Review>) => {
  try {
    const productRef = doc(db, 'products', productId, 'reviews', reviewId);
    await updateDoc(productRef, updatedReview);
    console.log('Review updated successfully');
  } catch (error) {
    console.error('Error updating product: ', error);
    throw error;  // Throwing the error to handle it at the call site
  }
};