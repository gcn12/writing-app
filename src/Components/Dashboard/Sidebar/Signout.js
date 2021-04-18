import IconComponent from '../../../Icons/IconComponent'
import styled from 'styled-components'
import firebase from 'firebase'
import { useHistory } from 'react-router-dom'

const Signout = () => {

    const history = useHistory()

    const signout = () => {
        firebase.auth().signOut()
        .then(()=> {
            history.push('/writing-app')
        })
        .catch(err=> {
            console.log(err)
        })
    }

    return(
        <Container>
            <LiButton onClick={signout}>
                <Icon>
                    <IconComponent><path d="M10 9.408l2.963 2.592-2.963 2.592v-1.592h-8v-2h8v-1.592zm-2-4.408v4h-8v6h8v4l8-7-8-7zm6-3c-1.787 0-3.46.474-4.911 1.295l.228.2 1.396 1.221c1.004-.456 2.114-.716 3.287-.716 4.411 0 8 3.589 8 8s-3.589 8-8 8c-1.173 0-2.283-.26-3.288-.715l-1.396 1.221-.228.2c1.452.82 3.125 1.294 4.912 1.294 5.522 0 10-4.477 10-10s-4.478-10-10-10z"/></IconComponent>
                </Icon>
                <Text>Sign out</Text>
            </LiButton>
        </Container>
    )
}

export default Signout

const LiButton = styled.button`
    display: flex;
    /* justify-content: center; */
    align-items: center;
    background-color: ${props=> props.background};
    /* border: none; */
    padding: 10px 0 10px 5px;
    margin: 5px 0;
    font-size: 1.25rem;
    width: 100%;
    border-radius: 5px;
    /* box-shadow: none; */
    transition: background-color 50ms ease-in-out;
    &:hover {
        background-color: var(--highlight);
    }
`

const Text = styled.h4`

`

const Icon = styled.div`
    transform: scale(.8);
    right: 7px;
    position: relative;
    top: 1px;
    margin-left: 20px;
`

const Container = styled.div`
    /* width: 18vw; */
    /* padding: 0 20px; */
    background-color: var(--sidebar);
    height: 100vh;
    min-width: 200px;
    position: fixed;
    @media(max-width: 900px) {
        display: none;
    }
`