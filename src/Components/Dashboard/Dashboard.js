import styled from 'styled-components'
import { Route } from 'react-router-dom'
import AllFiles from './FilesList/AllFiles'
import Sidebar from './Sidebar/Sidebar'
import { useEffect } from 'react'
import ToDo from '../Goals/ToDo/ToDo'
import MobileHeader from '../MobileNavigation/MobileHeader'
import ChangeColors from '../ChangeColors/ChangeColors'
import { connect } from 'react-redux'

const Dashboard = (props) => {

    useEffect(()=> {
        document.title='Redraft'
    }, [])

    useEffect(()=> {
        if(props.isModalOpen) {
            window.scrollTo(0, 0)
            document.body.scrollTop = 0
        }
    }, [props.isModalOpen])
    return(
        <Container isModalOpen={props.isModalOpen}>
            <Sidebar match={props.match} />
            <FilesContainer>
                <Route exact path='/writing-app/' render={(props)=> (
                    <FileContainer>
                        <AllFiles {...props} />
                    </FileContainer>
                )} />
                <Route exact path='/writing-app/tasks' render={(props)=> (
                    <ToDo {...props} />
                )} />
                <Route exact path='/writing-app/themes' render={(props)=> (
                    <ChangeColors {...props} />
                )} />
            </FilesContainer>
            <MobileHeader />
        </Container>
    )
}

const mapStateToProps = state => ({
    showProjects: state.dashboard.showProjects,
    isModalOpen: state.app.isModalOpen,
})

export default connect(mapStateToProps)(Dashboard)

const FileContainer = styled.div`
    padding: 0 30px;
    padding-top: 10px;
    overflow-y: scroll;
    @media(max-width: 800px) {
        height: calc(100% - 80px);
        margin-top: 80px;
    }
    @media(max-width: 500px) {
        padding: 0 15px;
    }
    height: 100%;
`

export const FilesContainer = styled.div`
    height: 100%;
    width: 100%;
    margin-left: 250px;
    margin-bottom: 250px;
    @media(max-width: 800px) {
        margin-left: 0;
        padding-left: 0;
    } 
`

export const Container = styled.div`
    width: 100%;
    height: 100%;
    position: ${props=>props.isModalOpen ? 'fixed' : 'static'};
    @media(min-width: 800px) {
        display: flex;
    } 
`