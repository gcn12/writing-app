import React, { useEffect, useState } from 'react'
import { db } from '../../../firebase'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { updateLastModified } from '../../../globalFunctions'
import { Link } from 'react-router-dom'
import { outlineData, outlineItemsDisplay, outlineItemsForUpdate } from '../../../redux/actions/appActions'
import EditCardModal from './EditCardModal'
import DeleteCardModal from './DeleteCardModal'
import CreateCardModal from './CreateCardModal'
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

    useEffect(()=> {
        // console.log(props.match)
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
            if(result.data() !== undefined) {
                const outline = result.data()
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
        const outlineCopy = {...outlineData}
        outlineCopy.data = cardsNewIndexes
        db.collection('users')
        .doc(props.userData.userID)
        .collection('files')
        .doc(props.match.params.fileID)
        .update({
            data: cardsNewIndexes,
        })
        .then(()=> {
            console.log('updated')
        })

        updateLastModified(props.userData.userID, String(props.outlineData.docID), props.match.params.fileID)
    }

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    

    function handleDragEnd(event) {
        const {active, over} = event;
        if (active.id !== over.id) {
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

    return (
        <div>
            <Link to='/writing-app'>
                <div>Home</div>
            </Link>
            {props?.outlineData?.name}
            <button onClick={()=>setShowCreateModal(true)}>Create new card</button>
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
            {showEditModal && 
                <EditCardModal itemIndexes={itemIndexes} match={props.match} cardIndex={cardIndex} setShowEditModal={setShowEditModal} title={title} text={text} />
            }
            {showDeleteModal &&
                <DeleteCardModal setItemIndexes={setItemIndexes} itemIndexes={itemIndexes} match={props.match} cardIndex={cardIndex} setShowDeleteModal={setShowDeleteModal} />
            }
            {showCreateModal && 
                <CreateCardModal itemIndexes={itemIndexes}  setItemIndexes={setItemIndexes}  match={props.match} setShowCreateModal={setShowCreateModal} getOutline={getOutline} />
            }
        </div>
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

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 20px;
    margin: 20px;
    grid-template-rows: auto;
`