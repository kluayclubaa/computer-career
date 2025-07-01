// lib/firebaseClient.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  collection,
  addDoc,
  serverTimestamp,
  Firestore,
} from "firebase/firestore";

// === Firebase Web SDK config (ใช้ชุดเดียวกับที่คุณมี) ===
const firebaseConfig = {
  apiKey: "AIzaSyA_ucoMZQXQo1dEe4lxxR2IaUKhIyS0S8k",
  authDomain: "nemoheal-32e6b.firebaseapp.com",
  projectId: "nemoheal-32e6b",
  storageBucket: "nemoheal-32e6b.appspot.com",
  messagingSenderId: "1087905726832",
  appId: "1:1087905726832:web:d4eb26ae4ad8c395278fb5",
  measurementId: "G-5R2GWZWLBB",
};

// สร้าง/คืนค่า app เดิม
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// 👉 Firestore instance สำหรับฝั่ง Client
export const db = getFirestore(app);
export async function saveDataToFirebase(
  data: Record<string, unknown>,
  dbInstance: Firestore = db
) {
  try {
    const docRef = await addDoc(collection(dbInstance, "userJourneys"), {
      ...data,
      createdAt: serverTimestamp(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("saveDataToFirebase error:", error);
    return { success: false, error };
  }
}