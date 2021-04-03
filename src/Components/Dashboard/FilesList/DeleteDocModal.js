import styled from 'styled-components'
import { Dialog } from "@reach/dialog";
import "@reach/dialog/styles.css";
import { connect } from 'react-redux'
import { db } from '../../../firebase'
import { 
    rootDocs,
    layerOneDocs,
    layerTwoDocs,
    layerThreeDocs,
} from '../../../redux/actions/appActions'

const DeleteDocModal = (props) => {

    const deleteDoc = (docData) => {
        console.log('deleting docs')
        if(docData.type!=='folder') {
            deleteFile(docData.docID, docData.currentIndex)
        }else{
            deleteFolder(docData.docID, docData.currentIndex)
        }
    }

    const deleteFile = (docID) => {
        db.collection('users')
        .doc(props.userData.userID)
        .collection('files')
        .doc(String(docID))
        .delete()
        .catch(err=>console.log(err))
        
        db.collection('users')
        .doc(props.userData.userID)
        .collection('files-folders')
        .doc(String(docID))
        .delete()
        .catch(err=>console.log(err))
        props.setShowDeleteModal(false)
    }

    const deleteFolder = (docID) => {
        db.collection('users')
        .doc(props.userData.userID)
        .collection('files-folders')
        .where('parentID', '==', String(docID))
        .get()
        .then((data)=> {
            data.forEach(item=> {
               deleteDoc(item.data())
            })
        })
        .then(()=> {
            db.collection('users')
            .doc(props.userData.userID)
            .collection('files-folders')
            .doc(String(docID))
            .delete()
            .then(()=>null)
            .catch(err=>console.log(err))
            props.setShowDeleteModal(false)
        })
    }

    const folderMap = {
        0: props.rootDocs,
        1: props.layerOneDocs,
        2: props.layerTwoDocs,
        3: props.layerThreeDocs,
    }

    const removeDocFromStore = (currentIndex) => {
        let deletedItem = [...folderMap[props.currentLayer]]
        deletedItem.splice(currentIndex, 1)
        if(props.currentLayer===0) props.dispatch(rootDocs(deletedItem))
        if(props.currentLayer===1) props.dispatch(layerOneDocs(deletedItem))
        if(props.currentLayer===2) props.dispatch(layerTwoDocs(deletedItem))
        if(props.currentLayer===3) props.dispatch(layerThreeDocs(deletedItem))
    }

    const initialDelete = (docData) => {
        if(docData.type!=='folder') {
            deleteFile(docData.docID)
        }else{
            deleteFolder(docData.docID)
        }
        removeDocFromStore(docData.currentIndex)
    }

    const closeModal = (e) => {
        if(e.code==='Enter' || e.code==='Space' || e.code==='Escape') {
            e.preventDefault()
            props.setShowDeleteModal(false)
        }
    }

    return(      
        <div>
            <Modal isOpen={props.showDeleteModal} onDismiss={()=>props.setShowDeleteModal(false)} aria-label='cancel delete'>
                <HeaderIconContainer>
                    <Header>{`Delete ${props.projectSelectedData.type}`}</Header>
                    <CloseDialog label='close rename dialog' onKeyDown={(e)=> closeModal(e)} onMouseDown={()=>props.setShowDeleteModal(false)}>
                        <Icon alt='delete' src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0xMiAxMS4yOTNsMTAuMjkzLTEwLjI5My43MDcuNzA3LTEwLjI5MyAxMC4yOTMgMTAuMjkzIDEwLjI5My0uNzA3LjcwNy0xMC4yOTMtMTAuMjkzLTEwLjI5MyAxMC4yOTMtLjcwNy0uNzA3IDEwLjI5My0xMC4yOTMtMTAuMjkzLTEwLjI5My43MDctLjcwNyAxMC4yOTMgMTAuMjkzeiIvPjwvc3ZnPg==" />
                    </CloseDialog>
                </HeaderIconContainer>
                <p>{`Are you sure you want to delete ${props.projectSelectedData.name}?`}</p>
                <div>
                    <Cancel onKeyDown={(e)=> closeModal(e)}  onMouseDown={()=>props.setShowDeleteModal(false)}>Cancel</Cancel>
                    <Delete onClick={()=>initialDelete(props.projectSelectedData)}>Delete</Delete>
                </div>
            </Modal>
        </div>      

    )
}


const mapStateToProps = state => ({
    userData: state.app.userData,
    outlineData: state.app.outlineData,
    currentFileID: state.app.currentFileID,
    outlineItemsForUpdate: state.app.outlineItemsForUpdate,
    outlineItemsDisplay: state.app.outlineItemsDisplay,
    currentLayer: state.app.currentLayer,
    rootDocs: state.app.rootDocs,
    layerOneDocs: state.app.layerOneDocs,
    layerTwoDocs: state.app.layerTwoDocs,
    layerThreeDocs: state.app.layerThreeDocs,
})

export default connect(mapStateToProps)(DeleteDocModal)

const HeaderIconContainer = styled.div`
    display: flex;
    justify-content: space-between;
`

const Header = styled.h1`
    font-size: 1.75rem;
`

const CloseDialog = styled.button`
    align-self: flex-end;
`

const Icon = styled.img` 
    width: 18px;
    height: 18px;
`

const Cancel = styled.button`
    height: 50px;
    width: 100px;
    margin: 10px;
    
`

const Delete = styled.button`
    margin: 10px;
    background-color: hsl(0, 60%, 50%);
    height: 50px;
    width: 100px;
    color: white;
    /* outline-color: blue; */
    &:focus {
        box-shadow: 0 0 0 5px rgba(21, 156, 228, 0.4);
    }
`


const Modal = styled(Dialog)`
    z-index: 100;
    display: grid;
    /* flex-direction: column; */
    align-items: center;
    justify-content: center;
    width: 600px;
    min-height: 300px;
    /* position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%); */
    background-color: white;
    isolation: isolate;
    padding: 15px;
    border-radius: 10px;
`