// import styled from 'styled-components'
import Header from './Header'
import { useEffect } from 'react'
import FirstSection from './FirstSection'
import SecondSection from './SecondSection'
import ThirdSection from './ThirdSection'

const LandingPage = () => {

    useEffect(()=> {
        document.body.style.backgroundColor = 'white'
    }, [])

    return(
        <div>
            <Header />
            <FirstSection />
            <SecondSection />
            <ThirdSection />
        </div>
    )
}

export default LandingPage



