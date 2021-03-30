import styled from 'styled-components'
import React, { useEffect, useState } from 'react'
import { db } from '../../firebase'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { notesData } from '../../redux/actions/appActions'

const Notes = (props) => {
    const [note, setNote] = useState('')
    useEffect(()=> {
        getNotes()
        // eslint-disable-next-line
    }, [props.match])

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
            lastModified: currentTime,
        })
        .then(()=> {
            console.log('work saved')
        })

        db.collection('users')
        .doc(props.userData.userID)
        .collection('file-previews')
        .doc(props.match.params.fileID)
        .update({
            lastModified: currentTime,
        })
        .then(()=> {
            console.log('updated')
        })
        db.collection('users')
        .doc(props.userData.userID)
        .collection('projects')
        .doc(String(props.notesData.projectID))
        .update({
            lastModified: currentTime,
        })
        .then(()=> {
            console.log('updated')
        })
    }

    return(
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
            <Link to='/'>Home</Link>
            <div></div>
            {props?.notesData?.fileName}
            <div></div>
            {/* <TextAreaPage style={{border: 'none', height: '600px', width: '700px'}} onChange={(e)=> setNote(e.target.value)} defaultValue={props?.notesData?.text} /> */}
            <TextAreaPage onChange={(e)=> setNote(e.target.value)} id='notes-textarea' />
            <div></div>
            <button onClick={saveWork}>Save work</button>
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
    background-color: hsl(0, 10%, 95%);
    border-radius: 15px;
    font-size: 1rem;
    line-height: 1.5;
    width: 60vw;
    height: 90vh;
    border: none;
    resize: none;
`