import React, { useContext } from "react"
import styled from "styled-components"
import { AddVehicleFormContext } from "./AddVehicleFormContext"
import { FormControl, InputLabel, Select, MenuItem } from "@material-ui/core"
import { Model } from "../../enums/Model"
import { getCarModelString } from "../../utils"

export const AddVehicleForm = () => {

    const { current, submitAddVehicleForm, setSelectedVehicleModel } = useContext(AddVehicleFormContext)

    const handleVehicleModelSelected = (event: any) => {
        setSelectedVehicleModel(event.target.value)
    }

    const handleSubmit = () => {
        submitAddVehicleForm()
    }

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
