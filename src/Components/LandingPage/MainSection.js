import styled from 'styled-components'
import { Link } from 'react-router-dom'
import EditorPreview from './EditorPreview'

const MainSection = () => {
    return(
        <Container>
            <ContentContainer>
                <Title>Screenwriting, essentials only.</Title>
                <Subtitle>Everything you need to write your next best screenplay.</Subtitle>
                <EditorPreview />
                <StyledLink to='/writing-app/signup'>
                    <GetStarted>Get started now</GetStarted>
                </StyledLink>
            </ContentContainer>
        </Container>
    )
}

export default MainSection

const ContentContainer = styled.div`
    padding: 0 30px;
    width: 80vw;
    max-width: 800px;
    @media(max-width: 800px) {
        width: 100%;
    }
`

const Subtitle = styled.h2`
    font-size: 1.25rem;
    font-weight: 400;
    margin: 20px 0;
`

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: hsl(184, 30%, 92%);
    height: 95vh;
    min-height: 650px;
    @media(max-width: 600px) {
        height: 80vh;
    }
`

const GetStarted = styled.div`
    background-color: black;
    color: white;
    padding: 20px;
    border-radius: 7px;
    display: inline-block;
`

const Title = styled.h1`
    font-size: 2.75rem;
    font-weight: 600;
    @media(max-width: 800px) {
        font-size: 2.5rem;
    }
    @media(max-width: 300px) {
        font-size: 1.75rem;
    }
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