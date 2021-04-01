import styled from 'styled-components'
import React, { useState, useEffect } from 'react'
import { db } from '../../../firebase'
import { connect } from 'react-redux'
import { updateLastModified } from '../../../globalFunctions'
import { outlineItemsForUpdate, outlineItemsDisplay } from '../../../redux/actions/appActions'

const CreateCardModal = (props) => {
    const [title, setTitle] = useState('')
    const [text, setText] = useState('')
    const [location, setLocation] = useState()

    useEffect(()=> {
        document.getElementById('create-card-location').value = props.outlineItemsForUpdate.length + 1
        setLocation(props.outlineData.data.length + 1)
        // eslint-disable-next-line 
    }, [])


    const createNewOutlineCard = () => {
        let numberOfCards = 0
        if(props.outlineItemsForUpdate) {
            numberOfCards = props.outlineItemsForUpdate.length 
        }
        const dataObject = {
            title, 
            text,
            index: location,
        }
        const updateCopy = [...props.outlineItemsForUpdate]
        const indexesCopy = [...props.itemIndexes]

        updateCopy.splice(location - 1, 0, dataObject)
        const outlineNewIndexes = updateCopy.map((card, index)=> {
            return {...card, index}
        })

        indexesCopy.splice(location, 0, String(numberOfCards))
        const dataIndexArray = []
        for(let i = 0; i<props.itemIndexes.length + 1; i++) {
            dataIndexArray.push(String(i))
        }

        props.setItemIndexes(dataIndexArray)
        props.dispatch(outlineItemsDisplay(outlineNewIndexes))
        props.dispatch(outlineItemsForUpdate(outlineNewIndexes))

        db.collection('users')
        .doc(props.userData.userID)
        .collection('files')
        .doc(props.match.params.fileID)
        .update({
            data: outlineNewIndexes,
        })
        .then(()=> {
            props.setShowCreateModal(false)
        })

        updateLastModified(props.userData.userID, String(props.outlineData.docID), props.match.params.fileID)
    }

    return(
        <Container>
            <Background onClick={()=>props.setShowCreateModal(false)} />
            <Modal>
                <Header>Create new card</Header>
                <Label>Title</Label>
                <Title onChange={(e)=>setTitle(e.target.value)} />
                <Label>Description</Label>
                <Description onChange={(e)=>setText(e.target.value)} />
                <Label>Insert at location:</Label>
                <div>
                    <Location id='create-card-location' onChange={(e)=>setLocation(e.target.value)} /> / {props.outlineItemsDisplay.length + 1}
                </div>
                <div style={{display: 'flex'}}>
                    <Cancel onClick={()=>props.setShowCreateModal(false)}>Cancel</Cancel>
                    <Create onClick={createNewOutlineCard}>Create</Create>
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

export default connect(mapStateToProps)(CreateCardModal)

const Header = styled.h1`
    font-size: 1.75rem;
    margin-bottom: 36px;
`

const Description = styled.textarea`
    width: 40vw;
    height: 150px;
    margin-bottom: 36px;
`

const Title = styled.input`
    width: 40vw;
    height: 40px;
    margin-bottom: 36px;
`

const Location = styled.input`
    width: 50px;
    height: 40px;
    margin-bottom: 36px;
`

const Label = styled.label`
`

const Cancel = styled.button`
    height: 50px;
    width: 100px;
    margin: 10px;
`

const Create = styled.button`
    margin: 10px;
    background-color: hsl(0, 0%, 20%);
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
    width: 700px;
    min-height: 300px;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    isolation: isolate;
    padding: 50px 15px;
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