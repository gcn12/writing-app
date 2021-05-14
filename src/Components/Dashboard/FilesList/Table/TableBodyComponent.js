import styled from 'styled-components'
import FileIcons from '../Table/FileIcons'
import ModifierIcon from '../Table/ModifierIcon'
import moment from 'moment'

const TableBodyComponent = (props) => {
    return(
        <TableBody role='row'>
            {props.folderMap[props.currentLayer]?.map((doc, index)=> {
                return(
                    <Row role='row' id={`projects-table-row-${index}`} tabIndex='0' onKeyDown={(e)=>props.buttonPress(e.code, doc.type, doc.docID, doc.name, index)} role='button' onFocus={()=>props.selectProject(doc, index)} onClick={()=>props.selectItem(doc.type, doc.docID, doc.name)} key={index}>
                        <Cell role='cell'>
                            <FileIcons docType={doc.type} docName={doc.name} />
                        </Cell>
                        <Cell aria-label={`Document type: ${doc.type}`} hide='550px' role='cell'>{doc.type}</Cell>
                        <CellDate aria-label={`Last modified: ${moment(doc.lastModified).format('ll')}`} hide='550px' role='cell'><Date>{moment(doc.lastModified).format('ll')}</Date></CellDate>
                        <Cell hide='550px' role='cell'>
                            <IconContainer>
                                <ModifierIcon ariaLabel='Rename document' title='Rename' openModal={props.showRenameProject} labelName='rename file'>
                                    <path d="M18.363 8.464l1.433 1.431-12.67 12.669-7.125 1.436 1.439-7.127 12.665-12.668 1.431 1.431-12.255 12.224-.726 3.584 3.584-.723 12.224-12.257zm-.056-8.464l-2.815 2.817 5.691 5.692 2.817-2.821-5.693-5.688zm-12.318 18.718l11.313-11.316-.705-.707-11.313 11.314.705.709z"/>
                                </ModifierIcon>
                                <ModifierIcon ariaLabel='Delete document' title='Delete' openModal={props.showDeleteProject} labelName='delete file'>
                                    <path d="M9 19c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5-17v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.315c0 .901.73 2 1.631 2h5.712zm-3 4v16h-14v-16h-2v18h18v-18h-2z"/>
                                </ModifierIcon>
                            </IconContainer>
                        </Cell>
                    </Row>
                )
            })}
        </TableBody>
    )
}

export default TableBodyComponent

const Date = styled.p`
    white-space: nowrap;
`

const IconContainer = styled.div`
    display: flex;
    @media(hover: hover) {
        &:not(:hover) {
            opacity: 0;
        }
    }
`

const TableBody = styled.div`
    display: table-row-group;
`

const Row = styled.div`
    cursor: pointer;
    height: 65px;
    display: table-row;
    background-color: var(--sidebar);
    transition: background-color 70ms ease-in-out;
    @media(hover: hover) {
        &:hover{ 
            background-color: var(--highlight);
            ${IconContainer} {
                opacity: 1;
                transition: opacity 500ms ease-in-out;
            }
        }
        &:not(:hover) {
        }
    }
    &:focus-within{ 
        background-color: var(--highlight);
        ${IconContainer} {
            opacity: 1;
            transition: opacity 500ms ease-in-out;
        }
    }
    &:active{
        background-color: var(--highlight);
        ${IconContainer} {
            opacity: 1;
            transition: opacity 500ms ease-in-out;
        }
    }
    &:first-of-type {
        border-top-left-radius: 10px;
        border-bottom-left-radius: 10px;
    }
    &:last-of-type {
        border-top-right-radius: 10px;
        border-bottom-right-radius: 10px;
    }
`

const Cell = styled.div`
    width: 0px;
    display: table-cell;
    padding: 15px 20px;
    vertical-align: middle;
    &:first-of-type {
        border-top-left-radius: 10px;
        border-bottom-left-radius: 10px;
    }
    &:last-of-type {
        border-top-right-radius: 10px;
        border-bottom-right-radius: 10px;
    }
    @media(max-width: ${props=>props.hide}) {
        display: none;
    }
`

const CellDate = styled.div`
    width: 0px;
    display: table-cell;
    padding: 15px 20px;
    vertical-align: middle;
    @media(max-width: ${props=>props.hide}) {
        border-top-right-radius: 10px;
        border-bottom-right-radius: 10px;
    }
`