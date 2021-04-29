import styled from 'styled-components'

const OutliningSection = () => {
    return(
        <Container>
            <ContentContainer>
                <div>
                    <Title>Outlining tools</Title>
                    <Subtitle>Virtual notecards make it easy to structure your story.</Subtitle>
                </div>
                <Preview playsInline autoPlay muted loop>
                    <source type='video/mp4' src='https://firebasestorage.googleapis.com/v0/b/writing-136ac.appspot.com/o/OutlineDemoVideo.mov?alt=media&token=658422ff-eaa9-4610-8645-fba4629822d1' />
                </Preview>
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

const Title = styled.h1`
    font-size: 2.7rem;
    font-weight: 600;
    @media(max-width: 600px) {
        font-size: 2.5rem;
    }
`