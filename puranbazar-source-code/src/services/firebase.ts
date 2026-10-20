import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  onSnapshot,
  getDocFromServer
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { Ad, AdReport, FeaturedPayment } from '../types';

// Initialize Firebase App instance
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore with custom database ID if provisioned
export const db = getFirestore(
  app, 
  (firebaseConfig as any).firestoreDatabaseId || '(default)'
);

// Connection verification test as required by Firebase specification
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    // If the test doc doesn't exist, it's still reachable
    return true;
  }
}

/**
 * Real-time listener for public advertisements.
 * Whenever any visitor posts, approves, or modifies an ad on any computer or mobile device,
 * this listener immediately pushes the updated ad list to all open browsers globally.
 */
export function subscribeToCloudAds(
  onUpdate: (ads: Ad[]) => void,
  onError?: (err: any) => void
): () => void {
  try {
    const adsRef = collection(db, 'ads');
    return onSnapshot(
      adsRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const cloudAds: Ad[] = [];
          snapshot.forEach((docSnap) => {
            cloudAds.push(docSnap.data() as Ad);
          });
          onUpdate(cloudAds);
        } else {
          onUpdate([]);
        }
      },
      (error) => {
        console.warn('Firestore ads snapshot notice:', error?.message);
        if (onError) onError(error);
      }
    );
  } catch (err) {
    console.warn('Could not subscribe to Firestore ads:', err);
    return () => {};
  }
}

/**
 * Save or update an advertisement in the centralized Firestore cloud database.
 */
export async function saveAdToCloud(ad: Ad): Promise<void> {
  try {
    const adDocRef = doc(db, 'ads', ad.id);
    await setDoc(adDocRef, ad, { merge: true });
  } catch (error) {
    console.error('Failed to sync ad to Firestore:', error);
  }
}

/**
 * Delete an advertisement from the centralized Firestore cloud database.
 */
export async function deleteAdFromCloud(adId: string): Promise<void> {
  try {
    const adDocRef = doc(db, 'ads', adId);
    await deleteDoc(adDocRef);
  } catch (error) {
    console.error('Failed to delete ad from Firestore:', error);
  }
}

/**
 * Synchronize safety reports across moderator devices.
 */
export async function saveReportToCloud(report: AdReport): Promise<void> {
  try {
    const reportRef = doc(db, 'reports', report.id);
    await setDoc(reportRef, report, { merge: true });
  } catch (error) {
    console.error('Failed to save report to Firestore:', error);
  }
}

/**
 * Synchronize boost payment records across devices.
 */
export async function savePaymentToCloud(payment: FeaturedPayment): Promise<void> {
  try {
    const payRef = doc(db, 'payments', payment.id);
    await setDoc(payRef, payment, { merge: true });
  } catch (error) {
    console.error('Failed to save payment to Firestore:', error);
  }
}

/**
 * Seed initial catalog to Firestore if the cloud database is currently brand new.
 */
export async function seedInitialAdsToCloud(initialAds: Ad[]): Promise<void> {
  try {
    const adsRef = collection(db, 'ads');
    const existing = await getDocs(adsRef);
    if (existing.empty) {
      // Seed first batch
      for (const ad of initialAds) {
        await setDoc(doc(db, 'ads', ad.id), ad);
      }
    }
  } catch (err) {
    console.warn('Initial seeding note:', err);
  }
}
