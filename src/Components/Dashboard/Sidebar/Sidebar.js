import styled from 'styled-components'
import { db } from '../../../firebase'
import { connect } from 'react-redux'
import { projectFiles, dashboardCurrentSection } from '../../../redux/actions/appActions'
import { showProjects, projects } from '../../../redux/actions/dashboardActions'

const Sidebar = (props) => {

    const getAllFiles = () => {
        if(props.projectFiles.length === 0) {
            db.collection('users')
            .doc(props.userData.userID)
            .collection('file-previews')
            .get()
            .then(files=> {
                let filesArr = []
                files.forEach(file=> {
                    filesArr.push(file.data())
                })
                props.dispatch(projectFiles(filesArr))
                props.dispatch(showProjects(false))
            })
        }
        props.dispatch(showProjects(false))
    }

    const getProjects = () => {
        if(props.projects.length === 0) {
            db.collection('users')
            .doc(props.userData.userID)
            .collection('projects')
            .get()
            .then(data=> {
                const projectArr = []
                data.forEach(project=> {
                    projectArr.push(project.data())
                })
                props.dispatch(projects(projectArr))
            })
            props.dispatch(showProjects(true))
        }
        props.dispatch(showProjects(true))
    }

    const navigateSidebar = (menuItem) => {
        if(menuItem==='projects') getProjects()
        if(menuItem==='files') getAllFiles()
        return props.dispatch(dashboardCurrentSection(menuItem))
    }

    return(
        <Container>
            <UL>
                <LI><LiButton onClick={()=>navigateSidebar('projects')} background={props.dashboardCurrentSection==='projects' ? 'hsl(202, 60%, 85%)' : 'transparent'} hover={props.dashboardCurrentSection==='projects' ? 'hsl(202, 60%, 85%)' : 'hsl(200, 10%, 95%)'} >
                    <Icon alt='' src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNNi4wODMgNGMxLjM4IDEuNjEyIDIuNTc4IDMgNC45MTcgM2gxMXYxM2gtMjB2LTE2aDQuMDgzem0uOTE3LTJoLTd2MjBoMjR2LTE3aC0xM2MtMS42MjkgMC0yLjMwNS0xLjA1OC00LTN6Ii8+PC9zdmc+" />
                    Projects
                    </LiButton></LI>
                <LI><LiButton onClick={()=>navigateSidebar('files')} background={props.dashboardCurrentSection==='files' ? 'hsl(202, 60%, 85%)' : 'transparent'} hover={props.dashboardCurrentSection==='files' ? 'hsl(202, 60%, 85%)' : 'hsl(200, 10%, 95%)'}>
                    <Icon alt='' src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNNiAyMnYtMTZoMTZ2Ny41NDNjMCA0LjEwNy02IDIuNDU3LTYgMi40NTdzMS41MTggNi0yLjYzOCA2aC03LjM2MnptMTgtNy42MTR2LTEwLjM4NmgtMjB2MjBoMTAuMTg5YzMuMTYzIDAgOS44MTEtNy4yMjMgOS44MTEtOS42MTR6bS0xMCAxLjYxNGgtNXYtMWg1djF6bTUtNGgtMTB2MWgxMHYtMXptMC0zaC0xMHYxaDEwdi0xem0yLTdoLTE5djE5aC0ydi0yMWgyMXYyeiIvPjwvc3ZnPg==" />
                    All files
                </LiButton></LI>
                <LI><LiButton onClick={()=>navigateSidebar('analytics')} background={props.dashboardCurrentSection==='analytics' ? 'hsl(202, 60%, 85%)' : 'transparent'} hover={props.dashboardCurrentSection==='analytics' ? 'hsl(202, 60%, 85%)' : 'hsl(200, 10%, 95%)'}>
                    <Icon alt='' src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTMgMTIuNDE0di0xMi4zNjRjNi4xNTguNTEgMTEgNS42NiAxMSAxMS45NSAwIDYuNjI3LTUuMzczIDEyLTEyIDEyLTIuOTUzIDAtNS42NTQtMS4wNzItNy43NDQtMi44NDJsOC43NDQtOC43NDR6bS0yLTEyLjM2NGMtNi4xNTguNTEtMTEgNS42Ni0xMSAxMS45NSAwIDIuOTU0IDEuMDcyIDUuNjU0IDIuODQyIDcuNzQ1bDEuNDItMS40MmMtMS40MTItMS43MjUtMi4yNjItMy45MjgtMi4yNjItNi4zMjUgMC01LjE3NyAzLjk1My05LjQ0NiA5LTkuOTQ5di0yLjAwMXoiLz48L3N2Zz4=" /> 
                    Analytics
                </LiButton ></LI>
                <LI><LiButton onClick={()=>navigateSidebar('settings')} background={props.dashboardCurrentSection==='settings' ? 'hsl(202, 60%, 85%)' : 'transparent'} hover={props.dashboardCurrentSection==='settings' ? 'hsl(202, 60%, 85%)' : 'hsl(200, 10%, 95%)'}>
                    <Icon alt='' src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMjQgMTQuMTg3di00LjM3NGMtMi4xNDgtLjc2Ni0yLjcyNi0uODAyLTMuMDI3LTEuNTI5LS4zMDMtLjcyOS4wODMtMS4xNjkgMS4wNTktMy4yMjNsLTMuMDkzLTMuMDkzYy0yLjAyNi45NjMtMi40ODggMS4zNjQtMy4yMjQgMS4wNTktLjcyNy0uMzAyLS43NjgtLjg4OS0xLjUyNy0zLjAyN2gtNC4zNzVjLS43NjQgMi4xNDQtLjggMi43MjUtMS41MjkgMy4wMjctLjc1Mi4zMTMtMS4yMDMtLjEtMy4yMjMtMS4wNTlsLTMuMDkzIDMuMDkzYy45NzcgMi4wNTUgMS4zNjIgMi40OTMgMS4wNTkgMy4yMjQtLjMwMi43MjctLjg4MS43NjQtMy4wMjcgMS41Mjh2NC4zNzVjMi4xMzkuNzYgMi43MjUuOCAzLjAyNyAxLjUyOC4zMDQuNzM0LS4wODEgMS4xNjctMS4wNTkgMy4yMjNsMy4wOTMgMy4wOTNjMS45OTktLjk1IDIuNDctMS4zNzMgMy4yMjMtMS4wNTkuNzI4LjMwMi43NjQuODggMS41MjkgMy4wMjdoNC4zNzRjLjc1OC0yLjEzMS43OTktMi43MjMgMS41MzctMy4wMzEuNzQ1LS4zMDggMS4xODYuMDk5IDMuMjE1IDEuMDYybDMuMDkzLTMuMDkzYy0uOTc1LTIuMDUtMS4zNjItMi40OTItMS4wNTktMy4yMjMuMy0uNzI2Ljg4LS43NjMgMy4wMjctMS41Mjh6bS00Ljg3NS43NjRjLS41NzcgMS4zOTQtLjA2OCAyLjQ1OC40ODggMy41NzhsLTEuMDg0IDEuMDg0Yy0xLjA5My0uNTQzLTIuMTYxLTEuMDc2LTMuNTczLS40OS0xLjM5Ni41ODEtMS43OSAxLjY5My0yLjE4OCAyLjg3N2gtMS41MzRjLS4zOTgtMS4xODUtLjc5MS0yLjI5Ny0yLjE4My0yLjg3NS0xLjQxOS0uNTg4LTIuNTA3LS4wNDUtMy41NzkuNDg4bC0xLjA4My0xLjA4NGMuNTU3LTEuMTE4IDEuMDY2LTIuMTguNDg3LTMuNTgtLjU3OS0xLjM5MS0xLjY5MS0xLjc4NC0yLjg3Ni0yLjE4MnYtMS41MzNjMS4xODUtLjM5OCAyLjI5Ny0uNzkxIDIuODc1LTIuMTg0LjU3OC0xLjM5NC4wNjgtMi40NTktLjQ4OC0zLjU3OWwxLjA4NC0xLjA4NGMxLjA4Mi41MzggMi4xNjIgMS4wNzcgMy41OC40ODggMS4zOTItLjU3NyAxLjc4NS0xLjY5IDIuMTgzLTIuODc1aDEuNTM0Yy4zOTggMS4xODUuNzkyIDIuMjk3IDIuMTg0IDIuODc1IDEuNDE5LjU4OCAyLjUwNi4wNDUgMy41NzktLjQ4OGwxLjA4NCAxLjA4NGMtLjU1NiAxLjEyMS0xLjA2NSAyLjE4Ny0uNDg4IDMuNTguNTc3IDEuMzkxIDEuNjg5IDEuNzg0IDIuODc1IDIuMTgzdjEuNTM0Yy0xLjE4OC4zOTgtMi4zMDIuNzkxLTIuODc3IDIuMTgzem0tNy4xMjUtNS45NTFjMS42NTQgMCAzIDEuMzQ2IDMgM3MtMS4zNDYgMy0zIDMtMy0xLjM0Ni0zLTMgMS4zNDYtMyAzLTN6bTAtMmMtMi43NjIgMC01IDIuMjM4LTUgNXMyLjIzOCA1IDUgNSA1LTIuMjM4IDUtNS0yLjIzOC01LTUtNXoiLz48L3N2Zz4=" />
                    Settings
                </LiButton></LI>
                <LI><LiButton onClick={()=>navigateSidebar('deleted')} background={props.dashboardCurrentSection==='deleted' ? 'hsl(202, 60%, 85%)' : 'transparent'} hover={props.dashboardCurrentSection==='deleted' ? 'hsl(202, 60%, 85%)' : 'hsl(200, 10%, 95%)'}>
                    <Icon alt='' src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNOSAxOWMwIC41NTItLjQ0OCAxLTEgMXMtMS0uNDQ4LTEtMXYtMTBjMC0uNTUyLjQ0OC0xIDEtMXMxIC40NDggMSAxdjEwem00IDBjMCAuNTUyLS40NDggMS0xIDFzLTEtLjQ0OC0xLTF2LTEwYzAtLjU1Mi40NDgtMSAxLTFzMSAuNDQ4IDEgMXYxMHptNCAwYzAgLjU1Mi0uNDQ4IDEtMSAxcy0xLS40NDgtMS0xdi0xMGMwLS41NTIuNDQ4LTEgMS0xczEgLjQ0OCAxIDF2MTB6bTUtMTd2MmgtMjB2LTJoNS43MTFjLjkgMCAxLjYzMS0xLjA5OSAxLjYzMS0yaDUuMzE1YzAgLjkwMS43MyAyIDEuNjMxIDJoNS43MTJ6bS0zIDR2MTZoLTE0di0xNmgtMnYxOGgxOHYtMThoLTJ6Ii8+PC9zdmc+" />
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
    width: 20vw;
`

const LI = styled.li`
`

const UL = styled.ul`
`

const LiButton = styled.button`
    background-color: ${props=> props.background};
    border: none;
    padding: 5px 0;
    font-size: 1.25rem;
    width: 100%;
    transition: background-color 50ms ease-in-out;
    &:hover {
        background-color: ${props=> props.hover};
    }
`

const Icon = styled.img`
    transform: scale(.8);
    margin-right: 7px;
    position: relative;
    top: 5px;
`