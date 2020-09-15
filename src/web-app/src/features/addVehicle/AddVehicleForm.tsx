import React, { useContext } from "react"
import styled from "styled-components"
import { AddVehicleFormContext } from "./AddVehicleFormContext"
import { FormControl, Input, InputLabel, Select, MenuItem, TextField, Button, InputAdornment } from "@material-ui/core"
import { Model } from "../../enums"
import { getCarModelString } from "../../utils"
import { StyledForm } from "../../components/form"

export const AddVehicleForm = () => {

    const {
        current,
        submitAddVehicleForm,
        setSelectedVehicleModel,
        setVehicleDescription,
        setVehicleId,
        setApiKey,
        setCurrency,
        setHireFee,
        setBond
    } = useContext(AddVehicleFormContext)

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

    const handleCurrencyChange = (event: any) => {
        const currency = currencies.find((currency: any) => {
            return currency.value === event.target.value
        })
        setCurrency(currency)
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

    // TODO: Move this to context?
    const currencies = [
        {
            value: 'USD',
            label: '$',
        },
        {
            value: 'GBP',
            label: '£',
        },
        {
            value: 'AUD',
            label: 'AU$',
        },
        {
            value: 'ETH',
            label: 'Ξ',
        },
    ]

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
                    <MenuItem value={Model.Roadster}>{getCarModelString(Model.Roadster)}</MenuItem>
                    <MenuItem value={Model.Cybertruck}>{getCarModelString(Model.Cybertruck)}</MenuItem>
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
            <CurrencySelectTextField
                select
                label="Currency"
                value={current.context.currency.value}
                onChange={handleCurrencyChange}>
                {
                    currencies.map((option) => {
                        return <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    })
                }
            </CurrencySelectTextField>
        </FormField>
        <FormField>
            <FormControl fullWidth>
                <InputLabel htmlFor="hourly-hire-fee">Hourly Hire Fee</InputLabel>
                <Input
                    id="hourly-hire-fee"
                    value={current.context.hireFee}
                    onChange={handleHireFeeChanged}
                    startAdornment={<InputAdornment position="start">{current.context.currency.label}</InputAdornment>}
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
                    startAdornment={<InputAdornment position="start">{current.context.currency.label}</InputAdornment>}
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
        <FormField>
            <Button color="primary" onClick={handleSubmit}>Submit</Button>
        </FormField>
    </FormWrapper>
}

const FormWrapper = styled(StyledForm)`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding: ${({ theme }) => theme.spacing(8)};
`

const FormField = styled.div`   
    margin: ${({ theme }) => `${theme.spacing(4)} 0`};
`

const VehicleModelFormControl = styled(FormControl)`
    width: ${({ theme }) => theme.typography.pxToRem(160)};
`

const CurrencySelectTextField = styled(TextField)`
    width: ${({ theme }) => theme.typography.pxToRem(80)};
`
