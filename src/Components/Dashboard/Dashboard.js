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
            
            {/* <EmptySidebar /> */}
            <Sidebar match={props.match} />
            <FilesContainer>
                <Route exact path='/writing-app/dashboard' render={(props)=> (
                    <FileContainer>
                        <Breadcrumbs />
                        <AllFiles {...props} />
                    </FileContainer>
                )} />
                <Route exact path='/writing-app/dashboard/goals' render={(props)=> (
                    <ToDo {...props} />
                )} />
                <Route exact path='/writing-app/dashboard/settings' render={(props)=> (
                    <Settings {...props} />
                )} />
                <Route exact path='/writing-app/dashboard/themes' render={(props)=> (
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
    /* height: 100vh; */
    height: calc(100% - 80px);
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    @media(max-width: 800px) {
        margin-top: 80px;
    }
    @media(max-width: 500px) {
        padding: 0 15px;
    }
`

// const EmptySidebar = styled.div`
//     width: 18%;
//     flex-grow: 1;
//     padding: 0 20px;
//     background-color: transparent;
//     height: 100%;
//     min-width: 200px;
//     @media(max-width: 800px) {
//         display: none;
//     }
// `

export const FilesContainer = styled.div`
    height: 100%;
    width: 100%;
    margin-left: max(18%, 200px);
    /* display: flex;
    justify-content: flex-end; */

    @media(max-width: 800px) {
        margin-left: 0;
        padding-left: 0;
    } 
    margin-bottom: 250px;
`

export const Container = styled.div`
    width: 100%;
    height: 100%;
    @media(min-width: 800px) {
        display: flex;
    } 
`