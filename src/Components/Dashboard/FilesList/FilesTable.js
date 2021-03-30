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
        const location = `/edit/${file.fileType}/${file.fileID}`
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
                                    <Icon onClick={(e)=>showRenameProject(e)} type='image' tabIndex='0' label='rename file' alt='' src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTguMzYzIDguNDY0bDEuNDMzIDEuNDMxLTEyLjY3IDEyLjY2OS03LjEyNSAxLjQzNiAxLjQzOS03LjEyNyAxMi42NjUtMTIuNjY4IDEuNDMxIDEuNDMxLTEyLjI1NSAxMi4yMjQtLjcyNiAzLjU4NCAzLjU4NC0uNzIzIDEyLjIyNC0xMi4yNTd6bS0uMDU2LTguNDY0bC0yLjgxNSAyLjgxNyA1LjY5MSA1LjY5MiAyLjgxNy0yLjgyMS01LjY5My01LjY4OHptLTEyLjMxOCAxOC43MThsMTEuMzEzLTExLjMxNi0uNzA1LS43MDctMTEuMzEzIDExLjMxNC43MDUuNzA5eiIvPjwvc3ZnPg==" />
                                    <Icon onClick={(e)=>showDeleteProject(e)} type='image' tabIndex='0' label='delete file' alt='' src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNOSAxOWMwIC41NTItLjQ0OCAxLTEgMXMtMS0uNDQ4LTEtMXYtMTBjMC0uNTUyLjQ0OC0xIDEtMXMxIC40NDggMSAxdjEwem00IDBjMCAuNTUyLS40NDggMS0xIDFzLTEtLjQ0OC0xLTF2LTEwYzAtLjU1Mi40NDgtMSAxLTFzMSAuNDQ4IDEgMXYxMHptNCAwYzAgLjU1Mi0uNDQ4IDEtMSAxcy0xLS40NDgtMS0xdi0xMGMwLS41NTIuNDQ4LTEgMS0xczEgLjQ0OCAxIDF2MTB6bTUtMTd2MmgtMjB2LTJoNS43MTFjLjkgMCAxLjYzMS0xLjA5OSAxLjYzMS0yaDUuMzE1YzAgLjkwMS43MyAyIDEuNjMxIDJoNS43MTJ6bS0zIDR2MTZoLTE0di0xNmgtMnYxOGgxOHYtMThoLTJ6Ii8+PC9zdmc+" />
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

const Icon = styled.input` 
    margin-right: 10px;
    transform: scale(.8);
    position: relative;
    top: 5px;
`

const Cell = styled.div`
    display: table-cell;
    padding: 10px;
`











// const Table = styled.table`
//     border-collapse: collapse;
//     border-spacing: 0;
//     width: 100%;
//     max-width: 100%;
// `

// const THEAD = styled.thead`
//     border-bottom: 2px solid #dedede;
// `

// const TH = styled.th`
//     text-align: left;
//     padding: 0.5rem;
//     border-bottom: 2px solid #dedede;
//     border-top: 2px solid #dedede;
//     color: hsl(0, 0%, 20%);
//     font-weight: 400;
// `

// const TD = styled.td`
//     text-align: left;
//     padding: 1rem 0.5rem;
//     border-bottom: 1px solid #dedede;
// `

// const TR = styled.tr`
//     cursor: pointer;
//     &:focus {
//         background-color: hsl(0, 0%, 95%);
//     }
// `