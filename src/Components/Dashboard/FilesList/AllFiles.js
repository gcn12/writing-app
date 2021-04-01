import { db } from '../../../firebase'
import styled from 'styled-components'
import { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import CreateDocModal from './CreateDocModal'
import ProjectsTable from './ProjectsTable'
import { rootDocs, currentLayer } from '../../../redux/actions/appActions'
const AllFiles = (props) => {
    const [isCreateProjectModal, setIsCreateProjectModal] = useState(false)
    const [isCreateProjectDropdown, setIsCreateProjectDropdown] = useState(false)
    const [projectSelectedData, setProjectSelectedData] = useState({})
    const [createType, setCreateType] = useState('')
    // const [currentDocID, setCurrentDocID] = useState('')
    useEffect(()=> {
        if(props.userData.userID) {
            getInitialFilesAndFolders()
        }
        // eslint-disable-next-line
    }, [props.userData])

    const sortProjects = (a, b) => {
        return b.lastModified - a.lastModified  
    }

    const getInitialFilesAndFolders = () => {
        db.collection('users')
        .doc(props.userData.userID)
        .collection('files-folders')
        .where('parentID', '==', props.userData.userID)
        .get()
        .then(data=> {
            const projectArr = []
            data.forEach(project=> {
                projectArr.push(project.data())
            })
            props.dispatch(rootDocs(projectArr.sort(sortProjects)))
            props.dispatch(currentLayer(0))
        })
    }

    const openModal = (type) => {
        setIsCreateProjectModal(true)
        setCreateType(type)
        setIsCreateProjectDropdown(false)
    }

    return(
        <div style={{width: '80vw', marginRight: '15px'}}>
            {isCreateProjectModal &&
                <CreateDocModal projectSelectedData={projectSelectedData} setProjectSelectedData={setProjectSelectedData} createType={createType} getProjects={getInitialFilesAndFolders} setIsCreateProjectModal={setIsCreateProjectModal} />
            }
            <NewFile onClick={()=>setIsCreateProjectDropdown(!isCreateProjectDropdown)}>Create new</NewFile>
            {isCreateProjectDropdown &&
                <PickDoc>
                    <Item onClick={()=>openModal('folder')}>Folder</Item>
                    <Item onClick={()=>openModal('outline')}>Outline</Item>
                    <Item onClick={()=>openModal('screenplay')}>Screenplay</Item>
                    <Item onClick={()=>openModal('notes')}>Notes</Item>
                </PickDoc>
            }
            <ProjectsTable projectSelectedData={projectSelectedData} setProjectSelectedData={setProjectSelectedData} />
        </div>
    )
}

const mapStateToProps = state => ({
    userData: state.app.userData,
    projects: state.dashboard.projects
})

export default connect(mapStateToProps)(AllFiles)

const Item = styled.span`
    margin-bottom: 5px;
    cursor: pointer;
`

const PickDoc = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: hsl(20, 30%, 90%);
    height: 100px;
    width: 150px;
    position: absolute;
    top: 15%;
    left: 18%;
    /* transform: translate(-50%, -50%); */
`

const NewFile = styled.button`
    position: relative;
    background-color: hsl(20, 30%, 90%);
    height: 40px;
    border: none;
    margin: 20px 20px 20px 0;
    border-radius: 5px;
    box-shadow: 0px 5px 5px 0px rgba(0, 0, 0, .1);
    padding: 10px;
`

// const Header = styled.h1`
//     font-size: 1.75rem;
//     font-weight: 500;
// `