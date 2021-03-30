import firebase from 'firebase'
import { db } from '../../firebase'
const SignUp = () => {
    const submit = () => {
        firebase.auth().createUserWithEmailAndPassword('hel2lo@gai1l.com', 'hello123')
        .then((userCredential) => {
            // Signed in 
            var user = userCredential.user;
            console.log(user)
            db.collection('users').doc(user.uid).set({
                userID: user.uid
            })
        })
        .catch((error) => {
            // var errorCode = error.code;
            // var errorMessage = error.message;
            // ..
            console.log('error signing up', error)
        });
    }
    return(
        <div>
            <input></input>
            <input></input>
            <button onClick={submit}>Signup</button>
        </div>
    )
}

export default SignUp