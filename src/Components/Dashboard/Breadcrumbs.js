import styled from "styled-components";
import { connect } from 'react-redux'
import IconComponent from '../../Icons/IconComponent'
import { 
    currentLayer,
    layerOneDocs,
    layerTwoDocs,
    layerThreeDocs,
 } from '../../redux/actions/appActions'
import { breadcrumbs } from '../../redux/actions/dashboardActions'

const Breadcrumbs = (props) => {

    const changeCurrentLayer = (indexToRoute) => props.dispatch(currentLayer(indexToRoute))

    const removeBreadcrumbs = (indexToRoute) => {
        const crumbsCopy = [...props.breadcrumbs]
        const breadcrumbsReduced = crumbsCopy.slice(0, indexToRoute+1)
        props.dispatch(breadcrumbs(breadcrumbsReduced))
    }

    const clearFilesFromState = (indexToRoute) => {
        if(indexToRoute <= 0) props.dispatch(layerOneDocs([]))
        if(indexToRoute <= 1) props.dispatch(layerTwoDocs([]))
        if(indexToRoute <= 2) props.dispatch(layerThreeDocs([]))
    }

    const breadcrumbChangeRoute = (indexToRoute) => {
        changeCurrentLayer(indexToRoute)
        removeBreadcrumbs(indexToRoute)
        clearFilesFromState(indexToRoute)
    }

    return(
        <Container>
            {props.breadcrumbs.map((crumb, index)=> {
                return(
                    <CrumbContainer key={index}>
                        {index === props.breadcrumbs.length -1 ? 
                        <LastCrumb>{crumb.name}</LastCrumb>
                        :
                        <Crumb onClick={()=>breadcrumbChangeRoute(index)}>{crumb.name}</Crumb>
                        }
                        {index !== props.breadcrumbs.length -1 &&
                        <IconContainer>
                            <IconComponent><path d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z"/></IconComponent>
                        </IconContainer>
                        }
                    </CrumbContainer>
                )
            })}
        </Container>
    )
} 

const mapStateToProps = state => ({
    breadcrumbs: state.dashboard.breadcrumbs,
    currentLayer: state.app.currentLayer,
    layerOneDocs: state.app.layerOneDocs,
    layerTwoDocs: state.app.layerTwoDocs,
    layerThreeDocs: state.app.layerThreeDocs,
})

export default connect(mapStateToProps)(Breadcrumbs)

const IconContainer = styled.div`
    opacity: 0.6;
    margin: 0 8px;
`

const CrumbContainer = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 15px;
`

const LastCrumb = styled.h2`
    font-size: 1.75rem;
    font-weight: 500;
`

const Crumb = styled.button`
    cursor: pointer;
    font-size: 1.75rem;
    font-weight: 500;
    opacity: .6;
    &:hover{
        opacity: 1;
    }
`

const Container = styled.nav`
    display: flex;
    margin: 20px 0;
    flex-wrap: wrap;
`