import styled from 'styled-components'
import IconsComponent from '../../../../Icons/IconComponent'

const TableHeadComponent = (props) => {
    return(
        <TableHead hide={props.hide} role='heading'>
            <ColumnNameButton onClick={()=>props.changeSortOrder(props.sortType)}>
                {props.name}
                {props.sortMethod === props.sortMethodValue1 ? 
                    <ArrowIcon isVisible={props.sortMethod === props.sortMethodValue1} rotate='rotate(180deg)'><IconsComponent><path d="M24 22h-24l12-20z"/></IconsComponent></ArrowIcon>
                :
                    <ArrowIcon isVisible={props.sortMethod === props.sortMethodValue2} rotate='rotate(0deg)'><IconsComponent><path d="M24 22h-24l12-20z"/></IconsComponent></ArrowIcon>
                }
            </ColumnNameButton>
        </TableHead>
    )
}

export default TableHeadComponent

const TableHead = styled.div`
    display: table-cell;
    text-align: left;
    padding: 10px 15px;
    border-bottom: 2px solid var(--primary-text);
    border-top: 2px solid var(--primary-text);
    color: hsl(0, 0%, 20%);
    font-weight: 400;
    white-space: nowrap;
    @media(max-width: ${props=>props.hide}) {
        display: none;
    }
`

const ColumnNameButton = styled.button`
    display: flex;
    align-items: center;
`

const ArrowIcon = styled.div`
    transform: scale(.6) ${props=>props.rotate};
    margin-left: 5px;
    visibility: ${props=>props.isVisible ? 'visible' : 'hidden'}
`