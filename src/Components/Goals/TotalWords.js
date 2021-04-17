import styled from 'styled-components'
import fitty from 'fitty'
import { useEffect } from 'react'

const TotalWords = () => {

    useEffect(()=> {
        fitty('#total-words', {
            minSize: 10,
            max: 20,
        })
    }, [])

    return(
        <Container>
            <Number>1000</Number>
            <Subtitle id='total-words'>total words</Subtitle>
        </Container>
    )
}

export default TotalWords

const Subtitle = styled.h2`
    font-size: 2rem;
    font-weight: 500;
    white-space: nowrap;
    padding: 0 20px;
`

const Number = styled.h1`
    font-size: 3rem;
    font-weight: 600;
`

const Container = styled.article`
    height: 15vw;
    width: 15vw;
    background-color: var(--sidebar);
    margin: 20px 0;
    border-radius: 10px;
    padding: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 40px;
`