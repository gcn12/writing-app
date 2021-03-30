import styled from 'styled-components'
import { db } from '../../../firebase'
import { useState } from 'react'
import { connect } from 'react-redux'
import { showProjects, currentProjectID } from '../../../redux/actions/dashboardActions'

const CreateProjectModal = (props) => {
    const [projectName, setProjectName] = useState('')

    const createProject = () => {
        const timestamp = Date.now()
        db.collection('users').doc(props.userData.userID)
        .collection('projects').doc(String(timestamp))
        .set({
            projectName: projectName,
            projectID: timestamp,
            dateCreated: timestamp,
            lastModified: timestamp,
        }, {merge: true})
        .then(()=> {
            console.log('created new project')
            props.getProjects()
            props.setIsCreateProjectModal(false)
            props.dispatch(showProjects(false))
            props.dispatch(currentProjectID(timestamp))
        })
    }

    return (
        <Container>
            <Background onClick={()=>props.setIsCreateProjectModal(false)} />
            <Modal>
                Create new project
                <ProjectTitle onChange={(e)=>setProjectName(e.target.value)} />
                <div>
                    <Cancel onClick={()=>props.setIsCreateProjectModal(false)}>Cancel</Cancel>
                    <Create onClick={createProject}>Create project</Create>
                </div>
            </Modal>
        </Container>
    )
}

const mapStateToProps = state => ({
    userData: state.app.userData,
    // projects: state.dashboard.projects
})

export default connect(mapStateToProps)(CreateProjectModal)

const Create = styled.button`
    background-color: hsl(0, 0%, 20%);
    height: 40px;
    width: 130px;
    border: none;
    color: white;
`

const Cancel = styled.button`
    /* background-color: hsl(0, 0%, 95%); */
    background-color: transparent;
    height: 40px;
    width: 90px;
    border: none;
`

const ProjectTitle = styled.input`
    width: 200px;
    height: 40px;
    font-size: 1.25rem;
`

const Modal = styled.div`
    background-color: white;
    height: 300px;
    width: 50vw;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 15px;
    display: flex;
    flex-direction: column;
    padding: 20px;
    align-items: center;
    justify-content: space-evenly;
`

const Container = styled.div`
`

const Background = styled.div`
    height: 100vh;
    width: 100vw;
    position: fixed;
    background-color: rgba(0, 0, 0, .6);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
`