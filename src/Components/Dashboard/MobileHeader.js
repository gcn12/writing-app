import styled from 'styled-components'
import { useState } from 'react'
import IconComponent from '../../Icons/IconComponent'
import MobileNavigation from './MobileNavigation'

const MobileHeader = () => {
    const [showMobileNav, setShowMobileNav] = useState(false)
    return(
        <Container>
            <MobileNavigation setShowMobileNav={setShowMobileNav} showMobileNav={showMobileNav} />
            <Logo>Redraft</Logo>
            <Icon onClick={()=>setShowMobileNav(true)}>
                <IconComponent><path d="M24 6h-24v-4h24v4zm0 4h-24v4h24v-4zm0 8h-24v4h24v-4z"/></IconComponent>
            </Icon>
        </Container>
    )
}

export default MobileHeader

const Icon = styled.button`

`

const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 90px;
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
`