import styled from 'styled-components'
import { useState } from 'react'
import { connect } from 'react-redux'
import { db } from '../../../firebase'
import { outlineItemsDisplay, outlineItemsForUpdate } from '../../../redux/actions/appActions'
import { updateLastModified } from '../../../globalFunctions'
import { Dialog } from "@reach/dialog";
import "@reach/dialog/styles.css";

const EditCardModal = (props) => {
    const [newTitle, setNewTitle] = useState('')
    const [newText, setNewText] = useState('')

    const saveCardEdits = () => {
        const newOutline = [...props.outlineItemsForUpdate]
        addChangesToState(newOutline)
        addChangesToDatabase(newOutline)
        updateLastModified(props.userData.userID, String(props.outlineData.docID), props.match.params.fileID)
    }

    const addChangesToState = (newOutline) => {
        const newCard = {
            index: props.cardIndex,
            title: newTitle || props.title,
            text: newText || props.text,
        }
        const newOutlineForDisplay = [...props.outlineItemsDisplay]
        newOutline[props.cardIndex] = newCard
        newOutlineForDisplay[props.itemIndexes[props.cardIndex]] = newCard
        props.dispatch(outlineItemsDisplay([...newOutlineForDisplay]))
        props.dispatch(outlineItemsForUpdate(newOutline))
    }

    const addChangesToDatabase = (newOutline) => {
        db.collection('users')
        .doc(props.userData.userID)
        .collection('files')
        .doc(props.match.params.fileID)
        .update({
            data: newOutline,
        })
        .then(()=> {
            props.setShowEditModal(false)
        })
        .catch(err=>{
            console.log(err)
        })
    }

    const closeModal = (e) => {
        if(e.code==='Enter' || e.code==='Space' || e.code==='Escape') {
            e.preventDefault()
            props.setShowEditModal(false)
            document.getElementById(`card-edit-button-${props.cardIndex}`).focus()
        }
    }

    const onEnter = (e) => {
        if(e.key==='Enter') {
            e.preventDefault()
            saveCardEdits()
        }
    }

    return(
        <Modal onDismiss={()=>props.setShowEditModal(false)} aria-label='edit card' isOpen={props.showEditModal}>
            <Header>Edit card</Header>
            <div>
                <Title onKeyDown={onEnter} autoComplete='off' onChange={(e)=>setNewTitle(e.target.value)} id='edit-card-modal-title' defaultValue={props.title}></Title>
                <div style={{marginBottom: '20px'}}></div>
                <Text onKeyDown={onEnter} onChange={(e)=>setNewText(e.target.value)} id='edit-card-modal-text' defaultValue={props.text}></Text>
            </div>
            <div>
                <Cancel onKeyDown={(e)=> closeModal(e)} onMouseDown={()=>props.setShowEditModal(false)}>Cancel</Cancel>
                <Save onClick={saveCardEdits}>Save</Save>
            </div>
        </Modal>
    )
}


const mapStateToProps = state => ({
    userData: state.app.userData,
    outlineData: state.app.outlineData,
    currentFileID: state.app.currentFileID,
    outlineItemsDisplay: state.app.outlineItemsDisplay,
    outlineItemsForUpdate: state.app.outlineItemsForUpdate,
})

export default connect(mapStateToProps)(EditCardModal)

const Header = styled.h1`
    font-size: 1.75rem;
`

const Cancel = styled.button`
    height: 50px;
    width: 100px;
    margin: 10px;
    
`

const Save = styled.button`
    margin: 10px;
    background-color: var(--primary-text);
    height: 50px;
    width: 100px;
    color: var(--sidebar);
`

const Title = styled.input`
    width: 400px;
    height: 40px;
    background-color: var(--secondary);
    color: var(--primary-text);
    border: none;
    outline: 1px solid var(--primary-text);
    @media(max-width: 600px) {
        width: 60vw;
    } 
`

const Text = styled.textarea`
    width: 400px;
    height: 100px;
    background-color: var(--secondary);
    color: var(--primary-text);
    border: none;
    outline: 1px solid var(--primary-text);
    @media(max-width: 600px) {
        width: 60vw;
    } 
`

const Modal = styled(Dialog)`
    display: grid;
    z-index: 10;
    align-items: center;
    justify-content: center;
    width: 500px;
    min-height: 400px;
    position: absolute;
    left: 50%;
    top: 25%;
    transform: translate(-50%, -25%);
    background-color: var(--secondary);
    isolation: isolate;
    padding: 0px 20px 20px 20px;
    border-radius: 10px;
    @media(max-width: 600px) {
        width: 80vw;
    } 
`