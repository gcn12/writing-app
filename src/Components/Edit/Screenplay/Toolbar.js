import styled from 'styled-components'
import IconComponent from '../../../Icons/IconComponent'
import { Link } from 'react-router-dom'
import { createPDF } from './createPDF'

const Toolbar = (props) => {
    return(
        <Container>
            <Home to='/writing-app/dashboard'>
                <IconComponent><path d="M21 13v10h-6v-6h-6v6h-6v-10h-3l12-12 12 12h-3zm-1-5.907v-5.093h-3v2.093l3 3z"/></IconComponent>
            </Home>
            <Export onClick={()=> createPDF(props.value)}>Export script</Export>
            {props.savingStatus}
        </Container>
    )
}

export default Toolbar

const Export = styled.button`
    height: 30px;
    min-width: 150px;
    background-color: var(--primary-text);
    color: var(--sidebar);
    border-radius: 5px;
`

const Home = styled(Link)`
    justify-self: flex-start;
`

const Container = styled.div`
    position: fixed;
    background-color: var(--background);
    width: 100%;
    z-index: 1;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40px;
    opacity: 0;
    transition: opacity 300ms ease-in-out;
    outline: 1px solid rgba(0, 0, 0, .1);
    &:hover {
        opacity: 1;
    }
`