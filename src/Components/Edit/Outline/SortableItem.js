import React from 'react';
import Card from './Card'
import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import { connect } from 'react-redux'

const SortableItem = (props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({id: props.id});
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {props?.text &&
        <Card 
          index={props.index} 
          setCardIndex={props.setCardIndex} 
          setTitle={props.setTitle} setText={props.setText}  
          setShowEditModal={props.setShowEditModal} 
          setShowDeleteModal={props.setShowDeleteModal} 
          text={props?.text[Number(props.id)]?.text || ''} 
          title={props?.text[Number(props.id)]?.title || ''} 
        />
      }
    </div>
  );
}

const mapStateToProps = state => ({
  outlineItemsDisplay: state.app.outlineItemsDisplay,
})

export default connect(mapStateToProps)(SortableItem)