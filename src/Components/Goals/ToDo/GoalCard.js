import styled from 'styled-components'

const GoalCard = (props) => {
    return(
        <Container>
            <Goal>{props.task.goal}</Goal>
            <Delete aria-label='delete task' onClick={()=>props.deleteTask(props.task, props.index)}>X</Delete>
        </Container>
    )
}

export default GoalCard

const Delete = styled.button`
    padding: 5px;
    margin-left: 10px;
`

const Goal = styled.h1`
    line-height: 1.2;
` 

const Container = styled.div`
    min-height: 50px;
    min-width: 200px;
    /* width: 48%; */
    width: 100%;
    background-color: var(--sidebar);
    padding: 40px 30px;
    border-radius: 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    /* margin: 0px 20px 10px 0px; */
    /* gap: 15px; */
    @media(max-width: 550px) {
        width: 100%;
    }
`