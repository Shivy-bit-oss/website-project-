import { collection, getDocs, addDoc, query, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { getAuth, updateEmail, updatePassword, sendPasswordResetEmail, sendEmailVerification, EmailAuthProvider, reauthenticateWithCredential, signInWithEmailAndPassword, deleteUser } from 'firebase/auth';
import { db } from './firebaseconfig';

// Menu Items
export const getMenuItems = async () => {
  try {
    const menuRef = collection(db, 'menu');
    const q = query(menuRef, orderBy('category'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return [];
  }
};

export const addMenuItem = async (menuItem) => {
  try {
    const menuRef = collection(db, 'menu');
    const docRef = await addDoc(menuRef, {
      ...menuItem,
      price: parseFloat(menuItem.price), // Ensure price is stored as a number
      timestamp: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding menu item:', error);
    throw error;
  }
};

export const deleteMenuItem = async (itemId) => {
  try {
    const menuItemRef = doc(db, 'menu', itemId);
    await deleteDoc(menuItemRef);
  } catch (error) {
    console.error('Error deleting menu item:', error);
    throw error;
  }
};

// Reviews
export const getReviews = async () => {
  try {
    const reviewsRef = collection(db, 'reviews');
    const q = query(reviewsRef, orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
};

export const addReview = async (reviewData) => {
  try {
    const reviewsRef = collection(db, 'reviews');
    const docRef = await addDoc(reviewsRef, {
      ...reviewData,
      timestamp: new Date().toISOString(),
      approved: false // Reviews need admin approval
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding review:', error);
    throw error;
  }
};

export const approveReview = async (reviewId) => {
  try {
    const reviewRef = doc(db, 'reviews', reviewId);
    await updateDoc(reviewRef, {
      approved: true
    });
  } catch (error) {
    console.error('Error approving review:', error);
    throw error;
  }
};

export const rejectReview = async (reviewId) => {
  try {
    const reviewRef = doc(db, 'reviews', reviewId);
    await deleteDoc(reviewRef);
  } catch (error) {
    console.error('Error rejecting review:', error);
    throw error;
  }
};

// Admin Panel
export const getPendingReviews = async () => {
  try {
    const reviewsRef = collection(db, 'reviews');
    const q = query(reviewsRef, orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      .filter(review => !review.approved);
  } catch (error) {
    console.error('Error fetching pending reviews:', error);
    return [];
  }
};

// Contact Messages
export const addContactMessage = async (messageData) => {
  try {
    const messagesRef = collection(db, 'messages');
    const docRef = await addDoc(messagesRef, {
      ...messageData,
      timestamp: new Date().toISOString(),
      read: false
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding contact message:', error);
    throw error;
  }
};

export const getContactMessages = async () => {
  try {
    const messagesRef = collection(db, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    return [];
  }
};

export const markMessageAsRead = async (messageId) => {
  try {
    const messageRef = doc(db, 'messages', messageId);
    await updateDoc(messageRef, {
      read: true
    });
  } catch (error) {
    console.error('Error marking message as read:', error);
    throw error;
  }
};

export const deleteMessage = async (messageId) => {
  try {
    const messageRef = doc(db, 'messages', messageId);
    await deleteDoc(messageRef);
  } catch (error) {
    console.error('Error deleting message:', error);
    throw error;
  }
};

// Authentication Functions
export const updateUserEmail = async (newEmail, password) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('No user logged in');
    }

    // First sign in again to get fresh credentials
    await signInWithEmailAndPassword(auth, user.email, password);
    
    // Then update the email
    await updateEmail(user, newEmail);
    
    // Send verification email
    await sendEmailVerification(user);
    
    return true;
  } catch (error) {
    console.error('Error updating email:', error);
    throw error;
  }
};

export const updateUserPassword = async (newPassword) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      await updatePassword(user, newPassword);
      return true;
    }
    throw new Error('No user logged in');
  } catch (error) {
    console.error('Error updating password:', error);
    throw error;
  }
};

export const sendPasswordReset = async (email) => {
  try {
    const auth = getAuth();
    await sendPasswordResetEmail(auth, email);
    return true;
  } catch (error) {
    console.error('Error sending password reset:', error);
    throw error;
  }
};

export const deleteCurrentUser = async (password) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) throw new Error('No user logged in');
    // Re-authenticate for security
    await signInWithEmailAndPassword(auth, user.email, password);
    await deleteUser(user);
    return true;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}; 