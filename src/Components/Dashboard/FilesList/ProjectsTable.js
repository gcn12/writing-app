import styled from 'styled-components'
import { db } from '../../../firebase'
import { 
    layerOneDocs,
    layerTwoDocs,
    layerThreeDocs,
    currentLayer,
} from '../../../redux/actions/appActions'
import moment from 'moment'
import RenameDocModal from './RenameDocModal'
import DeleteProjectModal from './DeleteDocModal'
import { useState } from 'react'
import { connect } from 'react-redux'
import { breadcrumbs } from '../../../redux/actions/dashboardActions'

const ProjectsTable = (props) => {
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showRenameModal, setShowRenameModal] = useState(false)

    const folderMap = {
        0: props.rootDocs,
        1: props.layerOneDocs,
        2: props.layerTwoDocs,
        3: props.layerThreeDocs,
    }

    const sortFiles = (a, b) => {
        return b.lastModified - a.lastModified  
    }

    const selectProject = (docData, index) => {
        props.setProjectSelectedData({...docData, currentIndex: index})
    }

    const buttonPress = (e, type, docID, name) => {
        if((e === 'Enter' || e === 'Space') && document.activeElement.id==='projects-table-row') {
            selectItem(type, docID, name)
        }
    }

    const showRenameProject = (e) => {
        e.stopPropagation()
        document.activeElement.blur()
        setShowRenameModal(true)
    }


    const showDeleteProject = (e) => {
        e.stopPropagation()
        document.activeElement.blur()
        setShowDeleteModal(true)
    }

    const selectItem = (type, docID, name) => {
        document.activeElement.blur()
        if(type==='folder') {
            db.collection('users')
            .doc(props.userData.userID)
            .collection('files-folders')
            .where('parentID', '==', docID)
            .get()
            .then(data=> {
                const dataArr = []
                data.forEach(item=> {
                    dataArr.push(item.data())
                })
                if(props.currentLayer === 0) {
                    props.dispatch(layerOneDocs(dataArr.sort(sortFiles)))
                }else if(props.currentLayer === 1) {
                    props.dispatch(layerTwoDocs(dataArr.sort(sortFiles)))
                }else if(props.currentLayer === 2) {
                    props.dispatch(layerThreeDocs(dataArr.sort(sortFiles)))
                }
                props.dispatch(currentLayer(props.currentLayer + 1))
                const breadcrumb = {
                    name,
                    docID, 
                }
                const breadcrumbsCopy = [...props.breadcrumbs]
                breadcrumbsCopy.push(breadcrumb)
                props.dispatch(breadcrumbs(breadcrumbsCopy))
            })
        }else{
            openFile(type, docID)
        }
    }

    const openFile = (fileType, docID) => {
        const location = `/writing-app/edit/${fileType}/${docID}`
        window.open(location, "_blank") || (document.location = location)
    }

    return(
        <div>
            <Table role='table'>
                <Head role='heading'> 
                    <RowHeader role='rowheader'>
                        <TableHead role='heading'>Project name</TableHead>
                        <TableHead role='heading'>Type</TableHead>
                        <TableHead role='heading'>Last modified</TableHead>
                        <TableHead aria-label='settings' role='heading'></TableHead>
                    </RowHeader>
                </Head>
                <TableBody role='row'>
                    {folderMap[props.currentLayer]?.map((doc, index)=> {
                        return(
                            <Row id='projects-table-row' tabIndex='0' onKeyDown={(e)=>buttonPress(e.code, doc.type, doc.docID, doc.name)} role='button' onFocus={()=>selectProject(doc, index)} onClick={()=>selectItem(doc.type, doc.docID, doc.name)} key={index}>
                                <Cell role='cell'>
                                    <DocIconNameContainer>
                                        {doc.type==='folder' &&
                                            <DocIcon alt='' src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNNi4wODMgNGMxLjM4IDEuNjEyIDIuNTc4IDMgNC45MTcgM2gxMXYxM2gtMjB2LTE2aDQuMDgzem0uOTE3LTJoLTd2MjBoMjR2LTE3aC0xM2MtMS42MjkgMC0yLjMwNS0xLjA1OC00LTN6Ii8+PC9zdmc+" />
                                        }
                                        {doc.type==='screenplay' &&
                                            <DocIcon alt='' src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMjEuMTU1IDguNjRjLS45MDkgMS41MTktMi4zMjcgMy4wNjctNC4wOTcgMy4wMDQtLjQxMy43MDYtLjg1MiAxLjY3Ny0xLjMzOSAyLjgwM2wtMS4zMTIuNTUzYy45MzYtMi4zNDMgMi4yMzEtNC45NjEgMy42OTgtNi45OTQtLjY3LjUyOS0xLjc0NiAxLjYzNy0yLjY2MiAyLjc4My0xLjA5OC0xLjgyOC0uMy0zLjY5MS45NzMtNS4xNzkuMDIxLjY0MS4zNTkgMS4xOTYuNjAxIDEuNDc1LS4wODctLjUzLS4xMTQtMS40ODkuMTk1LTIuMzUxLjcxOC0uNzMyIDEuMzY0LTEuMjcxIDIuMTEzLTEuNzYtLjA4My40NzguMDggMS4wMjYuMjYyIDEuMzYxLjAyNC0uNDkuMjI0LTEuNDMuNTIxLTEuODQuOTI0LS43MjcgMi4zMzItMS4zNzMgMy44OTItMS40OTUtLjA4MS45NzMtLjQzNiAyLjU3NS0xLjAyNCAzLjYwNC0uNTE1LjQwNC0xLjIyMS42OC0xLjc5MS44MzMuNDkzLjA4OSAxLjAzMS4wNzcgMS40OTQtLjAwMS0uMjY5Ljc0My0uNTUyIDEuNDI4LS45OTggMi4yNzYtLjY3OS40NjgtMS41NzguNzMyLTIuMjAzLjgyNS40Ni4xODcgMS4yNzIuMjQ1IDEuNjc3LjEwM3ptLTEzLjg0MSAzLjgwNWwuNjQ1Ljc4MSA0Ljc3My0yLjc5MS0uNjY4LS43NjgtNC43NSAyLjc3OHptNi45Ni0uMjM4bC0uNjY4LS43NjctNC44MDUgMi44MDguNjQ1Ljc4MSA0LjgyOC0yLjgyMnptNC42NzkuMDA3Yy0uNDIxLjIwMy0uODUxLjM0MS0xLjI4Ni4zOTgtLjEyLjIzMS0uMjQ2LjQ5NC0uMzc3Ljc3M2wuMjk4LjM0MmMuNjIzLjY5Mi40NTkgMS43MDQtLjM3NiAyLjIzOS0uNzczLjQ5Ny01LjM0MSAzLjM3Ni02LjM4NiA0LjAzNS0uMDc0LS43MjEtLjM1OC0xLjM5MS0uODI2LTEuOTQ4LS40NjktLjU1Ny02LjExNS03LjM3Ni03LjUyMy05LjE3OC0uNDY5LS42LS41NzUtMS4yNDUtLjI5NS0xLjgxNi4yNjgtLjU0OS44NDItLjkxOCAxLjQzLS45MTguOTE5IDAgMS40MDguNjU1IDEuNTQ5IDEuMjE1LjE2LjY0MS0uMDM1IDEuMjMxLS42MjMgMS42ODVsMS4zMjkgMS42MjQgNy43OTYtNC40NDZjMS40MjItMS4wNTEgMS44MjItMi45OTEuOTMtNC41MTMtLjYxOC0xLjA1My0xLjc1OS0xLjcwNi0yLjk3OC0xLjcwNi0xLjE4OCAwLS43OTMtLjAxNi05LjU2NSA0LjQ3NS0xLjIzNC41OTEtMi4wNSAxLjc4Ny0yLjA1IDMuMjAyIDAgLjg3LjMwOCAxLjc1Ni44ODkgMi40ODcgMS40MjcgMS43OTQgNy41NjEgOS4xODUgNy42MTYgOS4yNTcuMzcxLjQ5My40MjcgMS4xMTkuMTUgMS42NzMtLjI3Ny41NTUtLjgxMi44ODYtMS40MjkuODg2LS45MTkgMC0xLjQwOC0uNjU1LTEuNTQ5LTEuMjE2LS4xNTYtLjYyOS4wMTItMS4yMDguNjA0LTEuNjU0bC0xLjI3Ny0xLjU0NWMtLjgyMi42NjUtMS4yNzcgMS40OTYtMS4zNzcgMi40NDItLjIzMiAyLjIwNSAxLjUyNSAzLjk5MyAzLjYxMyAzLjk5My41OTYgMCAxLjMxMS0uMTc3IDEuODQxLS41MWw5LjQyNy01Ljk0NmMuOTU3LS42NjQgMS40OTItMS43ODEgMS40OTItMi44OTcgMC0uNzQ1LS4yNC0xLjQ1NC0uNjg4LTIuMDAzbC0uMzU5LS40M3ptLTcuOTMzLTEwLjA2MmMuMTg4LS4wODcuMzk4LS4xMzQuNjA5LS4xMzQuNTMyIDAgLjk5Ny4yODEgMS4yNDMuNzUyLjMxMi41OTYuMjI2IDEuNDY5LS41NDggMS45MTJsLTUuMDk3IDIuODg4Yy0uMDUxLTEuMDg5LS41NzktMi4wODEtMS40NTUtMi43MzJsNS4yNDgtMi42ODZ6bTIuMDk3IDEzLjM4M2wuMzYxLS45MDUuMjQ5LS42MDktMy40NDkgMi4wMTcuNjQ1Ljc4MSAyLjE5NC0xLjI4NHoiLz48L3N2Zz4=" />
                                        }
                                        {doc.type==='notes' &&
                                            <DocIcon alt='' src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNNCAyMnYtMjBoMTZ2MTEuNTQzYzAgNC4xMDctNiAyLjQ1Ny02IDIuNDU3czEuNTE4IDYtMi42MzggNmgtNy4zNjJ6bTE4LTcuNjE0di0xNC4zODZoLTIwdjI0aDEwLjE4OWMzLjE2MyAwIDkuODExLTcuMjIzIDkuODExLTkuNjE0em0tNS0xLjM4NmgtMTB2LTFoMTB2MXptMC00aC0xMHYxaDEwdi0xem0wLTNoLTEwdjFoMTB2LTF6Ii8+PC9zdmc+" />
                                        }
                                        {doc.type==='outline' &&
                                            <DocIcon alt='' src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNNCA0djIwaDIwdi0yMGgtMjB6bTE4IDE4aC0xNnYtMTNoMTZ2MTN6bS0zLTNoLTEwdi0xaDEwdjF6bTAtM2gtMTB2LTFoMTB2MXptMC0zaC0xMHYtMWgxMHYxem0yLTExaC0xOXYxOWgtMnYtMjFoMjF2MnoiLz48L3N2Zz4=" />
                                        }
                                        {doc.name}
                                    </DocIconNameContainer>
                                </Cell>
                                <Cell role='cell'>{doc.type}</Cell>
                                <Cell role='cell'>{moment(doc.lastModified).format('ll')}</Cell>
                                <Cell role='cell'>
                                    <IconContainer>
                                        <IconBackgroundContainer onClick={(e)=>showRenameProject(e)} label='rename file'>
                                            <IconTitle>Rename</IconTitle>
                                            <Icon alt='' src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTguMzYzIDguNDY0bDEuNDMzIDEuNDMxLTEyLjY3IDEyLjY2OS03LjEyNSAxLjQzNiAxLjQzOS03LjEyNyAxMi42NjUtMTIuNjY4IDEuNDMxIDEuNDMxLTEyLjI1NSAxMi4yMjQtLjcyNiAzLjU4NCAzLjU4NC0uNzIzIDEyLjIyNC0xMi4yNTd6bS0uMDU2LTguNDY0bC0yLjgxNSAyLjgxNyA1LjY5MSA1LjY5MiAyLjgxNy0yLjgyMS01LjY5My01LjY4OHptLTEyLjMxOCAxOC43MThsMTEuMzEzLTExLjMxNi0uNzA1LS43MDctMTEuMzEzIDExLjMxNC43MDUuNzA5eiIvPjwvc3ZnPg==" />
                                            <IconBackground />
                                        </IconBackgroundContainer>
                                        <IconBackgroundContainer onClick={(e)=>showDeleteProject(e)} label='delete file' >
                                            <IconTitle>Delete</IconTitle>
                                            <Icon alt='' src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNOSAxOWMwIC41NTItLjQ0OCAxLTEgMXMtMS0uNDQ4LTEtMXYtMTBjMC0uNTUyLjQ0OC0xIDEtMXMxIC40NDggMSAxdjEwem00IDBjMCAuNTUyLS40NDggMS0xIDFzLTEtLjQ0OC0xLTF2LTEwYzAtLjU1Mi40NDgtMSAxLTFzMSAuNDQ4IDEgMXYxMHptNCAwYzAgLjU1Mi0uNDQ4IDEtMSAxcy0xLS40NDgtMS0xdi0xMGMwLS41NTIuNDQ4LTEgMS0xczEgLjQ0OCAxIDF2MTB6bTUtMTd2MmgtMjB2LTJoNS43MTFjLjkgMCAxLjYzMS0xLjA5OSAxLjYzMS0yaDUuMzE1YzAgLjkwMS43MyAyIDEuNjMxIDJoNS43MTJ6bS0zIDR2MTZoLTE0di0xNmgtMnYxOGgxOHYtMThoLTJ6Ii8+PC9zdmc+" />
                                            <IconBackground />
                                        </IconBackgroundContainer>
                                    </IconContainer>
                                </Cell>
                            </Row>
                        )
                    })}
                </TableBody>
            </Table> 
            {showRenameModal && 
                <RenameDocModal projectSelectedData={props.projectSelectedData} setShowRenameModal={setShowRenameModal} />
            }
            {showDeleteModal && 
                <DeleteProjectModal projectSelectedData={props.projectSelectedData} setShowDeleteModal={setShowDeleteModal} />
            }
        </div>
    )   
}


