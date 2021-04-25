import styled from 'styled-components'
import { Link } from 'react-router-dom'

const FourthSection = () => {
    return(
        <Container>
            <ContentContainer>
                <Title>Ready to start writing?</Title>
                <StyledLink to='/writing-app/signup'>
                    <GetStarted>Sign up now</GetStarted>
                </StyledLink>
            </ContentContainer>
        </Container>
    )
}

export default FourthSection

const Container = styled.section`
    display: flex;
    justify-content: center;
    background-color: hsl(184, 30%, 92%);
`


const GetStarted = styled.div`
    background-color: black;
    color: white;
    padding: 20px;
    border-radius: 7px;
    display: inline-block;
    /* margin-bottom: 80px; */
`

const ContentContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    /* margin-bottom: 5vh; */
    height: 10vh;
    min-height: 300px;
    position: relative;
`

const Title = styled.h1`
    font-size: 2.25rem;
    font-weight: 600;
    margin-bottom: 15px;
`

const StyledLink = styled(Link)`
    &:focus {
        box-shadow: none;
    }
    &:focus-within {
        ${GetStarted} {
            box-shadow: 0 0 0 5px rgba(21, 156, 228, 0.4);
        }
    }
`