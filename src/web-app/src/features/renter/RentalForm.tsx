import React, { useContext, useEffect, useState } from "react"
import styled from "styled-components"
import { Typography, CircularProgress } from "@material-ui/core"
import { MuiPickersUtilsProvider, KeyboardDateTimePicker } from "@material-ui/pickers"
import { RentalFormContext } from "./RentalFormContext"
import DateFnsUtils from "@date-io/date-fns"
import { Map } from "../../components/map"
import Web3 from "web3"
import linkMyRideContract from "../../contract_abi.json"

export const RentalForm = () => {

    const { current, setSelectedDate } = useContext(RentalFormContext)

    const handleChildClick = (key: any, childProps: any) => {
        console.log("key: " + key)
        console.log("childProps: " + JSON.stringify(childProps))
    }

    const [dummyCarData, setDummyCarData] = useState({})

    const loadBlockchainData = async () => {
        const web3 = new Web3(Web3.givenProvider || "http://localhost:8545")

        // @ts-ignore
        const contract = new web3.eth.Contract(linkMyRideContract.abi,
            "0x31f6211446868b9F814a4015FdD535d8f27785B7"
        )

        const getVehicleAddresses = async () => contract.methods.getVehicleAddresses().call()

        const getVehicleByAddress = async (address: string) => contract.methods.getVehicle(address).call()

        const addresses = await getVehicleAddresses()

        const vehicleData = await Promise.all(addresses.map(async (address: string) => await getVehicleByAddress(address)))

        setDummyCarData(vehicleData)
    }

    useEffect(() => {
        loadBlockchainData()
    }, [])

    return <FormWrapper>
        {JSON.stringify(dummyCarData)}
        <FormField>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <DatePicker
                    label="When would you like to rent a car?"
                    value={current.context.selectedDate}
                    onChange={setSelectedDate}
                    animateYearScrolling
                    disablePast
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