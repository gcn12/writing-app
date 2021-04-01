import styled from 'styled-components'
import { useState } from 'react'
import { connect } from 'react-redux'
import { db } from '../../../firebase'
import { outlineItemsDisplay, outlineItemsForUpdate } from '../../../redux/actions/appActions'
import { updateLastModified } from '../../../globalFunctions'

const EditCardModal = (props) => {
    const [newTitle, setNewTitle] = useState('')
    const [newText, setNewText] = useState('')

    const saveCardEdits = () => {
        const newCard = {
            index: props.cardIndex,
            title: newTitle || props.title,
            text: newText || props.text,
        }
        const newOutline = [...props.outlineItemsForUpdate]
        const newOutlineForDisplay = [...props.outlineItemsDisplay]
        
        newOutline[props.cardIndex] = newCard
        newOutlineForDisplay[props.itemIndexes[props.cardIndex]] = newCard
        props.dispatch(outlineItemsDisplay([...newOutlineForDisplay]))
        props.dispatch(outlineItemsForUpdate(newOutline))



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

        updateLastModified(props.userData.userID, String(props.outlineData.docID), props.match.params.fileID)
    }

    return(
        <Container>
            <Background onClick={()=>props.setShowEditModal(false)}></Background>
            <Modal>
                <Header>Edit card</Header>
                <div>
                    <Title autoComplete='off' onChange={(e)=>setNewTitle(e.target.value)} id='edit-card-modal-title' defaultValue={props.title}></Title>
                    <div style={{marginBottom: '20px'}}></div>
                    <Text onChange={(e)=>setNewText(e.target.value)} id='edit-card-modal-text' defaultValue={props.text}></Text>
                </div>
                <div>
                    <Cancel onClick={()=>props.setShowEditModal(false)}>Cancel</Cancel>
                    <Save onClick={saveCardEdits}>Save</Save>
                </div>
            </Modal>
        </Container>
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
    background-color: hsl(0, 0%, 20%);
    height: 50px;
    width: 100px;
    color: white;
`

const Title = styled.input`
    width: 500px;
    height: 40px;
`

const Text = styled.textarea`
    width: 500px;
    height: 100px;
`

const Modal = styled.div`
    display: grid;
    /* flex-direction: column; */
    z-index: 100;
    align-items: center;
    justify-content: center;
    width: 600px;
    min-height: 350px;
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
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, .5);
    z-index: 100;
`

const Container = styled.div`
`