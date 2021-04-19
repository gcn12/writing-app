// import Projects from './FilesList/Projects'
import styled from 'styled-components'
import { Route } from 'react-router-dom'
import AllFiles from './FilesList/AllFiles'
import Sidebar from './Sidebar/Sidebar'
// import Goals from '../Goals/Goals'
import ToDo from '../Goals/ToDo/ToDo'
import MobileHeader from './MobileHeader'
import ChangeColors from '../Settings/ChangeColors/ChangeColors'
import Settings from '../Settings/Settings'
import { connect } from 'react-redux'
import Breadcrumbs from './Breadcrumbs'

const Dashboard = (props) => {

    return(
        <Container>
            <MobileHeader  />
            <Sidebar match={props.match} />
            <FilesContainer>
                <Route exact path='/writing-app/dashboard' render={(props)=> (
                    <FileContainer>
                        <Breadcrumbs />
                        <AllFiles {...props} />
                    </FileContainer>
                )} />
                <Route exact path='/writing-app/dashboard/goals' render={(props)=> (
                    // <Goals {...props} />
                    <ToDo {...props} />
                )} />
                <Route exact path='/writing-app/dashboard/settings' render={(props)=> (
                    <Settings {...props} />
                )} />
                <Route exact path='/writing-app/dashboard/themes' render={(props)=> (
                    <ChangeColors {...props} />
                )} />
            </FilesContainer>
        </Container>
    )
}

const mapStateToProps = state => ({
    showProjects: state.dashboard.showProjects,
})

export default connect(mapStateToProps)(Dashboard)

const FileContainer = styled.div`
    padding: 0 30px;
    overflow: scroll;
    --webkit-overflow-scrolling: touch;
`

export const FilesContainer = styled.div`
    /* overflow-y: scroll;
    --webkit-overflow-scrolling: touch; */
    /* height: 100vh; */
    min-height: 100vh;
    width: 100%;
    display: flex;
    justify-content: center;
    @media(max-width: 800px) {
        margin-left: 0;
        /* padding: 0 20px; */
    }
    /* padding: 0 30px; */
`

export const Container = styled.div`
    height: 100%;
    @media(min-width: 800px) {
        display: flex;
    } 
`