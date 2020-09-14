import React from "react"
import { MyVehicle } from "./MyVehicle"
import { MyRentalContracts } from "../rentalContracts"
import { StyledHr } from "../../components/form"

export const OwnerDashboard = () => <>
    <MyVehicle />
    <StyledHr />
    <MyRentalContracts asOwner={true} />
</>