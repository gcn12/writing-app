import styled from 'styled-components'
import { Link } from 'react-router-dom'
import IconComponent from '../../../Icons/IconComponent'
import { connect } from 'react-redux'
import { dashboardCurrentSection } from '../../../redux/actions/appActions'

const SidebarItem = (props) => {

    const navigateSidebar = (menuItem) => {
        return props.dispatch(dashboardCurrentSection(menuItem))
    }

    return(
        <LI>
            <StyledLink to={props.link}>
                <LiButton onClick={()=>navigateSidebar(props.type)} background={props.match.params.page===props.highlightParam ? 'var(--highlight)' : 'transparent'} hover={props.dashboardCurrentSection!==props.highlightParam ? 'var(--highlight)' : null} >
                    <Icon><IconComponent>{props.children}</IconComponent></Icon>
                    <NavigationItem>{props.name}</NavigationItem>
                </LiButton>
            </StyledLink>
        </LI>
    )
}

const mapStateToProps = state => ({
    dashboardCurrentSection: state.app.dashboardCurrentSection
})

export default connect(mapStateToProps)(SidebarItem)

const NavigationItem = styled.p`
    text-align: center;
`

const LI = styled.li`
`

const LiButton = styled.span`
    display: flex;
    align-items: center;
    background-color: ${props=> props.background};
    border: none;
    padding: 10px 0 10px 5px;
    margin: 5px 0;
    font-size: 1.25rem;
    width: 100%;
    border-radius: 5px;
    transition: background-color 50ms ease-in-out;
    &:hover {
        background-color: ${props=> props.hover};
    }
`

const StyledLink = styled(Link)`
    text-decoration: none;
    &:focus{
        box-shadow: none; 
    }
    &:focus-within {
        ${LiButton} {
            box-shadow: 0 0 0 5px rgba(21, 156, 228, 0.4);
        }
    }
`

const Icon = styled.div`
    transform: scale(.8);
    right: 7px;
    position: relative;
    top: 1px;
    margin-left: 20px;
`