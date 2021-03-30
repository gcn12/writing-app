import { useEffect } from 'react'
// import Signup from './Components/Signup/Signup'
// import Signin from './Components/Signup/Signin'
import Dashbaord from './Components/Dashboard/Dashboard'
// import Outline from './Components/Edit/Outline/OutlineDNDTest'
import Outline from './Components/Edit/Outline/Outline'
import firebase from 'firebase'
import Notes from './Components/Edit/Notes'
import { connect } from 'react-redux'
// import Outline from './Components/Edit/Outline/OutlineDND'
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
      <Route path='/edit/outline/:fileID' render={(props)=> (
        <Outline {...props} />
        // <OutlineDND {...props} />
      )} />
      <Route path='/edit/notes/:fileID' render={(props)=> (
        <Notes {...props} />
      )} />
      <Route exact path='/' render={(props)=> (
        <Dashbaord {...props} />
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