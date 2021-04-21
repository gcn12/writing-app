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

    useEffect(()=> {
        getOutline()
        // eslint-disable-next-line
    }, [props.match])


    const getOutline = () => {
        db.collection('users')
        .doc(props.userData.userID)
        .collection('files')
        .doc(props.match.params.fileID)
        .get()
        .then((result)=> {
            const outline = result.data()
            if(outline !== undefined) {
                document.title = outline.name
                const outlineItems = outline.data
                props.dispatch(outlineData(outline))
                if(outlineItems.length > 0) {
                    props.dispatch(outlineItemsDisplay([...outlineItems]))
                    props.dispatch(outlineItemsForUpdate([...outlineItems]))
                }
                const dataIndexArray = []
                for(let i = 0; i<outlineItems.length; i++) {
                    dataIndexArray.push(String(i))
                }
                setItemIndexes(dataIndexArray)
            }
        })
    }

    const updateToDatabase = (cardsInput) => {
        const cardsNewIndexes = cardsInput.map((card, index)=> {
            return {...card, index}
        })
        db.collection('users')
        .doc(props.userData.userID)
        .collection('files')
        .doc(props.match.params.fileID)
        .update({
            data: cardsNewIndexes,
        })
        .then(()=> {
            console.log('updated')
            setSavingStatus('All changes saved')
        })

        updateLastModified(props.userData.userID, String(props.outlineData.docID), props.match.params.fileID)
    }

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    

    const handleDragEnd = (e) => {
        const {active, over} = e
        if (active.id !== over.id) {
            setSavingStatus('Saving...')
            let oldIndex 
            let newIndex 
            setItemIndexes((itemIndexes) => {
                oldIndex = itemIndexes.indexOf(active.id);
                newIndex = itemIndexes.indexOf(over.id);
                const result = arrayMove(itemIndexes, oldIndex, newIndex)
                return result;
            });
            let itemsCopy = [...props.outlineItemsForUpdate]
            const removedItem = itemsCopy.splice(oldIndex, 1)
            itemsCopy.splice(newIndex, 0, ...removedItem)
            const newIndexItems = itemsCopy.map((item, index)=> {
                return {...item, index}
            })
            props.dispatch(outlineItemsForUpdate([...newIndexItems]))
            updateToDatabase(newIndexItems)
        }
    }

    window.onbeforeunload = function() {
        if(savingStatus==='Saving...') {
            return 'saving'
        }
    }

    return (
        <Container>
            <Toolbar savingStatus={savingStatus} />
            <CreateCardModal showCreateModal={showCreateModal} itemIndexes={itemIndexes}  setItemIndexes={setItemIndexes}  match={props.match} setShowCreateModal={setShowCreateModal} getOutline={getOutline} />
            <OutlineContainer>
                <Title>{props?.outlineData?.name}</Title>
                <CreateNew onClick={()=>setShowCreateModal(true)}><Plus>+</Plus> Create new card</CreateNew>
                <DndContext sensors={sensors} collisionDetection={closestCenter}onDragEnd={handleDragEnd}>
                <SortableContext items={itemIndexes} strategy={rectSortingStrategy}>
                    <Grid>
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
    );
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
    margin: 0px 0 20px 0;
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
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 20px;
    grid-template-rows: auto;
    @media(max-width: 900px) {
        grid-template-columns: repeat(1, 1fr);
    }
`