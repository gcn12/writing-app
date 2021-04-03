import styled from "styled-components";
import { connect } from 'react-redux'
import { 
    currentLayer,
    layerOneDocs,
    layerTwoDocs,
    layerThreeDocs,
 } from '../../redux/actions/appActions'
import { breadcrumbs } from '../../redux/actions/dashboardActions'

const Breadcrumbs = (props) => {

    const breadcrumbRoute = (indexToRoute) => {
        props.dispatch(currentLayer(indexToRoute))
        const crumbsCopy = [...props.breadcrumbs]
        const breadcrumbsReduced = crumbsCopy.slice(0, indexToRoute+1)
        props.dispatch(breadcrumbs(breadcrumbsReduced))
        if(indexToRoute <= 0) props.dispatch(layerOneDocs([]))
        if(indexToRoute <= 1) props.dispatch(layerTwoDocs([]))
        if(indexToRoute <= 2) props.dispatch(layerThreeDocs([]))
    }

    return(
        <Container>
            {props.breadcrumbs.map((crumb, index)=> {
                return(
                    <Crumb onClick={()=>breadcrumbRoute(index)} key={index}>{crumb.name}</Crumb>
                )
            })}
        </Container>
    )
} 

const mapStateToProps = state => ({
    breadcrumbs: state.dashboard.breadcrumbs,
    currentLayer: state.app.currentLayer,
    rootLayer: state.app.rootLayer,
    layerOneDocs: state.app.layerOneDocs,
    layerTwoDocs: state.app.layerTwoDocs,
    layerThreeDocs: state.app.layerThreeDocs,
})

export default connect(mapStateToProps)(Breadcrumbs)

const Crumb = styled.button`
    cursor: pointer;
    font-size: 1.75rem;
    font-weight: 500;
    &:not(:first-of-type) {
        margin-left: 5px;
        &:before {
            margin-right: 5px;
            content: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNNSAzbDMuMDU3LTMgMTEuOTQzIDEyLTExLjk0MyAxMi0zLjA1Ny0zIDktOXoiLz48L3N2Zz4=");
        }
    }
    &:not(:last-of-type) {
        margin-left: 5px;
        opacity: 0.6;
        font-size: 1.7rem;
        font-weight: 400;
    }
    &:hover{
        opacity: 1;
    }
`

const Container = styled.nav`
    display: flex;
    margin: 20px 0;
`