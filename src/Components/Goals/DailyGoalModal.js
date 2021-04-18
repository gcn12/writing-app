import styled from 'styled-components'
import { Dialog } from '@reach/dialog'
import '@reach/dialog/styles.css'
import { db } from '../../firebase'
import { connect } from 'react-redux'
import { useState } from 'react'
import { goals } from '../../redux/actions/appActions'


const DailyGoalModal = (props) => {

    const [goal, setGoal] = useState(null)
    
    const sendGoalToDatabase = (goal) => {
        db.collection('users')
        .doc(props.userData.userID)
        .collection('goals')
        .doc('daily-goal')
        .update({
            goal: Number(goal)
        })
        .catch(err=>console.log(err))
    }

    const updateGoal = (goal) => {
        if(goal > 0) {
            props.setShowChangeGoal(false)
            sendGoalToDatabase(goal)
            updateStateGoal(goal)
        }
    }

    const updateStateGoal = (goal) => {
        const goalsCopy = { ...props.goals }
        goalsCopy.goal = Number(goal)
        props.dispatch(goals(goalsCopy))
    }

    const onEnter = (e, goal) => {
        if(e.key==='Enter') {
            e.preventDefault()
            updateGoal(goal)
        }
    }

    return(
        <Modal aria-label='change daily goal' onDismiss={()=>props.setShowChangeGoal(false)} isOpen={props.showChangeGoal}>
            <TitleCloseContainer>
                <Title>Set new goal</Title>
                <Close onClick={()=>props.setShowChangeGoal(false)}>X</Close>
            </TitleCloseContainer>
            <GoalInput onKeyDown={(e)=>onEnter(e, goal)} defaultValue={props.goals.goal} onChange={(e)=>setGoal(e.target.value)} />
            <div>
                <Cancel onClick={()=>props.setShowChangeGoal(false)}>Cancel</Cancel>
                <Save onClick={()=>updateGoal(goal)}>Save goal</Save>
            </div>
        </Modal>
    )
}

const mapStateToProps = state => ({
    userData: state.app.userData,
    goals: state.app.goals,
})

export default connect(mapStateToProps)(DailyGoalModal)

const Close = styled.button`

`

const TitleCloseContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`

const Title = styled.h1`
    font-size: 1.25rem;
`

const GoalInput = styled.input`
    height: 40px;
    width: 220px;
    background-color: var(--secondary);
    border: none;
    outline: 1px solid var(--primary-text);
    color: var(--primary-text);
    font-size: 20px;
`

const Modal = styled(Dialog)`
    height: 300px;
    width: 500px;
    position: absolute;
    top: 35%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: var(--secondary);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
`

const Cancel = styled.button`
    height: 50px;
    width: 100px;
    margin: 10px; 
`

const Save = styled.button`
    margin: 10px;
    background-color: var(--primary-text);
    height: 50px;
    width: 120px;
    color: var(--sidebar);
`