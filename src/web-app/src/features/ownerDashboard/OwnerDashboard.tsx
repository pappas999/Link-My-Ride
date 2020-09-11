import React from "react"
import { MyVehicle } from "./MyVehicle"
import { MyRentalContracts } from "../rentalContracts"

export const OwnerDashboard = () => <>
    <MyVehicle />
    <MyRentalContracts asOwner={true} />
</>