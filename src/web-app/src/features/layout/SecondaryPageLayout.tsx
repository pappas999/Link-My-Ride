import React from "react"
import styled from "styled-components"
import { Header } from "./Header"

type Props = {
    children: React.ReactNode
}

export const SecondaryPageLayout = ({ children }: Props) => {

    return <Wrapper>
        <Header />
        {
            children
        }
    </Wrapper>
}

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
`