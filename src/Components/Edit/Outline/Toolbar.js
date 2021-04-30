import styled from 'styled-components'
import IconComponent from '../../../Icons/IconComponent'
import { Link } from 'react-router-dom'
import { db } from '../../../firebase'

const Toolbar = (props) => {
    const updateCardsPerRow = (e) => {
        const newCardsPerRow = e.target.value
        if(isNaN(newCardsPerRow)) return
        if(newCardsPerRow > 10 || newCardsPerRow < 1) return
        props.setCardsPerRow(newCardsPerRow)
        db.collection('users')
        .doc(props.userID)
        .collection('files')
        .doc(props.fileID)
        .update({
            cardsPerRow: newCardsPerRow
        })
        .catch((err)=>console.log(err))
    }
    return(
        <Container>
            <Home aria-label='return to homepage' to='/writing-app'>
                <IconComponent><path d="M21 13v10h-6v-6h-6v6h-6v-10h-3l12-12 12 12h-3zm-1-5.907v-5.093h-3v2.093l3 3z"/></IconComponent>
            </Home>
            <ToolbarRightContainer>
                <CardsPerRowContainer>
                    <CardsPerRowLabel htmlFor='cards-per-row'>Cards per row:</CardsPerRowLabel>
                    <CardsPerRow onBlur={updateCardsPerRow} defaultValue={props.cardsPerRow} id='cards-per-row' />
                </CardsPerRowContainer>
                {props.savingStatus}
            </ToolbarRightContainer>
        </Container>
    )
}

export default Toolbar

const CardsPerRowContainer = styled.div`
    @media(max-width: 450px){
        display: none;
    } 
`

const ToolbarRightContainer = styled.div`
    display: flex;
    align-items: center;
`

const CardsPerRowLabel = styled.label`
    margin-right: 10px;
`

const CardsPerRow = styled.input`
    width: 30px;
    background-color: var(--background);
    outline: 1px solid var(--primary-text);
    color: var(--primary-text);
    margin-right: 20px;
`

const Home = styled(Link)`
    justify-self: flex-start;
`

const Container = styled.div`
    position: fixed;
    background-color: var(--background);
    width: 100%;
    z-index: 10;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 50px;
    top: 0;
    transition: opacity 300ms ease-in-out;
    outline: 1px solid rgba(0, 0, 0, .1);
    &:hover {
        opacity: 1;
    }
    @media(hover: hover) {
        &:not(:hover) {
            opacity: 0;
        }
    }
`