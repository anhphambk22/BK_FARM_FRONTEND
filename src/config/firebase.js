// 1. Cấu hình Firebase cho frontend
// Thay các giá trị bên dưới bằng thông tin dự án Firebase của bạn
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyDZtEntEnoXWK7rTT7NpP94iaE6qUOfdy4",
  authDomain: "bk-iot-26.firebaseapp.com",
  databaseURL: "https://bk-iot-26-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "bk-iot-26",
  storageBucket: "bk-iot-26.firebasestorage.app",
  messagingSenderId: "994561419990",
  appId: "1:994561419990:web:84d6b692c917c4a7b3b777",
  measurementId: "G-65B30DK27K"
};


const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { app, database };