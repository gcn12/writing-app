import styled from 'styled-components'
import IconComponent from '../../../Icons/IconComponent'
import {
    MenuItem,
} from "@reach/menu-button";

const NewDocListItem = (props) => {
    return(
        <Item onSelect={()=>props.openModal(props.docType)}>
            <IconContainer>
                <IconComponent>{props.children}</IconComponent>
            </IconContainer>
            <Type>{props.docType}</Type>
        </Item>
    ) 
}

export default NewDocListItem

const IconContainer = styled.div`
    transform: scale(.8);
    margin-right: 5px;
`

const Item = styled(MenuItem)`
    font-size: 1rem;
    display: flex;
    align-items: center;
    &:hover{
        background-color: var(--highlight);
    }
`

const Type = styled.p`
    text-transform: capitalize;
`