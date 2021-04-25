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
            <Sidebar match={props.match} />
            <FilesContainer>
                <Route exact path='/writing-app/' render={(props)=> (
                    <FileContainer>
                        <Breadcrumbs />
                        <AllFiles {...props} />
                    </FileContainer>
                )} />
                <Route exact path='/writing-app/goals' render={(props)=> (
                    <ToDo {...props} />
                )} />
                <Route exact path='/writing-app/settings' render={(props)=> (
                    <Settings {...props} />
                )} />
                <Route exact path='/writing-app/themes' render={(props)=> (
                    <ChangeColors {...props} />
                )} />
            </FilesContainer>
            <MobileHeader />
        </Container>
    )
}

const mapStateToProps = state => ({
    showProjects: state.dashboard.showProjects,
})

export default connect(mapStateToProps)(Dashboard)

const FileContainer = styled.div`
    padding: 0 30px;
    height: 100%;
    overflow-y: scroll;
    @media(max-width: 800px) {
        height: calc(100% - 80px);
        margin-top: 80px;
    }
    @media(max-width: 500px) {
        padding: 0 15px;
    }
`

export const FilesContainer = styled.div`
    height: 100%;
    width: 100%;
    /* margin-left: max(18%, 200px); */
    margin-left: 250px;
    margin-bottom: 250px;
    @media(max-width: 800px) {
        margin-left: 0;
        padding-left: 0;
    } 
`

export const Container = styled.div`
    width: 100%;
    height: 100%;
    @media(min-width: 800px) {
        display: flex;
    } 
`