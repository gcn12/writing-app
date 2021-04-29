import styled from 'styled-components'

const ColorsSection = () => {
    return(
        <Container>
            <ContentContainer>
                <ImageColorsContainer>
                    <Image src='https://firebasestorage.googleapis.com/v0/b/writing-136ac.appspot.com/o/dark.png?alt=media&token=a0bc5acd-7950-4998-b106-7fbada394e95' alt='color selection demo' />
                    <Colors>
                        {colors.map((color, index)=> {
                            return(
                                <Color color={color} key={index} />
                            )
                        })}
                    </Colors>
                </ImageColorsContainer>
                <div>
                    <Title>Make it yours</Title>
                    <Subtitle>Dark mode, light mode, and everything in between. Customize the app with your favorite colors.</Subtitle>
                </div>
            </ContentContainer>
        </Container>
    )
}

const colors = [
    '#3e3d4d',
    '#9d8cbf',
    '#fbebff',
    '#6d718a',
    '#141415',
]

export default ColorsSection

const Container = styled.section`
    display: flex;
    justify-content: center;
`

const ContentContainer = styled.div`
    padding: 0 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    margin: 4% 0;
    position: relative;
    @media(max-width: 900px) {
        flex-direction: column-reverse;
        align-items: flex-start;
    }
    @media(max-width: 600px) {
        flex-direction: column-reverse;
        align-items: flex-start;
        margin: 8% 0;
    }
`

const Subtitle = styled.h2`
    font-size: 1.25rem;
    font-weight: 400;
    max-width: 30ch;
    margin: 20px 0;
    line-height: 1.2;
`

const Title = styled.h1`
    font-size: 2.7rem;
    font-weight: 600;
    @media(max-width: 600px) {
        font-size: 2.5rem;
    }
`

const Image = styled.img`
    max-height: auto;
    width: 40vw;
    max-width: 700px;
    box-shadow: 0 10px 10px rgba(0, 0, 0, .3);
    margin-bottom: 10px;
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

const ImageColorsContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-right: 50px;
    width: 40vw;
    max-width: 700px;
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

const Colors = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
`

const Color = styled.article`
    background-color: ${props=>props.color};
    border-radius: 50%;
    width: 5vw;
    height: 5vw;
    box-shadow: 0 10px 10px rgba(0, 0, 0, .1);
    border: 1px solid rgba(0, 0, 0, .2);
    @media(max-width: 900px) {
        width: 8vw;
        height: 8vw;
    }
    @media(max-width: 500px) {
        width: 12vw;
        height: 12vw;
    }
`