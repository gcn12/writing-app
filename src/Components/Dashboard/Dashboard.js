// import Projects from './FilesList/Projects'
import styled from 'styled-components'
import { Route } from 'react-router-dom'
import FilesList from './FilesList/FilesList'
import Sidebar from './Sidebar/Sidebar'
import Goals from '../Goals/Goals'
import ChangeColors from '../Settings/ChangeColors/ChangeColors'
import Settings from '../Settings/Settings'
import { connect } from 'react-redux'
import Breadcrumbs from './Breadcrumbs'
const Dashboard = (props) => {
    return(
        <Container>
            <Sidebar match={props.match} />
            <FilesContainer>
                <Route exact path='/writing-app/dashboard' render={(props)=> (
                    <div>
                        <Breadcrumbs />
                        <FilesList {...props} />
                    </div>
                )} />
                <Route exact path='/writing-app/dashboard/goals' render={(props)=> (
                    <Goals {...props} />
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

export const FilesContainer = styled.div`
    padding: 0 10px 0 50px;
    margin-left: 18%;
    overflow: scroll;
    height: 100vh;
    width: 100%;
`

export const Container = styled.div`
    /* width: 100vw;  */
    display: flex;
`