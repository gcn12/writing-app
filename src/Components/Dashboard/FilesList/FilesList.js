import { db } from '../../../firebase'
import { useEffect } from 'react'
import AllFiles from './AllFiles'
import { connect } from 'react-redux'

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
        })
    }

    return(
        <div>
            <AllFiles />
        </div>
    )
}

const mapStateToProps = state => ({
    userData: state.app.userData,
    showProjects: state.dashboard.showProjects,
})

export default connect(mapStateToProps)(FilesList)