import styled from 'styled-components'
import IconComponent from '../../Icons/IconComponent'

const MobileHeader = () => {
    return(
        <Container>
            <Logo>Redraft</Logo>
            <IconComponent><path d="M24 6h-24v-4h24v4zm0 4h-24v4h24v-4zm0 8h-24v4h24v-4z"/></IconComponent>
        </Container>
    )
}

export default MobileHeader

const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100px;
    width: 100vw;
    padding: 0 30px;
    background-color: var(--sidebar);
    @media(min-width: 900px) {
        display: none;
    }
`

const Logo = styled.h1`
    font-size: 1.5rem;
    font-weight: 700;
    /* display: grid;
    justify-content: center;
    padding: 20px; */
    /* margin: 30px 0 70px 0; */
`