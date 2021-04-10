import styled from 'styled-components'
import { connect } from 'react-redux'
import { useEffect } from 'react'
import { db } from '../../../firebase'
import EditorInterface from './Editor'

const Screenplay = (props) => {

    useEffect(()=> {
        db.collection('users')
        .doc(props.userData.userID)
        .collection('files')
        .doc(props.match.params.fileID)
        .get()
        .then(data=> {
            // document.getElementById('content').value = data.data().text
        })
        // eslint-disable-next-line
    }, [])

    const saveData = () => {
        const text = document.getElementById('content').value
        db.collection('users')
        .doc(props.userData.userID)
        .collection('files')
        .doc(props.match.params.fileID)
        .update({
            text
        })
        .catch(err=>console.log(err))
    }

    return(
        <Container>
            <button onClick={saveData}>Save</button>
            <EditorInterface />
        </Container>
    )
}

const mapStateToProps = state => ({
    userData: state.app.userData,
})

export default connect(mapStateToProps)(Screenplay)

export const Container = styled.div`
`