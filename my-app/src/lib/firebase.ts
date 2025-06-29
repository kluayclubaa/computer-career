import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, Timestamp } from "firebase/firestore";
import { AllUserData } from "@/app/page"; // ★ Import type จากหน้าหลัก

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA_ucoMZQXQo1dEe4lxxR2IaUKhIyS0S8k",
  authDomain: "nemoheal-32e6b.firebaseapp.com",
  projectId: "nemoheal-32e6b",
  storageBucket: "nemoheal-32e6b.firebasestorage.app",
  messagingSenderId: "1087905726832",
  appId: "1:1087905726832:web:d4eb26ae4ad8c395278fb5",
  measurementId: "G-5R2GWZWLBB"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

// --- Type สำหรับข้อมูลที่จะดึงมา ---
// เราจะเพิ่ม id และ createdAt ที่เป็น string เข้าไป
export type JourneyData = AllUserData & {
  id: string;
  createdAt: string; // แปลงเป็น string เพื่อให้ส่งผ่าน Server Component ได้ง่าย
};


// --- ฟังก์ชันสำหรับบันทึกข้อมูล (ของเดิม) ---
export const saveDataToFirebase = async (data: AllUserData) => {
  try {
    const docRef = await addDoc(collection(db, "userJourneys"), {
      ...data,
      createdAt: new Date(),
    });
    console.log("Document written with ID: ", docRef.id);
    return { success: true, id: docRef.id };
  } catch (e) {
    console.error("Error adding document: ", e);
    return { success: false, error: e };
  }
};


// ★★★ ฟังก์ชันใหม่: ดึงข้อมูลทั้งหมด ★★★
export const getAllJourneys = async (): Promise<JourneyData[]> => {
  try {
    // สร้าง query เพื่อเรียงข้อมูลตามวันที่สร้างล่าสุด
    const journeysCollection = collection(db, "userJourneys");
    const q = query(journeysCollection, orderBy("createdAt", "desc"));

    const querySnapshot = await getDocs(q);
    
    const journeys: JourneyData[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data() as AllUserData & { createdAt: Timestamp };
      journeys.push({
        id: doc.id,
        ...data,
        // แปลง Timestamp ของ Firebase เป็น string รูปแบบที่อ่านง่าย
        createdAt: data.createdAt.toDate().toLocaleString('th-TH'),
      });
    });

    console.log("Fetched journeys:", journeys.length);
    return journeys;
  } catch (error) {
    console.error("Error getting documents: ", error);
    return []; // คืนค่าเป็น array ว่างถ้าเกิด error
  }
};