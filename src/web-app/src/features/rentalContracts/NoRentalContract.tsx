import React from "react"
import styled from "styled-components"
import { Typography } from "@material-ui/core"

export const NoRentalContract = () => {

    return <Wrapper>
        <Typography>No rental contracts have been created for your vehicle yet.</Typography>
        <Typography>When someone opens a request to rent your vehicle it should appear here.</Typography>
    </Wrapper>
}

const Wrapper = styled.div`
    padding: ${({ theme }) => theme.spacing(6)};
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
`