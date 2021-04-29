import styled from 'styled-components'
import { useState } from 'react'
import { connect } from 'react-redux'
import { db } from '../../../firebase'
import { outlineItemsDisplay, outlineItemsForUpdate } from '../../../redux/actions/appActions'
import { updateLastModified } from '../../../globalFunctions'
import { Dialog } from "@reach/dialog";
import "@reach/dialog/styles.css";

const EditCardModal = (props) => {
    const [newTitle, setNewTitle] = useState(props.title)
    const [newText, setNewText] = useState(props.text)

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
            text: newOutline,
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
                <LabelInputContainer>
                    <Label htmlFor='edit-card-modal-title'>Title:</Label>
                    <Title onKeyDown={onEnter} autoComplete='off' onChange={(e)=>setNewTitle(e.target.value)} id='edit-card-modal-title' defaultValue={props.title}></Title>
                </LabelInputContainer>
                <div style={{marginBottom: '20px'}}></div>
                <LabelInputContainer>
                    <Label htmlFor='edit-card-modal-text'>Content:</Label>
                    <Text onKeyDown={onEnter} onChange={(e)=>setNewText(e.target.value)} id='edit-card-modal-text' defaultValue={props.text}></Text>
                </LabelInputContainer>
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

const LabelInputContainer = styled.div`
    display: flex;
    flex-direction: column;
`

const Label = styled.label`
    margin-bottom: 10px;
`

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
    min-height: 40px;
    font-size: 1.25rem;
    background-color: var(--secondary);
    color: var(--primary-text);
    border: 1px solid var(--primary-text);
    @media(max-width: 600px) {
        width: 60vw;
    } 
`

const Text = styled.textarea`
    width: 400px;
    height: 100px;
    font-size: 1.25rem;
    background-color: var(--secondary);
    color: var(--primary-text);
    border: 1px solid var(--primary-text);
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
    max-height: 75vh;
    overflow: scroll;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    margin: 0;
    box-shadow: none;
    background-color: var(--secondary);
    isolation: isolate;
    padding: 20px;
    border-radius: 10px;
    @media(max-width: 600px) {
        width: 80vw;
    } 
`