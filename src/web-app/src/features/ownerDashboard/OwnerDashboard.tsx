import React from "react"
import styled from "styled-components"
import { MyVehicle } from "./MyVehicle"
import { MyRentalContracts } from "../rentalContracts"

export const OwnerDashboard = () => <>
    <MyVehicle />
    <StyledHr />
    <MyRentalContracts asOwner={true} />
</>

const StyledHr = styled.hr`
    width: 100%;
    max-width: ${({ theme }) => theme.typography.pxToRem(800)};
`