import styled from 'styled-components'
import IconComponent from '../../../Icons/IconComponent'
import { Link } from 'react-router-dom'
import CreatePDFButton from './CreatePDFButton'

const Toolbar = (props) => {
    return(
        <Container>
            <Home aria-label='return to home' to='/writing-app'>
                <IconComponent><path d="M21 13v10h-6v-6h-6v6h-6v-10h-3l12-12 12 12h-3zm-1-5.907v-5.093h-3v2.093l3 3z"/></IconComponent>
            </Home>
            <RightContainer>
                <Status>{props.savingStatus}</Status>
                <CreatePDFButton value={props.value} />
            </RightContainer>
        </Container>
    )
}

export default Toolbar

const Status = styled.h3`
    @media(max-width: 500px) {
        font-size: .85rem;
    }
`

const RightContainer = styled.div`
    display: flex;
    align-items: center;
`

const Home = styled(Link)`
    justify-self: flex-start;
`

const Container = styled.div`
    position: fixed;
    top: 0;
    background-color: var(--background);
    width: 100%;
    z-index: 1;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 60px;
    transition: opacity 300ms ease-in-out;
    outline: 1px solid rgba(0, 0, 0, .1);
    &:hover {
        opacity: 1;
    }
    @media(hover: hover) {
        &:not(:hover) {
            opacity: 0;
        }
    }
`