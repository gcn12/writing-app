import styled from 'styled-components'
import GoalCard from './GoalCard'

const CardComponent = (props) => {
    return(
        <CardContainer>
            {props.tasks.map((task, index) => {
                return(
                    <GoalCard deleteTask={props.deleteTask} index={index} task={task} key={index} />
                )
            })}
        </CardContainer>
    )
}

export default CardComponent

const CardContainer = styled.div`
    display: grid;
    grid-gap: 20px;
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    padding-bottom: 40px;
    @media(max-width: 700px) {
        grid-template-columns: 1fr;
    } 
`