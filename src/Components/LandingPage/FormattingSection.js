import styled from 'styled-components'

const FormattingSection = () => {
    return(
        <Container>
            <ContentContainer>
                <div>
                    <Title>Leave the formatting to us</Title>
                    <Subtitle>Redraft formats your script as you type.</Subtitle>
                </div>
                <Preview autoPlay muted loop>
                    <source src='https://firebasestorage.googleapis.com/v0/b/writing-136ac.appspot.com/o/app%20preview.mov?alt=media&token=0e668593-cc11-410e-b899-22aeaa83938d' />
                </Preview>
            </ContentContainer>
        </Container>
    )
}

export default FormattingSection

const Container = styled.section`
    display: flex;
    justify-content: center;
    padding: 0 30px;
    /* background-color: green; */
`

const Preview = styled.video`
    /* max-height: 300px; */
    /* width: min(40vw, auto, 100%);  */
    width: 40vw;
    max-width: 700px;
    box-shadow: 0 10px 10px rgba(0, 0, 0, .3);
    border: 1px solid rgba(0, 0, 0, .1);
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

const ContentContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    margin: 8% 0;
    @media(max-width: 900px) {
        flex-direction: column;
        align-items: flex-start;
    }
    @media(max-width: 600px) {
        margin: 14% 0;
    }
`

const Title = styled.h1`
    font-size: 2.75rem;
    font-weight: 600;
    max-width: 15ch;
    @media(max-width: 600px) {
        font-size: 2.5rem;
    }
`

const Subtitle = styled.h2`
    font-size: 1.25rem;
    font-weight: 400;
    max-width: 30ch;
    margin: 20px 0;
`