import styled from 'styled-components'
import firebase from 'firebase/app'
import { useHistory } from 'react-router-dom'
import IconComponent from '../../Icons/IconComponent'
import { connect } from 'react-redux'
import { reset, userData } from '../../redux/actions/appActions'
import { resetDashboard } from '../../redux/actions/dashboardActions'

const MobileSignout = (props) => {
    const history = useHistory()

    const signout = () => {
        firebase.auth().signOut()
        .then(()=> {
            props.dispatch(userData({userID: ''}))
            props.dispatch(reset())
            props.dispatch(resetDashboard())
            history.push('/writing-app')
        })
        .catch(err=> {
            console.log(err)
        })
    }

    return(
        <Container>
            <Button onClick={signout}>
                <Icon><IconComponent><path d="M10 9.408l2.963 2.592-2.963 2.592v-1.592h-8v-2h8v-1.592zm-2-4.408v4h-8v6h8v4l8-7-8-7zm6-3c-1.787 0-3.46.474-4.911 1.295l.228.2 1.396 1.221c1.004-.456 2.114-.716 3.287-.716 4.411 0 8 3.589 8 8s-3.589 8-8 8c-1.173 0-2.283-.26-3.288-.715l-1.396 1.221-.228.2c1.452.82 3.125 1.294 4.912 1.294 5.522 0 10-4.477 10-10s-4.478-10-10-10z"/></IconComponent></Icon>
                <Name>Sign out</Name>
            </Button>
        </Container>
    )
}

const mapStateToProps = state => ({})

export default connect(mapStateToProps)(MobileSignout)

const Name = styled.h2`
    margin-left: 10px; 
    font-size: 1.75rem;
`

const Button = styled.button`
    display: flex;
    align-items: center;
`

const Icon = styled.div`
`

const Container = styled.li`
    margin-bottom: 20px;
`