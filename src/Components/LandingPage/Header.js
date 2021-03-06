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
    margin-right: 50px;
    @media(max-width: 800px) {
        margin-right: 20px;
    }
`

const Container = styled.nav`
    padding-top: 20px;
    background-color: hsl(184, 30%, 92%);
`

const UL = styled.ul`
    display: flex;
    align-items: center;
    justify-content: space-between;
    list-style-type: none;
    padding: 0;
`

const LI = styled.li`
`

const SignIn = styled.div`
    background-color: transparent;
    border: 1px solid black;
    padding: 15px;
    border-radius: 7px;
    white-space: nowrap;
    @media(max-width: 500px) {
        font-size: .9rem;
        padding: 12px;
    }
    @media(max-width: 350px) {
        font-size: .8rem;
        padding: 9px;
    }
`

const SignUp = styled.div`
    background-color: black;
    border: 1px solid black;
    color: white;
    padding: 15px;
    border-radius: 7px;
    margin-left: 10px;
    white-space: nowrap;
    @media(max-width: 500px) {
        font-size: .9rem;
        padding: 12px;
    }
    @media(max-width: 350px) {
        font-size: .8rem;
        padding: 9px;
    }
`

const StyledLink = styled(Link)`
    text-decoration: none;
    color: black;
    &:focus {
        box-shadow: none;
    }
    &:focus-within {
        ${SignIn} {
            box-shadow: 0 0 0 5px rgba(21, 156, 228, 0.4);
        }
        ${SignUp} {
            box-shadow: 0 0 0 5px rgba(21, 156, 228, 0.4);
        }
    }
`

const Logo = styled.h1`
    font-size: 2rem;
    font-weight: 700;
    margin-left: 50px;
    @media(max-width: 800px) {
        margin-left: 20px;
    }
    @media(max-width: 500px) {
        font-size: 1.75rem;
    }
    @media(max-width: 350px) {
        font-size: 1.5rem;
    }
`