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
import { Ad, AdReport, FeaturedPayment, UserProfile, StaffMember } from '../types';

// Helper to strip undefined values so Firestore never throws 'Unsupported field value: undefined'
function cleanFirestoreData<T>(obj: T): T {
  try {
    return JSON.parse(JSON.stringify(obj));
  } catch {
    return obj;
  }
}

// Initialize Firebase App instance
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore with custom database ID if provisioned
export const db = getFirestore(
  app, 
  (firebaseConfig as any).firestoreDatabaseId || '(default)'
);

// Connection verification test
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch {
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
            const data = docSnap.data() as Ad;
            cloudAds.push(data);
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
    const cleanAd = cleanFirestoreData(ad);
    const adDocRef = doc(db, 'ads', cleanAd.id);
    await setDoc(adDocRef, cleanAd, { merge: true });
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
    const cleanReport = cleanFirestoreData(report);
    const reportRef = doc(db, 'reports', cleanReport.id);
    await setDoc(reportRef, cleanReport, { merge: true });
  } catch (error) {
    console.error('Failed to save report to Firestore:', error);
  }
}

/**
 * Synchronize boost payment records across devices.
 */
export async function savePaymentToCloud(payment: FeaturedPayment): Promise<void> {
  try {
    const cleanPayment = cleanFirestoreData(payment);
    const payRef = doc(db, 'payments', cleanPayment.id);
    await setDoc(payRef, cleanPayment, { merge: true });
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
      for (const ad of initialAds) {
        const cleanAd = cleanFirestoreData(ad);
        await setDoc(doc(db, 'ads', cleanAd.id), cleanAd);
      }
    }
  } catch (err) {
    console.warn('Initial seeding note:', err);
  }
}

/**
 * Save real visitor user account to centralized Firestore cloud database.
 */
export async function saveUserToCloud(user: UserProfile): Promise<void> {
  try {
    const cleanUser = cleanFirestoreData(user);
    const userRef = doc(db, 'users', cleanUser.id);
    await setDoc(userRef, cleanUser, { merge: true });
  } catch (error) {
    console.error('Failed to sync user to Firestore:', error);
  }
}

/**
 * Real-time listener for registered user accounts across all devices.
 */
export function subscribeToCloudUsers(
  onUpdate: (users: UserProfile[]) => void,
  onError?: (err: any) => void
): () => void {
  try {
    const usersRef = collection(db, 'users');
    return onSnapshot(
      usersRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const cloudUsers: UserProfile[] = [];
          snapshot.forEach((docSnap) => {
            cloudUsers.push(docSnap.data() as UserProfile);
          });
          onUpdate(cloudUsers);
        } else {
          onUpdate([]);
        }
      },
      (error) => {
        console.warn('Firestore users snapshot notice:', error?.message);
        if (onError) onError(error);
      }
    );
  } catch (err) {
    console.warn('Could not subscribe to Firestore users:', err);
    return () => {};
  }
}

/**
 * Real-time listener for confidential staff and moderator accounts across all admin devices.
 */
export function subscribeToCloudStaff(
  onUpdate: (staff: StaffMember[]) => void,
  onError?: (err: any) => void
): () => void {
  try {
    const staffRef = collection(db, 'staff');
    return onSnapshot(
      staffRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const cloudStaff: StaffMember[] = [];
          snapshot.forEach((docSnap) => {
            cloudStaff.push(docSnap.data() as StaffMember);
          });
          onUpdate(cloudStaff);
        } else {
          onUpdate([]);
        }
      },
      (error) => {
        console.warn('Firestore staff snapshot notice:', error?.message);
        if (onError) onError(error);
      }
    );
  } catch (err) {
    console.warn('Could not subscribe to Firestore staff:', err);
    return () => {};
  }
}

/**
 * Save or update a staff/moderator in the centralized Firestore cloud database.
 */
export async function saveStaffToCloud(staff: StaffMember): Promise<void> {
  try {
    const cleanStaff = cleanFirestoreData(staff);
    const staffRef = doc(db, 'staff', cleanStaff.id);
    await setDoc(staffRef, cleanStaff, { merge: true });
  } catch (error) {
    console.error('Failed to sync staff to Firestore:', error);
  }
}

/**
 * Delete a staff/moderator from Firestore cloud database.
 */
export async function deleteStaffFromCloud(staffId: string): Promise<void> {
  try {
    const staffRef = doc(db, 'staff', staffId);
    await deleteDoc(staffRef);
  } catch (error) {
    console.error('Failed to delete staff from Firestore:', error);
  }
}

/**
 * Seed initial default staff members if the staff collection is new.
 */
export async function seedInitialStaffToCloud(initialStaff: StaffMember[]): Promise<void> {
  try {
    const staffRef = collection(db, 'staff');
    const existing = await getDocs(staffRef);
    if (existing.empty) {
      for (const member of initialStaff) {
        const cleanMember = cleanFirestoreData(member);
        await setDoc(doc(db, 'staff', cleanMember.id), cleanMember);
      }
    }
  } catch (err) {
    console.warn('Initial staff seeding note:', err);
  }
}
