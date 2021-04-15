import styled from 'styled-components'
import Header from './Header'

const LandingPage = () => {
    return(
        <div>
            <Header />
            <Title>The new way to write</Title>
            <GetStarted>Get started now</GetStarted>
        </div>
    )
}

export default LandingPage



const GetStarted = styled.button`
    background-color: black;
    color: white;
    padding: 15px;
    border-radius: 7px;
`

const Title = styled.h1`
    font-size: 3rem;
    font-weight: 700;
`