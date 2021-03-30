import { db } from '../../../firebase'
import styled from 'styled-components'
import { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { projects } from '../../../redux/actions/dashboardActions'
import CreateProjectModal from './CreateProjectModal'
import ProjectsTable from './ProjectsTable'
const Dashboard = (props) => {
    const [isCreateProjectModal, setIsCreateProjectModal] = useState(false)
    useEffect(()=> {
        getProjects()
        // eslint-disable-next-line
    }, [props.userData])

    const sortProjects = (a, b) => {
        return b.lastModified - a.lastModified  
    }

    const getProjects = () => {
        db.collection('users')
        .doc(props.userData.userID)
        .collection('projects')
        .get()
        .then(data=> {
            const projectArr = []
            data.forEach(project=> {
                projectArr.push(project.data())
            })

            props.dispatch(projects(projectArr.sort(sortProjects)))
        })
    }

    return(
        <div style={{width: '80vw'}}>
            {isCreateProjectModal &&
                <CreateProjectModal getProjects={getProjects} setIsCreateProjectModal={setIsCreateProjectModal} />
            }
            <Header>Projects</Header>
            <NewFile onClick={()=>setIsCreateProjectModal(true)}>Create new project</NewFile>
            <ProjectsTable />
        </div>
    )
}

const mapStateToProps = state => ({
    userData: state.app.userData,
    projects: state.dashboard.projects
})

export default connect(mapStateToProps)(Dashboard)

const NewFile = styled.button`
    background-color: hsl(20, 30%, 90%);
    height: 40px;
    border: none;
    margin: 20px;
    border-radius: 5px;
    box-shadow: 0px 5px 5px 0px rgba(0, 0, 0, .1);
    padding: 10px;
`

const Header = styled.h1`
    font-size: 1.75rem;
    font-weight: 500;
`