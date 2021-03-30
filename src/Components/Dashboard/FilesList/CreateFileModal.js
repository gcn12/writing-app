import styled from 'styled-components'
import { useState } from 'react'
import { generateID } from '../../../globalFunctions'
import { db } from '../../../firebase'
import { connect } from 'react-redux'
import { updateLastModified } from '../../../globalFunctions'

const CreateFileModal = (props) => {
    const [fileName, setFileName] = useState('')
    const [fileType, setFileType] = useState('')

    const createFile = () => {
        let fileID = ''
        const generateIDAndCreateFile = () => {
            const idAttempt = generateID()
            db.collection('fileIDs')
            .where('fileID', '==', idAttempt)
            .get()
            .then(data=> {
                if(data.empty) {
                    fileID = idAttempt
                    const timestamp = Date.now()
                    const fileProperties = {
                        fileName,
                        fileType,
                        projectID: props.currentProjectID,
                        fileID,
                        dateCreated: timestamp,
                        lastModified: timestamp,
                    }
                    db.collection('users')
                    .doc(props.userData.userID)
                    .collection('file-previews')
                    .doc(fileID)
                    .set({
                        ...fileProperties
                    })
                    .then(()=> {
                        console.log('new file preview created')
                        props.setIsCreateFileModal(false)
                    })
                    if(fileType==='outline') {
                        fileProperties['data'] = []
                    }
                    if(fileType==='notes' || fileType==='screenplay') {
                        fileProperties['text'] = ''
                    }
                    const { lastModified, ...fileProps } = fileProperties
                    db.collection('users')
                    .doc(props.userData.userID)
                    .collection('files')
                    .doc(fileID)
                    .set({
                        ...fileProps
                    })
                    .then(()=> {
                        console.log('new file created')
                        const location = `/writing-app/edit/${fileType}/${fileID}`
                        window.open(location, "_blank") || (document.location = location)
                    })
                    updateLastModified(props.userData.userID, String(props.currentProjectID))
                    db.collection('fileIDs')
                    .add({
                        fileID,
                    })
                }else{
                    generateIDAndCreateFile()
                }
            })
        }
        generateIDAndCreateFile()
    }

    return(
        <Container>
            <Background onClick={()=>props.setIsCreateFileModal(false)} />
            <Modal>
                Create new file
                <ProjectTitle onChange={(e)=>setFileName(e.target.value)} />
                <SelectFileType defaultValue='' name='project type' onChange={(e)=>setFileType(e.target.value)}>
                    <option value="" disabled>Document type</option>
                    <option value='screenplay'>screenplay</option>
                    <option value='notes'>notes</option>
                    <option value='outline'>outline</option>
                </SelectFileType>
                <div>
                    <Cancel onClick={()=>props.setIsCreateFileModal(false)}>Cancel</Cancel>
                    <Create onClick={createFile}>Create</Create>
                </div>
            </Modal>
        </Container>
    )
}

const mapStateToProps = state => ({
    userData: state.app.userData,
    currentProjectID: state.app.currentProjectID,
})

export default connect(mapStateToProps)(CreateFileModal)

const SelectFileType = styled.select`
    width: 20vw;
`

const Create = styled.button`
    background-color: hsl(0, 0%, 20%);
    height: 40px;
    width: 130px;
    border: none;
    color: white;
`

const Cancel = styled.button`
    /* background-color: hsl(0, 0%, 95%); */
    background-color: transparent;
    height: 40px;
    width: 90px;
    border: none;
`

const ProjectTitle = styled.input`
    width: 200px;
    height: 40px;
    font-size: 1.25rem;
`

const Modal = styled.div`
    background-color: white;
    height: 300px;
    width: 40vw;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 15px;
    display: flex;
    flex-direction: column;
    padding: 20px;
    justify-content: space-evenly;
    align-items: center;
`

const Container = styled.div`
`

const Background = styled.div`
    height: 100vh;
    width: 100vw;
    position: fixed;
    background-color: rgba(0, 0, 0, .6);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
`