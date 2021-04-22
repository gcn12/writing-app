// import styled from 'styled-components'
import styled from 'styled-components'
import Header from './Header'
import { useEffect } from 'react'
import FirstSection from './FirstSection'
import SecondSection from './SecondSection'
import ThirdSection from './ThirdSection'
import { colors } from '../../redux/actions/appActions'
import { connect } from 'react-redux'

const LandingPage = (props) => {

    useEffect(()=> {
        props.setIsLoading(false)
        props.dispatch(colors({
            background: 'white',
            primaryText: 'black',
        }))
        // eslint-disable-next-line
    }, [])

    return(
        <Container>
            <Header />
            <FirstSection />
            <SecondSection />
            <ThirdSection />
        </Container>
    )
}

const mapStateToProps = state => ({})

export default connect(mapStateToProps)(LandingPage)

const Container = styled.div`
`