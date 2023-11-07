// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-analytics.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDHDLToy27276ecWXRitLxjG12_U4Qpn7Y",
  authDomain: "look-b1624.firebaseapp.com",
  databaseURL: "https://look-b1624-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "look-b1624",
  storageBucket: "look-b1624.appspot.com",
  messagingSenderId: "118997797112",
  appId: "1:118997797112:web:c3c5fabf767d0d620ad30d",
  measurementId: "G-H6ZHRY2DV2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Firebase Firestore에 대한 참조 얻기
const db = getFirestore(app);

// 데이터 저장
const addStudentData = async () => {
  try {
    const studentData = {
      full_name: "Andrew",
      age: 17,
      grade: "A"
    };

    const docRef = await addDoc(collection(db, "students"), studentData);
    console.log("Document written with ID: ", docRef.id);
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};

addStudentData();