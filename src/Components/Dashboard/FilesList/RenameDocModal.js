import styled from 'styled-components'
import { db } from '../../../firebase'
import { useState } from 'react'
import { connect } from 'react-redux'
import { Dialog } from "@reach/dialog";
import "@reach/dialog/styles.css";
import { 
    rootDocs,
    layerOneDocs,
    layerTwoDocs,
    layerThreeDocs,
} from '../../../redux/actions/appActions'

const RenameFileModal = (props) => {
    const [name, setName] = useState('')

    // useEffect(()=> {
    //     document.getElementById('rename-file-input').value = props.projectSelectedData.name
    //     // eslint-disable-next-line
    // }, [props.fileSelectedName])

    // useEffect(()=> {
    //     document.getElementById('rename-doc-close-button').focus()
    // }, [])

    const renameFile = (e) => {
        db.collection('users')
        .doc(props.userData.userID)
        .collection('files-folders')
        .doc(String(props.projectSelectedData.docID))
        .update({
            name,
        })
        .then(()=> {
            renameStoreDocs()
            console.log('file rename successful')
            props.setShowRenameModal(false)
        })
        if(props.projectSelectedData.type!=='folder') {
            db.collection('users')
            .doc(props.userData.userID)
            .collection('files')
            .doc(String(props.projectSelectedData.docID))
            .update({
                name,
            })
            .then(()=> {
                console.log('file rename successful')
                closeModal(e)
                props.setShowRenameModal(false)
            })
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
        if(props.currentLayer===0) props.dispatch(rootDocs(renamedItems))
        if(props.currentLayer===1) props.dispatch(layerOneDocs(renamedItems))
        if(props.currentLayer===2) props.dispatch(layerTwoDocs(renamedItems))
        if(props.currentLayer===3) props.dispatch(layerThreeDocs(renamedItems))
    }

    const closeModal = (e) => {
        if(e.code==='Enter' || e.code==='Space' || e.code==='Escape') {
            e.preventDefault()
            props.setShowRenameModal(false)
        }
    }

    const renameFileOnKeyDown = (e) => {
        if(e.code==='Enter' || e.code==='Space' || e.code==='Escape') {
            renameFile(e)
        }
    }

    return (
        <Container>
            {/* <Background onClick={()=>props.setShowRenameModal(false)} /> */}
            <NewModal aria-label={`change ${props.projectSelectedData.type} name of ${props.projectSelectedData.name}`} isOpen={props.showRenameModal} onDismiss={()=>props.setShowRenameModal(false)}>
                <CloseDialog label='close rename dialog' onKeyDown={(e)=> closeModal(e)} onMouseDown={()=>props.setShowRenameModal(false)} id='rename-doc-close-button'>
                    <Icon alt='delete' src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0xMiAxMS4yOTNsMTAuMjkzLTEwLjI5My43MDcuNzA3LTEwLjI5MyAxMC4yOTMgMTAuMjkzIDEwLjI5My0uNzA3LjcwNy0xMC4yOTMtMTAuMjkzLTEwLjI5MyAxMC4yOTMtLjcwNy0uNzA3IDEwLjI5My0xMC4yOTMtMTAuMjkzLTEwLjI5My43MDctLjcwNyAxMC4yOTMgMTAuMjkzeiIvPjwvc3ZnPg==" />
                </CloseDialog>
                <Header>Rename {props.projectSelectedData.type}</Header>
                <ProjectTitle defaultValue={props.projectSelectedData.name} autoComplete='off' id='rename-file-input' onChange={(e)=>setName(e.target.value)} />
                <div>
                    <Cancel onKeyDown={(e)=> closeModal(e)} onMouseDown={()=>props.setShowRenameModal(false)}>Cancel</Cancel>
                    <Create onKeyDown={renameFileOnKeyDown} onMouseDown={renameFile}>Rename</Create>
                </div>
            </NewModal>
            {/* <Modal>
                <CloseDialog onKeyDown={(e)=> closeModal(e)} onMouseDown={()=>props.setShowRenameModal(false)} id='rename-doc-close-button'>
                    <Icon alt='delete' src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0xMiAxMS4yOTNsMTAuMjkzLTEwLjI5My43MDcuNzA3LTEwLjI5MyAxMC4yOTMgMTAuMjkzIDEwLjI5My0uNzA3LjcwNy0xMC4yOTMtMTAuMjkzLTEwLjI5MyAxMC4yOTMtLjcwNy0uNzA3IDEwLjI5My0xMC4yOTMtMTAuMjkzLTEwLjI5My43MDctLjcwNyAxMC4yOTMgMTAuMjkzeiIvPjwvc3ZnPg==" />
                </CloseDialog>
                <Header>Rename {props.projectSelectedData.type}</Header>
                <ProjectTitle autoComplete='off' id='rename-file-input' onChange={(e)=>setName(e.target.value)} />
                <div>
                    <Cancel onKeyDown={(e)=> closeModal(e)} onMouseDown={()=>props.setShowRenameModal(false)}>Cancel</Cancel>
                    <Create onKeyDown={renameFileOnKeyDown} onMouseDown={renameFile}>Rename</Create>
                </div>
            </Modal> */}
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

const Icon = styled.img` 
    width: 18px;
    height: 18px;
`

const Header = styled.h1`
    font-size: 1.75rem;
`

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
    margin-right: 5px;
`

const ProjectTitle = styled.input`
    width: 200px;
    height: 40px;
    font-size: 1.25rem;
`

const NewModal = styled(Dialog)`
    background-color: white;
    min-height: 400px;
    width: 500px;
    /* position: fixed; */
    /* top: 50%;
    left: 50%;
    transform: translate(-50%, -50%); */
    border-radius: 15px;
    flex-direction: column;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
`

const Container = styled.div`
`