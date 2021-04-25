import { useEffect, useState } from 'react'
import Signup from './Components/Signup/Signup'
import Signin from './Components/Signup/Signin'
import Outline from './Components/Edit/Outline/Outline'
import Screenplay from './Components/Edit/Screenplay/Screenplay'
import firebase from 'firebase'
import Notes from './Components/Edit/Notes/Notes'
import { connect } from 'react-redux'
import GlobalStyles from './GlobalStyles'
import { Route, useHistory, Switch } from 'react-router-dom'
import { userData, colors } from './redux/actions/appActions'
import Homepage from './Components/Homepage'
import moment from 'moment'
import { goals, goalIsVisible } from './redux/actions/appActions'
import { db } from './firebase'

const App = (props) => {
  const [isLoading, setIsLoading] = useState(true)
  const history = useHistory()
  useEffect(()=> {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        console.log('logged in')
        props.dispatch(userData({ userID: user.uid }))
        getGoalData(user.uid)
        db.collection('users')
        .doc(user.uid)
        .get()
        .then(data=> {
          if(data.data().preferences) {
            const preferences = data.data().preferences
            const colorsData = preferences.colors
            props.dispatch(colors(colorsData))
          }
          if(props.match.params.page==='signup' 
            || props.match.params.page==='signin') {
            history.push('/writing-app')
          }
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

  useEffect(()=> {
    if(props.userData.userID.length > 0) {
      const unsubscribe = goalListener()
      return ()=> unsubscribe()
    }
    // eslint-disable-next-line
  }, [props.userData.userID])

  const goalListener = () => {
    return db.collection('users')
    .doc(props.userData.userID)
    .collection('goals')
    .doc('daily-goal')
    .onSnapshot((doc)=> {
      const currentDate = moment().format('L')
      let goalsObject
      if(doc.exists) {
        goalsObject = doc.data()
      }else {
        goalsObject = {
          goal: 100,
          wordsWritten: {
            words: 0,
            date: currentDate,
          }
        }
      }
      props.dispatch(goals({
        goal: goalsObject.goal,
        wordsWritten: goalsObject.wordsWritten.words
      }))
    }) 
  }

  const getGoalData = (userID) => {
    db.collection('users')
    .doc(userID)
    .collection('goals')
    .doc('daily-goal')
    .get()
    .then(data=> {
      const currentDate = moment().format('L')
      let goalsObject
      if(data.exists) {
        goalsObject = data.data()
      }else {
        goalsObject = {
          goal: 100,
          wordsWritten: {
            words: 0,
            date: currentDate,
          }
        }
      }
      let date
      if(goalsObject !== undefined) {
        date = goalsObject.wordsWritten.date
      }else{
        date = currentDate
      }
      if(date === currentDate) {
        props.dispatch(goals({
          goal: goalsObject.goal,
          wordsWritten: goalsObject.wordsWritten.words
        }))
      }else{
        props.dispatch(goals({
          goal: goalsObject.goal,
          wordsWritten: 0
        }))
        db.collection('users')
        .doc(userID)
        .collection('goals')
        .doc('daily-goal')
        .update({
          wordsWritten: {
            date: currentDate,
            words: 0,
          }
        })
      }
      props.dispatch(goalIsVisible(true))
    })
  }

  return (
    isLoading ? 
    null
    :
    <div style={{height: '100%'}}>
      <Switch>
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
        <Route path='/writing-app' render={(props)=> (
          <Homepage setIsLoading={setIsLoading} {...props} />
          )} />
      </Switch>
      <GlobalStyles page={props.match.params.page} userID={props.userData.userID} />
    </div>
  );
}

const mapStateToProps = state => ({
  userData: state.app.userData
})

export default connect(mapStateToProps)(App);