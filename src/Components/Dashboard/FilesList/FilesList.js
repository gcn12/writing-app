import { db } from '../../../firebase'
import { useEffect } from 'react'
import Files from './Files'
import Projects from './Projects'
import { connect } from 'react-redux'
import { projects } from '../../../redux/actions/dashboardActions'

const FilesList = (props) => {

    useEffect(()=> {
        getProjects()
        // eslint-disable-next-line
    }, [props.userData])

    const getProjects = () => {
        db.collection('users')
        .doc(props.userData.userID)
        .collection('projects')
        .get()
        .then(data=> {
            const projectArr = []
            data.forEach(project=> {
                projectArr.push(project.data())
            })
            props.dispatch(projects(projectArr))
        })
    }

    return(
        <div>
            {props.showProjects ? 
            <Projects />
            :
            <Files />
            }
        </div>
    )
}

const mapStateToProps = state => ({
    userData: state.app.userData,
    showProjects: state.dashboard.showProjects,
})

export default connect(mapStateToProps)(FilesList)