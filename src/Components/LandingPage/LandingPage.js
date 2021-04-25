// import styled from 'styled-components'
import styled from 'styled-components'
import Header from './Header'
import { useEffect } from 'react'
import MainSection from './MainSection'
import FormattingSection from './FormattingSection'
import ColorsSection from './ColorsSection'
import OutliningSection from './OutliningSection'
import Footer from './Footer'
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
            <MainSection />
            <FormattingSection />
            <ColorsSection />
            <OutliningSection />
            <Footer />
        </Container>
    )
}

const mapStateToProps = state => ({})

export default connect(mapStateToProps)(LandingPage)

const Container = styled.div`
    position: relative;
`