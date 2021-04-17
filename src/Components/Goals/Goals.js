// import TotalWords from './TotalWords'
// import ScreenplaysCompleted from './ScreenplaysCompleted'
// import DailyGoals from './DailyGoals'
// import TotalAchievements from './TotalAchievements'
import ToDo from './ToDo/ToDo'
import styled from 'styled-components'


const Goals = () => {
    return(
        <Container>
            {/* <Cards>
                <DailyGoals />
                <TotalAchievements />
                <TotalWords />
                <ScreenplaysCompleted />
            </Cards> */}
            <ToDo />
        </Container>
    )
}

export default Goals

// const Cards = styled.div`
//     display: flex;
//     gap: 15px;
// `

const Container = styled.div`
    margin-top: 40px;
    display: flex;
    gap: 20px;
    flex-direction: column;
`