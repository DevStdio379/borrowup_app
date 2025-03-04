import { db, storage } from './firebaseConfig';  // Import the Firestore instance
import { collection, getDocs, addDoc, doc, updateDoc, getDoc } from 'firebase/firestore';  // Firestore functions
import { getStorage, ref, uploadBytes, getDownloadURL, uploadBytesResumable } from 'firebase/storage';  // Import Firebase storage functions

// Define the Review interface
export interface Review {
  id?: string;  // Add an optional id field
  borrowingId: string;
  borrowerReviewerId?: string;
  lenderReviewerId?: string;

  // borrowerReview
  borrowerOverallRating?: number;
  borrowerCollectionRating?: number;
  borrowerCollectionFeedback?: string[];
  borrowerOtherCollectionReview?: string;
  borrowerReturnRating?: number;
  borrowerReturnFeedback?: string[];
  borrowerOtherReturnReview?: string;
  borrowerListingMatch?: string;
  borrowerListingMatchFeedback?: string[];
  borrowerOtherListingMatchReview?: string;
  borrowerCommunicationRating?: number;
  borrowerCommunicationFeedback?: string[];
  borrowerOtherCommunicationReview?: string;
  borrowerProductConditionRating?: number;
  borrowerProductConditionFeedback?: string[];
  borrowerOtherProductConditionReview?: string;
  borrowerPriceWorthyRating?: number;
  borrowerPublicReview?: string;
  borrowerPrivateNotesforLender?: string;
  borrowerStatus?: number;
  borrowerCreateAt?: any; 
  borrowerUpdatedAt?: any;

  // lenderReview
  lenderOverallRating?: number;
  lenderCollectionRating?: number;
  lenderCollectionFeedback?: string[];
  lenderOtherCollectionReview?: string;
  lenderReturnRating?: number;
  lenderReturnFeedback?: string[];
  lenderOtherReturnReview?: string;
  lenderGivenInstructionFollowed?: string;
  lenderGivenInstructionFollowedFeedback?: string[];
  lenderOtherGivenInstructionFollowedReview?: string;
  lenderCommunicationRating?: number;
  lenderCommunicationFeedback?: string[];
  lenderOtherCommunicationReview?: string;
  lenderReturnedProductConditionRating?: number;
  lenderReturnedProductConditionFeedback?: string[];
  lenderOtherReturnedProductConditionReview?: string;
  lenderPublicReview?: string;
  lenderPrivateNotesforLender?: string;
  lenderStatus?: number;
  lenderCreateAt?: any;
  lenderUpdatedAt?: any;
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