const mapStateToProps = state => ({
    userData: state.app.userData,
    rootDocs: state.app.rootDocs,
    currentLayer: state.app.currentLayer,
    currentProjectID: state.app.currentProjectID,
    layerOneDocs: state.app.layerOneDocs,
    layerTwoDocs: state.app.layerTwoDocs,
    layerThreeDocs: state.app.layerThreeDocs,
    breadcrumbs: state.dashboard.breadcrumbs,
})

export default connect(mapStateToProps)(ProjectsTable)

const DocIconNameContainer = styled.div`
    display: flex;
    align-items: center;
`

const DocIcon = styled.img`
    height: 20px;
    width: 20px;
    margin-right: 10px;
`

const IconTitle = styled.div`
    opacity: 0;
    transition: opacity 200ms ease-in-out;
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

const IconContainer = styled.div`
    opacity: 0;
    display: flex;
`

const TableHead = styled.div`
    display: table-cell;
    text-align: left;
    /* padding: 0.5rem; */
    padding: 10px 15px;
    border-bottom: 2px solid #dedede;
    border-top: 2px solid #dedede;
    color: hsl(0, 0%, 20%);
    font-weight: 400;
`

const TableBody = styled.div`
    display: table-row-group;
`

const Head = styled.div`
    display: table-header-group;
`

const Table = styled.div`
    display: table;
    width: 100%;
    max-width: 100%;
    border-collapse: separate;
    border-spacing: 0 10px;
`

const RowHeader = styled.div`
    display: table-row;
    background-color: transparent;
`

const Row = styled.div`
    border-collapse: separate;
    cursor: pointer;
    display: table-row;
    background-color: hsl(20, 0%, 97%);
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
    &:first-of-type {
        border-top-left-radius: 10px;
        border-bottom-left-radius: 10px;
    }
    &:last-of-type {
        border-top-right-radius: 10px;
        border-bottom-right-radius: 10px;
    }
`

const IconBackground = styled.div`
    opacity: 0;
    transition: opacity 200ms ease-in-out;
    background-color: lightblue;
    height: 35px;
    width: 35px;
    position: relative;
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
    padding: 15px 20px;
    vertical-align: middle;
    &:first-of-type {
        border-top-left-radius: 10px;
        border-bottom-left-radius: 10px;
    }
    &:last-of-type {
        border-top-right-radius: 10px;
        border-bottom-right-radius: 10px;
    }
`