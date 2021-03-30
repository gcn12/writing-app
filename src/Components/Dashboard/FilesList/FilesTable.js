import styled from 'styled-components'
import moment from 'moment'
import { connect } from 'react-redux'
import { useEffect, useState } from 'react'
import RenameFileModal from './RenameFileModal'
import DeleteFileModal from './DeleteFileModal'

const FilesTable = (props) => {

    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showRenameModal, setShowRenameModal] = useState(false)
    const [fileSelectedID, setFileSelectedID] = useState('')
    const [fileSelectedName, setFileSelectedName] = useState('')

    useEffect(()=>{
        return function() {
            window.onclick = null;
        } 
        // eslint-disable-next-line
    }, [])

    const selectFile = (fileID, fileName) => {
        setFileSelectedID(fileID)
        setFileSelectedName(fileName)
        // props.setIsFileSelected(true)
    }

    const buttonPress = (e, file) => {
        if((e === 'Enter' || e === 'Space') && document.activeElement.id==='files-table-row') {
            // document.location = `/edit/${file.fileType}/${file.fileID}`
            openFile(file)
        }
    }
    
    const showRenameProject = (e) => {
        e.stopPropagation()
        setShowRenameModal(true)
    }


    const showDeleteProject = (e) => {
        e.stopPropagation()
        setShowDeleteModal(true)
    }

    const openFile = (file) => {
        const location = `/writing-app/edit/${file.fileType}/${file.fileID}`
        window.open(location, "_blank") || (document.location = location)
    }

    return(
        <div>
            <Table role='table'> 
                <Head role='heading'>
                    <RowHeader role='rowheader'>
                        <TableHead role='heading'>File name</TableHead>
                        <TableHead role='heading'>File type</TableHead>
                        <TableHead role='heading'>Date created</TableHead>
                        <TableHead role='heading'>Last modified</TableHead>
                        <TableHead aria-label='settings' role='heading' label='settings'></TableHead>
                    </RowHeader>
                </Head>
                <TableBody role='row'>
                    {props.projectFiles.map((file, index)=> {
                        return(
                            <Row id='files-table-row' tabIndex='0' role='button' onKeyDown={(e)=>buttonPress(e.code, file)} onFocus={()=>selectFile(file.fileID, file.fileName)} onClick={()=>openFile(file)} key={index}>
                                <Cell>{file.fileName}</Cell>
                                <Cell>{file.fileType}</Cell>
                                <Cell>{moment(file.dateCreated).format('ll')}</Cell>
                                <Cell>{moment(file.lastModified).calendar()}</Cell>
                                <IconContainer>
                                    <IconBackgroundContainer onClick={(e)=>showRenameProject(e)} label='rename file'>
                                        <IconTitle>Rename</IconTitle>
                                        <Icon alt='' src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTguMzYzIDguNDY0bDEuNDMzIDEuNDMxLTEyLjY3IDEyLjY2OS03LjEyNSAxLjQzNiAxLjQzOS03LjEyNyAxMi42NjUtMTIuNjY4IDEuNDMxIDEuNDMxLTEyLjI1NSAxMi4yMjQtLjcyNiAzLjU4NCAzLjU4NC0uNzIzIDEyLjIyNC0xMi4yNTd6bS0uMDU2LTguNDY0bC0yLjgxNSAyLjgxNyA1LjY5MSA1LjY5MiAyLjgxNy0yLjgyMS01LjY5My01LjY4OHptLTEyLjMxOCAxOC43MThsMTEuMzEzLTExLjMxNi0uNzA1LS43MDctMTEuMzEzIDExLjMxNC43MDUuNzA5eiIvPjwvc3ZnPg==" />
                                        <IconBackground />
                                    </IconBackgroundContainer>
                                    <IconBackgroundContainer onClick={(e)=>showDeleteProject(e)} label='delete file'>
                                        <IconTitle>Delete</IconTitle>
                                        <Icon alt='' src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNOSAxOWMwIC41NTItLjQ0OCAxLTEgMXMtMS0uNDQ4LTEtMXYtMTBjMC0uNTUyLjQ0OC0xIDEtMXMxIC40NDggMSAxdjEwem00IDBjMCAuNTUyLS40NDggMS0xIDFzLTEtLjQ0OC0xLTF2LTEwYzAtLjU1Mi40NDgtMSAxLTFzMSAuNDQ4IDEgMXYxMHptNCAwYzAgLjU1Mi0uNDQ4IDEtMSAxcy0xLS40NDgtMS0xdi0xMGMwLS41NTIuNDQ4LTEgMS0xczEgLjQ0OCAxIDF2MTB6bTUtMTd2MmgtMjB2LTJoNS43MTFjLjkgMCAxLjYzMS0xLjA5OSAxLjYzMS0yaDUuMzE1YzAgLjkwMS43MyAyIDEuNjMxIDJoNS43MTJ6bS0zIDR2MTZoLTE0di0xNmgtMnYxOGgxOHYtMThoLTJ6Ii8+PC9zdmc+" />
                                        <IconBackground />
                                    </IconBackgroundContainer>
                                </IconContainer>
                             </Row>

                        )
                    })}
                </TableBody>
            </Table>
            {showRenameModal && 
                <RenameFileModal fileSelectedName={fileSelectedName} fileSelectedID={fileSelectedID} setShowRenameModal={setShowRenameModal} />
            }
            {showDeleteModal && 
                <DeleteFileModal fileSelectedID={fileSelectedID} setShowDeleteModal={setShowDeleteModal} />
            }
        </div>
    )   
}


