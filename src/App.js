import { useEffect, useState } from 'react'
import Signup from './Components/Signup/Signup'
import Signin from './Components/Signup/Signin'
import Dashboard from './Components/Dashboard/Dashboard'
import Outline from './Components/Edit/Outline/Outline'
import Screenplay from './Components/Edit/Screenplay/Screenplay'
import firebase from 'firebase'
import Notes from './Components/Edit/Notes/Notes'
import { connect } from 'react-redux'
import GlobalStyles from './GlobalStyles'
import { Route } from 'react-router-dom'
import { userData, colorThemes } from './redux/actions/appActions'
import LandingPage from './Components/LandingPage/LandingPage'
import { db } from './firebase'

const App = (props) => {
  const [isLoading, setIsLoading] = useState(true)
  // const [colors, setColors] = useState({mainColor: 'red'})
  useEffect(()=> {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        const userInfo = {
          userID: user.uid, 
        }
        console.log('logged in')
        props.dispatch(userData(userInfo))
        db.collection('users')
        .doc(user.uid)
        .get()
        .then(data=> {
          const preferences = data.data().preferences
          const colors = preferences.colors
          props.dispatch(colorThemes(colors))
          setIsLoading(false)
        })
      }
    });
    // eslint-disable-next-line
  }, [])
  return (
    isLoading ? 
    null
    :
    (props.userData.userID ? 
    <div>
      <Route exact path='/writing-app/' render={(props)=> (
        <LandingPage {...props} />
      )} />
      <Route exact path='/writing-app/signup' render={(props)=> (
        <Signup {...props} />
      )} />
      <Route exact path='/writing-app/signin' render={(props)=> (
        <Signin {...props} />
      )} />
      <Route path='/writing-app/edit/outline/:fileID' render={(props)=> (
        <Outline {...props} />
      )} />
      <Route path='/writing-app/edit/notes/:fileID' render={(props)=> (
        <Notes {...props} />
      )} />
      <Route path='/writing-app/edit/screenplay/:fileID' render={(props)=> (
        <Screenplay {...props} />
      )} />
      <Route path='/writing-app/dashboard/:page?' render={(props)=> (
        <Dashboard {...props} />
      )} />
      <GlobalStyles />
    </div>
    :
    <div>
      <Signup />
      <Signin />
    </div>)
  );
}

const mapStateToProps = state => ({
  userData: state.app.userData
})

export default connect(mapStateToProps)(App);