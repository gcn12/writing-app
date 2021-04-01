import styled from 'styled-components'
import { connect } from 'react-redux'
import { db } from '../../../firebase'
import { 
    // currentLayer,
    rootDocs,
    layerOneDocs,
    layerTwoDocs,
    layerThreeDocs,
    currentLayer
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

    return(
        <Container>
            <Background onClick={()=>props.setShowDeleteModal(false)}></Background>
            <Modal>
                <Header>Delete project</Header>
                <p>Are you sure you want to delete this project?</p>
                <div>
                    <Cancel onClick={()=>props.setShowDeleteModal(false)}>Cancel</Cancel>
                    <Delete onClick={()=>initialDelete(props.projectSelectedData)}>Delete</Delete>
                </div>
            </Modal>
        </Container>
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

const Header = styled.h1`
    font-size: 1.75rem;
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


const Modal = styled.div`
    z-index: 100;
    display: grid;
    /* flex-direction: column; */
    align-items: center;
    justify-content: center;
    width: 600px;
    min-height: 300px;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    isolation: isolate;
    padding: 15px;
    border-radius: 10px;
`

const Background = styled.div`
    z-index: 100;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, .5);
`

const Container = styled.div`
`