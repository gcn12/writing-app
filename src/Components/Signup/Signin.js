import firebase from 'firebase'
const SignUp = () => {
    const submit = () => {

        firebase.auth().signInWithEmailAndPassword('hel2lo@gai1l.com', 'hello123')
        .then((userCredential) => {
            // Signed in
            // var user = userCredential.user;
            // ...
            console.log('signed in')
        })
        .catch((error) => {
            console.log(error)
            // var errorCode = error.code;
            // var errorMessage = error.message;
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