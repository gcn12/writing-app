import styled from 'styled-components'
import { db } from '../../../firebase'
import { currentProjectID, projectFiles } from '../../../redux/actions/appActions'
import moment from 'moment'
import RenameProjectModal from './RenameProjectModal'
import DeleteProjectModal from './DeleteProjectModal'
import { useState } from 'react'
import { connect } from 'react-redux'
import { showProjects } from '../../../redux/actions/dashboardActions'

const ProjectsTable = (props) => {
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showRenameModal, setShowRenameModal] = useState(false)
    const [projectSelectedID, setProjectSelectedID] = useState('')
    const [projectSelectedName, setProjectSelectedName] = useState('')

    const sortFiles = (a, b) => {
        return b.lastModified - a.lastModified  
    }

    const getProjectFiles = (projectID) => {
        props.dispatch(currentProjectID(projectID))
        db.collection('users')
        .doc(props.userData.userID)
        .collection('file-previews')
        .where('projectID', '==', projectID)
        .get()
        .then(data=> {
            const files = []
            data.forEach(file=> {
                files.push(file.data())
            })
            props.dispatch(projectFiles(files.sort(sortFiles)))
            props.dispatch(showProjects(false))
        })
    }

    const selectProject = (projectID, projectName) => {
        setProjectSelectedID(projectID)
        setProjectSelectedName(projectName)
    }

    const buttonPress = (e, projectID) => {
        if((e === 'Enter' || e=== 'Space') && document.activeElement.id==='projects-table-row') {
            getProjectFiles(projectID)
        }
    }

    const showRenameProject = (e) => {
        e.stopPropagation()
        setShowRenameModal(true)
    }


    const showDeleteProject = (e) => {
        e.stopPropagation()
        setShowDeleteModal(true)
    }

    return(
        <div>
            <Table role='table'>
                <Head role='heading'> 
                    <RowHeader role='rowheader'>
                        <TableHead role='heading'>Project name</TableHead>
                        <TableHead role='heading'>Date created</TableHead>
                        <TableHead role='heading'>Last modified</TableHead>
                        <TableHead aria-label='settings' role='heading'></TableHead>
                        {/* <TableHead role='heading'>Settings</TableHead> */}
                    </RowHeader>
                </Head>
                <TableBody role='row'>
                    {props.projects.map((project, index)=> {
                        return(
                            <Row id='projects-table-row' tabIndex='0' onKeyDown={(e)=>buttonPress(e.code, project.projectID)} role='button' onFocus={()=>selectProject(project.projectID, project.projectName)} onClick={()=>getProjectFiles(project.projectID)} key={index}>
                                <Cell role='cell'>{project.projectName}</Cell>
                                <Cell role='cell'>{moment(project.dateCreated).format('ll')}</Cell>
                                <Cell role='cell'>{moment(project.lastModified).calendar()}</Cell>
                                <Cell role='cell'>
                                    <IconContainer>
                                        <IconBackground>
                                            <Icon onClick={(e)=>showRenameProject(e)} type='image' tabIndex='0' label='rename file' alt='' src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTguMzYzIDguNDY0bDEuNDMzIDEuNDMxLTEyLjY3IDEyLjY2OS03LjEyNSAxLjQzNiAxLjQzOS03LjEyNyAxMi42NjUtMTIuNjY4IDEuNDMxIDEuNDMxLTEyLjI1NSAxMi4yMjQtLjcyNiAzLjU4NCAzLjU4NC0uNzIzIDEyLjIyNC0xMi4yNTd6bS0uMDU2LTguNDY0bC0yLjgxNSAyLjgxNyA1LjY5MSA1LjY5MiAyLjgxNy0yLjgyMS01LjY5My01LjY4OHptLTEyLjMxOCAxOC43MThsMTEuMzEzLTExLjMxNi0uNzA1LS43MDctMTEuMzEzIDExLjMxNC43MDUuNzA5eiIvPjwvc3ZnPg==" />
                                        </IconBackground>
                                        <IconBackground>
                                            <Icon onClick={(e)=>showDeleteProject(e)} type='image' tabIndex='0' label='delete file' alt='' src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNOSAxOWMwIC41NTItLjQ0OCAxLTEgMXMtMS0uNDQ4LTEtMXYtMTBjMC0uNTUyLjQ0OC0xIDEtMXMxIC40NDggMSAxdjEwem00IDBjMCAuNTUyLS40NDggMS0xIDFzLTEtLjQ0OC0xLTF2LTEwYzAtLjU1Mi40NDgtMSAxLTFzMSAuNDQ4IDEgMXYxMHptNCAwYzAgLjU1Mi0uNDQ4IDEtMSAxcy0xLS40NDgtMS0xdi0xMGMwLS41NTIuNDQ4LTEgMS0xczEgLjQ0OCAxIDF2MTB6bTUtMTd2MmgtMjB2LTJoNS43MTFjLjkgMCAxLjYzMS0xLjA5OSAxLjYzMS0yaDUuMzE1YzAgLjkwMS43MyAyIDEuNjMxIDJoNS43MTJ6bS0zIDR2MTZoLTE0di0xNmgtMnYxOGgxOHYtMThoLTJ6Ii8+PC9zdmc+" />
                                        </IconBackground>
                                    </IconContainer>
                                </Cell>
                            </Row>
                        )
                    })}
                </TableBody>
            </Table> 
            {showRenameModal && 
                <RenameProjectModal projectSelectedName={projectSelectedName} projectSelectedID={projectSelectedID} setShowRenameModal={setShowRenameModal} />
            }
            {showDeleteModal && 
                <DeleteProjectModal projectSelectedID={projectSelectedID} setShowDeleteModal={setShowDeleteModal} />
            }
        </div>
    )   
}


const mapStateToProps = state => ({
    userData: state.app.userData,
    projects: state.dashboard.projects,
    currentProjectID: state.app.currentProjectID,
})

export default connect(mapStateToProps)(ProjectsTable)

const IconContainer = styled.div`
    opacity: 0;
    display: flex;
`

const TableHead = styled.div`
    display: table-cell;
    text-align: left;
    padding: 0.5rem;
    border-bottom: 2px solid #dedede;
    border-top: 2px solid #dedede;
    color: hsl(0, 0%, 20%);
    font-weight: 400;
`

const TableBody = styled.div`
    display: table-row-group;
`

const Head = styled.div`
    display: table-header-group;
`

const Table = styled.div`
    display: table;
    width: 100%;
    max-width: 100%;
`

const RowHeader = styled.div`
    display: table-row;
    background-color: transparent;
`

const Row = styled.div`
    cursor: pointer;
    display: table-row;
    background-color: transparent;
    transition: background-color 70ms ease-in-out;
    &:hover{ 
        background-color: hsl(0, 0%, 95%);
        ${IconContainer} {
            opacity: 1;
            transition: opacity 500ms ease-in-out;
        }
    }
    &:focus-within{ 
        background-color: hsl(0, 0%, 90%);
        ${IconContainer} {
            opacity: 1;
            transition: opacity 500ms ease-in-out;
        }
    }
`

const Icon = styled.input` 
    transform: scale(.8);
    position: absolute;
    top: 5px;
    z-index: 5;
`

const IconBackground = styled.div`
    background-color: lightblue;
    height: 35px;
    width: 35px;
    position: relative;
    margin-right: 10px;
    border-radius: 50%;
    top: 7px;
`

const Cell = styled.div`
    display: table-cell;
    padding: 10px;
`