import React, { useContext } from "react"
import styled from "styled-components"
import { AddVehicleFormContext } from "./AddVehicleFormContext"

export const AddVehicleForm = () => {

    const { current, submitAddVehicleForm } = useContext(AddVehicleFormContext)

    const handleSubmit = () => {
        submitAddVehicleForm()
    }

    return <FormWrapper>
        <FormField>FORM</FormField>
    </FormWrapper>
}

const FormWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding: ${({ theme }) => theme.spacing(8)};
    color: ${({ theme }) => theme.palette.common.white};
`

const FormField = styled.div`   
    margin: ${({ theme }) => `${theme.spacing(4)} 0`};
`
