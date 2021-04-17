import styled from 'styled-components'
import { useEffect } from 'react'
import fitty from 'fitty'

const ScreenplaysCompleted = () => {

    useEffect(()=> {
        fitty('#screenplays-completed', {
            minSize: 10,
            max: 20,
        })
    }, [])

    return(
        <Container>
            <Number>2</Number>
            <Subtitle id='screenplays-completed'>screenplays completed</Subtitle>
        </Container>
    )
}

export default ScreenplaysCompleted

const Subtitle = styled.h2`
    font-size: 1.25rem;
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
    padding: 40px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 40px;
`