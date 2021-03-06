import styled from 'styled-components'
import { db } from '../../../firebase'
import { useState } from 'react'
import { connect } from 'react-redux'
import { Dialog } from "@reach/dialog";
import IconComponent from '../../../Icons/IconComponent'
import "@reach/dialog/styles.css";
import { 
    rootDocs,
    layerOneDocs,
    layerTwoDocs,
    layerThreeDocs,
} from '../../../redux/actions/appActions'

const RenameFileModal = (props) => {
    const [name, setName] = useState('')

    const updateFilesFoldersName = () => {
        return db.collection('users')
        .doc(props.userData.userID)
        .collection('files-folders')
        .doc(String(props.projectSelectedData.docID))
        .update({
            name,
        })
    }

    const updateFilesName = () => {
        return db.collection('users')
        .doc(props.userData.userID)
        .collection('files')
        .doc(String(props.projectSelectedData.docID))
        .update({
            name,
        })
    }

    const renameFile = () => {
        updateFilesFoldersName()
        .then(()=> {
            renameStoreDocs()
            props.setShowRenameModal(false)
        })
        if(props.projectSelectedData.type!=='folder') {
            updateFilesName()
            .catch((err)=>console.log(err))
        }
    }

    const folderMap = {
        0: props.rootDocs,
        1: props.layerOneDocs,
        2: props.layerTwoDocs,
        3: props.layerThreeDocs,
    }

    const renameStoreDocs = () => {
        let renamedItems = folderMap[props.currentLayer]
        renamedItems[props.projectSelectedData.currentIndex].name = name
        if(props.currentLayer===0) return props.dispatch(rootDocs(renamedItems))
        if(props.currentLayer===1) return props.dispatch(layerOneDocs(renamedItems))
        if(props.currentLayer===2) return props.dispatch(layerTwoDocs(renamedItems))
        if(props.currentLayer===3) return props.dispatch(layerThreeDocs(renamedItems))
    }

    const closeModal = (e) => {
        if(e.code==='Enter' || e.code==='Space' || e.code==='Escape') {
            e.preventDefault()
            props.setShowRenameModal(false)
        }
    }

    const renameFileOnKeyDown = (e) => {
        if(e.code==='Enter' || e.code==='Space' || e.code==='Escape') {
            e.preventDefault()
            renameFile()
        }
    }

    const onEnter = (e) => {
        if(e.key==='Enter') {
            e.preventDefault()
            renameFile()
        }
    }

    return (
        <Container>
            <NewModal aria-label={`change name of ${props.projectSelectedData.name}`} isOpen={props.showRenameModal} onDismiss={()=>props.setShowRenameModal(false)}>
                <CloseDialog aria-label='close rename dialog' onKeyDown={closeModal} onMouseDown={()=>props.setShowRenameModal(false)} id='rename-doc-close-button'>
                    <IconComponent><path d="M12 11.293l10.293-10.293.707.707-10.293 10.293 10.293 10.293-.707.707-10.293-10.293-10.293 10.293-.707-.707 10.293-10.293-10.293-10.293.707-.707 10.293 10.293z"/></IconComponent>
                </CloseDialog>
                <Header>Rename {props.projectSelectedData.type}</Header>
                <DocumentTitle aria-label='document title' onKeyDown={onEnter} defaultValue={props.projectSelectedData.name} autoComplete='off' id='rename-file-input' onChange={(e)=>setName(e.target.value)} />
                <div>
                    <Cancel onKeyDown={closeModal} onMouseDown={()=>props.setShowRenameModal(false)}>Cancel</Cancel>
                    <Create onKeyDown={renameFileOnKeyDown} onMouseDown={renameFile}>Rename</Create>
                </div>
            </NewModal>
        </Container>
    )
}

const mapStateToProps = state => ({
    userData: state.app.userData,
    currentLayer: state.app.currentLayer,
    rootDocs: state.app.rootDocs,
    layerOneDocs: state.app.layerOneDocs,
    layerTwoDocs: state.app.layerTwoDocs,
    layerThreeDocs: state.app.layerThreeDocs,
})

export default connect(mapStateToProps)(RenameFileModal)

const CloseDialog = styled.button`
    align-self: flex-end;
`

const Header = styled.h1`
    font-size: 1.75rem;
`

const Create = styled.button`
    background-color: var(--primary-text);
    height: 40px;
    width: 130px;
    border: none;
    color: var(--sidebar);
`

const Cancel = styled.button`
    background-color: transparent;
    height: 40px;
    width: 90px;
    border: none;
    margin-right: 5px;
    color: var(--primary-text);
`

const DocumentTitle = styled.input`
    width: 200px;
    min-height: 40px;
    font-size: 1.25rem;
    color: var(--primary-text);
    background-color: var(--secondary);
    border: 1px solid var(--primary-text);
`

const NewModal = styled(Dialog)`
    background-color: var(--secondary);
    height: 300px;
    width: 500px;
    border-radius: 15px;
    flex-direction: column;
    padding: 20px 50px;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    position: absolute;
    box-shadow: none;
    margin: 0;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    @media(max-width: 600px) {
        width: 80vw;
    } 
`

const Container = styled.div`
    height: 100%;
`