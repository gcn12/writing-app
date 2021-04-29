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
                <Preview playsInline autoPlay muted loop>
                    <source src='https://firebasestorage.googleapis.com/v0/b/writing-136ac.appspot.com/o/OutlineDemoVideo.mov?alt=media&token=e2d2118e-85df-47a5-ad31-f6e706894627' />
                </Preview>
                {/* <Image src='https://firebasestorage.googleapis.com/v0/b/writing-136ac.appspot.com/o/OutlineDemo.png?alt=media&token=9ef8acf2-5ab5-4ba7-ba6b-50b5c77b5983' alt='dark interface' /> */}
            </ContentContainer>
        </Container>
    )
}


export default OutliningSection

const Preview = styled.video`
    width: 40vw;
    max-width: 700px;
    box-shadow: 0 10px 10px rgba(0, 0, 0, .3);
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

const Container = styled.section`
    display: flex;
    justify-content: center;
`

const Subtitle = styled.h2`
    font-size: 1.25rem;
    font-weight: 400;
    max-width: 30ch;
    margin: 20px 0;
    line-height: 1.2;
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
    width: 40vw;
    max-width: 700px;
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
    font-size: 2.7rem;
    font-weight: 600;
    @media(max-width: 600px) {
        font-size: 2.5rem;
    }
`