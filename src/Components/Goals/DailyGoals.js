import styled from 'styled-components'
import CircleProgress from './CircleProgress'
import CirclePlaceholder from './CirclePlaceholder'
import { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { db } from '../../firebase'
import { goals } from '../../redux/actions/appActions'
import DailyGoalModal from './DailyGoalModal'

const DailyGoals = (props) => {

    const [isVisible, setIsVisible] = useState(false)
    const [showChangeGoal, setShowChangeGoal] = useState(false)
    // const [progress, setProgress] = useState(0)

    useEffect(()=> {
        getData()
        goalListener()
        // eslint-disable-next-line
    }, [])

    useEffect(()=> {
        // const { goal, wordsWritten } = props.goals
        // if(wordsWritten===0) return setProgress(0)
        // const progressAmount = wordsWritten / goal * 100
        // setProgress(progressAmount)
    }, [props.goals])

    const getData = () => {
        db.collection('users')
        .doc(props.userData.userID)
        .collection('goals')
        .doc('daily-goal')
        .get()
        .then(data=> {
            const goalsObject = data.data()
            const date = goalsObject.wordsWritten.date
            const currentDate = moment().format('L')
            if(date === moment().format('L')) {
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
                .doc(props.userData.userID)
                .collection('goals')
                .doc('daily-goal')
                .update({
                    wordsWritten: {
                        date: currentDate,
                        words: 0,
                    }
                })
            }
            setIsVisible(true)
        })
    }

    const goalListener = () => {
        db.collection('users')
        .doc(props.userData.userID)
        .collection('goals')
        .doc('daily-goal')
        .onSnapshot((doc)=> {
            const goalsObject = doc.data()
            props.dispatch(goals({
                goal: goalsObject.goal,
                wordsWritten: goalsObject.wordsWritten.words
            }))
        })
    }

    

    return(
        // isVisible &&
        <Container>
            {/* <Title>Daily goal</Title> */}
            {props.goals.goal - props.goals.wordsWritten <= 0 ?
            <Met>Goal Achieved</Met>
            : 
            <div>
                <Goal>{isVisible && props.goals.goal - props.goals.wordsWritten}</Goal>
                <Subtitle>words to go</Subtitle>
            </div>
            }
            <SetGoal onClick={()=>setShowChangeGoal(true)}>Set daily goal</SetGoal>
            <CircleContainer>
                {props.goals.wordsWritten / props.goals.goal * 100 > 100 ?
                <CircleProgress progress={100} />
                :
                <CircleProgress progress={props.goals.wordsWritten / props.goals.goal * 100} />
                }
            </CircleContainer>
            <CirclePlaceholderContainer>
                <CirclePlaceholder />
            </CirclePlaceholderContainer>
            <DailyGoalModal setShowChangeGoal={setShowChangeGoal} showChangeGoal={showChangeGoal} />
        </Container>
    )
}

const mapStateToProps = state => ({
    userData: state.app.userData,
    goals: state.app.goals,
})

export default connect(mapStateToProps)(DailyGoals)

const Met = styled.h2`
    font-size: 1.25rem;
    text-align: center;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
`

const Subtitle = styled.h2`
    white-space: nowrap;
    font-size: 1rem;
    font-weight: 500;
    position: absolute;
    top: 55%;
    left: 50%;
    transform: translate(-50%, -50%);
`

const Goal = styled.h2`
    font-size: 1.5rem;
    font-weight: 700;
    position: absolute;
    top: 45%;
    left: 50%;
    transform: translate(-50%, -50%);
`

const SetGoal = styled.button`
    position: absolute;
    bottom: 0;
`

const CircleContainer = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
`

const CirclePlaceholderContainer = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: .2;
`

const Container = styled.article`
    min-height: 200px;
    width: 100%;
    margin: 80px 0;
    border-radius: 10px;
    padding: 10px;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
`