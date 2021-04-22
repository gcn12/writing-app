import styled from 'styled-components'
import { Link } from 'react-router-dom'

const FirstSection = () => {
    return(
        <Container>
            <div>
                <Title>Screenwriting, </Title>
                <Title>essentials only.</Title>
                <Subtitle>Redraft gives you everything you need to write your next best screenplay.</Subtitle>
                <StyledLink to='/writing-app/signup'>
                    <GetStarted>Get started now</GetStarted>
                </StyledLink>
            </div>
            <Image src='dashboard.png' alt='interface' />
            <BackgroundColorDecoration color='#cfd1fa' blur='60px' height='270px' width='270px' top='-5%' left='25%' opacity='.4' />
            <BackgroundColorDecoration color='#ffd8cc' blur='50px' height='200px' width='200px' top='30%' right='0' opacity='.6' />
            <BackgroundColorDecoration color='#f8ffc7' blur='50px' height='300px' width='300px' top='60%' left='0%' opacity='.2' />
        </Container>
    )
}

export default FirstSection

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

const Subtitle = styled.h2`
    font-size: 1.25rem;
    font-weight: 400;
    max-width: 30ch;
    margin: 20px 0;
`

const Container = styled.div`
    display: flex;
    /* flex-direction: column; */
    justify-content: center;
    align-items: center;
    /* gap: 50px; */
    height: 95vh;
    position: relative;
`
const Image = styled.img`
    max-height: 300px;
    max-width: auto; 
    box-shadow: 0 10px 10px rgba(0, 0, 0, .3);
    outline: 1px solid rgba(0, 0, 0, .1);
    margin-left: 50px;
    position: relative;
    z-index: 1;
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