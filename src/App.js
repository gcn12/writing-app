import { useEffect, useState } from 'react'
import Signup from './Components/Signup/Signup'
import Signin from './Components/Signup/Signin'
import Outline from './Components/Edit/Outline/Outline'
import Screenplay from './Components/Edit/Screenplay/Screenplay'
import firebase from 'firebase/app'
import styled from 'styled-components'
import LoadingScreen from './LoadingScreen'
import 'firebase/auth'
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
  const [isLoggedIn, setIsLoggedIn] = useState(true)
  const history = useHistory()

  useEffect(()=> {
    if(props.userData.userID.length > 0) {
      const unsubscribe = goalListener()
      return ()=> unsubscribe()
    }
    // eslint-disable-next-line
  }, [props.userData.userID])

  useEffect(()=> {
    checkAuthentication()
    // eslint-disable-next-line
  }, [])

  const getUserData = (user) => {
    return db.collection('users')
    .doc(user.uid)
    .get()
  }

  const sendPreferencesToState = (data) => {
    const preferences = data.data().preferences
    const colorsData = preferences.colors
    props.dispatch(colors(colorsData))
  }

  const handleAuthenticatedUser = (user) => {
    props.dispatch(userData({ userID: user.uid }))
    getGoalData(user.uid)
    getUserData(user)
    .then(data=> {
      sendPreferencesToState(data)
      if(props.match.params.page==='signup' 
      || props.match.params.page==='signin') {
        history.push('/writing-app')
      }
      if(props.match.params.page==='edit') {
        setIsLoggedIn(false)
        setIsLoading(false)
      }else {
        setTimeout(()=>setIsLoggedIn(false), 400)
        setIsLoading(false)
      }
    })
  }

  const handleUnauthenticatedUser = () => {
    setIsLoggedIn(false)
    if(props.match.params.page!==undefined 
      && props.match.params.page!=='signup' 
      && props.match.params.page!=='signin') {
      history.push('/writing-app')
    }
    setIsLoading(false)
  }
 
  const checkAuthentication = () => {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        return handleAuthenticatedUser(user)
      }
      return handleUnauthenticatedUser()
    })
  }

  const updateGoalsAfterListen = (data) => {
    const currentDate = moment().format('L')
    const goalsObject = createGoalsObject(data, currentDate)
    updateGoalsInState(goalsObject)
  }

  const createGoalsObject = (data, currentDate) => {
    if(data.exists) return data.data()
    return {
      goal: 100,
      wordsWritten: {
        words: 0,
        date: currentDate,
      }
    }
  }

  const goalListener = () => {
    return db.collection('users')
    .doc(props.userData.userID)
    .collection('goals')
    .doc('daily-goal')
    .onSnapshot((data)=> {
      updateGoalsAfterListen(data)
    }) 
  }

  const updateGoalsInState = (goalsObject) => {
    props.dispatch(goals({
      goal: goalsObject.goal,
      wordsWritten: goalsObject.wordsWritten.words
    }))
  }

  const handleGoalData = (data, userID) => {
    const currentDate = moment().format('L')
    const goalsObject = createGoalsObject(data, currentDate)
    const date = goalsObject.wordsWritten.date
    if(date === currentDate) {
      updateGoalsInState(goalsObject)
    }else{
      resetDailyGoalDatabase(userID, currentDate)
      resetDailyGoalState(goalsObject)
    }
    props.dispatch(goalIsVisible(true))
  }

  const getGoalData = (userID) => {
    db.collection('users')
    .doc(userID)
    .collection('goals')
    .doc('daily-goal')
    .get()
    .then(data=> {
      handleGoalData(data, userID)
    })
  }

  const resetDailyGoalDatabase = (userID, currentDate) => {
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

  const resetDailyGoalState = (goalsObject) => {
    props.dispatch(goals({
      goal: goalsObject.goal,
      wordsWritten: 0
    }))
  }

  return (
    isLoading ? 
    null
    :
    (
    isLoggedIn ? 
    <Container>
      <LoadingScreen /> 
    </Container>
    :
    <Container>
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
    </Container>
    )
  );
}

const mapStateToProps = state => ({
  userData: state.app.userData
})

export default connect(mapStateToProps)(App);

const Container = styled.div`
  height: 100%;
`