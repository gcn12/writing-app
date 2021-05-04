import styled from 'styled-components'

const LoadingScreen = () => {
    return(
        <Container>
            <Logo>Redraft</Logo>
        </Container>
    )
}

export default LoadingScreen

const Container = styled.div`
    height: 100%;
    width: 100vw;
    background-color: black;
    display: grid;
    place-items: center;
`

const Logo = styled.h1`
    font-size: clamp(2rem, 5vw, 3rem);
    font-weight: 700;
    color: white;
    font-family: Montserrat;
`