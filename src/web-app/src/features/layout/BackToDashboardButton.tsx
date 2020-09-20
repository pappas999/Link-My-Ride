import React from "react"
import styled from "styled-components"
import { ArrowBack } from "@material-ui/icons"
import { Typography } from "@material-ui/core"
import { Link } from "react-router-dom"

type Props = {
    to: string
}

export const BackToDashboardButton = ({ to }: Props) => {

    return <Wrapper to={to}>
        <ArrowBack />
        <Typography variant="h5">Back to dashboard</Typography>
    </Wrapper>
}

const Wrapper = styled(Link)`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    color: ${({theme}) => theme.palette.common.white};
`