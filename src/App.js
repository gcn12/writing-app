import { useEffect } from 'react'
// import Signup from './Components/Signup/Signup'
// import Signin from './Components/Signup/Signin'
import Dashboard from './Components/Dashboard/Dashboard'
import Outline from './Components/Edit/Outline/Outline'
// import ModalTest from './ModalTest'
import firebase from 'firebase'
import Notes from './Components/Edit/Notes'
import { connect } from 'react-redux'
import GlobalStyles from './GlobalStyles'
import { Route } from 'react-router-dom'
import { userData } from './redux/actions/appActions'

const App = (props) => {

  useEffect(()=> {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        const userInfo = {
          userID: user.uid, 
        }
        console.log('logged in')
        props.dispatch(userData(userInfo))
      }
    });
    // eslint-disable-next-line
  }, [])
  return (
    <div>
      {/* <ModalTest /> */}
      <Route path='/writing-app/edit/outline/:fileID' render={(props)=> (
        <Outline {...props} />
        // <OutlineDND {...props} />
      )} />
      <Route path='/writing-app/edit/notes/:fileID' render={(props)=> (
        <Notes {...props} />
      )} />
      <Route exact path='/writing-app' render={(props)=> (
        <Dashboard {...props} />
      )} />
      {/* <Signup /> */}
      {/* <Signin /> */}
      <GlobalStyles />
    </div>
  );
}

const mapStateToProps = state => ({
  userData: state.app.userData
})

export default connect(mapStateToProps)(App);