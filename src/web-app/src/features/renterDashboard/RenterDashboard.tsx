import React from "react"
import styled from "styled-components"
import { MyRentalContracts } from "../rentalContracts"
import { Link } from "react-router-dom"
import { BigActionButton } from "../../components/button"
import { NoteAdd } from "@material-ui/icons"

export const RenterDashboard = () => <>
    <BigActionButton
        component={Link}
        to="/rent-a-car"
        icon={<NoteAdd color="primary" style={{ fontSize: 100 }} />}
        label="Create another rental contract"
    />
    <StyledHr />
    <MyRentalContracts asOwner={false} />
</>

const StyledHr = styled.hr`
    width: 100%;
    max-width: ${({ theme }) => theme.typography.pxToRem(800)};
`