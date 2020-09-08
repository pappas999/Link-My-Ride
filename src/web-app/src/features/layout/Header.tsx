import React from "react"
import styled from "styled-components"
import { Logo } from "../../components/logo"
import { Link } from "react-router-dom"

export const Header = () => {

    return <Wrapper>
        <Content>
            <Link to="/">
                <Logo />
            </Link>
        </Content>
    </Wrapper>
}

const Wrapper = styled.div`
    width: 100%;
`

const Content = styled.div`
    padding: ${({ theme }) => `${theme.spacing(4)} ${theme.spacing(4)}`};
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
`