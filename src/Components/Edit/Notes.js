import styled from 'styled-components'
import React, { useEffect, useState } from 'react'
import { db } from '../../firebase'
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
        })
    }

    const saveWork = () => {
        const currentTime = Date.now()
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

        if(currentTime - lastSaved > 600000) {
            db.collection('users')
            .doc(props.userData.userID)
            .collection('files-folders')
            .doc(props.match.params.fileID)
            .update({
                lastModified: currentTime,
            })
            .then(()=> {
                console.log('updated')
            })
            db.collection('users')
            .doc(props.userData.userID)
            .collection('files-folders')
            .doc(String(props.notesData.docID))
            .update({
                lastModified: currentTime,
            })
            .then(()=> {
                console.log('updated')
            })
        }

        setLastSaved(currentTime)
    }

    return(
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
            <h4>{savedStatus}</h4>
            <Link to='/writing-app'>Home</Link>
            <div></div>
            {props?.notesData?.name}
            <div></div>
            <TextAreaPage placeholder='Write notes here' onChange={(e)=> setNote(e.target.value)} autoFocus id='notes-textarea' />
            <div></div>
            {/* <button onClick={saveWork}>Save work</button> */}
        </div>
    )
}

const mapStateToProps = state => ({
    userData: state.app.userData,
    notesData: state.app.notesData,
    outlineData: state.app.outlineData
})

export default connect(mapStateToProps)(Notes)

const TextAreaPage = styled.textarea`
    padding: 40px 100px;
    /* background-color: hsl(0, 10%, 95%); */
    background-color: transparent;
    outline: none;
    border-radius: 15px;
    font-size: 1rem;
    line-height: 1.5;
    width: 60vw;
    height: 90vh;
    border: none;
    resize: none;
`