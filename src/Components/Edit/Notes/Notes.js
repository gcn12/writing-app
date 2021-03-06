import styled from 'styled-components'
import { useEffect, useState } from 'react'
import { db } from '../../../firebase'
import fitTextarea from 'fit-textarea';
import { connect } from 'react-redux'
import Toolbar from './Toolbar'
import { notesData } from '../../../redux/actions/appActions'

const Notes = (props) => {

    const [note, setNote] = useState('')
    const [lastSaved, setLastSaved] = useState(0)
    const [isPreventSave, setIsPreventSave] = useState(true)
    const [savedStatus, setSavedStatus] = useState('All changes saved')

    useEffect(()=> {
        getNotes()
        // eslint-disable-next-line
    }, [props.match])
    
    useEffect(()=> {
        if(props.userData.userID && !isPreventSave) {
            return autosave()
        }
        // eslint-disable-next-line 
    }, [note])

    const autosave = () => {
        setSavedStatus('Saving...')
        const timeout = setTimeout(()=>saveWork(), 1000)
        return  ()=>clearTimeout(timeout)
    }

    const getNotes = () => {
        db.collection('users')
        .doc(props.userData.userID)
        .collection('files')
        .doc(props.match.params.fileID)
        .get()
        .then(result=> {
            if(result.exists) {
                const notesInfo = result.data()
                document.getElementById('notes-textarea').value = notesInfo.text
                document.title = notesInfo.name
                props.dispatch(notesData(notesInfo))
                const textarea = document.getElementById('notes-textarea')
                fitTextarea.watch(textarea)
            }
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
        .catch((err)=>console.log(err))
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

    const addNotesToState = (e) => {
        setNote(e.target.value)
        if(isPreventSave) setIsPreventSave(false)
    }

    return(
        <Container>
            <Toolbar savingStatus={savedStatus} />
            <NotesContainer>
                <div>
                    <Title>{props?.notesData?.name}</Title>
                    <TextAreaPage rows='5' placeholder='Write notes here' onChange={addNotesToState} autoFocus id='notes-textarea' />
                </div>
            </NotesContainer>
        </Container>
    )
}

const mapStateToProps = state => ({
    userData: state.app.userData,
    notesData: state.app.notesData,
})

export default connect(mapStateToProps)(Notes)

const NotesContainer = styled.div`
    display: flex; 
    flex-direction: column; 
    align-items: center; 
    justify-content: center;
    padding: 20px 30vw;
    margin-top: 40px;
`

const Container = styled.div`
`

const Title = styled.h1`
    font-size: 3rem;
    font-weight: 600;
    margin-bottom: 10px;
    @media(max-width: 900px) {
        font-size: 2.5rem;
    }
`

const TextAreaPage = styled.textarea`
    margin-top: 40px;
    background-color: transparent;
    border-radius: 15px;
    font-size: 1rem;
    line-height: 1.5;
    width: 50vw;
    max-width: 800px;
    color: var(--primary-text);
    border: none;
    resize: none;
    &:focus{
        box-shadow: none;
    }
    @media(max-width: 900px) {
        width: 70vw
    }
    @media(max-width: 500px) {
        width: 80vw
    }
`