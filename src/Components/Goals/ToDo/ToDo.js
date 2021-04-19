import { db } from '../../../firebase'
import { useState, useEffect } from 'react'
import GoalCard from './GoalCard'
import firebase from 'firebase'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { tasks } from '../../../redux/actions/appActions'

const ToDo = (props) => {
    const [newTask, setNewTask] = useState('')

    useEffect(()=> {
        if(props.tasks.length === 0) {
            getToDoItems()
        }
        // eslint-disable-next-line 
    }, [])

    const getToDoItems = () => {
        db.collection('users')
        .doc(props.userData.userID)
        .collection('goals')
        .doc('todo')
        .get()
        .then(data=> {
            props.dispatch(tasks(data.data().todo.reverse()))
        })
    }

    const createTask = (task) => {
        if(task.length > 0) {
            const toUpload = {
                goal: task,
                isCompleted: false,
            }
            const tasksCopy = [...props.tasks]
            tasksCopy.unshift(toUpload)
            props.dispatch(tasks(tasksCopy))
            db.collection('users')
            .doc(props.userData.userID)
            .collection('goals')
            .doc('todo')
            .update({
                todo: firebase.firestore.FieldValue.arrayUnion(toUpload)
            })
            .catch(err=>console.log(err))
            document.getElementById('todo-input').value = ''
        }
    }

    const deleteTask = (toDelete, index) => {
        const tasksCopy = [...props.tasks]
        tasksCopy.splice(index, 1)
        props.dispatch(tasks(tasksCopy))
        db.collection('users')
        .doc(props.userData.userID)
        .collection('goals')
        .doc('todo')
        .update({
            todo: firebase.firestore.FieldValue.arrayRemove(toDelete)
        })
        .catch(err=>console.log(err))
    }

    const onEnter = (e, task) => {
        if(e.key==='Enter') createTask(task)
    }
    
    return(
        <Container>
            <Title>Current tasks</Title>
            <CreateTaskContainer>
                <TaskInput placeholder='Add a new task' autoComplete='off' onKeyDown={(e)=>onEnter(e, newTask)} id='todo-input' onChange={(e)=>setNewTask(e.target.value)} />
                <CreateTask onClick={()=>createTask(newTask)}>Create task</CreateTask>
            </CreateTaskContainer>
            <CardContainer>
                {props.tasks.map((task, index) => {
                    return(
                        <GoalCard deleteTask={deleteTask} index={index} task={task} key={index} />
                    )
                })}
            </CardContainer>
        </Container>
    )
}

const mapStateToProps = state => ({
    userData: state.app.userData,
    tasks: state.app.tasks,
})

export default connect(mapStateToProps)(ToDo)

const CreateTaskContainer = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 25px;
`

const CreateTask = styled.button`
    border-right: 1px solid var(--primary-text);
    border-top: 1px solid var(--primary-text);
    border-bottom: 1px solid var(--primary-text);
    height: 40px;
    padding: 0 10px;
    background-color: var(--primary-text);
    color: var(--sidebar);
`

const TaskInput = styled.input`
    width: 50vw;
    height: 40px;
    background-color: var(--background);
    border: none;
    border: 1px solid var(--primary-text);
    color: var(--primary-text);
    font-size: 20px;
    margin-right: 20px;
`

const Title = styled.h1`
    font-size: 2.5rem;
    font-weight: 600;
    margin-bottom: 25px;
    @media(max-width: 750px) { 
        margin-top: 20px;
    }
`

const Container = styled.div`
    width: 100%;
    /* height: 100vh; */
    min-height: 100%;
    --webkit-overflow-scrolling: touch;
    padding: 60px 30px 0px 30px;
    overflow: scroll;
    @media(max-width: 750px) { 
        padding: 0px 30px;
    } 
`

const CardContainer = styled.div`
    display: grid;
    grid-gap: 20px;
    grid-template-columns: 1fr 1fr;
    /* margin-bottom: 200px; */
    padding-bottom: 100px;
    @media(max-width: 700px) {
        padding-bottom: 200px;
        grid-template-columns: 1fr;
    } 
`