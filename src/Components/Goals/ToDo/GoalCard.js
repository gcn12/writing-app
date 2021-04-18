import styled from 'styled-components'

const GoalCard = (props) => {
    return(
        <Container>
            <Goal>{props.task.goal}</Goal>
            <Delete onClick={()=>props.deleteTask(props.task, props.index)}>X</Delete>
        </Container>
    )
}

export default GoalCard

const Delete = styled.button`
`

const Goal = styled.h1`
    line-height: 1.2;
` 

const Container = styled.div`
    min-height: 50px;
    min-width: 200px;
    width: 48%;
    background-color: var(--sidebar);
    padding: 40px 30px;
    border-radius: 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 15px;
    @media(max-width: 550px) {
        width: 100%;
    }
`