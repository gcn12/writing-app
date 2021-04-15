import styled from 'styled-components'
import { Link } from 'react-router-dom'
import IconComponent from '../../../Icons/IconComponent'
import { connect } from 'react-redux'
import { dashboardCurrentSection } from '../../../redux/actions/appActions'

const Sidebar = (props) => {

    const navigateSidebar = (menuItem) => {
        return props.dispatch(dashboardCurrentSection(menuItem))
    }

    return(
        <Container>
            <Logo>Redraft</Logo>
            <UL>
                <LI>
                    <StyledLink to='/writing-app/dashboard'>
                        <LiButton onClick={()=>navigateSidebar('projects')} background={props.match.params.page===undefined ? 'var(--highlight)' : 'transparent'} hover={props.dashboardCurrentSection!==undefined ? 'var(--highlight)' : null} >
                            <Icon><IconComponent><path d="M6 22v-16h16v7.543c0 4.107-6 2.457-6 2.457s1.518 6-2.638 6h-7.362zm18-7.614v-10.386h-20v20h10.189c3.163 0 9.811-7.223 9.811-9.614zm-10 1.614h-5v-1h5v1zm5-4h-10v1h10v-1zm0-3h-10v1h10v-1zm2-7h-19v19h-2v-21h21v2z"/></IconComponent></Icon>
                            <NavigationItem>All files</NavigationItem>
                        </LiButton>
                    </StyledLink>
                </LI>
                <LI>
                    <LiButton onClick={()=>navigateSidebar('analytics')} background={props.match.params.page==='analytics' ? 'var(--highlight)' : 'transparent'} hover={props.dashboardCurrentSection!=='analytics' ? 'var(--highlight)' : null}>
                        <Icon><IconComponent><path d="M13 12.414v-12.364c6.158.51 11 5.66 11 11.95 0 6.627-5.373 12-12 12-2.953 0-5.654-1.072-7.744-2.842l8.744-8.744zm-2-12.364c-6.158.51-11 5.66-11 11.95 0 2.954 1.072 5.654 2.842 7.745l1.42-1.42c-1.412-1.725-2.262-3.928-2.262-6.325 0-5.177 3.953-9.446 9-9.949v-2.001z"/></IconComponent></Icon>
                        <NavigationItem>Analytics</NavigationItem>
                    </LiButton>
                </LI>
                <LI>
                    <StyledLink to='/writing-app/dashboard/themes'>
                        <LiButton onClick={()=>navigateSidebar('themes')} background={props.match.params.page==='themes' ? 'var(--highlight)' : 'transparent'} hover={props.dashboardCurrentSection!=='themes' ? 'var(--highlight)' : null}>
                            <Icon><IconComponent><path d="M8.997 13.985c.01 1.104-.88 2.008-1.986 2.015-1.105.009-2.005-.88-2.011-1.984-.01-1.105.879-2.005 1.982-2.016 1.106-.007 2.009.883 2.015 1.985zm-.978-3.986c-1.104.008-2.008-.88-2.015-1.987-.009-1.103.877-2.004 1.984-2.011 1.102-.01 2.008.877 2.012 1.982.012 1.107-.88 2.006-1.981 2.016zm7.981-4.014c.004 1.102-.881 2.008-1.985 2.015-1.106.01-2.008-.879-2.015-1.983-.011-1.106.878-2.006 1.985-2.015 1.101-.006 2.005.881 2.015 1.983zm-12 15.847c4.587.38 2.944-4.492 7.188-4.537l1.838 1.534c.458 5.537-6.315 6.772-9.026 3.003zm14.065-7.115c1.427-2.239 5.846-9.748 5.846-9.748.353-.623-.429-1.273-.975-.813 0 0-6.572 5.714-8.511 7.525-1.532 1.432-1.539 2.086-2.035 4.447l1.68 1.4c2.227-.915 2.868-1.04 3.995-2.811zm-12.622 4.806c-2.084-1.82-3.42-4.479-3.443-7.447-.044-5.51 4.406-10.03 9.92-10.075 3.838-.021 6.479 1.905 6.496 3.447l1.663-1.456c-1.01-2.223-4.182-4.045-8.176-3.992-6.623.055-11.955 5.466-11.903 12.092.023 2.912 1.083 5.57 2.823 7.635.958.492 2.123.329 2.62-.204zm12.797-1.906c1.059 1.97-1.351 3.37-3.545 3.992-.304.912-.803 1.721-1.374 2.311 5.255-.591 9.061-4.304 6.266-7.889-.459.685-.897 1.197-1.347 1.586z"/></IconComponent></Icon>
                            <NavigationItem>Colors</NavigationItem>
                        </LiButton>
                    </StyledLink>
                </LI> 
                <LI>
                    <StyledLink to='/writing-app/dashboard/settings'>
                        <LiButton onClick={()=>navigateSidebar('settings')} background={props.match.params.page==='settings' ? 'var(--highlight)' : 'transparent'} hover={props.dashboardCurrentSection!=='settings' ? 'var(--highlight)' : null}>
                            <Icon><IconComponent><path d="M24 14.187v-4.374c-2.148-.766-2.726-.802-3.027-1.529-.303-.729.083-1.169 1.059-3.223l-3.093-3.093c-2.026.963-2.488 1.364-3.224 1.059-.727-.302-.768-.889-1.527-3.027h-4.375c-.764 2.144-.8 2.725-1.529 3.027-.752.313-1.203-.1-3.223-1.059l-3.093 3.093c.977 2.055 1.362 2.493 1.059 3.224-.302.727-.881.764-3.027 1.528v4.375c2.139.76 2.725.8 3.027 1.528.304.734-.081 1.167-1.059 3.223l3.093 3.093c1.999-.95 2.47-1.373 3.223-1.059.728.302.764.88 1.529 3.027h4.374c.758-2.131.799-2.723 1.537-3.031.745-.308 1.186.099 3.215 1.062l3.093-3.093c-.975-2.05-1.362-2.492-1.059-3.223.3-.726.88-.763 3.027-1.528zm-4.875.764c-.577 1.394-.068 2.458.488 3.578l-1.084 1.084c-1.093-.543-2.161-1.076-3.573-.49-1.396.581-1.79 1.693-2.188 2.877h-1.534c-.398-1.185-.791-2.297-2.183-2.875-1.419-.588-2.507-.045-3.579.488l-1.083-1.084c.557-1.118 1.066-2.18.487-3.58-.579-1.391-1.691-1.784-2.876-2.182v-1.533c1.185-.398 2.297-.791 2.875-2.184.578-1.394.068-2.459-.488-3.579l1.084-1.084c1.082.538 2.162 1.077 3.58.488 1.392-.577 1.785-1.69 2.183-2.875h1.534c.398 1.185.792 2.297 2.184 2.875 1.419.588 2.506.045 3.579-.488l1.084 1.084c-.556 1.121-1.065 2.187-.488 3.58.577 1.391 1.689 1.784 2.875 2.183v1.534c-1.188.398-2.302.791-2.877 2.183zm-7.125-5.951c1.654 0 3 1.346 3 3s-1.346 3-3 3-3-1.346-3-3 1.346-3 3-3zm0-2c-2.762 0-5 2.238-5 5s2.238 5 5 5 5-2.238 5-5-2.238-5-5-5z"/></IconComponent></Icon>
                            <NavigationItem>Settings</NavigationItem>
                        </LiButton>
                    </StyledLink>
                </LI>
                {/* <LI>
                    <LiButton onClick={()=>navigateSidebar('deleted')} background={props.match.params.page==='deleted' ? 'var(--highlight)' : 'transparent'} hover={props.dashboardCurrentSection!=='deleted' ? 'var(--highlight)' : null}>
                        <Icon><IconComponent><path d="M9 19c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5-17v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.315c0 .901.73 2 1.631 2h5.712zm-3 4v16h-14v-16h-2v18h18v-18h-2z"/></IconComponent></Icon>
                        <NavigationItem>Deleted</NavigationItem>
                    </LiButton>
                </LI> */}
            </UL>
        </Container>
    )
}

const mapStateToProps = state => ({
    userData: state.app.userData,
    projects: state.dashboard.projects,
    projectFiles: state.app.projectFiles,
    dashboardCurrentSection: state.app.dashboardCurrentSection,
})

export default connect(mapStateToProps)(Sidebar)

const NavigationItem = styled.p`
    text-align: center;
`

const Container = styled.div`
    width: 18vw;
    padding: 0 20px;
    background-color: var(--sidebar);
    height: 100vh;
    min-width: 200px;
    position: fixed;
`

const LI = styled.li`
`

const UL = styled.ul`
`

const LiButton = styled.span`
    display: flex;
    /* justify-content: center; */
    align-items: center;
    background-color: ${props=> props.background};
    border: none;
    padding: 10px 0 10px 5px;
    margin: 5px 0;
    font-size: 1.25rem;
    width: 100%;
    border-radius: 5px;
    /* box-shadow: none; */
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

const Logo = styled.h1`
    font-size: 1.5rem;
    font-weight: 700;
    display: grid;
    justify-content: center;
    padding: 20px;
    margin: 30px 0 70px 0;
`