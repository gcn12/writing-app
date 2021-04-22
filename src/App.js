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
import { Route, useHistory } from 'react-router-dom'
import { userData, colors } from './redux/actions/appActions'
import LandingPage from './Components/LandingPage/LandingPage'
import { db } from './firebase'

const App = (props) => {
  const [isLoading, setIsLoading] = useState(true)
  const history = useHistory()
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
          const colorsData = preferences.colors
          props.dispatch(colors(colorsData))
          setIsLoading(false)
        })
      }else{
        props.dispatch(colors({
          background: 'white'
        }))
        if(props.match.params.page!==undefined 
          && props.match.params.page!=='signup' 
          && props.match.params.page!=='signin') {
          history.push('/writing-app')
        }else{
          setIsLoading(false)
        }
      }
    });
    // eslint-disable-next-line
  }, [])
  return (
    isLoading ? 
    null
    :
    <div style={{height: '100%'}}>
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
      <GlobalStyles isDashboard={props.match.params.page==='dashboard'} />

      <Route exact path='/writing-app/' render={(props)=> (
        <LandingPage setIsLoading={setIsLoading} {...props} />
      )} />
    </div>
  );
}

const mapStateToProps = state => ({
  userData: state.app.userData
})

export default connect(mapStateToProps)(App);