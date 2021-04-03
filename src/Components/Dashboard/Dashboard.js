// import Projects from './FilesList/Projects'
import styled from 'styled-components'
import FilesList from './FilesList/FilesList'
import Sidebar from './Sidebar/Sidebar'
import { connect } from 'react-redux'
import Breadcrumbs from './Breadcrumbs'
const Dashboard = () => {
    return(
        <Container>
            <Sidebar />
            <FilesContainer>
                <Breadcrumbs />
                <FilesList />
            </FilesContainer>
        </Container>
    )
}

const mapStateToProps = state => ({
    showProjects: state.dashboard.showProjects,
})

export default connect(mapStateToProps)(Dashboard)

export const FilesContainer = styled.div`
    padding: 0 10px 0 50px;
`

export const Container = styled.div`
    /* width: 100vw;  */
    display: flex;
`