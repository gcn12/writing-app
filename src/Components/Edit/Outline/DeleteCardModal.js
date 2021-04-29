import styled from 'styled-components'
import { connect } from 'react-redux'
import { db } from '../../../firebase'
import { outlineItemsDisplay, outlineItemsForUpdate } from '../../../redux/actions/appActions'
import { updateLastModified } from '../../../globalFunctions'
import { Dialog } from "@reach/dialog";
import "@reach/dialog/styles.css";

const DeleteCardModal = (props) => {

    const removeCardFromOutline = () => {
        let newOutline = [...props.outlineItemsForUpdate]
        newOutline.splice(props.cardIndex, 1)
        return newOutline.map((card, index)=> {
            return {...card, index}
        })
    }

    const removeCardFromState = (outlineNewIndexes) => {
        props.dispatch(outlineItemsForUpdate(outlineNewIndexes))
        props.dispatch(outlineItemsDisplay(outlineNewIndexes))
    }

    const createNewIndexes = () => {
        const dataIndexArray = []
        for(let i = 0; i<props.itemIndexes.length - 1; i++) {
            dataIndexArray.push(String(i))
        }
        props.setItemIndexes(dataIndexArray)
    }

    const sendUpdatedOutlineToDatabase = (outlineNewIndexes) => {
        db.collection('users')
        .doc(props.userData.userID)
        .collection('files')
        .doc(props.match.params.fileID)
        .update({ text: outlineNewIndexes })
        .then(()=> props.setShowDeleteModal(false))
        .catch((err)=>console.log(err))
    }

    const deleteCard = () => {
        const updatedOutline = removeCardFromOutline()
        createNewIndexes()
        removeCardFromState(updatedOutline)
        sendUpdatedOutlineToDatabase(updatedOutline)
        updateLastModified(props.userData.userID, String(props.outlineData.docID), props.match.params.fileID)
    }

    const closeModal = (e) => {
        if(e.code==='Enter' || e.code==='Space' || e.code==='Escape') {
            e.preventDefault()
            props.setShowDeleteModal(false)
            document.getElementById(`card-delete-button-${props.cardIndex}`).focus()
        }
    }

    return(
        <Modal aria-label='Are you sure you want to delete this card?' isOpen={props.showDeleteModal} onDismiss={()=>props.setShowDeleteModal(false)}>
            <Header>Delete card</Header>
            <p>Are you sure you want to delete this card?</p>
            <div>
                <Cancel onKeyDown={closeModal} onMouseDown={()=>props.setShowDeleteModal(false)}>Cancel</Cancel>
                <Delete onClick={deleteCard}>Delete</Delete>
            </div>
        </Modal>
    )
}


const mapStateToProps = state => ({
    userData: state.app.userData,
    outlineData: state.app.outlineData,
    currentFileID: state.app.currentFileID,
    outlineItemsForUpdate: state.app.outlineItemsForUpdate,
    outlineItemsDisplay: state.app.outlineItemsDisplay,
})

export default connect(mapStateToProps)(DeleteCardModal)

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


const Modal = styled(Dialog)`
    z-index: 10;
    display: grid;
    align-items: center;
    justify-content: center;
    width: 500px;
    height: 300px;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    margin: 0;
    box-shadow: none;
    background-color: var(--secondary);
    padding: 0px 20px 20px 20px;
    border-radius: 10px;
    @media(max-width: 600px) {
        width: 80vw;
    } 
`