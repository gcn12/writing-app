import firebase from 'firebase'
import { db } from '../../firebase'
import styled from 'styled-components'

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
            console.log('error signing up', error)
        });
    }
    return(
        <Container>
            <Form>
                <Logo>Redraft</Logo>
                <InputLabelContainer>
                    <Label>Username</Label>
                    <Username></Username>
                </InputLabelContainer>
                <InputLabelContainer>
                    <Label>Password</Label>
                    <Password type='password'></Password>
                </InputLabelContainer>
                <Submit onClick={submit}>CREATE ACCOUNT</Submit>
            </Form>
            <BackgroundColorDecoration color='#c4ffd6' blur='50px' height='250px' width='250px' top='0' left='0'  opacity='.6' />
            <BackgroundColorDecoration color='#fffca8' blur='50px' height='200px' width='200px' top='20%' right='0' opacity='.7' />
            <BackgroundColorDecoration color='#b5f1ff' blur='80px' height='300px' width='300px' top='50%' left='30%' opacity='.8' />
        </Container>
    )
}

export default SignUp

const InputLabelContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 70%;
`

const Label = styled.label`
    margin-bottom: 5px;
`

const Form = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    /* border: 1px solid black; */
    box-shadow: 0px 5px 7px rgba(0, 0, 0, .3);
    background-color: white;
    border-radius: 5px;
    height: 400px;
    width: 400px;
    position: relative;
    z-index: 1;
    @media(max-width: 800px) {
        width: 70vw;
    }
`

const Submit = styled.button`
    background-color: black;
    color: white;
    padding: 10px 50px;
    width: 70%;
    height: 50px;
    border-radius: 4px;
    white-space: nowrap;
`

const Container = styled.div`
    display: grid;
    place-items: center;
    height: 100%;
    width: 100%;
`

const Username = styled.input`
    width: 100%;
    height: 35px;
    margin-bottom: 20px;
    font-size: 20px;
`

const Password = styled.input`
    width: 100%;
    height: 35px;
    margin-bottom: 30px;
`

const BackgroundColorDecoration = styled.div`
    height: ${props=>props.height}; 
    width: ${props=>props.width};
    border-radius: 50%;
    background-color: ${props=>props.color};
    filter: blur(${props=>props.blur});
    opacity: ${props=>props.opacity};
    position: absolute;
    top: ${props=>props.top};
    left: ${props=>props.left};
    bottom: ${props=>props.bottom};
    right: ${props=>props.right};
`

const Logo = styled.h1`
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 20px;
    /* align-self: flex-start; */
`