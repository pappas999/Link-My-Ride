import React, { useContext } from "react"
import styled from "styled-components"
import { Typography, CircularProgress, FormControl, InputLabel, Select, MenuItem, Button } from "@material-ui/core"
import { MuiPickersUtilsProvider, KeyboardDateTimePicker } from "@material-ui/pickers"
import { RentalFormContext } from "./RentalFormContext"
import DateFnsUtils from "@date-io/date-fns"
import { Map } from "../../components/map"
import { Vehicle } from "../ownerDashboard/Vehicle"

export const RentalForm = () => {

    const { current, setSelectedDate, setSelectedCar, setSelectedHireDuration, submitRentalForm } = useContext(RentalFormContext)

    console.log(JSON.stringify(current.context.availableCars))

    const handleChildClick = (key: any, childProps: any) => {
        setSelectedCar(current.context.availableCars && current.context.availableCars.filter((car: Car) => car.id === key)[0])
    }

    const handleHireDurationSelected = (event: any) => {
        setSelectedHireDuration(event.target.value)
    }

    const handleSubmit = () => {
        submitRentalForm()
    }

    return <FormWrapper>
        <FormField>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <DatePicker
                    label="When would you like to rent a car?"
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
                    current.matches("dateSelecting") && <CircularProgress />
                }
                {
                    current.matches("dateSelected") && <MapWrapper>
                        <MapLabel>Here are the available cars for that date and time:</MapLabel>
                        <Map cars={current.context.availableCars} onChildSelected={handleChildClick} />
                    </MapWrapper>
                }
            </MapSection>
        }
        {
            current.matches("dateSelected") && <>
                <Vehicle car={current.context.selectedCar} />
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
                <Button color="primary" onClick={handleSubmit}>Send request to car owner</Button>
            </>
        }
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

const DatePicker = styled(KeyboardDateTimePicker)`
    width: ${({ theme }) => theme.typography.pxToRem(300)};
`

const MapSection = styled(FormField)`
    width: ${({ theme }) => theme.typography.pxToRem(800)};
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

const MapLabel = styled(Typography)`

`

const HireDurationFormControl = styled(FormControl)`
    width: ${({ theme }) => theme.typography.pxToRem(160)};
`