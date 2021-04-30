import styled from 'styled-components'
import { useState, useEffect } from 'react'
import { db } from '../../../firebase'
import { connect } from 'react-redux'
import { updateLastModified } from '../../../globalFunctions'
import { outlineItemsForUpdate, outlineItemsDisplay } from '../../../redux/actions/appActions'
import { Dialog } from "@reach/dialog";
import "@reach/dialog/styles.css";

const CreateCardModal = (props) => {
    const [title, setTitle] = useState('')
    const [text, setText] = useState('')
    const [location, setLocation] = useState(null)

    useEffect(()=> {
        setLocation(props?.outlineItemsForUpdate?.length + 1)
        // eslint-disable-next-line 
    }, [props.outlineItemsForUpdate])

    const getUpdatedOutline = () => {
        const dataObject = {
            title, 
            text,
            index: location,
        }
        const updateCopy = [...props.outlineItemsForUpdate]
        updateCopy.splice(location - 1, 0, dataObject)
        return updateCopy.map((card, index)=> {
            return {...card, index}
        })
    }

    const addCardToDatabase = (outlineNewIndexes) => {
        return db.collection('users')
        .doc(props.userData.userID)
        .collection('files')
        .doc(props.match.params.fileID)
        .update({
            text: outlineNewIndexes,
        })
    }

    const addUpdatedCardsToState = (outlineNewIndexes) => {
        props.dispatch(outlineItemsDisplay(outlineNewIndexes))
        props.dispatch(outlineItemsForUpdate(outlineNewIndexes))
    }

    const addNewIndexesToState = () => {
        const dataIndexArray = []
        for(let i = 0; i<props.itemIndexes.length + 1; i++) {
            dataIndexArray.push(String(i))
        }
        props.setItemIndexes(dataIndexArray)
    }

    const createNewOutlineCard = () => {
        if(!checkConditions()) return
        addNewIndexesToState()
        const updatedOutline = getUpdatedOutline()
        addCardToDatabase(updatedOutline)
        .then(()=> {
            addUpdatedCardsToState(updatedOutline)
            props.setShowCreateModal(false)
        })
        clearState()
        updateLastModified(props.userData.userID, String(props.outlineData.docID), props.match.params.fileID)
    }

    const checkConditions = () => {
        if(title.length === 0) return false
        if(text.length === 0) return false
        if(location < 1 || location > props.outlineItemsForUpdate.length + 1) return false
        return true
    }

    const clearState = () => {
        setText('')
        setTitle('')
        setLocation(null)
    }

    const onEnter = (e) => {
        if(e.key==='Enter') {
            e.preventDefault()
            createNewOutlineCard()
        }
    }

    return(
        <Modal aria-label='create card' isOpen={props.showCreateModal} onDismiss={()=>props.setShowCreateModal(false)}>
            <Header>Create new card</Header>
            <Label htmlFor='create-card-title'>Title</Label>
            <Title autoComplete='off' id='create-card-title' onKeyDown={onEnter} onChange={(e)=>setTitle(e.target.value)} />
            <Label htmlFor='create-card-description'>Description</Label>
            <Description id='create-card-description' onKeyDown={onEnter} onChange={(e)=>setText(e.target.value)} />
                <Label aria-label={`insert at position ${props.outlineItemsForUpdate.length + 1} of ${props.outlineItemsDisplay.length + 1}`}  htmlFor='create-card-location'>Insert at location</Label>
            <LocationContainer>
                <Location id='create-card-location' onKeyDown={onEnter} defaultValue={props.outlineItemsForUpdate.length + 1} onChange={(e)=>setLocation(e.target.value)} /> / {props.outlineItemsDisplay.length + 1}
            </LocationContainer>
            <ButtonsComponent>
                <Cancel onClick={()=>props.setShowCreateModal(false)}>Cancel</Cancel>
                <Create onClick={createNewOutlineCard}>Create</Create>
            </ButtonsComponent>
        </Modal>
    )
}

const mapStateToProps = state => ({
    userData: state.app.userData,
    outlineData: state.app.outlineData,
    outlineItemsForUpdate: state.app.outlineItemsForUpdate,
    outlineItemsDisplay: state.app.outlineItemsDisplay,
})

export default connect(mapStateToProps)(CreateCardModal)

const ButtonsComponent = styled.div`
    display: flex;
`

const Header = styled.h1`
    font-size: 1.75rem;
    margin-bottom: 36px;
`

const Description = styled.textarea`
    font-size: 1.25rem;
    width: 400px;
    height: 85px;
    margin-bottom: 36px;
    background-color: var(--secondary);
    color: var(--primary-text);
    border: 1px solid var(--primary-text);
    @media(max-width: 1000px) {
        width: 300px;
    } 
    @media(max-width: 600px) {
        width: 60vw;
        height: 100px;
    } 
`

const Title = styled.input`
    font-size: 1.25rem;
    width: 400px;
    min-height: 40px;
    margin-bottom: 36px;
    background-color: var(--secondary);
    color: var(--primary-text);
    border: 1px solid var(--primary-text);
    @media(max-width: 1000px) {
        width: 300px;
    } 
    @media(max-width: 600px) {
        width: 60vw;
    } 
`

const LocationContainer = styled.div`
    font-size: 1.25rem;
`

const Location = styled.input`
    font-size: inherit;
    width: 50px;
    min-height: 40px;
    margin-bottom: 10px;
    background-color: var(--secondary);
    color: var(--primary-text);
    border: 1px solid var(--primary-text);
    text-align: center;
`

const Label = styled.label`
    margin-bottom: 10px;
`

const Cancel = styled.button`
    height: 50px;
    width: 100px;
    margin: 10px;
`

const Create = styled.button`
    margin: 10px;
    background-color: var(--primary-text);
    height: 50px;
    width: 100px;
    color: var(--sidebar);
`

const Modal = styled(Dialog)`
    display: grid;
    align-items: center;
    justify-content: center;
    width: 500px;
    min-height: 300px;
    max-height: 85vh;
    overflow: scroll;
    background-color: var(--secondary);
    padding: 50px 15px;
    border-radius: 10px;
    left: 50%;
    top: 50%;
    margin: 0;
    transform: translate(-50%, -50%);
    position: absolute;
    @media(max-width: 1000px) {
        width: 500px;
    } 
    @media(max-width: 600px) {
        width: 80vw;
    } 
`