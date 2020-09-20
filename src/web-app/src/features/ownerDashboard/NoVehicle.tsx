import React from "react"
import styled from "styled-components"
import { Typography } from "@material-ui/core"
import { Link } from "react-router-dom"
import { BigActionButton } from "../../components/button"
import { PhonelinkSetup } from "@material-ui/icons"

export const NoVehicle = () => {

    return <Wrapper>
        <Typography>It looks like you haven't added your vehicle yet.</Typography>
        <BigActionButton
            component={Link}
            to="/add-vehicle"
            icon={<PhonelinkSetup color="primary" style={{ fontSize: 100 }} />}
            label="Add vehicle"
        >
        </BigActionButton>
    </Wrapper>
}

const Wrapper = styled.div`
    padding: ${({ theme }) => theme.spacing(6)};
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    color: ${({ theme }) => theme.palette.common.white};
`