import FilesTable from './FilesTable'
import { useState } from 'react'
import styled from 'styled-components'
import RenameFileModal from './RenameFileModal'
import { connect } from 'react-redux'
import CreateFilesModal from './CreateFileModal'
import { showProjects } from '../../../redux/actions/dashboardActions'

const Files = (props) => {
    const [isCreateFileModal, setIsCreateFileModal] = useState(false)
    const [isRenameFileModal, setIsRenameFileModal] = useState(false)
    const [isFileSelected, setIsFileSelected] = useState(false)
    const [fileSelectedID, setFileSelectedID] = useState('')
    const [fileSelectedName, setFileSelectedName] = useState('')

    return(
        <div style={{width: '80vw'}}>
            {isRenameFileModal &&
            <RenameFileModal fileSelectedID={fileSelectedID} fileSelectedName={fileSelectedName} setIsRenameFileModal={setIsRenameFileModal} />
            }
            {isCreateFileModal &&
            <CreateFilesModal setIsCreateFileModal={setIsCreateFileModal} />
            }
            <Header>Files</Header>
            <Back onClick={()=> props.dispatch(showProjects(true))}>Back to all projects</Back>

            <NewFile onClick={()=>setIsCreateFileModal(true)}>Create new file</NewFile>
            {isFileSelected && 
                <RenameFile className='files-delete' onClick={()=> setIsRenameFileModal(true)}>Rename file</RenameFile>
            }
            <FilesTable setFileSelectedName={setFileSelectedName} setIsFileSelected={setIsFileSelected} setFileSelectedID={setFileSelectedID} />
        </div>
    )
}

const mapStateToProps = state => ({
    userData: state.app.userData,
    currentProjectID: state.app.currentProjectID,
})

export default connect(mapStateToProps)(Files)

const RenameFile = styled.button`
    background-color: hsl(20, 30%, 90%);
    height: 40px;
    border: none;
    margin: 20px;
    border-radius: 5px;
    box-shadow: 0px 5px 5px 0px rgba(0, 0, 0, .1);
    padding: 10px;
`

const Back = styled.button`
    background-color: hsl(20, 30%, 90%);
    height: 40px;
    border: none;
    margin: 20px;
    border-radius: 5px;
    box-shadow: 0px 5px 5px 0px rgba(0, 0, 0, .1);
    padding: 10px;
`

const NewFile = styled.button`
    background-color: hsl(20, 30%, 90%);
    height: 40px;
    border: none;
    margin: 20px;
    border-radius: 5px;
    box-shadow: 0px 5px 5px 0px rgba(0, 0, 0, .1);
    padding: 10px;
`

const Header = styled.h1`
    font-size: 1.75rem;
    font-weight: 500;
`