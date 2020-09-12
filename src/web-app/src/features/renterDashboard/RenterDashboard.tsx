import React from "react"
import styled from "styled-components"
import { MyRentalContracts } from "../rentalContracts"
import { Link } from "react-router-dom"
import { Button } from "@material-ui/core"

export const RenterDashboard = () => <>
    <Button
        component={Link}
        to="/rent-a-car"
    >
        Rent a car!
        </Button>
    <StyledHr />
    <MyRentalContracts asOwner={false} />
</>

const StyledHr = styled.hr`
    width: 100%;
    max-width: ${({theme}) => theme.typography.pxToRem(800)};
`