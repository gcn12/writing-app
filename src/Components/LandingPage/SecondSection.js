import styled from 'styled-components'

const FirstSection = () => {
    return(
        <Container>
            <ContentContainer>
                <Image src='dark.png' alt='dark interface' />
                <div>
                    <Title>Make it yours</Title>
                    <Subtitle>Customize the app with your favorite colors.</Subtitle>
                </div>
            </ContentContainer>
        </Container>
    )
}

export default FirstSection

const Container = styled.section`
    display: flex;
    justify-content: center;
`

const Subtitle = styled.h2`
    font-size: 1.25rem;
    font-weight: 400;
    max-width: 30ch;
    margin: 20px 0;
`

const ContentContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 25vh;
    height: 60vh;
    position: relative;
    @media(max-width: 900px) {
        /* flex-direction: row-reverse; */
        flex-direction: column-reverse;
        align-items: flex-start;
    }
`
const Image = styled.img`
    max-height: 300px;
    width: min(40vw, 100%); 
    box-shadow: 0 10px 10px rgba(0, 0, 0, .3);
    outline: 1px solid rgba(0, 0, 0, .1);
    margin-right: 50px;
    @media(max-width: 900px) {
        /* flex-direction: row-reverse; */
        width: 80vw;
        max-height: none;
        height: auto;
    }
`

const Title = styled.h1`
    font-size: 2.75rem;
    font-weight: 600;
`