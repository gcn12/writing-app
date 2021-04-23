import LandingPage from './LandingPage/LandingPage'
import Dashboard from './Dashboard/Dashboard'
import { connect } from 'react-redux'
import { Route } from 'react-router-dom'

const Homepage = (props) => {
    return(
        props.userData.userID ? 
        <Route path='/writing-app/:page?' render={(props)=> (
            <Dashboard {...props} />
          )} />
        :
        <LandingPage setIsLoading={props.setIsLoading} />
    )
}

const mapStateToProps = state => ({
    userData: state.app.userData
})

export default connect(mapStateToProps)(Homepage)