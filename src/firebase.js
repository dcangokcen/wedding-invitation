// src/firebase.js
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "…",
  authDomain: "wedding-invitation-d99d6.firebaseapp.com",
  projectId: "wedding-invitation-d99d6",
  storageBucket: "wedding-invitation-d99d6.firebasestorage.app", // ✅ DÜZGÜN BUCKET
  messagingSenderId: "…",
  appId: "…",
};

const app = initializeApp(firebaseConfig);

// İki seçenekten biri yeterli (ilk satır genelde yeterli):
export const storage = getStorage(app);
// Alternatif (explicit gs://):
// export const storage = getStorage(app, "gs://wedding-invitation-d99d6.firebasestorage.app");
