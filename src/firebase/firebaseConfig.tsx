import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// configuration of xlerate products

// const firebaseConfig = {
//   apiKey: "AIzaSyBgYGulsDfu4VFt_tcPfQwAPjZccMe7nA0",
//   authDomain: "pelagic-core-297908.firebaseapp.com",
//   databaseURL: "https://pelagic-core-297908-default-rtdb.firebaseio.com",
//   projectId: "pelagic-core-297908",
//   storageBucket: "pelagic-core-297908.appspot.com",
//   messagingSenderId: "376262739834",
//   appId: "1:376262739834:web:ced1b62d7dc48ca3cbf8c3",
//   measurementId: "G-656P8R2FYS",
// };

// configuration of Food Healers app

const firebaseConfig = {
  apiKey: "AIzaSyAuYMvtEnxg_UImPL8SkxW3HCz0Z9cZ8WM",
  authDomain: "food-healers-b6ab8.firebaseapp.com",
  projectId: "food-healers-b6ab8",
  storageBucket: "food-healers-b6ab8.appspot.com",
  messagingSenderId: "863742234744",
  appId: "1:863742234744:web:4b3a537aea2efa5c54dd8d",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export { auth };
