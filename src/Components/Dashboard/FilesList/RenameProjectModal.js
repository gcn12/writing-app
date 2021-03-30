import styled from 'styled-components'
import { db } from '../../../firebase'
import { useState, useEffect } from 'react'
import { connect } from 'react-redux'

const RenameFileModal = (props) => {
    const [projectName, setProjectName] = useState('')

    useEffect(()=> {
        document.getElementById('rename-file-input').value = props.projectSelectedName
        // eslint-disable-next-line
    }, [props.fileSelectedName])

    const renameFile = () => {
        db.collection('users')
        .doc(props.userData.userID)
        .collection('projects')
        .doc(String(props.projectSelectedID))
        .update({
            projectName,
        })
        .then(()=> {
            console.log('file rename successful')
            props.setShowRenameModal(false)
        })
    }

    return (
        <Container>
            <Background onClick={()=>props.setShowRenameModal(false)} />
            <Modal>
                Rename Project
                <ProjectTitle id='rename-file-input' onChange={(e)=>setProjectName(e.target.value)} />
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
    // projects: state.dashboard.projects
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