import styled from 'styled-components'
import { Dialog } from "@reach/dialog";
import "@reach/dialog/styles.css";
import { connect } from 'react-redux'
import { db } from '../../../firebase'
import IconComponent from '../../../Icons/IconComponent'
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
                <CloseDialog label='close rename dialog' onKeyDown={(e)=> closeModal(e)} onMouseDown={()=>props.setShowDeleteModal(false)}>
                    <IconComponent><path d="M12 11.293l10.293-10.293.707.707-10.293 10.293 10.293 10.293-.707.707-10.293-10.293-10.293 10.293-.707-.707 10.293-10.293-10.293-10.293.707-.707 10.293 10.293z"/></IconComponent>
                </CloseDialog>
                <HeaderIconContainer>
                    <Header>{`Delete ${props.projectSelectedData.type}`}</Header>
                </HeaderIconContainer>
                <p>Are you sure you want to delete <Name>{props.projectSelectedData.name}</Name> ?</p>
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

const Name = styled.span`
    font-weight: 700;
`

const HeaderIconContainer = styled.div`
    display: flex;
    justify-content: space-between;
`

const Header = styled.h1`
    font-size: 1.75rem;
`

const CloseDialog = styled.button`
    justify-self: flex-end;
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
`


const Modal = styled(Dialog)`
    z-index: 100;
    display: grid;
    align-items: center;
    justify-content: center;
    width: 500px;
    height: 300px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    box-shadow: none;
    margin: 0;
    background-color: var(--secondary);
    isolation: isolate;
    padding: 0px 20px 20px 20px;
    border-radius: 10px;
    @media(max-width: 600px) {
        width: 80vw;
    } 
`