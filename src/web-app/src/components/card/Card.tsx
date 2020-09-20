import React from "react"
import styled from "styled-components"
import { Card as MuiCard } from "@material-ui/core"

export const Card = ({ ...rest }) => {
    return <StyledCard {...rest} />
}

const StyledCard = styled(MuiCard)`
    width: 100%;
    margin: ${({ theme }) => theme.spacing(4)};
    padding: ${({ theme }) => theme.spacing(4)};
    box-sizing: border-box;
`