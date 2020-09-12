import React from "react"
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
    <MyRentalContracts asOwner={false} />
</>