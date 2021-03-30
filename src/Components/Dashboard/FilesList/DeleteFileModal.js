import styled from 'styled-components'
import { connect } from 'react-redux'
import { db } from '../../../firebase'
import { updateLastModified } from '../../../globalFunctions'

const DeleteFileModal = (props) => {

    const deleteFile = () => {
        const ref = db.collection('users')
        .doc(props.userData.userID)

        ref.collection('file-previews')
        .doc(props.fileSelectedID)
        .delete()
        .then(()=>{
            console.log('file deleted')
        })
        
        ref.collection('files')
        .doc(props.fileSelectedID)
        .delete()
        .then(()=>{
            console.log('file deleted')
            props.setShowDeleteModal(false)
        })
        updateLastModified(props.userData.userID, String(props.outlineData.projectID))
    }

    return(
        <Container>
            <Background onClick={()=>props.setShowDeleteModal(false)}></Background>
            <Modal>
                <Header>Delete project</Header>
                <p>Are you sure you want to delete this project?</p>
                <div>
                    <Cancel onClick={()=>props.setShowDeleteModal(false)}>Cancel</Cancel>
                    <Delete onClick={deleteFile}>Delete</Delete>
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
})

export default connect(mapStateToProps)(DeleteFileModal)

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