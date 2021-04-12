import styled from 'styled-components'
import { Link } from 'react-router-dom'
import IconComponent from '../../../Icons/IconComponent'
import { connect } from 'react-redux'
import { dashboardCurrentSection } from '../../../redux/actions/appActions'

const Sidebar = (props) => {

    const navigateSidebar = (menuItem) => {
        // if(menuItem==='projects') getProjects()
        // if(menuItem==='files') getAllFiles()
        return props.dispatch(dashboardCurrentSection(menuItem))
    }

    return(
        <Container>
            <Logo>Redraft</Logo>
            <UL>
                <LI>
                <Link to='/writing-app/dashboard'>
                    <LiButton onClick={()=>navigateSidebar('projects')} background={props.dashboardCurrentSection==='projects' ? 'hsl(202, 40%, 85%)' : 'transparent'} hover={props.dashboardCurrentSection==='projects' ? 'hsl(202, 40%, 85%)' : 'hsl(200, 10%, 95%)'} >
                    {/* <Icon alt='' src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNNiAyMnYtMTZoMTZ2Ny41NDNjMCA0LjEwNy02IDIuNDU3LTYgMi40NTdzMS41MTggNi0yLjYzOCA2aC03LjM2MnptMTgtNy42MTR2LTEwLjM4NmgtMjB2MjBoMTAuMTg5YzMuMTYzIDAgOS44MTEtNy4yMjMgOS44MTEtOS42MTR6bS0xMCAxLjYxNGgtNXYtMWg1djF6bTUtNGgtMTB2MWgxMHYtMXptMC0zaC0xMHYxaDEwdi0xem0yLTdoLTE5djE5aC0ydi0yMWgyMXYyeiIvPjwvc3ZnPg==" /> */}
                    <Icon><IconComponent><path d="M6 22v-16h16v7.543c0 4.107-6 2.457-6 2.457s1.518 6-2.638 6h-7.362zm18-7.614v-10.386h-20v20h10.189c3.163 0 9.811-7.223 9.811-9.614zm-10 1.614h-5v-1h5v1zm5-4h-10v1h10v-1zm0-3h-10v1h10v-1zm2-7h-19v19h-2v-21h21v2z"/></IconComponent></Icon>
                    All files
                    </LiButton>
                </Link>
                </LI>
                <LI><LiButton onClick={()=>navigateSidebar('analytics')} background={props.dashboardCurrentSection==='analytics' ? 'hsl(202, 40%, 85%)' : 'transparent'} hover={props.dashboardCurrentSection==='analytics' ? 'hsl(202, 40%, 85%)' : 'hsl(200, 10%, 95%)'}>
                    <Icon><IconComponent><path d="M13 12.414v-12.364c6.158.51 11 5.66 11 11.95 0 6.627-5.373 12-12 12-2.953 0-5.654-1.072-7.744-2.842l8.744-8.744zm-2-12.364c-6.158.51-11 5.66-11 11.95 0 2.954 1.072 5.654 2.842 7.745l1.42-1.42c-1.412-1.725-2.262-3.928-2.262-6.325 0-5.177 3.953-9.446 9-9.949v-2.001z"/></IconComponent></Icon>
                    Analytics
                </LiButton ></LI>
                <LI>
                <Link to='/writing-app/dashboard/settings'>
                    <LiButton onClick={()=>navigateSidebar('settings')} background={props.dashboardCurrentSection==='settings' ? 'hsl(202, 40%, 85%)' : 'transparent'} hover={props.dashboardCurrentSection==='settings' ? 'hsl(202, 40%, 85%)' : 'hsl(200, 10%, 95%)'}>
                    <Icon><IconComponent><path d="M24 14.187v-4.374c-2.148-.766-2.726-.802-3.027-1.529-.303-.729.083-1.169 1.059-3.223l-3.093-3.093c-2.026.963-2.488 1.364-3.224 1.059-.727-.302-.768-.889-1.527-3.027h-4.375c-.764 2.144-.8 2.725-1.529 3.027-.752.313-1.203-.1-3.223-1.059l-3.093 3.093c.977 2.055 1.362 2.493 1.059 3.224-.302.727-.881.764-3.027 1.528v4.375c2.139.76 2.725.8 3.027 1.528.304.734-.081 1.167-1.059 3.223l3.093 3.093c1.999-.95 2.47-1.373 3.223-1.059.728.302.764.88 1.529 3.027h4.374c.758-2.131.799-2.723 1.537-3.031.745-.308 1.186.099 3.215 1.062l3.093-3.093c-.975-2.05-1.362-2.492-1.059-3.223.3-.726.88-.763 3.027-1.528zm-4.875.764c-.577 1.394-.068 2.458.488 3.578l-1.084 1.084c-1.093-.543-2.161-1.076-3.573-.49-1.396.581-1.79 1.693-2.188 2.877h-1.534c-.398-1.185-.791-2.297-2.183-2.875-1.419-.588-2.507-.045-3.579.488l-1.083-1.084c.557-1.118 1.066-2.18.487-3.58-.579-1.391-1.691-1.784-2.876-2.182v-1.533c1.185-.398 2.297-.791 2.875-2.184.578-1.394.068-2.459-.488-3.579l1.084-1.084c1.082.538 2.162 1.077 3.58.488 1.392-.577 1.785-1.69 2.183-2.875h1.534c.398 1.185.792 2.297 2.184 2.875 1.419.588 2.506.045 3.579-.488l1.084 1.084c-.556 1.121-1.065 2.187-.488 3.58.577 1.391 1.689 1.784 2.875 2.183v1.534c-1.188.398-2.302.791-2.877 2.183zm-7.125-5.951c1.654 0 3 1.346 3 3s-1.346 3-3 3-3-1.346-3-3 1.346-3 3-3zm0-2c-2.762 0-5 2.238-5 5s2.238 5 5 5 5-2.238 5-5-2.238-5-5-5z"/></IconComponent></Icon>
                    Settings
                </LiButton></Link></LI>
                <LI><LiButton onClick={()=>navigateSidebar('deleted')} background={props.dashboardCurrentSection==='deleted' ? 'hsl(202, 40%, 85%)' : 'transparent'} hover={props.dashboardCurrentSection==='deleted' ? 'hsl(202, 40%, 85%)' : 'hsl(200, 10%, 95%)'}>
                    {/* <Icon alt='' src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNOSAxOWMwIC41NTItLjQ0OCAxLTEgMXMtMS0uNDQ4LTEtMXYtMTBjMC0uNTUyLjQ0OC0xIDEtMXMxIC40NDggMSAxdjEwem00IDBjMCAuNTUyLS40NDggMS0xIDFzLTEtLjQ0OC0xLTF2LTEwYzAtLjU1Mi40NDgtMSAxLTFzMSAuNDQ4IDEgMXYxMHptNCAwYzAgLjU1Mi0uNDQ4IDEtMSAxcy0xLS40NDgtMS0xdi0xMGMwLS41NTIuNDQ4LTEgMS0xczEgLjQ0OCAxIDF2MTB6bTUtMTd2MmgtMjB2LTJoNS43MTFjLjkgMCAxLjYzMS0xLjA5OSAxLjYzMS0yaDUuMzE1YzAgLjkwMS43MyAyIDEuNjMxIDJoNS43MTJ6bS0zIDR2MTZoLTE0di0xNmgtMnYxOGgxOHYtMThoLTJ6Ii8+PC9zdmc+" /> */}
                    <Icon><IconComponent><path d="M9 19c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5-17v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.315c0 .901.73 2 1.631 2h5.712zm-3 4v16h-14v-16h-2v18h18v-18h-2z"/></IconComponent></Icon>
                    Deleted
                </LiButton></LI>
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

const Container = styled.div`
    width: 18vw;
    /* margin: 0 0 0 20px; */
    padding: 0 20px;
    /* background-color: hsl(0, 0%, 97%); */
    background-color: var(--sidebar);
    height: 100vh;
    /* margin-top: 115px; */
`

const LI = styled.li`
`

const UL = styled.ul`
`

const LiButton = styled.button`
    background-color: ${props=> props.background};
    display: flex;
    border: none;
    padding: 10px 0;
    font-size: 1.25rem;
    width: 100%;
    border-radius: 5px;
    transition: background-color 50ms ease-in-out;
    &:hover {
        background-color: ${props=> props.hover};
    }
`

const Icon = styled.div`
    transform: scale(.8);
    margin-right: 7px;
    position: relative;
    top: -3px;
`

const Logo = styled.h1`
    font-size: 1.5rem;
    font-weight: 700;
    display: grid;
    justify-content: center;
    padding: 20px;
    margin: 30px 0 70px 0;
`