const mapStateToProps = state => ({
    userData: state.app.userData,
    projectFiles: state.app.projectFiles
})

export default connect(mapStateToProps)(FilesTable)

const IconTitle = styled.div`
    transition: opacity 200ms ease-in-out;
    opacity: 0;
    background-color: hsl(0, 0%, 10%);
    height: 30px;
    min-width: 50px;
    position: absolute;
    z-index: 10;
    top: 160%;
    left: 50%;
    transform: translate(-50%, -50%); 
    border-radius: 5px;
    color: white;
    vertical-align: middle;
    padding: 5px 10px;
`

const RowHeader = styled.div`
    display: table-row;
    background-color: transparent;
`

const IconContainer = styled.div`
    opacity: 0;
    display: flex;
`

const TableHead = styled.div`
    display: table-cell;
    text-align: left;
    padding: 0.5rem;
    border-bottom: 2px solid #dedede;
    border-top: 2px solid #dedede;
    color: hsl(0, 0%, 20%);
    font-weight: 400;
`

const Head = styled.div`
    display: table-header-group;
`

const Table = styled.div`
    display: table;
    width: 100%;
    max-width: 100%;
`

const Row = styled.div`
    cursor: pointer;
    display: table-row;
    background-color: transparent;
    transition: background-color 70ms ease-in-out;
    &:hover{ 
        background-color: hsl(0, 0%, 95%);
        ${IconContainer} {
            opacity: 1;
            transition: opacity 500ms ease-in-out;
        }
    }
    &:focus-within{ 
        background-color: hsl(0, 0%, 90%);
        ${IconContainer} {
            opacity: 1;
            transition: opacity 500ms ease-in-out;
        }
    }
`

const TableBody = styled.div`
    display: table-row-group;
`

const IconBackground = styled.div`
    opacity: 0;
    transition: opacity 200ms ease-in-out;
    background-color: lightblue;
    height: 35px;
    width: 35px;
    position: relative;
    /* margin-right: 10px; */
    border-radius: 50%;
    &:hover{
        opacity: 1;
    }
    &:focus{
        opacity: 1;
    }
`

const IconBackgroundContainer = styled.button`
    position: relative;
    margin-right: 10px;
    &:hover{
        ${IconBackground} {
            opacity: 1;
        }
        ${IconTitle} {
            opacity: 1;
        }
    }
    &:focus{
        ${IconBackground} {
            opacity: 1;
        }
        ${IconTitle} {
            opacity: 1;
        }
    }
`

const Icon = styled.img` 
    width: 18px;
    height: 18px;
    z-index: 100;
    top: 50%;
    left: 50%;
    position: absolute;
    transform: translate(-50%, -50%);
`

const Cell = styled.div`
    display: table-cell;
    padding: 10px;
    vertical-align: middle;
`