import { db } from '../../../firebase'
import { useState, useEffect } from 'react'
import GoalCard from './GoalCard'
import firebase from 'firebase/app'
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
            <Background>
                <AddTask htmlFor='todo-input'>Add a task:</AddTask>
                <CreateTaskContainer>
                    <TaskInput autoComplete='off' onKeyDown={(e)=>onEnter(e, newTask)} id='todo-input' onChange={(e)=>setNewTask(e.target.value)} />
                    <CreateTask onClick={()=>createTask(newTask)}>Create task</CreateTask>
                </CreateTaskContainer>
            </Background>
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

const Background = styled.div`
    background-color: var(--sidebar);
    padding: 40px; 
    border-radius: 10px;
    margin-bottom: 20px;
`

const AddTask = styled.label`
    font-size: 1.125rem;
    font-weight: 600;
`

const CreateTaskContainer = styled.div`
    display: flex;
    align-items: center;
    margin: 10px 0;
`

const CreateTask = styled.button`
    border-right: 1px solid var(--primary-text);
    border-top: 1px solid var(--primary-text);
    border-bottom: 1px solid var(--primary-text);
    height: 40px;
    padding: 10px 30px;
    background-color: var(--primary-text);
    color: var(--sidebar);
    white-space: nowrap;
`

const TaskInput = styled.input`
    width: 50vw;
    min-height: 40px;
    background-color: var(--background);
    border: none;
    color: var(--primary-text);
    font-size: 1.25rem;
    margin-right: 10px;
    padding-left: 5px;
`

const Title = styled.h1`
    margin-top: 40px;
    font-size: 2.25rem;
    font-weight: 600;
    margin-bottom: 25px;
    @media(max-width: 750px) { 
        margin-top: 20px;
    }
`

const Container = styled.div`
    width: 100%;
    height: 100%;
    padding: 0 30px;
    overflow: scroll;
    @media(max-width: 800px) { 
        height: calc(100% - 80px);
        padding: 0px 15px;
        margin-top: 80px;
    } 
`

const CardContainer = styled.div`
    display: grid;
    grid-gap: 20px;
    grid-template-columns: 1fr 1fr;
    padding-bottom: 40px;
    @media(max-width: 700px) {
        grid-template-columns: 1fr;
    } 
`