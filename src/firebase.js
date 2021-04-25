import firebase from "firebase";

const config = {
  apiKey: "AIzaSyDZovNB2YZLGb8SVd3tGQd44MdFQyLhgTI",
  authDomain: "writing-136ac.firebaseapp.com",
  databaseURL: "https://writing-136ac.firebaseio.com",
  projectId: "writing-136ac",
  storageBucket: "writing-136ac.appspot.com",
};
let app = firebase.initializeApp(config)
export default app
const db = app.firestore();
export { db };