import Firebase from 'react-native-firebase';

const firebaseConfig = {
  apiKey: "AIzaSyBMmGEikKtO034hW7w0M-YOOiPWBaiacvs",
  authDomain: "flashpik-f516b.firebaseapp.com",
  databaseURL: "https://flashpik-f516b.firebaseio.com",
  projectId: "flashpik-f516b",
  storageBucket: "flashpik-f516b.appspot.com",
  messagingSenderId: "878809565752",
  appId: "1:878809565752:web:1d0704276b5b03933e34cd",
  measurementId: "G-9BTS6FRFHD"
};

  let app = Firebase.initializeApp(firebaseConfig);
  export const db = app.database();