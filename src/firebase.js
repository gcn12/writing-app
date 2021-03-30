import firebase from "firebase";

const config = {
  apiKey: "AIzaSyDZovNB2YZLGb8SVd3tGQd44MdFQyLhgTI",
  authDomain: "writing-136ac.firebaseapp.com",
  databaseURL: "https://writing-136ac.firebaseio.com",
  projectId: "writing-136ac",
  storageBucket: "writing-136ac.appspot.com",
  // messagingSenderId: "65211879809",
  // appId: "1:65211879909:web:3ae38ef1cdcb2e01fe5f0c",
  // measurementId: "G-8GSGZQ44ST"
};
let app = firebase.initializeApp(config)
// if(firebase.apps.length) {
//   app = firebase.app()
// }else{
//   app = firebase.initializeApp(config)
// }
export default app
const db = app.firestore();
export { db };