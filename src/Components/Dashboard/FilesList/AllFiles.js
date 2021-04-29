import { db } from '../../../firebase'
import styled from 'styled-components'
import { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import CreateDocModal from './CreateDocModal'
import CreateDocButton from './CreateDocButton'
import ProjectsTable from './DocsTable'
import { rootDocs } from '../../../redux/actions/appActions'
import { sortMethod } from '../../../redux/actions/dashboardActions'
const AllFiles = (props) => {

    const [isCreateProjectModal, setIsCreateProjectModal] = useState(false)
    const [projectSelectedData, setProjectSelectedData] = useState({})
    const [createType, setCreateType] = useState('')

    useEffect(()=> {
        if(props.userData.userID && props.rootDocs.length===0) return getInitialFilesAndFolders()
        // eslint-disable-next-line
    }, [props.userData])

    const sortProjectsDateAsc = (a, b) => a.lastModified - b.lastModified  
    const sortProjectsDateDesc = (a, b) => b.lastModified - a.lastModified  
    const sortProjectsNameAsc = (a, b) => b.name.localeCompare(a.name)
    const sortProjectsNameDesc = (a, b) => a.name.localeCompare(b.name)
    const sortProjectsTypeAsc = (a, b) => b.name.localeCompare(a.name)
    const sortProjectsTypeDesc = (a, b) =>  a.type.localeCompare(b.type)

    const getDatabaseFilesFolders = () => {
        return db.collection('users')
        .doc(props.userData.userID)
        .collection('files-folders')
        .where('parentID', '==', props.userData.userID)
        .get()
    }

    const sortFiles = (sortMethodType, projectArr) => {
        if(sortMethodType==='dateAsc') return props.dispatch(rootDocs(projectArr.sort(sortProjectsDateAsc)))
        if(sortMethodType==='dateDesc') return props.dispatch(rootDocs(projectArr.sort(sortProjectsDateDesc)))
        if(sortMethodType==='nameAsc') return props.dispatch(rootDocs(projectArr.sort(sortProjectsNameAsc)))
        if(sortMethodType==='nameDesc') return props.dispatch(rootDocs(projectArr.sort(sortProjectsNameDesc)))
        if(sortMethodType==='typeAsc') return props.dispatch(rootDocs(projectArr.sort(sortProjectsTypeAsc)))
        if(sortMethodType==='typeDesc') return props.dispatch(rootDocs(projectArr.sort(sortProjectsTypeDesc)))
    }

    const getInitialFilesAndFolders = () => {
        getDatabaseFilesFolders()
        .then(data=> {
            const projectArr = []
            let sortMethodType
            data.forEach(project=> {
                const docData = project.data()
                if(docData.sortMethod) return sortMethodType = docData.sortMethod
                return projectArr.push(docData)
            })
            props.dispatch(sortMethod(sortMethodType))
            sortFiles(sortMethodType, projectArr)
        })
    }

    return(
        <Container>
            <CreateDocModal isCreateProjectModal={isCreateProjectModal} projectSelectedData={projectSelectedData} setProjectSelectedData={setProjectSelectedData} createType={createType} setIsCreateProjectModal={setIsCreateProjectModal} />
            <div>
                <CreateDocButton setIsCreateProjectModal={setIsCreateProjectModal} setCreateType={setCreateType} />
            </div>
            <ProjectsTable projectSelectedData={projectSelectedData} setProjectSelectedData={setProjectSelectedData} />
        </Container>
    )
}

const mapStateToProps = state => ({
    userData: state.app.userData,
    projects: state.dashboard.projects,
    rootDocs: state.app.rootDocs,
    currentLayer: state.app.currentLayer,
})

export default connect(mapStateToProps)(AllFiles)


const Container = styled.div`
    display: flex;
    flex-direction: column;
`