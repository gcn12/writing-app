import { useEffect, useState } from 'react'
import { db } from '../../../firebase'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { updateLastModified } from '../../../globalFunctions'
import { outlineData, outlineItemsDisplay, outlineItemsForUpdate } from '../../../redux/actions/appActions'
import EditCardModal from './EditCardModal'
import DeleteCardModal from './DeleteCardModal'
import CreateCardModal from './CreateCardModal'
import Toolbar from './Toolbar'
import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';

import SortableItem from './SortableItem';

const Outline = (props) => {
    const [showEditModal, setShowEditModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [title, setTitle] = useState('')
    const [text, setText] = useState('')
    const [cardIndex, setCardIndex] = useState(null)
    const [itemIndexes, setItemIndexes] = useState([])
    const [savingStatus, setSavingStatus] = useState('All changes saved')
    const [cardsPerRow, setCardsPerRow] = useState(3)

    useEffect(()=> {
        getOutline()
        // eslint-disable-next-line
    }, [props.match])

    const getOutlineElements = () => {
        return db.collection('users')
        .doc(props.userData.userID)
        .collection('files')
        .doc(props.match.params.fileID)
        .get()
    }

    const createOutlineIndexes = (outlineItems) => {
        const dataIndexArray = []
        for(let i = 0; i<outlineItems.length; i++) {
            dataIndexArray.push(String(i))
        }
        setItemIndexes(dataIndexArray)
    }

    const getOutline = () => {
        getOutlineElements()
        .then((result)=> {
            if(!result.exists) return
            const outline = result.data()
            props.dispatch(outlineData(outline))
            document.title = outline.name
            setCardsPerRow(outline.cardsPerRow)
            const outlineItems = outline.text
            props.dispatch(outlineItemsDisplay(outlineItems))
            props.dispatch(outlineItemsForUpdate(outlineItems))
            createOutlineIndexes(outlineItems)
        })
    }

    const updateToDatabase = (updatedOutline) => {
        db.collection('users')
        .doc(props.userData.userID)
        .collection('files')
        .doc(props.match.params.fileID)
        .update({
            text: updatedOutline,
        })
        .then(()=> setSavingStatus('All changes saved'))
        updateLastModified(props.userData.userID, String(props.outlineData.docID), props.match.params.fileID)
    }

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    const switchCardPosition = (oldIndex, newIndex) => {
        let itemsCopy = [...props.outlineItemsForUpdate]
        const removedItem = itemsCopy.splice(oldIndex, 1)
        itemsCopy.splice(newIndex, 0, ...removedItem)
        return itemsCopy.map((item, index)=> {
            return {...item, index}
        })
    }

    const updateStateAndDatabase = (updatedOutline) => {
        props.dispatch(outlineItemsForUpdate(updatedOutline))
        updateToDatabase(updatedOutline)
    }

    const handleDragEnd = (e) => {
        const {active, over} = e
        if(active.id === over.id) return
        setSavingStatus('Saving...')
        const oldIndex = itemIndexes.indexOf(active.id)
        const newIndex = itemIndexes.indexOf(over.id)
        setItemIndexes(arrayMove(itemIndexes, oldIndex, newIndex))
        const updatedOutline = switchCardPosition(oldIndex, newIndex)
        updateStateAndDatabase(updatedOutline)
    }

    window.onbeforeunload = function() {
        if(savingStatus==='Saving...') {
            return 'saving'
        }
    }

    const screenReaderInstructions = `
        To pick up a card, press space or enter.
        Use the arrow keys to move cards in any direction.
        Press space or enter to confirm move, or press escape to cancel move.
    `

    const announcements = {
        onDragStart(id) {
            return `picked up note card ${Number(id + 1)}, ${props.outlineItemsDisplay[id].title}`
        },
        onDragOver(id, overId) {
            return `note card was moved into position ${Number(overId) + 1} of ${props.outlineItemsDisplay.length}`
        },
        onDragEnd(id, overId) {
            return `${props.outlineItemsDisplay[id]} was dropped over in position ${Number(overId) + 1} of ${props.outlineItemsDisplay.length}`
        }, 
        onDragCancel() {
            return `Move was canceled.`
        }
    }

    return (
        <Container>
            <Toolbar fileID={props.match.params.fileID} userID={props.userData.userID} setCardsPerRow={setCardsPerRow} cardsPerRow={cardsPerRow} savingStatus={savingStatus} />
            <CreateCardModal showCreateModal={showCreateModal} itemIndexes={itemIndexes}  setItemIndexes={setItemIndexes}  match={props.match} setShowCreateModal={setShowCreateModal} getOutline={getOutline} />
            <OutlineContainer>
                <Title>{props?.outlineData?.name}</Title>
                <CreateNew onClick={()=>setShowCreateModal(true)}><Plus aria-hidden>+</Plus> Create new card</CreateNew>
                <DndContext screenReaderInstructions={screenReaderInstructions} announcements={announcements} sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={itemIndexes} strategy={rectSortingStrategy}>
                    <Grid cardsPerRow={cardsPerRow}>
                        {itemIndexes.map((itemIndex, index)=> {
                            return(
                                <SortableItem index={index} setCardIndex={setCardIndex} setTitle={setTitle} setText={setText} setShowEditModal={setShowEditModal} setShowDeleteModal={setShowDeleteModal} key={itemIndex} id={itemIndex} text={props.outlineItemsDisplay} />
                            )
                        })}
                    </Grid>
                </SortableContext>
                </DndContext>
            </OutlineContainer>
            <EditCardModal showEditModal={showEditModal} itemIndexes={itemIndexes} match={props.match} cardIndex={cardIndex} setShowEditModal={setShowEditModal} title={title} text={text} />
            <DeleteCardModal showDeleteModal={showDeleteModal} setItemIndexes={setItemIndexes} itemIndexes={itemIndexes} match={props.match} cardIndex={cardIndex} setShowDeleteModal={setShowDeleteModal} />
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

export default connect(mapStateToProps)(Outline)

const Plus = styled.span`
    font-size: 1.75rem;
    margin-right: 5px;
    background-color: inherit;
    color: inherit;
`

const Container = styled.div`
    width: 100%;
`

const CreateNew = styled.button`
    background-color: var(--primary-text);
    position: relative;
    color: var(--sidebar);
    padding: 12px 15px;
    border-radius: 10px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    font-size: .875rem;
`

const OutlineContainer = styled.div`
    padding: 10px 20px 20px 20px;
`

const Title = styled.h1`
    font-size: 2rem;
    margin: 40px 0 20px 0;
`

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(${props=>props.cardsPerRow}, 1fr);
    grid-gap: 20px;
    grid-template-rows: auto;
    @media(max-width: 450px) {
        grid-template-columns: repeat(1, 1fr); 
    }
`