import React, { useContext } from "react"
import styled from "styled-components"
import { AddVehicleFormContext } from "./AddVehicleFormContext"
import { FormControl, InputLabel, Select, MenuItem, TextField, Button } from "@material-ui/core"
import { Model } from "../../enums/Model"
import { getCarModelString } from "../../utils"

export const AddVehicleForm = () => {

    const { current, submitAddVehicleForm, setSelectedVehicleModel, setVehicleDescription, setVehicleId, setApiKey, setHireFee, setBond } = useContext(AddVehicleFormContext)

    const handleVehicleModelSelected = (event: any) => {
        setSelectedVehicleModel(event.target.value)
    }

    const handleVehicleDescriptionChanged = (event: any) => {
        setVehicleDescription(event.target.value)
    }

    const handleVehicleIdChanged = (event: any) => {
        setVehicleId(event.target.value)
    }

    const handleApiKeyChanged = (event: any) => {
        setApiKey(event.target.value)
    }

    const handleHireFeeChanged = (event: any) => {
        setHireFee(event.target.value)
    }

    const handleBondChanged = (event: any) => {
        setBond(event.target.value)
    }

    const handleSubmit = () => {
        submitAddVehicleForm()
    }

    console.log(JSON.stringify(current.context))

    return <FormWrapper>
        <FormField>
            <VehicleModelFormControl>
                <InputLabel>Vehicle Model</InputLabel>
                <Select
                    value={current.context.selectedVehicleModel}
                    onChange={handleVehicleModelSelected}
                >
                    <MenuItem value={Model.Model_S}>{getCarModelString(Model.Model_S)}</MenuItem>
                    <MenuItem value={Model.Model_3}>{getCarModelString(Model.Model_3)}</MenuItem>
                    <MenuItem value={Model.Model_X}>{getCarModelString(Model.Model_X)}</MenuItem>
                    <MenuItem value={Model.Model_Y}>{getCarModelString(Model.Model_Y)}</MenuItem>
                    <MenuItem value={Model.Cybertruck}>{getCarModelString(Model.Roadster)}</MenuItem>
                    <MenuItem value={Model.Roadster}>{getCarModelString(Model.Cybertruck)}</MenuItem>
                </Select>
            </VehicleModelFormControl>
        </FormField>
        <FormField>
            <TextField
                label="Vehicle Description"
                value={current.context.vehicleDescription}
                onChange={handleVehicleDescriptionChanged} />
        </FormField>
        <FormField>
            <TextField
                label="Hourly Hire Fee"
                value={current.context.hireFee}
                type="number"
                onChange={handleHireFeeChanged} />
        </FormField>
        <FormField>
            <TextField
                label="Required Bond"
                value={current.context.bond}
                type="number"
                onChange={handleBondChanged} />
        </FormField>
        <FormField>
            <TextField
                label="Vehicle ID"
                value={current.context.vehicleId}
                type="number"
                onChange={handleVehicleIdChanged} />
        </FormField>
        <FormField>
            <TextField
                label="API Key"
                value={current.context.apiKey}
                onChange={handleApiKeyChanged} />
        </FormField>
        <FormField>
            <Button color="primary" onClick={handleSubmit}>Submit</Button>
        </FormField>
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

const VehicleModelFormControl = styled(FormControl)`
    width: ${({ theme }) => theme.typography.pxToRem(160)};
`
