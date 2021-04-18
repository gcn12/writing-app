import styled from 'styled-components'
import IconComponent from '../../Icons/IconComponent'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { dashboardCurrentSection } from '../../redux/actions/appActions'

const MobileNavItem = (props) => {

    const navigateSidebar = (menuItem) => {
        props.setShowMobileNav(false)
        return props.dispatch(dashboardCurrentSection(menuItem))
    }

    return(
        <Container>
            <StyledLink to={props.link} onClick={()=>navigateSidebar(props.type)}>
                <IconComponent>{props.children}</IconComponent>
                <Name>{props.name}</Name>
            </StyledLink>
        </Container>
    )
}

const mapStateToProps = state => ({
    dashboardCurrentSection: state.app.dashboardCurrentSection
})

export default connect(mapStateToProps)(MobileNavItem)

const Name = styled.h2`
    margin-left: 10px; 
    font-size: 2rem;
`

const StyledLink = styled(Link)`
    display: flex;
    align-items: center;
    text-decoration: none;
`

const Container = styled.li`
    margin-bottom: 20px;
`