import styled from 'styled-components'
import { db } from '../../../firebase'
import { 
    rootDocs,
    layerOneDocs,
    layerTwoDocs,
    layerThreeDocs,
    currentLayer,
} from '../../../redux/actions/appActions'
import IconsComponent from '../../../Icons/IconComponent'
import moment from 'moment'
import RenameDocModal from './RenameDocModal'
import DeleteProjectModal from './DeleteDocModal'
import { useState } from 'react'
import { connect } from 'react-redux'
import { breadcrumbs, sortMethod } from '../../../redux/actions/dashboardActions'
import IconComponent from '../../../Icons/IconComponent'

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
        <div>
            <Table role='table'>
                <Head role='heading'> 
                    <RowHeader role='rowheader'>
                        <TableHead role='heading'>
                            <ColumnNameButton onClick={()=>changeSortOrder('name')}>
                                Name
                                {props.sortMethod === 'nameDesc' &&
                                    <ArrowIcon rotate='rotate(180deg)'><IconsComponent><path d="M24 22h-24l12-20z"/></IconsComponent></ArrowIcon>
                                }
                                {props.sortMethod === 'nameAsc' &&
                                    <ArrowIcon rotate='rotate(0deg)'><IconsComponent><path d="M24 22h-24l12-20z"/></IconsComponent></ArrowIcon>
                                }
                            </ColumnNameButton>
                        </TableHead>
                        <TableHead role='heading'>
                            <ColumnNameButton onClick={()=>changeSortOrder('type')}>
                            Type
                            {props.sortMethod === 'typeDesc' &&
                                <ArrowIcon rotate='rotate(180deg)'><IconsComponent><path d="M24 22h-24l12-20z"/></IconsComponent></ArrowIcon>
                            }
                            {props.sortMethod === 'typeAsc' &&
                                <ArrowIcon rotate='rotate(0deg)'><IconsComponent><path d="M24 22h-24l12-20z"/></IconsComponent></ArrowIcon>
                            }
                            </ColumnNameButton>
                        </TableHead>
                        <TableHead role='heading'>
                            <ColumnNameButton onClick={()=>changeSortOrder('date')}>
                                Last modified
                                {props.sortMethod === 'dateDesc' &&
                                    <ArrowIcon rotate='rotate(0deg)'><IconsComponent><path d="M24 22h-24l12-20z"/></IconsComponent></ArrowIcon>
                                }
                                {props.sortMethod === 'dateAsc' &&
                                    <ArrowIcon rotate='rotate(180deg)'><IconsComponent><path d="M24 22h-24l12-20z"/></IconsComponent></ArrowIcon>
                                }
                            </ColumnNameButton>
                        </TableHead>
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
                                            <DocIcon><IconComponent><path d="M6.083 4c1.38 1.612 2.578 3 4.917 3h11v13h-20v-16h4.083zm.917-2h-7v20h24v-17h-13c-1.629 0-2.305-1.058-4-3z"/></IconComponent></DocIcon>
                                            // <DocIcon alt='' src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNNi4wODMgNGMxLjM4IDEuNjEyIDIuNTc4IDMgNC45MTcgM2gxMXYxM2gtMjB2LTE2aDQuMDgzem0uOTE3LTJoLTd2MjBoMjR2LTE3aC0xM2MtMS42MjkgMC0yLjMwNS0xLjA1OC00LTN6Ii8+PC9zdmc+" />
                                        }
                                        {doc.type==='screenplay' &&
                                            <DocIcon><IconComponent><path d="M21.155 8.64c-.909 1.519-2.327 3.067-4.097 3.004-.413.706-.852 1.677-1.339 2.803l-1.312.553c.936-2.343 2.231-4.961 3.698-6.994-.67.529-1.746 1.637-2.662 2.783-1.098-1.828-.3-3.691.973-5.179.021.641.359 1.196.601 1.475-.087-.53-.114-1.489.195-2.351.718-.732 1.364-1.271 2.113-1.76-.083.478.08 1.026.262 1.361.024-.49.224-1.43.521-1.84.924-.727 2.332-1.373 3.892-1.495-.081.973-.436 2.575-1.024 3.604-.515.404-1.221.68-1.791.833.493.089 1.031.077 1.494-.001-.269.743-.552 1.428-.998 2.276-.679.468-1.578.732-2.203.825.46.187 1.272.245 1.677.103zm-13.841 3.805l.645.781 4.773-2.791-.668-.768-4.75 2.778zm6.96-.238l-.668-.767-4.805 2.808.645.781 4.828-2.822zm4.679.007c-.421.203-.851.341-1.286.398-.12.231-.246.494-.377.773l.298.342c.623.692.459 1.704-.376 2.239-.773.497-5.341 3.376-6.386 4.035-.074-.721-.358-1.391-.826-1.948-.469-.557-6.115-7.376-7.523-9.178-.469-.6-.575-1.245-.295-1.816.268-.549.842-.918 1.43-.918.919 0 1.408.655 1.549 1.215.16.641-.035 1.231-.623 1.685l1.329 1.624 7.796-4.446c1.422-1.051 1.822-2.991.93-4.513-.618-1.053-1.759-1.706-2.978-1.706-1.188 0-.793-.016-9.565 4.475-1.234.591-2.05 1.787-2.05 3.202 0 .87.308 1.756.889 2.487 1.427 1.794 7.561 9.185 7.616 9.257.371.493.427 1.119.15 1.673-.277.555-.812.886-1.429.886-.919 0-1.408-.655-1.549-1.216-.156-.629.012-1.208.604-1.654l-1.277-1.545c-.822.665-1.277 1.496-1.377 2.442-.232 2.205 1.525 3.993 3.613 3.993.596 0 1.311-.177 1.841-.51l9.427-5.946c.957-.664 1.492-1.781 1.492-2.897 0-.745-.24-1.454-.688-2.003l-.359-.43zm-7.933-10.062c.188-.087.398-.134.609-.134.532 0 .997.281 1.243.752.312.596.226 1.469-.548 1.912l-5.097 2.888c-.051-1.089-.579-2.081-1.455-2.732l5.248-2.686zm2.097 13.383l.361-.905.249-.609-3.449 2.017.645.781 2.194-1.284z"/></IconComponent></DocIcon>
                                            // <DocIcon alt='' src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMjEuMTU1IDguNjRjLS45MDkgMS41MTktMi4zMjcgMy4wNjctNC4wOTcgMy4wMDQtLjQxMy43MDYtLjg1MiAxLjY3Ny0xLjMzOSAyLjgwM2wtMS4zMTIuNTUzYy45MzYtMi4zNDMgMi4yMzEtNC45NjEgMy42OTgtNi45OTQtLjY3LjUyOS0xLjc0NiAxLjYzNy0yLjY2MiAyLjc4My0xLjA5OC0xLjgyOC0uMy0zLjY5MS45NzMtNS4xNzkuMDIxLjY0MS4zNTkgMS4xOTYuNjAxIDEuNDc1LS4wODctLjUzLS4xMTQtMS40ODkuMTk1LTIuMzUxLjcxOC0uNzMyIDEuMzY0LTEuMjcxIDIuMTEzLTEuNzYtLjA4My40NzguMDggMS4wMjYuMjYyIDEuMzYxLjAyNC0uNDkuMjI0LTEuNDMuNTIxLTEuODQuOTI0LS43MjcgMi4zMzItMS4zNzMgMy44OTItMS40OTUtLjA4MS45NzMtLjQzNiAyLjU3NS0xLjAyNCAzLjYwNC0uNTE1LjQwNC0xLjIyMS42OC0xLjc5MS44MzMuNDkzLjA4OSAxLjAzMS4wNzcgMS40OTQtLjAwMS0uMjY5Ljc0My0uNTUyIDEuNDI4LS45OTggMi4yNzYtLjY3OS40NjgtMS41NzguNzMyLTIuMjAzLjgyNS40Ni4xODcgMS4yNzIuMjQ1IDEuNjc3LjEwM3ptLTEzLjg0MSAzLjgwNWwuNjQ1Ljc4MSA0Ljc3My0yLjc5MS0uNjY4LS43NjgtNC43NSAyLjc3OHptNi45Ni0uMjM4bC0uNjY4LS43NjctNC44MDUgMi44MDguNjQ1Ljc4MSA0LjgyOC0yLjgyMnptNC42NzkuMDA3Yy0uNDIxLjIwMy0uODUxLjM0MS0xLjI4Ni4zOTgtLjEyLjIzMS0uMjQ2LjQ5NC0uMzc3Ljc3M2wuMjk4LjM0MmMuNjIzLjY5Mi40NTkgMS43MDQtLjM3NiAyLjIzOS0uNzczLjQ5Ny01LjM0MSAzLjM3Ni02LjM4NiA0LjAzNS0uMDc0LS43MjEtLjM1OC0xLjM5MS0uODI2LTEuOTQ4LS40NjktLjU1Ny02LjExNS03LjM3Ni03LjUyMy05LjE3OC0uNDY5LS42LS41NzUtMS4yNDUtLjI5NS0xLjgxNi4yNjgtLjU0OS44NDItLjkxOCAxLjQzLS45MTguOTE5IDAgMS40MDguNjU1IDEuNTQ5IDEuMjE1LjE2LjY0MS0uMDM1IDEuMjMxLS42MjMgMS42ODVsMS4zMjkgMS42MjQgNy43OTYtNC40NDZjMS40MjItMS4wNTEgMS44MjItMi45OTEuOTMtNC41MTMtLjYxOC0xLjA1My0xLjc1OS0xLjcwNi0yLjk3OC0xLjcwNi0xLjE4OCAwLS43OTMtLjAxNi05LjU2NSA0LjQ3NS0xLjIzNC41OTEtMi4wNSAxLjc4Ny0yLjA1IDMuMjAyIDAgLjg3LjMwOCAxLjc1Ni44ODkgMi40ODcgMS40MjcgMS43OTQgNy41NjEgOS4xODUgNy42MTYgOS4yNTcuMzcxLjQ5My40MjcgMS4xMTkuMTUgMS42NzMtLjI3Ny41NTUtLjgxMi44ODYtMS40MjkuODg2LS45MTkgMC0xLjQwOC0uNjU1LTEuNTQ5LTEuMjE2LS4xNTYtLjYyOS4wMTItMS4yMDguNjA0LTEuNjU0bC0xLjI3Ny0xLjU0NWMtLjgyMi42NjUtMS4yNzcgMS40OTYtMS4zNzcgMi40NDItLjIzMiAyLjIwNSAxLjUyNSAzLjk5MyAzLjYxMyAzLjk5My41OTYgMCAxLjMxMS0uMTc3IDEuODQxLS41MWw5LjQyNy01Ljk0NmMuOTU3LS42NjQgMS40OTItMS43ODEgMS40OTItMi44OTcgMC0uNzQ1LS4yNC0xLjQ1NC0uNjg4LTIuMDAzbC0uMzU5LS40M3ptLTcuOTMzLTEwLjA2MmMuMTg4LS4wODcuMzk4LS4xMzQuNjA5LS4xMzQuNTMyIDAgLjk5Ny4yODEgMS4yNDMuNzUyLjMxMi41OTYuMjI2IDEuNDY5LS41NDggMS45MTJsLTUuMDk3IDIuODg4Yy0uMDUxLTEuMDg5LS41NzktMi4wODEtMS40NTUtMi43MzJsNS4yNDgtMi42ODZ6bTIuMDk3IDEzLjM4M2wuMzYxLS45MDUuMjQ5LS42MDktMy40NDkgMi4wMTcuNjQ1Ljc4MSAyLjE5NC0xLjI4NHoiLz48L3N2Zz4=" />
                                        }
                                        {doc.type==='notes' &&
                                            <DocIcon><IconComponent><path d="M4 22v-20h16v11.543c0 4.107-6 2.457-6 2.457s1.518 6-2.638 6h-7.362zm18-7.614v-14.386h-20v24h10.189c3.163 0 9.811-7.223 9.811-9.614zm-5-1.386h-10v-1h10v1zm0-4h-10v1h10v-1zm0-3h-10v1h10v-1z"/></IconComponent></DocIcon>
                                            // <DocIcon alt='' src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNNCAyMnYtMjBoMTZ2MTEuNTQzYzAgNC4xMDctNiAyLjQ1Ny02IDIuNDU3czEuNTE4IDYtMi42MzggNmgtNy4zNjJ6bTE4LTcuNjE0di0xNC4zODZoLTIwdjI0aDEwLjE4OWMzLjE2MyAwIDkuODExLTcuMjIzIDkuODExLTkuNjE0em0tNS0xLjM4NmgtMTB2LTFoMTB2MXptMC00aC0xMHYxaDEwdi0xem0wLTNoLTEwdjFoMTB2LTF6Ii8+PC9zdmc+" />
                                        }
                                        {doc.type==='outline' &&
                                            <DocIcon><IconComponent><path d="M4 4v20h20v-20h-20zm18 18h-16v-13h16v13zm-3-3h-10v-1h10v1zm0-3h-10v-1h10v1zm0-3h-10v-1h10v1zm2-11h-19v19h-2v-21h21v2z"/></IconComponent></DocIcon>
                                            // <DocIcon alt='' src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNNCA0djIwaDIwdi0yMGgtMjB6bTE4IDE4aC0xNnYtMTNoMTZ2MTN6bS0zLTNoLTEwdi0xaDEwdjF6bTAtM2gtMTB2LTFoMTB2MXptMC0zaC0xMHYtMWgxMHYxem0yLTExaC0xOXYxOWgtMnYtMjFoMjF2MnoiLz48L3N2Zz4=" />
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
                                            <Icon><IconComponent><path d="M18.363 8.464l1.433 1.431-12.67 12.669-7.125 1.436 1.439-7.127 12.665-12.668 1.431 1.431-12.255 12.224-.726 3.584 3.584-.723 12.224-12.257zm-.056-8.464l-2.815 2.817 5.691 5.692 2.817-2.821-5.693-5.688zm-12.318 18.718l11.313-11.316-.705-.707-11.313 11.314.705.709z"/></IconComponent></Icon>
                                            {/* <Icon alt='' src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTguMzYzIDguNDY0bDEuNDMzIDEuNDMxLTEyLjY3IDEyLjY2OS03LjEyNSAxLjQzNiAxLjQzOS03LjEyNyAxMi42NjUtMTIuNjY4IDEuNDMxIDEuNDMxLTEyLjI1NSAxMi4yMjQtLjcyNiAzLjU4NCAzLjU4NC0uNzIzIDEyLjIyNC0xMi4yNTd6bS0uMDU2LTguNDY0bC0yLjgxNSAyLjgxNyA1LjY5MSA1LjY5MiAyLjgxNy0yLjgyMS01LjY5My01LjY4OHptLTEyLjMxOCAxOC43MThsMTEuMzEzLTExLjMxNi0uNzA1LS43MDctMTEuMzEzIDExLjMxNC43MDUuNzA5eiIvPjwvc3ZnPg==" /> */}
                                            <IconBackground />
                                        </IconBackgroundContainer>
                                        <IconBackgroundContainer onClick={(e)=>showDeleteProject(e)} label='delete file' >
                                            <IconTitle>Delete</IconTitle>
                                            <Icon><IconComponent><path d="M9 19c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5-17v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.315c0 .901.73 2 1.631 2h5.712zm-3 4v16h-14v-16h-2v18h18v-18h-2z"/></IconComponent></Icon>
                                            {/* <Icon alt='' src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNOSAxOWMwIC41NTItLjQ0OCAxLTEgMXMtMS0uNDQ4LTEtMXYtMTBjMC0uNTUyLjQ0OC0xIDEtMXMxIC40NDggMSAxdjEwem00IDBjMCAuNTUyLS40NDggMS0xIDFzLTEtLjQ0OC0xLTF2LTEwYzAtLjU1Mi40NDgtMSAxLTFzMSAuNDQ4IDEgMXYxMHptNCAwYzAgLjU1Mi0uNDQ4IDEtMSAxcy0xLS40NDgtMS0xdi0xMGMwLS41NTIuNDQ4LTEgMS0xczEgLjQ0OCAxIDF2MTB6bTUtMTd2MmgtMjB2LTJoNS43MTFjLjkgMCAxLjYzMS0xLjA5OSAxLjYzMS0yaDUuMzE1YzAgLjkwMS43MyAyIDEuNjMxIDJoNS43MTJ6bS0zIDR2MTZoLTE0di0xNmgtMnYxOGgxOHYtMThoLTJ6Ii8+PC9zdmc+" /> */}
                                            <IconBackground />
                                        </IconBackgroundContainer>
                                    </IconContainer>
                                </Cell>
                            </Row>
                        )
                    })}
                </TableBody>
            </Table> 
            <RenameDocModal showRenameModal={showRenameModal} projectSelectedData={props.projectSelectedData} setShowRenameModal={setShowRenameModal} />
            <DeleteProjectModal showDeleteModal={showDeleteModal} projectSelectedData={props.projectSelectedData} setShowDeleteModal={setShowDeleteModal} />
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
    sortMethod: state.dashboard.sortMethod,
})

export default connect(mapStateToProps)(ProjectsTable)

const ColumnNameButton = styled.button`
    display: flex;
    align-items: center;
`

const ArrowIcon = styled.div`
    transform: scale(.6) ${props=>props.rotate};
    margin-left: 5px;
`

const DocIconNameContainer = styled.div`
    display: flex;
    align-items: center;
`

const DocIcon = styled.div`
    /* height: 20px;
    width: 20px; */
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
    white-space: nowrap;
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
    background-color: var(--sidebar);
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

const Icon = styled.div` 
    /* width: 18px;
    height: 18px; */
    z-index: 100;
    top: 50%;
    left: 50%;
    position: absolute;
    transform: translate(-50%, -50%) scale(.7);
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