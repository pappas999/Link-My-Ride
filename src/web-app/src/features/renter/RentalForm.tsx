import React, { useContext } from "react"
import styled from "styled-components"
import { Typography, CircularProgress } from "@material-ui/core"
import { MuiPickersUtilsProvider, KeyboardDateTimePicker } from "@material-ui/pickers"
import { RentalFormContext } from "./RentalFormContext"
import DateFnsUtils from "@date-io/date-fns"
import { Map } from "../../components/map"
import { CarDetailsCard } from "../../components/car"

export const RentalForm = () => {

    const { current, setSelectedDate, setSelectedCar } = useContext(RentalFormContext)

    const handleChildClick = (key: any, childProps: any) => {
        setSelectedCar(current.context.availableCars && current.context.availableCars.filter((car: Car) => car.id === key)[0])
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
        <CarDetailsCard car={current.context.selectedCar} />
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