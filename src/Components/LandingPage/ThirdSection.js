import styled from 'styled-components'

const ThirdSection = () => {
    return(
        <Container>
            <div>
                <Title>Leave the formatting to us</Title>
                <Subtitle>Redraft follows screenwriting formatting.</Subtitle>
            </div>
            <Preview height='300px' width='auto' autoPlay muted loop>
                <source src='https://firebasestorage.googleapis.com/v0/b/writing-136ac.appspot.com/o/app%20preview.mov?alt=media&token=0e668593-cc11-410e-b899-22aeaa83938d' />
            </Preview>
        </Container>
    )
}

export default ThirdSection

const Preview = styled.video`
    box-shadow: 0 10px 10px rgba(0, 0, 0, .3);
    outline: 1px solid rgba(0, 0, 0, .1);
    /* margin-left: 50px; */
`

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    /* gap: 50px; */
    padding-bottom: 25vh;
    height: 40vh;
`

const Title = styled.h1`
    font-size: 2.75rem;
    font-weight: 600;
    max-width: 15ch;
`

const Subtitle = styled.h2`
    font-size: 1.25rem;
    font-weight: 400;
    max-width: 30ch;
    margin: 20px 0;
`