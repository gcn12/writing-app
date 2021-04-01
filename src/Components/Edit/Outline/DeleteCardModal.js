import styled from 'styled-components'
import { connect } from 'react-redux'
import { db } from '../../../firebase'
import { outlineItemsDisplay, outlineItemsForUpdate } from '../../../redux/actions/appActions'
import { updateLastModified } from '../../../globalFunctions'

const DeleteCardModal = (props) => {

    const deleteCard = () => {
        let newOutline = [...props.outlineItemsForUpdate]
        newOutline.splice(props.cardIndex, 1)
        const outlineNewIndexes = newOutline.map((card, index)=> {
            return {...card, index}
        })
        props.dispatch(outlineItemsForUpdate(outlineNewIndexes))
        props.dispatch(outlineItemsDisplay(outlineNewIndexes))

        const dataIndexArray = []
        for(let i = 0; i<props.itemIndexes.length - 1; i++) {
            dataIndexArray.push(String(i))
        }
        props.setItemIndexes(dataIndexArray)

        db.collection('users')
        .doc(props.userData.userID)
        .collection('files')
        .doc(props.match.params.fileID)
        .update({
            data: outlineNewIndexes,
        })
        .then(()=> {
            props.setShowDeleteModal(false)
        })
        .catch(err=>{
            console.log(err)
        })

        updateLastModified(props.userData.userID, String(props.outlineData.docID), props.match.params.fileID)
    }

    return(
        <Container>
            <Background onClick={()=>props.setShowDeleteModal(false)}></Background>
            <Modal>
                <Header>Delete card</Header>
                <p>Are you sure you want to delete this card?</p>
                <div>
                    <Cancel onClick={()=>props.setShowDeleteModal(false)}>Cancel</Cancel>
                    <Delete onClick={deleteCard}>Delete</Delete>
                </div>
            </Modal>
        </Container>
    )
}


const mapStateToProps = state => ({
    userData: state.app.userData,
    outlineData: state.app.outlineData,
    currentFileID: state.app.currentFileID,
    outlineItemsForUpdate: state.app.outlineItemsForUpdate,
    outlineItemsDisplay: state.app.outlineItemsDisplay,
})

export default connect(mapStateToProps)(DeleteCardModal)

const Header = styled.h1`
    font-size: 1.75rem;
`

const Cancel = styled.button`
    height: 50px;
    width: 100px;
    margin: 10px;
    
`

const Delete = styled.button`
    margin: 10px;
    background-color: hsl(0, 60%, 50%);
    height: 50px;
    width: 100px;
    color: white;
`


const Modal = styled.div`
    z-index: 100;
    display: grid;
    /* flex-direction: column; */
    align-items: center;
    justify-content: center;
    width: 600px;
    min-height: 300px;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    isolation: isolate;
    padding: 15px;
    border-radius: 10px;
`

const Background = styled.div`
    z-index: 100;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, .5);
`

const Container = styled.div`
`