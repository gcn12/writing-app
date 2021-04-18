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
            const notesInfo = result.data()
            document.title = notesInfo.name
            props.dispatch(notesData(notesInfo))
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
    outlineData: state.app.outlineData
})

export default connect(mapStateToProps)(Notes)

const NotesContainer = styled.div`
    display: flex; 
    flex-direction: column; 
    align-items: center; 
    justify-content: center;
    padding: 20px 30vw;
    margin-top: 30px;
`

const Container = styled.div`
    
`

const Title = styled.h1`
    font-size: 3rem;
    font-weight: 600;
    margin-bottom: 10px;
`

const TextAreaPage = styled.textarea`
    margin: 40px 0 0 0;
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