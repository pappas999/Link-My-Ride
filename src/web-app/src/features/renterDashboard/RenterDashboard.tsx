import React from "react"
import { MyRentalContracts } from "../rentalContracts"
import { Link } from "react-router-dom"
import { BigActionButton } from "../../components/button"
import { NoteAdd } from "@material-ui/icons"
import { StyledHr } from "../../components/form"

export const RenterDashboard = () => <>
    <BigActionButton
        component={Link}
        to="/rent-a-car"
        icon={<NoteAdd color="primary" style={{ fontSize: 100 }} />}
        label="Create a rental contract"
    />
    <StyledHr />
    <MyRentalContracts asOwner={false} />
</>