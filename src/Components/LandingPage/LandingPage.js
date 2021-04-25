// import styled from 'styled-components'
import styled from 'styled-components'
import Header from './Header'
import { useEffect } from 'react'
import FirstSection from './FirstSection'
import SecondSection from './SecondSection'
import ThirdSection from './ThirdSection'
import FourthSection from './FourthSection'
import FifthSection from './FifthSection'
import { colors } from '../../redux/actions/appActions'
import { connect } from 'react-redux'

const LandingPage = (props) => {

    useEffect(()=> {
        props.setIsLoading(false)
        props.dispatch(colors({
            background: '#fafafa',
            primaryText: 'black',
        }))
        // eslint-disable-next-line
    }, [])

    return(
        <Container>
            <Header />
            <FirstSection />
            <ThirdSection />
            <SecondSection />
            <FifthSection />
            <FourthSection />
        </Container>
    )
}

const mapStateToProps = state => ({})

export default connect(mapStateToProps)(LandingPage)

const Container = styled.div`
    position: relative;
`