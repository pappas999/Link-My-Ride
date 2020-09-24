import React, { useContext } from "react"
import styled from "styled-components"
import { AddVehicleFormContext } from "./AddVehicleFormContext"
import { FormControl, Typography, Input, InputLabel, Select, MenuItem, TextField, InputAdornment } from "@material-ui/core"
import { Model } from "../../enums"
import { getCarModelString, getCurrencyString } from "../../utils"
import { StyledForm, SubmittingOverlay } from "../../components/form"
import { CurrencyContext } from "../currency"
import { SubmitButton } from "../../components/button"
import { Redirect } from "react-router-dom"
import { SelectLatLngMap } from "./SelectLatLngMap"

export const AddVehicleForm = () => {

    const {
        current,
        submitAddVehicleForm,
        setSelectedVehicleModel,
        setVehicleDescription,
        setVehicleId,
        setApiKey,
        setHireFee,
        setBond
    } = useContext(AddVehicleFormContext)

    const { currency: usersCurrency } = useContext(CurrencyContext)

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

    return <FormWrapper>
        <FormField>
            <VehicleModelFormControl>
                <InputLabel>Vehicle Model</InputLabel>
                <Select
                    value={current.context.selectedVehicleModel}
                    onChange={handleVehicleModelSelected}
                >
                    <MenuItem key={Model.Model_S} value={Model.Model_S}>{getCarModelString(Model.Model_S)}</MenuItem>
                    <MenuItem key={Model.Model_3} value={Model.Model_3}>{getCarModelString(Model.Model_3)}</MenuItem>
                    <MenuItem key={Model.Model_X} value={Model.Model_X}>{getCarModelString(Model.Model_X)}</MenuItem>
                    <MenuItem key={Model.Model_Y} value={Model.Model_Y}>{getCarModelString(Model.Model_Y)}</MenuItem>
                    <MenuItem key={Model.Roadster} value={Model.Roadster}>{getCarModelString(Model.Roadster)}</MenuItem>
                    <MenuItem key={Model.Cybertruck} value={Model.Cybertruck}>{getCarModelString(Model.Cybertruck)}</MenuItem>
                </Select>
            </VehicleModelFormControl>
        </FormField>
        <FormField>
            <TextField
                label="Vehicle Registration"
                value={current.context.vehicleDescription}
                onChange={handleVehicleDescriptionChanged} />
        </FormField>
        <FormField>
            <FormControl fullWidth>
                <InputLabel htmlFor="hourly-hire-fee">Hourly Hire Fee</InputLabel>
                <Input
                    id="hourly-hire-fee"
                    value={current.context.hireFee}
                    onChange={handleHireFeeChanged}
                    startAdornment={<InputAdornment position="start">{getCurrencyString(usersCurrency)}</InputAdornment>}
                />
            </FormControl>
        </FormField>
        <FormField>
            <FormControl fullWidth>
                <InputLabel htmlFor="required-bond">Required Bond</InputLabel>
                <Input
                    id="required-bond"
                    value={current.context.bond}
                    onChange={handleBondChanged}
                    startAdornment={<InputAdornment position="start">{getCurrencyString(usersCurrency)}</InputAdornment>}
                />
            </FormControl>
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
        <MapSection>
            <MapWrapper>
            <BigFieldLabel>Please select where you would like your vehicle to be collected from and returned to.</BigFieldLabel>
                <SelectLatLngMap />
            </MapWrapper>
        </MapSection>
        <FormField>
            <SubmitButton color="secondary" onClick={handleSubmit}>Submit</SubmitButton>
        </FormField>
        {
            current.matches("submitting") &&
            <SubmittingOverlay />
        }
        {
            current.matches("done") &&
            <Redirect to="owner-dashboard" />
        }
    </FormWrapper>
}

const FormWrapper = styled(StyledForm)`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding: ${({ theme }) => theme.spacing(8)};
    color: ${({ theme }) => theme.palette.common.white};
    width: 100%;
    max-width: ${({ theme }) => theme.typography.pxToRem(600)};
`

const FormField = styled.div`   
    margin: ${({ theme }) => `${theme.spacing(4)} 0`};
`

const VehicleModelFormControl = styled(FormControl)`
    width: ${({ theme }) => theme.typography.pxToRem(160)};
`

const MapSection = styled(FormField)`
    width: 100%;
    max-width: ${({ theme }) => theme.typography.pxToRem(800)};
    height: ${({ theme }) => theme.typography.pxToRem(500)};
    display: flex;
    justify-content: center;
    align-items: center;
`

const MapWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    height: 100%;
    width: 100%;
`

const BigFieldLabel = styled(Typography)`
    &.MuiTypography-body1 {
        font-size: ${({ theme }) => theme.typography.pxToRem(24)};
        margin: ${({ theme }) => theme.typography.pxToRem(24)};
        text-align: center;
    }
`