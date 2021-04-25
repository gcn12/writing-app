import styled from 'styled-components'
import image from '../../outline.png'

const OutliningSection = () => {
    return(
        <Container>
            <ContentContainer>
                <div>
                    <Title>Outlining tools</Title>
                    <Subtitle>Virtual notecards make it easy to structure your story.</Subtitle>
                </div>
                <Image src={image} alt='dark interface' />
            </ContentContainer>
        </Container>
    )
}


export default OutliningSection

const Container = styled.section`
    display: flex;
    justify-content: center;
    /* background-color: blanchedalmond; */
`

const Subtitle = styled.h2`
    font-size: 1.25rem;
    font-weight: 400;
    max-width: 30ch;
    margin: 20px 0;
`

const ContentContainer = styled.div`
    padding: 0 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    margin: 8% 0;
    position: relative;
    @media(max-width: 900px) {
        flex-direction: column;
        align-items: flex-start;
    }
    @media(max-width: 600px) {
        margin: 14% 0;
    }
`
const Image = styled.img`
    /* max-height: 300px;
    width: auto; */
    width: 40vw;
    box-shadow: 0 10px 10px rgba(0, 0, 0, .3);
    margin-right: 50px;
    @media(max-width: 900px) {
        width: 70vw;
        max-height: none;
        height: auto;
        margin-right: 0px;
    }
    @media(max-width: 500px) {
        width: 100%;
    }
`

const Title = styled.h1`
    font-size: 2.75rem;
    font-weight: 600;
    @media(max-width: 600px) {
        font-size: 2.5rem;
    }
`