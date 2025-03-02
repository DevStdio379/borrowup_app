import { db, storage } from './firebaseConfig';  // Import the Firestore instance
import { collection, getDocs, addDoc, doc, updateDoc, getDoc } from 'firebase/firestore';  // Firestore functions
import { getStorage, ref, uploadBytes, getDownloadURL, uploadBytesResumable } from 'firebase/storage';  // Import Firebase storage functions

// Define the Product interface
export interface Product {
  id?: string;  // Add an optional id field
  ownerID: string;
  imageUrls: string[];  // Change to an array to accept multiple images
  title: string;
  description: string;
  category: string;
  lendingRate: number;
  collectionTime: string;
  returnTime: string;
  availableDays: string[];
  borrowingNotes: string;
  pickupInstructions: string;
  returnInstructions: string;
  addressID: string;
  isCollectDeposit: boolean;
  depositAmount: number;  // Add an optional depositAmount field
  isActive: boolean;
  createAt: any;  // Use the Firebase Timestamp object for createAt
  updatedAt: any;  // Use the Firebase Timestamp object for updatedAt
}

// Function to fetch products from Firestore
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const productList: Product[] = [];
    const snapshot = await getDocs(collection(db, 'products')); // Fetch products from 'products' collection
    snapshot.forEach(doc => {
      const productData = doc.data();
      if (productData.isActive) {  // Check if the product is active
        const product: Product = {
          id: doc.id, // Get the document ID
          ownerID: productData.ownerID,
          imageUrls: productData.imageUrls,
          title: productData.title,
          description: productData.description,
          category: productData.category,
          lendingRate: productData.lendingRate,
          collectionTime: productData.collectionTime,
          returnTime: productData.returnTime,
          availableDays: productData.availableDays,
          borrowingNotes: productData.borrowingNotes,
          pickupInstructions: productData.pickupInstructions,
          returnInstructions: productData.returnInstructions,
          addressID: productData.addressID,
          isCollectDeposit: productData.isCollectDeposit,
          depositAmount: productData.depositAmount,
          isActive: productData.isActive,
          createAt: productData.createAt,
          updatedAt: productData.updatedAt
        };
        productList.push(product);  // Push the formatted product to the list
      }
    });
    return productList;
  } catch (error) {
    console.error('Error fetching products: ', error);
    throw error;  // Throwing the error to handle it at the call site
  }
};
// Function to upload an image to Firebase Storage
export const uploadImages = async (imageName: string, imagesUrl: string[]) => {
  const urls: string[] = [];

  for (const uri of imagesUrl) {
    try {
      // Convert to Blob
      const response = await fetch(uri);
      const blob = await response.blob();

      // Generate unique filename
      const filename = `products/${imageName}_${imagesUrl.indexOf(uri)}.jpg`;
      const storageRef = ref(storage, filename);

      // Upload file
      const uploadTask = uploadBytesResumable(storageRef, blob);

      await new Promise<void>((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          snapshot => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Upload ${filename}: ${progress.toFixed(2)}% done`);
          },
          reject, // Handle error
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            urls.push(downloadURL);
            resolve();
          }
        );
      });

    } catch (error) {
      console.error("Upload failed:", error);
    }
  }

  console.log("All images uploaded:", urls);
  return urls; // Return all uploaded image URLs
};

// Function to fetch products for a specific user from Firestore
export const fetchUserProductListings = async (userID: string): Promise<Product[]> => {
  try {
    const userProductList: Product[] = [];
    const snapshot = await getDocs(collection(db, 'products')); // Fetch products from 'products' collection
    snapshot.forEach(doc => {
      const productData = doc.data();
      if (productData.ownerID === userID) {  // Check if the product belongs to the user
        const product: Product = {
          id: doc.id, // Get the document ID
          ownerID: productData.ownerID,
          imageUrls: productData.imageUrls,
          title: productData.title,
          description: productData.description,
          category: productData.category,
          lendingRate: productData.lendingRate,
          collectionTime: productData.collectionTime,
          returnTime: productData.returnTime,
          availableDays: productData.availableDays,
          borrowingNotes: productData.borrowingNotes,
          pickupInstructions: productData.pickupInstructions,
          returnInstructions: productData.returnInstructions,
          addressID: productData.addressID,
          isCollectDeposit: productData.isCollectDeposit,
          depositAmount: productData.depositAmount,
          isActive: productData.isActive,
          createAt: productData.createAt,
          updatedAt: productData.updatedAt,
        };
        userProductList.push(product);  // Push the formatted product to the list
      }
    });
    return userProductList;
  } catch (error) {
    console.error('Error fetching user products: ', error);
    throw error;  // Throwing the error to handle it at the call site
  }
};

export const fetchSelectedProduct = async (productId: string): Promise<Product | null> => {
  try {
    const productRef = doc(db, 'products', productId);
    const productDoc = await getDoc(productRef);

    if (productDoc.exists() && productDoc.data()) {
      const productData = productDoc.data();
      const product: Product = {
        id: productDoc.id,
        ownerID: productData.ownerID,
        imageUrls: productData.imageUrls,
        title: productData.title,
        description: productData.description,
        category: productData.category,
        lendingRate: productData.lendingRate,
        collectionTime: productData.collectionTime,
        returnTime: productData.returnTime,
        availableDays: productData.availableDays,
        borrowingNotes: productData.borrowingNotes,
        pickupInstructions: productData.pickupInstructions,
        returnInstructions: productData.returnInstructions,
        addressID: productData.addressID,
        isCollectDeposit: productData.isCollectDeposit,
        depositAmount: productData.depositAmount,
        isActive: productData.isActive,
        createAt: productData.createAt,
        updatedAt: productData.updatedAt,
      };
      return product;
    } else {
      console.log('No such selected product exists.');
      return null;
    }
  } catch (error) {
    console.error('Error fetching selected product: ', error);
    throw error;  // Throwing the error to handle it at the call site
  }
};


// Function to save a product to Firestore
export const createProduct = async (product: Product) => {
  try {
    const productRef = collection(db, 'products');
    const docRef = await addDoc(productRef, product);

    if (product.imageUrls && product.imageUrls.length > 0) {
      const uploadedUrls = await uploadImages(docRef.id, product.imageUrls);
      await updateDoc(doc(db, 'products', docRef.id), { imageUrls: uploadedUrls });
    }
    console.log('Product saved successfully');
  } catch (error) {
    console.error('Error saving product: ', error);
    throw error;  // Throwing the error to handle it at the call site
  }
};

// Function to update a product in Firestore
export const updateProduct = async (productId: string, updatedProduct: Partial<Product>) => {
  try {
    const productRef = doc(db, 'products', productId);
    await updateDoc(productRef, updatedProduct);
    console.log('Product updated successfully');
  } catch (error) {
    console.error('Error updating product: ', error);
    throw error;  // Throwing the error to handle it at the call site
  }
};