import React, { useContext, useEffect, useState, useCallback } from "react"
import styled from "styled-components"
import { Typography, CircularProgress, FormControl, InputLabel, Select, MenuItem, Button } from "@material-ui/core"
import { MuiPickersUtilsProvider, DateTimePicker } from "@material-ui/pickers"
import { RentalFormContext } from "./RentalFormContext"
import DateFnsUtils from "@date-io/date-fns"
import { Map } from "../../components/map"
import { Vehicle } from "../ownerDashboard/Vehicle"
import { StyledForm, StyledHr, SubmittingOverlay } from "../../components/form"
import { getCurrencyString, fromSolidityFormat } from "../../utils"
import { CurrencyContext } from "../currency"
import BigNumber from "bignumber.js"

export const RentalForm = () => {

    const { current, setSelectedDate, setSelectedCar, setSelectedHireDuration, submitRentalForm } = useContext(RentalFormContext)

    const { currency: usersCurrency, convertCurrency } = useContext(CurrencyContext)

    const handleChildClick = (key: any, childProps: any) => {
        setSelectedCar(current.context.availableCars && current.context.availableCars.filter((car: Car) => car.id === key)[0])
    }

    const handleHireDurationSelected = (event: any) => {
        setSelectedHireDuration(event.target.value)
    }

    const handleSubmit = () => {
        submitRentalForm()
    }

    const total = current.context.selectedCar && ((+current.context.hireDuration * +current.context.selectedCar.baseHireFee) + +current.context.selectedCar.bondRequired)

    const [convertedTotalCost, setConvertedTotalCost] = useState(new BigNumber(0))

    const getConvertedTotalCost = useCallback(async () => {
        if (current.context.selectedCar) {
            setConvertedTotalCost(await convertCurrency(new BigNumber(total), current.context.selectedCar.currency, usersCurrency))
        }
    }, [usersCurrency, current.context.selectedCar, convertCurrency, setConvertedTotalCost, total])

    useEffect(() => {
        getConvertedTotalCost()
    }, [usersCurrency, getConvertedTotalCost])

    return <FormWrapper>
        <BigFieldLabel>When would you like to rent a car?</BigFieldLabel>
        <FormField>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <DatePicker
                    label="Rental start time"
                    value={current.context.selectedDate}
                    onChange={setSelectedDate}
                    animateYearScrolling
                    minutesStep={60}
                    views={["date", "hours"]}
                    disablePast
                    disableToolbar
                    ampm={false}
                />
            </MuiPickersUtilsProvider>
        </FormField>
        {
            <MapSection>
                {
                    current.matches("idle.dateSelecting") && <CircularProgress color="secondary" />
                }
                {
                    !current.matches("idle.dateSelecting") && !current.matches("idle.dateUnselected") && current.context.selectedDate && <MapWrapper>
                        <BigFieldLabel>Here are the available cars for that date and time.<br />Select them to view more details.</BigFieldLabel>
                        <Map cars={current.context.availableCars} onChildSelected={handleChildClick} />
                    </MapWrapper>
                }
            </MapSection>
        }
        {
            current.context.selectedCar && <>
                <BigFieldLabel>You selected:</BigFieldLabel>
                <Vehicle car={current.context.selectedCar} />
                <BigFieldLabel>How long would you like to hire it for?</BigFieldLabel>
                <HireDurationFormControl>
                    <InputLabel>Hire Duration</InputLabel>
                    <Select
                        value={current.context.hireDuration}
                        onChange={handleHireDurationSelected}
                    >
                        <MenuItem value={1}>1 hour</MenuItem>
                        <MenuItem value={2}>2 hours</MenuItem>
                        <MenuItem value={3}>3 hours</MenuItem>
                    </Select>
                </HireDurationFormControl>
            </>
        }
        {
            current.context.hireDuration && <>
                <StyledHr />
                <BigFieldLabel>Total cost:</BigFieldLabel>
                <Total><span>{getCurrencyString(usersCurrency)}</span>&nbsp;{fromSolidityFormat(convertedTotalCost, usersCurrency).toString()}</Total>
                <SubmitButton color="secondary" onClick={handleSubmit}>Send request to car owner</SubmitButton>
            </>
        }
        {
            current.matches("submitting") &&
            <SubmittingOverlay />
        }
    </FormWrapper >
}

const FormWrapper = styled(StyledForm)`
    position: relative;
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

const DatePicker = styled(DateTimePicker)`
    width: ${({ theme }) => theme.typography.pxToRem(300)};
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

const Total = styled(Typography)`
    &.MuiTypography-body1 {
        font-size: ${({ theme }) => theme.typography.pxToRem(24)};
        text-align: center;
        border: ${({ theme }) => `solid 2px ${theme.palette.secondary.main}`};
        padding: ${({ theme }) => theme.spacing(8)};
    }
`

const HireDurationFormControl = styled(FormControl)`
    &.MuiFormControl-root {
        width: ${({ theme }) => theme.typography.pxToRem(160)};
        margin-bottom: ${({ theme }) => theme.spacing(12)};
    }
`

const SubmitButton = styled(Button)`
    &.MuiButtonBase-root {
        margin-top: ${({ theme }) => theme.spacing(16)};
        margin-top: ${({ theme }) => theme.spacing(12)};
        padding: ${({ theme }) => theme.spacing(6)};
    }
`