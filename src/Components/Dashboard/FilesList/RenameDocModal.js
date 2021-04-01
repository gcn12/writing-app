import styled from 'styled-components'
import { db } from '../../../firebase'
import { useState, useEffect } from 'react'
import { connect } from 'react-redux'

const RenameFileModal = (props) => {
    const [name, setName] = useState('')

    useEffect(()=> {
        document.getElementById('rename-file-input').value = props.projectSelectedData.name
        // eslint-disable-next-line
    }, [props.fileSelectedName])

    const renameFile = () => {
        db.collection('users')
        .doc(props.userData.userID)
        .collection('files-folders')
        .doc(String(props.projectSelectedData.docID))
        .update({
            name,
        })
        .then(()=> {
            console.log('file rename successful')
            props.setShowRenameModal(false)
        })
        if(props.projectSelectedData.type!=='folder') {
            db.collection('users')
            .doc(props.userData.userID)
            .collection('files')
            .doc(String(props.projectSelectedData.docID))
            .update({
                name,
            })
            .then(()=> {
                console.log('file rename successful')
                props.setShowRenameModal(false)
            })
        }
    }

    return (
        <Container>
            <Background onClick={()=>props.setShowRenameModal(false)} />
            <Modal>
                Rename {props.projectSelectedData.type}
                <ProjectTitle id='rename-file-input' onChange={(e)=>setName(e.target.value)} />
                <div>
                    <Cancel onClick={()=>props.setShowRenameModal(false)}>Cancel</Cancel>
                    <Create onClick={renameFile}>Rename</Create>
                </div>
            </Modal>
        </Container>
    )
}

const mapStateToProps = state => ({
    userData: state.app.userData,
    currentLayer: state.app.currentLayer,
    rootDocs: state.app.rootDocs,
    layerOneDocs: state.app.layerOneDocs,
    layerTwoDocs: state.app.layerTwoDocs,
    layerThreeDocs: state.app.layerThreeDocs,
})

export default connect(mapStateToProps)(RenameFileModal)

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
    margin-right: 5px;
`

const ProjectTitle = styled.input`
    width: 200px;
    height: 40px;
    font-size: 1.25rem;
`

const Modal = styled.div`
    background-color: white;
    height: 300px;
    width: 400px;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 15px;
    display: flex;
    flex-direction: column;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
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