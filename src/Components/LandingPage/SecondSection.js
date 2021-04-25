import styled from 'styled-components'
import image from '../../dark.png'

const SecondSection = () => {
    return(
        <Container>
            <ContentContainer>
                <ImageColorsContainer>
                    <Image src={image} alt='dark interface' />
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
                    <Subtitle>Customize the app with your favorite colors.</Subtitle>
                </div>
            </ContentContainer>
        </Container>
    )
}

const colors = [
    '#433f4b',
    '#3e3d4d',
    '#fbebff',
    '#53566a',
    '#141415',
]

export default SecondSection

const Container = styled.section`
    display: flex;
    justify-content: center;
    /* background-color: blanchedalmond; */
`

const ContentContainer = styled.div`
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
`

const Subtitle = styled.h2`
    font-size: 1.25rem;
    font-weight: 400;
    max-width: 30ch;
    margin: 20px 0;
`

const Title = styled.h1`
    font-size: 2.75rem;
    font-weight: 600;
`

const Image = styled.img`
    max-height: 300px;
    width: min(40vw, 100%); 
    box-shadow: 0 10px 10px rgba(0, 0, 0, .3);
    border: 1px solid rgba(0, 0, 0, .1);
    margin-bottom: 10px;
    /* margin-right: 50px; */
    @media(max-width: 900px) {
        width: 80vw;
        max-height: none;
        height: auto;
    }
`

const ImageColorsContainer = styled.div`
    /* border: 1px solid black; */
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-right: 50px; 
    /* max-height: 300px;
    width: min(40vw, 100%); 
    width: 100%; */
    height: 350px;
    width: 500px;
    @media(max-width: 900px) {
        width: 80vw;
        max-height: none;
        height: auto;
        margin-right: 0px;
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
    height: 60px;
    width: 60px;
    border: 1px solid rgba(0, 0, 0, .2);
`