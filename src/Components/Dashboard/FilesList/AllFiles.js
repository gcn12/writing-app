import { db } from '../../../firebase'
import styled from 'styled-components'
import { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import CreateDocModal from './CreateDocModal'
import {
    Menu,
    MenuList,
    MenuButton,
    MenuItem,
} from "@reach/menu-button";
import "@reach/menu-button/styles.css";
import ProjectsTable from './DocsTable'
import { rootDocs, currentLayer } from '../../../redux/actions/appActions'
import { sortMethod } from '../../../redux/actions/dashboardActions'
const AllFiles = (props) => {
    const [isCreateProjectModal, setIsCreateProjectModal] = useState(false)
    const [projectSelectedData, setProjectSelectedData] = useState({})
    const [createType, setCreateType] = useState('')
    // const [currentDocID, setCurrentDocID] = useState('')
    useEffect(()=> {
        if(props.userData.userID) {
            getInitialFilesAndFolders()
        }
        // eslint-disable-next-line
    }, [props.userData])

    const sortProjectsDateAsc = (a, b) => {
        return b.lastModified - a.lastModified  
    }

    const sortProjectsDateDesc = (a, b) => {
        return a.lastModified - b.lastModified  
    }

    const sortProjectsNameAsc = (a, b) => {
        return b.name.localeCompare(a.name)
    }

    const sortProjectsNameDesc = (a, b) => {
        return a.name.localeCompare(b.name)
    }

    const sortProjectsTypeAsc = (a, b) => {
        return b.name.localeCompare(a.name)
    }

    const sortProjectsTypeDesc = (a, b) => {
        return a.type.localeCompare(b.type)
    }

    

    const getInitialFilesAndFolders = () => {
        db.collection('users')
        .doc(props.userData.userID)
        .collection('files-folders')
        .where('parentID', '==', props.userData.userID)
        .get()
        .then(data=> {
            const projectArr = []
            let sortMethodType
            data.forEach(project=> {
                const docData = project.data()
                if(docData.sortMethod) {
                    sortMethodType = docData.sortMethod
                    props.dispatch(sortMethod(docData.sortMethod))
                }else{
                    projectArr.push(docData)
                }
            })
            props.dispatch(currentLayer(0))
            if(sortMethodType==='dateAsc') return props.dispatch(rootDocs(projectArr.sort(sortProjectsDateAsc)))
            if(sortMethodType==='dateDesc') return props.dispatch(rootDocs(projectArr.sort(sortProjectsDateDesc)))
            if(sortMethodType==='nameAsc') return props.dispatch(rootDocs(projectArr.sort(sortProjectsNameAsc)))
            if(sortMethodType==='nameDesc') return props.dispatch(rootDocs(projectArr.sort(sortProjectsNameDesc)))
            if(sortMethodType==='typeAsc') return props.dispatch(rootDocs(projectArr.sort(sortProjectsTypeAsc)))
            if(sortMethodType==='typeDesc') return props.dispatch(rootDocs(projectArr.sort(sortProjectsTypeDesc)))
        })
    }

    const openModal = (type) => {
        setIsCreateProjectModal(true)
        setCreateType(type)
    }

    return(
        <Container>

            <CreateDocModal isCreateProjectModal={isCreateProjectModal} projectSelectedData={projectSelectedData} setProjectSelectedData={setProjectSelectedData} createType={createType} getProjects={getInitialFilesAndFolders} setIsCreateProjectModal={setIsCreateProjectModal} />
            <Menu>
                <CreateNew><Plus>+</Plus> Create new</CreateNew>
                <List>
                    <Item onSelect={()=>openModal('folder')}>
                        <MenuIconContainer>
                        <DocIcon alt='' src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNNi4wODMgNGMxLjM4IDEuNjEyIDIuNTc4IDMgNC45MTcgM2gxMXYxM2gtMjB2LTE2aDQuMDgzem0uOTE3LTJoLTd2MjBoMjR2LTE3aC0xM2MtMS42MjkgMC0yLjMwNS0xLjA1OC00LTN6Ii8+PC9zdmc+" />
                            Folder
                        </MenuIconContainer>
                    </Item>
                    <Item onSelect={()=>openModal('screenplay')}>
                        <MenuIconContainer>
                            <DocIcon alt='' src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMjEuMTU1IDguNjRjLS45MDkgMS41MTktMi4zMjcgMy4wNjctNC4wOTcgMy4wMDQtLjQxMy43MDYtLjg1MiAxLjY3Ny0xLjMzOSAyLjgwM2wtMS4zMTIuNTUzYy45MzYtMi4zNDMgMi4yMzEtNC45NjEgMy42OTgtNi45OTQtLjY3LjUyOS0xLjc0NiAxLjYzNy0yLjY2MiAyLjc4My0xLjA5OC0xLjgyOC0uMy0zLjY5MS45NzMtNS4xNzkuMDIxLjY0MS4zNTkgMS4xOTYuNjAxIDEuNDc1LS4wODctLjUzLS4xMTQtMS40ODkuMTk1LTIuMzUxLjcxOC0uNzMyIDEuMzY0LTEuMjcxIDIuMTEzLTEuNzYtLjA4My40NzguMDggMS4wMjYuMjYyIDEuMzYxLjAyNC0uNDkuMjI0LTEuNDMuNTIxLTEuODQuOTI0LS43MjcgMi4zMzItMS4zNzMgMy44OTItMS40OTUtLjA4MS45NzMtLjQzNiAyLjU3NS0xLjAyNCAzLjYwNC0uNTE1LjQwNC0xLjIyMS42OC0xLjc5MS44MzMuNDkzLjA4OSAxLjAzMS4wNzcgMS40OTQtLjAwMS0uMjY5Ljc0My0uNTUyIDEuNDI4LS45OTggMi4yNzYtLjY3OS40NjgtMS41NzguNzMyLTIuMjAzLjgyNS40Ni4xODcgMS4yNzIuMjQ1IDEuNjc3LjEwM3ptLTEzLjg0MSAzLjgwNWwuNjQ1Ljc4MSA0Ljc3My0yLjc5MS0uNjY4LS43NjgtNC43NSAyLjc3OHptNi45Ni0uMjM4bC0uNjY4LS43NjctNC44MDUgMi44MDguNjQ1Ljc4MSA0LjgyOC0yLjgyMnptNC42NzkuMDA3Yy0uNDIxLjIwMy0uODUxLjM0MS0xLjI4Ni4zOTgtLjEyLjIzMS0uMjQ2LjQ5NC0uMzc3Ljc3M2wuMjk4LjM0MmMuNjIzLjY5Mi40NTkgMS43MDQtLjM3NiAyLjIzOS0uNzczLjQ5Ny01LjM0MSAzLjM3Ni02LjM4NiA0LjAzNS0uMDc0LS43MjEtLjM1OC0xLjM5MS0uODI2LTEuOTQ4LS40NjktLjU1Ny02LjExNS03LjM3Ni03LjUyMy05LjE3OC0uNDY5LS42LS41NzUtMS4yNDUtLjI5NS0xLjgxNi4yNjgtLjU0OS44NDItLjkxOCAxLjQzLS45MTguOTE5IDAgMS40MDguNjU1IDEuNTQ5IDEuMjE1LjE2LjY0MS0uMDM1IDEuMjMxLS42MjMgMS42ODVsMS4zMjkgMS42MjQgNy43OTYtNC40NDZjMS40MjItMS4wNTEgMS44MjItMi45OTEuOTMtNC41MTMtLjYxOC0xLjA1My0xLjc1OS0xLjcwNi0yLjk3OC0xLjcwNi0xLjE4OCAwLS43OTMtLjAxNi05LjU2NSA0LjQ3NS0xLjIzNC41OTEtMi4wNSAxLjc4Ny0yLjA1IDMuMjAyIDAgLjg3LjMwOCAxLjc1Ni44ODkgMi40ODcgMS40MjcgMS43OTQgNy41NjEgOS4xODUgNy42MTYgOS4yNTcuMzcxLjQ5My40MjcgMS4xMTkuMTUgMS42NzMtLjI3Ny41NTUtLjgxMi44ODYtMS40MjkuODg2LS45MTkgMC0xLjQwOC0uNjU1LTEuNTQ5LTEuMjE2LS4xNTYtLjYyOS4wMTItMS4yMDguNjA0LTEuNjU0bC0xLjI3Ny0xLjU0NWMtLjgyMi42NjUtMS4yNzcgMS40OTYtMS4zNzcgMi40NDItLjIzMiAyLjIwNSAxLjUyNSAzLjk5MyAzLjYxMyAzLjk5My41OTYgMCAxLjMxMS0uMTc3IDEuODQxLS41MWw5LjQyNy01Ljk0NmMuOTU3LS42NjQgMS40OTItMS43ODEgMS40OTItMi44OTcgMC0uNzQ1LS4yNC0xLjQ1NC0uNjg4LTIuMDAzbC0uMzU5LS40M3ptLTcuOTMzLTEwLjA2MmMuMTg4LS4wODcuMzk4LS4xMzQuNjA5LS4xMzQuNTMyIDAgLjk5Ny4yODEgMS4yNDMuNzUyLjMxMi41OTYuMjI2IDEuNDY5LS41NDggMS45MTJsLTUuMDk3IDIuODg4Yy0uMDUxLTEuMDg5LS41NzktMi4wODEtMS40NTUtMi43MzJsNS4yNDgtMi42ODZ6bTIuMDk3IDEzLjM4M2wuMzYxLS45MDUuMjQ5LS42MDktMy40NDkgMi4wMTcuNjQ1Ljc4MSAyLjE5NC0xLjI4NHoiLz48L3N2Zz4=" />
                            Screenplay
                        </MenuIconContainer>
                    </Item>
                    <Item onSelect={()=>openModal('outline')}>
                    <MenuIconContainer>
                        <DocIcon alt='' src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNNCAyMnYtMjBoMTZ2MTEuNTQzYzAgNC4xMDctNiAyLjQ1Ny02IDIuNDU3czEuNTE4IDYtMi42MzggNmgtNy4zNjJ6bTE4LTcuNjE0di0xNC4zODZoLTIwdjI0aDEwLjE4OWMzLjE2MyAwIDkuODExLTcuMjIzIDkuODExLTkuNjE0em0tNS0xLjM4NmgtMTB2LTFoMTB2MXptMC00aC0xMHYxaDEwdi0xem0wLTNoLTEwdjFoMTB2LTF6Ii8+PC9zdmc+" />
                        Outline
                    </MenuIconContainer>
                    </Item>
                    <Item onSelect={()=>openModal('notes')}>
                    <MenuIconContainer>
                        <DocIcon alt='' src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNNCA0djIwaDIwdi0yMGgtMjB6bTE4IDE4aC0xNnYtMTNoMTZ2MTN6bS0zLTNoLTEwdi0xaDEwdjF6bTAtM2gtMTB2LTFoMTB2MXptMC0zaC0xMHYtMWgxMHYxem0yLTExaC0xOXYxOWgtMnYtMjFoMjF2MnoiLz48L3N2Zz4=" />
                        Notes
                    </MenuIconContainer>
                    </Item>
                </List>
            </Menu>
            <ProjectsTable projectSelectedData={projectSelectedData} setProjectSelectedData={setProjectSelectedData} />
        </Container>
    )
}

const mapStateToProps = state => ({
    userData: state.app.userData,
    projects: state.dashboard.projects
})

export default connect(mapStateToProps)(AllFiles)

const Container = styled.div`
    width: 75vw;
`

const Plus = styled.span`
    font-size: 1.75rem;
    margin-right: 5px;
`

const Item = styled(MenuItem)`
    font-size: 1rem;
`

const MenuIconContainer = styled.div`
    display: flex;
`

const DocIcon = styled.img`
    height: 20px;
    width: 20px;
    margin-right: 10px;
`

const CreateNew = styled(MenuButton)`
    background-color: black;
    color: white;
    padding: 8px 15px;
    border-radius: 10px;
    margin: 0px 0 20px 0;
    display: flex;
    align-items: center;
    font-size: .875rem;
`

const List = styled(MenuList)`
    min-width: 100px;
`