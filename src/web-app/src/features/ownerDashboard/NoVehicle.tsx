import React from "react"
import styled from "styled-components"
import { Typography, Button } from "@material-ui/core"
import { Link } from "react-router-dom"

export const NoVehicle = () => {

    return <Wrapper>
        <Typography>It looks like you haven't added your vehicle yet.</Typography>
        <Button
            component={Link}
            to="/add-vehicle"
        >
            Add vehicle
        </Button>
    </Wrapper>
}

const Wrapper = styled.div`
    padding: ${({ theme }) => theme.spacing(6)};
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
`