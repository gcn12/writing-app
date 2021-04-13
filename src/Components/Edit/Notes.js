import styled from 'styled-components'
import React, { useEffect, useState } from 'react'
import { db } from '../../firebase'
import fitTextarea from 'fit-textarea';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { notesData } from '../../redux/actions/appActions'

const Notes = (props) => {
    const [note, setNote] = useState('')
    const [lastSaved, setLastSaved] = useState(0)
    const [savedStatus, setSavedStatus] = useState('All changes saved')
    useEffect(()=> {
        getNotes()
        // eslint-disable-next-line
    }, [props.match])

    
    useEffect(()=> {
        if(props.userData.userID) {
            setSavedStatus('Saving...')
            const timeout = setTimeout(()=>saveWork(), 1000)
            return  ()=>clearTimeout(timeout)
        }
        // eslint-disable-next-line 
    }, [note])

    const getNotes = () => {
        db.collection('users')
        .doc(props.userData.userID)
        .collection('files')
        .doc(props.match.params.fileID)
        .get()
        .then(result=> {
            if(result.data() !== undefined) {
                document.getElementById('notes-textarea').value = result.data().text
            }
            props.dispatch(notesData(result.data()))
            const textarea = document.getElementById('notes-textarea');
            fitTextarea.watch(textarea);
        })
    }

    window.onbeforeunload = function() {
        if(savedStatus==='Saving...') {
            return 'saving'
        }
    }

    const sendToDatabase = (note) => {
        db.collection('users')
        .doc(props.userData.userID)
        .collection('files')
        .doc(props.match.params.fileID)
        .update({
            text: note,
        })
        .then(()=> {
            console.log('work saved')
            setSavedStatus('All changes saved')
        })
    }

    const updateLastUpdatedFunction = (currentTime, collectionName, fileID) => {
        db.collection('users')
        .doc(props.userData.userID)
        .collection(collectionName)
        .doc(fileID)
        .update({
            lastModified: currentTime,
        })
        .then(()=> {
            console.log('updated')
        })
    }

    const updateLastUpdated = (currentTime) => {
        if(currentTime - lastSaved > 600000) {
            updateLastUpdatedFunction(currentTime, 'files-folders', props.match.params.fileID)
            updateLastUpdatedFunction(currentTime, 'files-folders', String(props.notesData.docID))
        }
    }

    const saveWork = () => {
        const currentTime = Date.now()
        sendToDatabase(note)
        updateLastUpdated(currentTime)
        setLastSaved(currentTime)
    }

    return(
        <Container>
            <div>
                <Link to='/writing-app/dashboard'>Home</Link>
                <Title>{props?.notesData?.name}</Title>
                <h4>{savedStatus}</h4>
                <TextAreaPage rows='5' placeholder='Write notes here' onChange={(e)=> setNote(e.target.value)} autoFocus id='notes-textarea' />
            </div>
        </Container>
    )
}

const mapStateToProps = state => ({
    userData: state.app.userData,
    notesData: state.app.notesData,
    outlineData: state.app.outlineData
})

export default connect(mapStateToProps)(Notes)

const Container = styled.div`
    display: flex; 
    flex-direction: column; 
    align-items: center; 
    justify-content: center;
    padding: 20px 30vw;
`

const Title = styled.h1`
    font-size: 3rem;
    font-weight: 600;
    margin-bottom: 10px;
`

const TextAreaPage = styled.textarea`
    /* padding: 40px 0px; */
    margin: 40px 0 0 0;
    /* background-color: hsl(0, 10%, 5%); */
    background-color: transparent;
    border-radius: 15px;
    font-size: 1rem;
    line-height: 1.5;
    width: 50vw;
    color: var(--primary-text);
    /* height: 80vh; */
    border: none;
    resize: none;
    &:focus{
        box-shadow: none;
    }
`