import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  GithubAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail, 
  signOut, 
  updateProfile,
  User 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  getDocs, 
  query, 
  orderBy, 
  limit, 
  getDocFromServer 
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { UserProfile, WorkoutSessionHistory, GamificationState } from '../types/fitness';

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);

// Initialize Firestore with custom databaseId if specified
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Initialize Auth
export const auth = getAuth(app);

// Auth Providers
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();

// Standard Firebase Security Rules Error Handling
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Mandatory connection test on module boot
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('Firebase connection test completed successfully.');
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline or network restricted.');
    }
  }
}

testConnection();

// Authentication Helpers
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    console.error('Google Sign-In Error:', error);
    throw error;
  }
}

export async function signInWithGithub() {
  try {
    const result = await signInWithPopup(auth, githubProvider);
    return result.user;
  } catch (error: any) {
    console.error('GitHub Sign-In Error:', error);
    throw error;
  }
}

export async function signInWithEmail(email: string, pass: string) {
  try {
    const result = await signInWithEmailAndPassword(auth, email, pass);
    return result.user;
  } catch (error: any) {
    console.error('Email Sign-In Error:', error);
    throw error;
  }
}

export async function registerWithEmail(email: string, pass: string, displayName: string) {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, pass);
    if (displayName && result.user) {
      await updateProfile(result.user, { displayName });
    }
    return result.user;
  } catch (error: any) {
    console.error('Email Registration Error:', error);
    throw error;
  }
}

export async function resetPassword(email: string) {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    console.error('Password Reset Error:', error);
    throw error;
  }
}

export async function logOut() {
  try {
    await signOut(auth);
  } catch (error: any) {
    console.error('Sign Out Error:', error);
    throw error;
  }
}

// Firestore User Profile Sync
export async function syncUserProfileToFirestore(userId: string, profile: Partial<UserProfile> & { email?: string; photoURL?: string; provider?: string }) {
  const path = `users/${userId}`;
  try {
    const userRef = doc(db, 'users', userId);
    const docSnap = await getDoc(userRef);

    const payload = {
      id: userId,
      uid: userId,
      name: profile.name || 'Atleta',
      email: profile.email || '',
      photoURL: profile.photoURL || '',
      provider: profile.provider || 'password',
      age: profile.age ?? 30,
      sex: profile.sex ?? 'prefer_not_to_say',
      heightCm: profile.heightCm ?? 175,
      weightKg: profile.weightKg ?? 72,
      unitSystem: profile.unitSystem ?? 'metric',
      primaryGoal: profile.primaryGoal ?? 'general_fitness',
      experience: profile.experience ?? 'beginner',
      activityLevel: profile.activityLevel ?? 'moderately_active',
      trainingDaysPerWeek: profile.trainingDaysPerWeek ?? 4,
      preferredDurationMinutes: profile.preferredDurationMinutes ?? 30,
      isOnboarded: profile.isOnboarded ?? true,
      hasCompletedAssessment: profile.hasCompletedAssessment ?? true,
      reminderPreferences: profile.reminderPreferences ?? null,
      role: profile.email === 'lucas.ferreyra@gmail.com' ? 'admin' : (profile.role || 'user'),
      lastActiveAt: new Date().toISOString(),
      createdAt: docSnap.exists() ? (docSnap.data()?.createdAt || new Date().toISOString()) : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await setDoc(userRef, payload, { merge: true });
    return payload;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function fetchUserProfileFromFirestore(userId: string): Promise<UserProfile | null> {
  const path = `users/${userId}`;
  try {
    const userRef = doc(db, 'users', userId);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return null;
  }
}

export async function fetchAllUsersForAdmin(): Promise<UserProfile[]> {
  const path = 'users';
  try {
    const colRef = collection(db, 'users');
    const q = query(colRef, limit(100));
    const querySnapshot = await getDocs(q);
    const results: UserProfile[] = [];
    querySnapshot.forEach(docSnap => {
      const data = docSnap.data() as UserProfile;
      results.push({
        ...data,
        id: docSnap.id,
        uid: data.uid || docSnap.id
      });
    });
    return results;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

// Firestore Workout History Sync
export async function saveWorkoutSessionToFirestore(userId: string, session: WorkoutSessionHistory) {
  const path = `users/${userId}/workouts/${session.id}`;
  try {
    const sessionRef = doc(db, 'users', userId, 'workouts', session.id);
    const payload = {
      id: session.id,
      userId: userId,
      workoutId: session.workoutId,
      workoutTitle: session.workoutTitle,
      category: session.category,
      date: session.date,
      durationSeconds: session.durationSeconds,
      caloriesBurned: session.caloriesBurned,
      exercisesCompletedCount: session.exercisesCompletedCount,
      totalExercisesCount: session.totalExercisesCount,
      feedbackRating: session.feedbackRating,
      postFeeling: session.postFeeling,
      xpEarned: session.xpEarned,
      createdAt: new Date().toISOString()
    };
    await setDoc(sessionRef, payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function fetchWorkoutHistoryFromFirestore(userId: string): Promise<WorkoutSessionHistory[]> {
  const path = `users/${userId}/workouts`;
  try {
    const colRef = collection(db, 'users', userId, 'workouts');
    const q = query(colRef, orderBy('createdAt', 'desc'), limit(50));
    const querySnapshot = await getDocs(q);
    const results: WorkoutSessionHistory[] = [];
    querySnapshot.forEach(docSnap => {
      results.push(docSnap.data() as WorkoutSessionHistory);
    });
    return results;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

// Firestore Gamification Sync
export async function saveGamificationToFirestore(userId: string, gamification: GamificationState) {
  const path = `users/${userId}/gamification/state`;
  try {
    const stateRef = doc(db, 'users', userId, 'gamification', 'state');
    const payload = {
      id: 'state',
      userId: userId,
      xp: gamification.xp,
      currentLevelNumber: gamification.currentLevelNumber,
      levelTitle: gamification.levelTitle,
      currentStreakDays: gamification.currentStreakDays,
      totalWorkoutsCompleted: gamification.totalWorkoutsCompleted,
      totalTrainingMinutes: gamification.totalTrainingMinutes,
      totalEstimatedCalories: gamification.totalEstimatedCalories,
      updatedAt: new Date().toISOString()
    };
    await setDoc(stateRef, payload, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function fetchGamificationFromFirestore(userId: string): Promise<Partial<GamificationState> | null> {
  const path = `users/${userId}/gamification/state`;
  try {
    const stateRef = doc(db, 'users', userId, 'gamification', 'state');
    const docSnap = await getDoc(stateRef);
    if (docSnap.exists()) {
      return docSnap.data() as Partial<GamificationState>;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return null;
  }
}

