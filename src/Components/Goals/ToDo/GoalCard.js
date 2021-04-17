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

` 

const Container = styled.div`
    height: 50px;
    min-width: 200px;
    width: 48%;
    background-color: var(--sidebar);
    padding: 50px 30px;
    border-radius: 5px;
    /* margin: 10px 0; */
    display: flex;
    justify-content: space-between;
    align-items: center;
`