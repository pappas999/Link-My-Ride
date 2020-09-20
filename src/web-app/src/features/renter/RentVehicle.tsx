import React from "react"
import styled from "styled-components"
import { RentalForm } from "./RentalForm"
import { RentalFormProvider } from "./RentalFormContext"
import { BackToDashboardButton } from "../layout/BackToDashboardButton"

export const RentVehicle = () => {

    return <Container>
        <BackToDashboardButton to="/renter-dashboard" />
        <RentalFormProvider>
            <RentalForm />
        </RentalFormProvider>
    </Container>
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
`