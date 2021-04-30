import styled from 'styled-components'
import { useState } from 'react'
import IconComponent from '../../Icons/IconComponent'
import MobileNavigation from './MobileNavigation'
import { connect } from 'react-redux'

const MobileHeader = (props) => {
    const [showMobileNav, setShowMobileNav] = useState(false)
    return(
        <Container isModalOpen={props.isModalOpen}>
            <Logo>Redraft</Logo>
            <Icon onClick={()=>setShowMobileNav(true)}>
                <IconComponent><path d="M24 6h-24v-4h24v4zm0 4h-24v4h24v-4zm0 8h-24v4h24v-4z"/></IconComponent>
            </Icon>
            <MobileNavigation setShowMobileNav={setShowMobileNav} showMobileNav={showMobileNav} />
        </Container>

    )
}

const mapStateToProps = state => ({
    isModalOpen: state.app.isModalOpen
})

export default connect(mapStateToProps)(MobileHeader)

const Icon = styled.button`
`

const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 80px;
    width: 100vw;
    padding: 0 30px;
    background-color: var(--sidebar);
    @media(min-width: 800px) {
        display: none;
    }
    position: fixed;
    /* position: ${props=>props.isModalOpen ? 'absolute' : 'fixed'}; */
    top: 0;
    isolation: isolate;
`

const Logo = styled.h1`
    font-size: 1.5rem;
    font-weight: 700;
`