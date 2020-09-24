import React from "react"
import styled from "styled-components"
import { AddVehicleForm } from "./AddVehicleForm"
import { AddVehicleFormProvider } from "./AddVehicleFormContext"
import { BackToDashboardButton } from "../layout/BackToDashboardButton"

export const AddVehicle = () => {

    return <Container>
        <BackToDashboardButton to="/owner-dashboard" />
        <AddVehicleFormProvider>
            <AddVehicleForm />
        </AddVehicleFormProvider>
    </Container>
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
`