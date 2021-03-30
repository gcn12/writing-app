// import Projects from './FilesList/Projects'
import FilesList from './FilesList/FilesList'
import Sidebar from './Sidebar/Sidebar'
import { connect } from 'react-redux'
const Dashboard = (props) => {

    return(
        <div style={{display: 'flex'}}>
            <Sidebar />
            <FilesList />
        </div>
    )
}

const mapStateToProps = state => ({
    showProjects: state.dashboard.showProjects,
})

export default connect(mapStateToProps)(Dashboard)