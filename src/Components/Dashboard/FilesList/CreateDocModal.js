import styled from 'styled-components'
import { db } from '../../../firebase'
import { useState } from 'react'
import { connect } from 'react-redux'
import { generateID } from '../../../globalFunctions'
import { updateLastModified } from '../../../globalFunctions'
import IconComponent from '../../../Icons/IconComponent'
import { Dialog } from "@reach/dialog";
import "@reach/dialog/styles.css";
import { 
    rootDocs,
    layerOneDocs,
    layerTwoDocs,
    layerThreeDocs
} from '../../../redux/actions/appActions'

const CreateDocModal = (props) => {
    const [name, setName] = useState('')

    const createProject = () => {
        if (props.createType==='folder' && props.currentLayer < 3) return createFolder()
        return startFileCreation(props.createType)
    }

    const getParentId = () => {
        if(props.breadcrumbs.length === 1) return props.userData.userID
        return props.breadcrumbs[props.breadcrumbs.length - 1].docID
    }

    const createFolder = () => {
        const parentID = getParentId()
        const timestamp = Date.now()
        const folderProperties = {
            name,
            parentID: String(parentID),
            type: 'folder',
            docID: String(timestamp),
            lastModified: timestamp,
        }
        addFileToPreviews(String(timestamp), folderProperties, props.setIsCreateProjectModal)
    }

    const addDocID = (docID) => {
        db.collection('docID')
        .add({
            docID,
        })
        .catch(err=> console.log(err))
    }

    const createFile = (parentID, docID, type) => {
        const timestamp = Date.now()
        const fileProperties = {
            name,
            type,
            parentID: String(parentID),
            docID: String(docID),
            dateCreated: timestamp,
            lastModified: timestamp,
        }
        addFileToPreviews(docID, fileProperties)
        if(type==='outline') {
            fileProperties['data'] = []
        }
        if(type==='notes' || type==='screenplay') {
            fileProperties['text'] = ''
        }
        const { lastModified, ...fileProps } = fileProperties
        addFileToDatabase(docID, fileProps, type)
    }

    const addFileToPreviews = (docID, fileProperties, closeModal) => {
        db.collection('users')
        .doc(props.userData.userID)
        .collection('files-folders')
        .doc(docID)
        .set({
            ...fileProperties
        })
        .then(()=> {
            console.log('new file preview created')
            addDocToStore(fileProperties)
            if(closeModal) closeModal(false)
        })
    }

    const addFileToDatabase = (docID, fileProps, type) => {
        db.collection('users')
        .doc(props.userData.userID)
        .collection('files')
        .doc(docID)
        .set({
            ...fileProps
        })
        .then(()=> {
            console.log('new file created')
            openFileInNewTab(type, docID)
            props.setIsCreateProjectModal(false)
            if(props.projectSelectedData.docID) {
                updateLastModified(props.userData.userID, String(props.projectSelectedData.docID))
            }
        })
    }

    const openFileInNewTab = (type, docID) => {
        const location = `/writing-app/edit/${type}/${docID}`
        window.open(location, "_blank") || (document.location = location)
    }

    const startFileCreation = (type) => {
        const parentID = getParentId()
        generateIDAndCreateFile(parentID, type)
    }

    const generateIDAndCreateFile = (parentID, type) => {
        const docID = generateID()
        db.collection('docID')
        .where('docID', '==', docID)
        .get()
        .then(data=> {
            if(data.empty) {
                createFile(parentID, docID, type)
                addDocID(docID)
            }else{
                generateIDAndCreateFile()
            }
        })
    }

    const onEnter = (e) => {
        if(e.key==='Enter') {
            e.preventDefault()
            createProject()
        }
    }

    const addDocToStore = (data) => {
        if(props.currentLayer===0) props.dispatch(rootDocs([data, ...props.rootDocs]))
        if(props.currentLayer===1) props.dispatch(layerOneDocs([data, ...props.layerOneDocs]))
        if(props.currentLayer===2) props.dispatch(layerTwoDocs([data, ...props.layerTwoDocs]))
        if(props.currentLayer===3) props.dispatch(layerThreeDocs([data, ...props.layerThreeDocs]))
    }
 
    return (
        <Modal aria-label='create document' isOpen={props.isCreateProjectModal} onDismiss={()=>props.setIsCreateProjectModal(false)}>
            <CloseDialog aria-label='close dialog' onClick={()=>props.setIsCreateProjectModal(false)}>
                <IconComponent><path d="M12 11.293l10.293-10.293.707.707-10.293 10.293 10.293 10.293-.707.707-10.293-10.293-10.293 10.293-.707-.707 10.293-10.293-10.293-10.293.707-.707 10.293 10.293z"/></IconComponent>
            </CloseDialog>
            <HeaderIconContainer>
                <Header>Create new {props.createType}</Header>
            </HeaderIconContainer>
            <DocumentTitle aria-label='document title' onKeyDown={onEnter} autoComplete='off' onChange={(e)=>setName(e.target.value)} />
            <div>
                <Cancel onClick={()=>props.setIsCreateProjectModal(false)}>Cancel</Cancel>
                <Create onClick={createProject}>Create project</Create>
            </div>
        </Modal>
    )
}

const mapStateToProps = state => ({
    userData: state.app.userData,
    breadcrumbs: state.dashboard.breadcrumbs,
    currentLayer: state.app.currentLayer,
    rootDocs: state.app.rootDocs,
    layerOneDocs: state.app.layerOneDocs,
    layerTwoDocs: state.app.layerTwoDocs,
    layerThreeDocs: state.app.layerThreeDocs,
})

export default connect(mapStateToProps)(CreateDocModal)

const Header = styled.h1`
    font-size: 1.75rem;
`

const HeaderIconContainer = styled.div`
    display: flex;
    justify-content: space-between;
`

const CloseDialog = styled.button`
    align-self: flex-end;
`

const Create = styled.button`
    background-color: hsl(0, 0%, 20%);
    height: 40px;
    width: 130px;
    border: none;
    color: white;
    background-color: var(--primary-text);
    color: var(--sidebar);
`

const Cancel = styled.button`
    background-color: transparent;
    height: 40px;
    width: 90px;
    border: none;
    margin-right: 10px;
`

const DocumentTitle = styled.input`
    width: 200px;
    height: 40px;
    font-size: 1.25rem;
    background-color: var(--secondary);
    color: var(--primary-text);
    border: 1px solid var(--primary-text);
`

const Modal = styled(Dialog)`
    background-color: var(--secondary);
    height: 300px;
    width: 500px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 15px;
    display: flex;
    margin: 0;
    box-shadow: none;
    flex-direction: column;
    padding: 0px 20px 20px 20px;
    align-items: center;
    justify-content: space-evenly;
    @media(max-width: 600px) {
        width: 80vw;
    } 
`