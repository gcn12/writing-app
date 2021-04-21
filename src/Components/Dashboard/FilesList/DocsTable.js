import styled from 'styled-components'
import { db } from '../../../firebase'
import { 
    rootDocs,
    layerOneDocs,
    layerTwoDocs,
    layerThreeDocs,
    currentLayer,
} from '../../../redux/actions/appActions'
import TableBodyComponent from './Table/TableBodyComponent'
import RenameDocModal from './RenameDocModal'
import DeleteProjectModal from './DeleteDocModal'
import { useState } from 'react'
import { connect } from 'react-redux'
import { breadcrumbs, sortMethod } from '../../../redux/actions/dashboardActions'
import TableHeadComponent from './Table/TableHeadComponent'

const ProjectsTable = (props) => {
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showRenameModal, setShowRenameModal] = useState(false)

    const folderMap = {
        0: props.rootDocs,
        1: props.layerOneDocs,
        2: props.layerTwoDocs,
        3: props.layerThreeDocs,
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
        setShowRenameModal(true)
    }


    const showDeleteProject = (e) => {
        e.stopPropagation()
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
                let sortMethodToUse
                if(props.sortMethod==='dateAsc') sortMethodToUse = sortProjectsDateAsc
                if(props.sortMethod==='dateDesc') sortMethodToUse = sortProjectsDateDesc
                if(props.sortMethod==='typeAsc') sortMethodToUse = sortProjectsTypeAsc
                if(props.sortMethod==='typeDesc') sortMethodToUse = sortProjectsTypeDesc
                if(props.sortMethod==='nameAsc') sortMethodToUse = sortProjectsNameAsc
                if(props.sortMethod==='nameDesc') sortMethodToUse = sortProjectsNameDesc
                if(props.currentLayer === 0) {
                    props.dispatch(layerOneDocs(dataArr.sort(sortMethodToUse)))
                }else if(props.currentLayer === 1) {
                    props.dispatch(layerTwoDocs(dataArr.sort(sortMethodToUse)))
                }else if(props.currentLayer === 2) {
                    props.dispatch(layerThreeDocs(dataArr.sort(sortMethodToUse)))
                    console.log(dataArr)
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
        // document.location = location
        window.open(location, "_blank") || (document.location = location)
    }

    const sortProjectsDateAsc = (a, b) => {
        return a.lastModified - b.lastModified  
    }

    const sortProjectsDateDesc = (a, b) => {
        return b.lastModified - a.lastModified  
    }

    const sortProjectsNameAsc = (a, b) => {
        return b.name.localeCompare(a.name)
    }

    const sortProjectsNameDesc = (a, b) => {
        return a.name.localeCompare(b.name)
    }

    const sortProjectsTypeAsc = (a, b) => {
        return b.type.localeCompare(a.type)
    }

    const sortProjectsTypeDesc = (a, b) => {
        return a.type.localeCompare(b.type)
    }

    const changeSortOrder = (sortType) => {
        let sortMethodToUse
        let sortMethodName
        if(sortType === 'name') {
            if(props.sortMethod === 'nameDesc') {
                sortMethodToUse = sortProjectsNameAsc
                sortMethodName = 'nameAsc'
            }else{
                sortMethodToUse = sortProjectsNameDesc
                sortMethodName = 'nameDesc'
            }
        }
        if(sortType === 'type') {
            if(props.sortMethod === 'typeDesc') {
                sortMethodToUse = sortProjectsTypeAsc
                sortMethodName = 'typeAsc'
            }else{
                sortMethodToUse = sortProjectsTypeDesc
                sortMethodName = 'typeDesc'
            }
        }
        if(sortType === 'date') {
            if(props.sortMethod === 'dateDesc') {
                sortMethodToUse = sortProjectsDateAsc
                sortMethodName = 'dateAsc'
            }else{
                sortMethodToUse = sortProjectsDateDesc
                sortMethodName = 'dateDesc'
            }
        }
        props.dispatch(sortMethod(sortMethodName))
        if(props.rootDocs.length > 0) {
            props.dispatch(rootDocs(props.rootDocs.sort(sortMethodToUse)))
        }
        if(props.layerOneDocs.length > 0) {
            props.dispatch(layerOneDocs(props.layerOneDocs.sort(sortMethodToUse)))
        }
        if(props.layerTwoDocs.length > 0) {
            props.dispatch(layerTwoDocs(props.layerTwoDocs.sort(sortMethodToUse)))
        }
        if(props.layerThreeDocs.length > 0) {
            props.dispatch(layerThreeDocs(props.layerThreeDocs.sort(sortMethodToUse)))
        }
        db.collection('users')
        .doc(props.userData.userID)
        .collection('files-folders')
        .doc('preferences')
        .update({
            sortMethod: sortMethodName
        })
    }

    return(
        <Container>
            <Table role='table'>
                <Head role='heading'> 
                    <RowHeader role='rowheader'>
                        <TableHeadComponent name='Name' sortType='name' sortMethodValue1='nameDesc' sortMethodValue2='nameAsc' sortMethod={props.sortMethod} changeSortOrder={changeSortOrder} />
                        <TableHeadComponent hide='550px' name='Type' sortType='type' sortMethodValue1='typeDesc' sortMethodValue2='typeAsc' sortMethod={props.sortMethod} changeSortOrder={changeSortOrder} />
                        <TableHeadComponent name='Last modified' sortType='date' sortMethodValue1='dateDesc' sortMethodValue2='dateAsc' sortMethod={props.sortMethod} changeSortOrder={changeSortOrder} />
                        <TableHead hide='550px' aria-label='settings' role='heading'></TableHead>
                    </RowHeader>
                </Head>
                <TableBodyComponent selectItem={selectItem} selectProject={selectProject} showRenameProject={showRenameProject} showDeleteProject={showDeleteProject} buttonPress={buttonPress} currentLayer={props.currentLayer} folderMap={folderMap} />
            </Table> 
            <RenameDocModal showRenameModal={showRenameModal} projectSelectedData={props.projectSelectedData} setShowRenameModal={setShowRenameModal} />
            <DeleteProjectModal showDeleteModal={showDeleteModal} projectSelectedData={props.projectSelectedData} setShowDeleteModal={setShowDeleteModal} />
        </Container>
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
    sortMethod: state.dashboard.sortMethod,
})

export default connect(mapStateToProps)(ProjectsTable)

const Container = styled.div`
`

const TableHead = styled.div`
    display: table-cell;
    text-align: left;
    padding: 10px 15px;
    border-bottom: 2px solid var(--primary-text);
    border-top: 2px solid var(--primary-text);
    color: hsl(0, 0%, 20%);
    font-weight: 400;
    white-space: nowrap;
    @media(max-width: ${props=>props.hide}) {
        display: none;
    }
`

const Head = styled.div`
    display: table-header-group;
`

const Table = styled.div`
    display: table;
    width: 100%;
    border-collapse: separate;
    border-spacing: 0 10px;
    overflow: auto;
    table-layout: fixed;
`

const RowHeader = styled.div`
    display: table-row;
    background-color: transparent;
`