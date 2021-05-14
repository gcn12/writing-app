import styled from 'styled-components'
import { db } from '../../../firebase'
import TableBodyComponent from './Table/TableBodyComponent'
import RenameDocModal from './RenameDocModal'
import DeleteProjectModal from './DeleteDocModal'
import { useState } from 'react'
import { connect } from 'react-redux'
import { breadcrumbs, sortMethod } from '../../../redux/actions/dashboardActions'
import TableHeadComponent from './Table/TableHeadComponent'
import { 
    rootDocs,
    layerOneDocs,
    layerTwoDocs,
    layerThreeDocs,
    currentLayer,
} from '../../../redux/actions/appActions'

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

    const buttonPress = (e, type, docID, name, index) => {
        if((e === 'Enter' || e === 'Space') && document.activeElement.id===`projects-table-row-${index}`) {
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

    const getSortMethod = (sortMethod) => {
        if(sortMethod==='dateAsc') return sortProjectsDateAsc
        if(sortMethod==='dateDesc') return sortProjectsDateDesc
        if(sortMethod==='typeAsc') return sortProjectsTypeAsc
        if(sortMethod==='typeDesc') return sortProjectsTypeDesc
        if(sortMethod==='nameAsc') return sortProjectsNameAsc
        if(sortMethod==='nameDesc') return sortProjectsNameDesc
    }

    const getFolderContents = (docID) => {
        return db.collection('users')
        .doc(props.userData.userID)
        .collection('files-folders')
        .where('parentID', '==', docID)
        .get()
    }

    const addSortedFilesToState = (files) => {
        const sortMethodToUse = getSortMethod(props.sortMethod)
        const sortedFiles = files.sort(sortMethodToUse)
        if(props.currentLayer === 0) return props.dispatch(layerOneDocs(sortedFiles))
        if(props.currentLayer === 1) return props.dispatch(layerTwoDocs(sortedFiles))
        if(props.currentLayer === 2) return props.dispatch(layerThreeDocs(sortedFiles))
    }

    const addBreadcrumbToState = (docID, name) => {
        const breadcrumb = { name, docID, }
        const breadcrumbsCopy = [...props.breadcrumbs]
        breadcrumbsCopy.push(breadcrumb)
        props.dispatch(breadcrumbs(breadcrumbsCopy))
    }

    const incrementCurrentLayer = () => props.dispatch(currentLayer(props.currentLayer + 1))

    const sendFilesToState = (data) => {
        const unsortedFiles = []
        data.forEach(item=> {
            unsortedFiles.push(item.data())
        })
        addSortedFilesToState(unsortedFiles)
    }

    const openFolder = (docID, name) => {
        getFolderContents(docID)
        .then(data=> {
            sendFilesToState(data)
            incrementCurrentLayer()
            addBreadcrumbToState(docID, name)
        })
    }

    const selectItem = (type, docID, name) => {
        document.activeElement.blur()
        if(type==='folder') {
            openFolder(docID, name)
        }else{
            openFile(type, docID)
        }
    }

    const openFile = (fileType, docID) => {
        const location = `/writing-app/edit/${fileType}/${docID}`
        window.open(location, "_blank") || (document.location = location)
    }

    const sortProjectsDateAsc = (a, b) => a.lastModified - b.lastModified
    const sortProjectsDateDesc = (a, b) => b.lastModified - a.lastModified
    const sortProjectsNameAsc = (a, b) => b.name.localeCompare(a.name)
    const sortProjectsNameDesc = (a, b) => a.name.localeCompare(b.name)
    const sortProjectsTypeAsc = (a, b) => b.type.localeCompare(a.type)
    const sortProjectsTypeDesc = (a, b) => a.type.localeCompare(b.type)

    const addSortMethodToDatabase = (sortMethodName) => {
        db.collection('users')
        .doc(props.userData.userID)
        .collection('files-folders')
        .doc('preferences')
        .update({
            sortMethod: sortMethodName
        })
    }

    const sendSortedFilesToState = (sortMethodToUse) => {
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
    }

    const getSortMethodData = (sortType) => {
        if(sortType === 'name') {
            if(props.sortMethod === 'nameDesc') return [sortProjectsNameAsc, 'nameAsc']
            return [sortProjectsNameDesc, 'nameDesc']
        }
        if(sortType === 'type') {
            if(props.sortMethod === 'typeDesc') return [sortProjectsTypeAsc, 'typeAsc']
            return [sortProjectsTypeDesc, 'typeDesc']
        }
        if(sortType === 'date') {
            if(props.sortMethod === 'dateDesc') return [sortProjectsDateAsc, 'dateAsc']
            return [sortProjectsDateDesc, 'dateDesc']
        }
    }

    const changeSortOrder = (sortType) => {
        const [sortMethodToUse, sortMethodName] = getSortMethodData(sortType)
        props.dispatch(sortMethod(sortMethodName))
        sendSortedFilesToState(sortMethodToUse)
        addSortMethodToDatabase(sortMethodName)
    }

    const sortMap = {
        dateAsc: 'last modified ascending',
        dateDesc: 'last modified descending',
        nameAsc: 'name ascending',
        nameDesc: 'name descending',
        typeAsc: 'file type ascending',
        typeDesc: 'file type descending',
    }

    return(
        <Container>
            <Table role='table' aria-label='Documents table'>
                <Head aria-label={`current sort: ${sortMap[props.sortMethod]}`} role='heading'> 
                    <RowHeader role='rowheader'>
                        <TableHeadComponent sortMap={sortMap} name='Name' sortType='name' sortMethodValue1='nameDesc' sortMethodValue2='nameAsc' sortMethod={props.sortMethod} changeSortOrder={changeSortOrder} />
                        <TableHeadComponent sortMap={sortMap} hide='550px' name='Type' sortType='type' sortMethodValue1='typeDesc' sortMethodValue2='typeAsc' sortMethod={props.sortMethod} changeSortOrder={changeSortOrder} />
                        <TableHeadComponent sortMap={sortMap} name='Last modified' sortType='date' sortMethodValue1='dateDesc' sortMethodValue2='dateAsc' sortMethod={props.sortMethod} changeSortOrder={changeSortOrder} />
                        <TableHead hide='550px' aria-label='settings' role='heading'></TableHead>
                    </RowHeader>
                </Head>
                <TableBodyComponent role='rowgroup' selectItem={selectItem} selectProject={selectProject} showRenameProject={showRenameProject} showDeleteProject={showDeleteProject} buttonPress={buttonPress} currentLayer={props.currentLayer} folderMap={folderMap} />
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