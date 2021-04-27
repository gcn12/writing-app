import styled from 'styled-components'
import { Link } from 'react-router-dom'
import EditorPreview from './EditorPreview'
import { useState, useEffect } from 'react'

const MainSection = () => {
    const [isArrowVisible, setIsArrowVisible] = useState(false)

    useEffect(()=> {
        setIsArrowVisible(true)
    }, [])

    return(
        <Container>
            <ContentContainer>
                <Title>Screenwriting, essentials only.</Title>
                <Subtitle>Everything you need to write your next best screenplay.</Subtitle>
                <EditorPreview />
                <StyledLink to='/writing-app/signup'>
                    <GetStarted>Get started now</GetStarted>
                </StyledLink>
                <TryItAbsolute>
                    <TryItRelative>
                        <Arrow isArrowVisible={isArrowVisible} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M16 15v4l8-8.035-8-7.965v4s-13.277 2.144-16 14c5.796-6.206 16-6 16-6z"/></Arrow>
                        <TryItText isArrowVisible={isArrowVisible}>Try it out!</TryItText>
                    </TryItRelative>
                </TryItAbsolute>
            </ContentContainer>
        </Container>
    )
}

export default MainSection

const Arrow = styled.svg`
    transform: ${props=>props.isArrowVisible ? 'rotate(240deg)' : 'rotate(200deg)'};
    width: 80px;
    height: 80px;
    opacity: ${props=>props.isArrowVisible ? 1 : 0};
    transition: opacity 400ms ease-in-out, transform 400ms ease-in-out;
    transform-origin: bottom left;
    transition-delay: 300ms;
    @media(max-width: 600px) {
        transform: rotate(260deg);
        width: 55px;
        height: 55px;
    }
`

const TryItText = styled.h3`
    opacity: ${props=>props.isArrowVisible ? 1 : 0};
    transition: opacity 400ms ease-in-out;
    transition-delay: 800ms;
    position: relative;
    top: -10px;
    left: 0px;
    font-size: 1.25rem;
    font-weight: 600;
    @media(max-width: 600px) {
        font-size: 1.125rem;
        top: -15px;
        left: 0px;
    }
`

const TryItRelative = styled.div`
    position: relative;
    top: -100px;
    @media(max-width: 600px) {
        top: -80px;
    }
`

const TryItAbsolute = styled.div`
    position: absolute;
    left: 70%;
    @media(min-width: 1450px) {
        left: 60%;
    }
    @media(max-width: 400px) {
        display: none;
    }
`

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