import styled from 'styled-components'
import { db } from '../../../firebase'
import { useState } from 'react'
import { connect } from 'react-redux'
import { generateID } from '../../../globalFunctions'
import { updateLastModified } from '../../../globalFunctions'
import { 
    // currentLayer,
    rootDocs,
    layerOneDocs,
    layerTwoDocs,
    layerThreeDocs
} from '../../../redux/actions/appActions'

const CreateDocModal = (props) => {
    const [name, setName] = useState('')

    const createProject = () => {
        if (props.createType==='folder' && props.currentLayer < 3) return createFolder()
        if (props.createType!=='folder') return createFile(props.createType)
    }

    const createFolder = () => {
        let parentID
        if(props.breadcrumbs.length === 1) {
            parentID = props.userData.userID
        }else{
            parentID = props.breadcrumbs[props.breadcrumbs.length - 1].docID
        }
        const timestamp = Date.now()
        const folderProperties = {
            name,
            parentID: String(parentID),
            type: 'folder',
            docID: String(timestamp),
            lastModified: timestamp,
        }
        db.collection('users')
        .doc(props.userData.userID)
        .collection('files-folders')
        .doc(String(timestamp))
        .set({
            ...folderProperties
        })
        .then(()=> {
            console.log('folder created')
            addDocToStore(folderProperties)
            props.setIsCreateProjectModal(false)
        })
        .catch(err=>{
            console.log(err)
        })
    }

    const createFile = (type) => {
        let parentID
        if(props.breadcrumbs.length === 1) {
            parentID = props.userData.userID
        }else{
            parentID = props.breadcrumbs[props.breadcrumbs.length - 1].docID
        }
        let docID = ''
        const generateIDAndCreateFile = () => {
            const idAttempt = generateID()
            db.collection('docID')
            .where('docID', '==', idAttempt)
            .get()
            .then(data=> {
                if(data.empty) {
                    docID = idAttempt
                    const timestamp = Date.now()
                    const fileProperties = {
                        name,
                        type,
                        parentID: String(parentID),
                        docID: String(docID),
                        dateCreated: timestamp,
                        lastModified: timestamp,
                    }
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
                    })
                    if(type==='outline') {
                        fileProperties['data'] = []
                    }
                    if(type==='notes' || type==='screenplay') {
                        fileProperties['text'] = ''
                    }
                    const { lastModified, ...fileProps } = fileProperties
                    db.collection('users')
                    .doc(props.userData.userID)
                    .collection('files')
                    .doc(docID)
                    .set({
                        ...fileProps
                    })
                    .then(()=> {
                        console.log('new file created')
                        const location = `/writing-app/edit/${type}/${docID}`
                        window.open(location, "_blank") || (document.location = location)
                        props.setIsCreateProjectModal(false)
                        if(props.projectSelectedData.docID) {
                            updateLastModified(props.userData.userID, String(props.projectSelectedData.docID))
                        }
                    })
                    db.collection('docID')
                    .add({
                        docID,
                    })
                }else{
                    generateIDAndCreateFile()
                }
            })
        }
        generateIDAndCreateFile()
    }

    const addDocToStore = (data) => {
        if(props.currentLayer===0) props.dispatch(rootDocs([data, ...props.rootDocs]))
        if(props.currentLayer===1) props.dispatch(layerOneDocs([data, ...props.layerOneDocs]))
        if(props.currentLayer===2) props.dispatch(layerTwoDocs([data, ...props.layerTwoDocs]))
        if(props.currentLayer===3) props.dispatch(layerThreeDocs([data, ...props.layerThreeDocs]))
    }
 
    return (
        <Container>
            <Background onClick={()=>props.setIsCreateProjectModal(false)} />
            <Modal>
                Create new {props.createType}
                <ProjectTitle onChange={(e)=>setName(e.target.value)} />
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
    breadcrumbs: state.dashboard.breadcrumbs,
    currentLayer: state.app.currentLayer,
    rootDocs: state.app.rootDocs,
    layerOneDocs: state.app.layerOneDocs,
    layerTwoDocs: state.app.layerTwoDocs,
    layerThreeDocs: state.app.layerThreeDocs,
})

export default connect(mapStateToProps)(CreateDocModal)

const Create = styled.button`
    background-color: hsl(0, 0%, 20%);
    height: 40px;
    width: 130px;
    border: none;
    color: white;
`

const Cancel = styled.button`
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