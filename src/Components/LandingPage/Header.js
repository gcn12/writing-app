import styled from 'styled-components'
import { Link } from 'react-router-dom'

const Header = () => {
    return(
        <Container>
            <UL>
                <LI><Logo>Redraft</Logo></LI>
                <RightContainer>
                    <LI>
                        <StyledLink to='/writing-app/signin'><SignIn>Sign in</SignIn></StyledLink>
                    </LI>
                    <LI>
                        <StyledLink to='/writing-app/signup'><SignUp>Sign up</SignUp></StyledLink>
                    </LI>
                </RightContainer>
            </UL>
        </Container>
    )
}

export default Header

const RightContainer = styled.div`
    display: flex;
    gap: 10px;
    margin-right: 50px;
`

const Container = styled.nav`
    padding-top: 20px;
`

const UL = styled.ul`
    display: flex;
    align-items: center;
    justify-content: space-between;
`

const LI = styled.li`
`

const StyledLink = styled(Link)`
    text-decoration: none;
`

const SignIn = styled.div`
    background-color: transparent;
    border: 1px solid black;
    color: black;
    padding: 15px;
    border-radius: 7px;
`

const SignUp= styled.div`
    background-color: black;
    color: white;
    padding: 15px;
    border-radius: 7px;
`

const Logo = styled.h1`
    font-size: 2rem;
    font-weight: 700;
    margin-left: 50px;
    /* padding: 20px; */
    /* margin: 30px 0 70px 0; */
`