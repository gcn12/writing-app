import styled from 'styled-components'
import CircleProgress from './CircleProgress'
import CirclePlaceholder from './CirclePlaceholder'
import { useState } from 'react'
import { connect } from 'react-redux'
import DailyGoalModal from './DailyGoalModal'

const DailyGoals = (props) => {
    const [showChangeGoal, setShowChangeGoal] = useState(false)
    return(
        <Container>
            {props.goals.goal - props.goals.wordsWritten <= 0 ?
            <Met><p>Goal</p><p>Achieved</p></Met>
            : 
            <div>
                <Goal>{props.goalIsVisible && props.goals.goal - props.goals.wordsWritten}</Goal>
                <Subtitle>{props.goals.goal - props.goals.wordsWritten === 1 ? 'word' :'words'} to go</Subtitle>
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
    goalIsVisible: state.app.goalIsVisible,
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
    font-size: 1.125rem;
    padding: 2px 0;
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
    border-radius: 10px;
    padding: 10px;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
`