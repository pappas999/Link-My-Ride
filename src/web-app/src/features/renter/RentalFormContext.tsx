import React, { createContext, useContext } from "react"
import { useMachine } from "@xstate/react"
import { rentalFormMachine } from "./rentalFormMachine"
import { initRentalFormMachineOptions } from "./initRentalFormMachineOptions"
import { Web3Context } from "../web3"
import { CurrencyContext } from "../currency"
import { Currency } from "../../enums"
import BigNumber from "bignumber.js"

type ContextProps = {
    current: any,
    setSelectedDate: (date: any) => void
    setSelectedCar: (car: Car) => void
    setSelectedHireDuration: (hours: number) => void
    submitRentalForm: () => void
}

const defaultValues = {
    current: {},
    setSelectedDate: () => { },
    setSelectedCar: () => { },
    setSelectedHireDuration: () => { },
    submitRentalForm: () => { }
}

export const RentalFormContext = createContext<ContextProps>(defaultValues)

type ProviderProps = {
    children: React.ReactNode
}

export const RentalFormProvider = ({ children }: ProviderProps) => {

    const { linkMyRideContract, web3 } = useContext(Web3Context)

    const { convertCurrency } = useContext(CurrencyContext)

    const getAvailableCars = async (context: any, event: any): Promise<Car[]> => {
        const getVehicleAddresses = async () => linkMyRideContract.methods.getVehicleAddresses().call()

        const getVehicleByAddress = async (address: string) => linkMyRideContract.methods.getVehicle(address).call()

        const addresses = await getVehicleAddresses()

        // TODO: Filter to only available vehicles
        const vehicleData = await Promise.all(addresses.map(async (address: string) => await getVehicleByAddress(address)))

        return vehicleData.map((vehicle: any) => ({
            id: +vehicle[0],
            address: vehicle[1],
            baseHireFee: vehicle[2],
            bondRequired: vehicle[3],
            currency: vehicle[4],
            model: vehicle[5],
            description: vehicle[6],
            lat: +vehicle[7],
            lng: +vehicle[8],
            status: vehicle[9]
        }))
    }

    const createRentalAgreement = async (context: any, event: any): Promise<any> => {

        try {
            const {
                address: carAddress,
                baseHireFee,
                bondRequired,
                currency
            } = context.selectedCar

            const toEpochSeconds = (dateTime: Date) => dateTime.getTime() / 1000

            const startDate = toEpochSeconds(context.selectedDate)
            const endDate = toEpochSeconds(new Date(context.selectedDate.setHours(context.selectedDate.getHours() + 2)))
            const hireFee: BigNumber = new BigNumber(baseHireFee).multipliedBy(+(context.hireDuration))

            const hireFeeAsEth = await convertCurrency(hireFee, currency, Currency.ETH)
            const bondRequiredAsEth = await convertCurrency(bondRequired, currency, Currency.ETH)

            const addresses = await web3.eth.getAccounts()

            console.log(carAddress)
            console.log(addresses[0])
            console.log(+startDate)
            console.log(+endDate)
            console.log(new BigNumber(hireFeeAsEth).plus(bondRequiredAsEth).toString())

            return linkMyRideContract.methods.newRentalAgreement(
                carAddress,
                addresses[0],
                +startDate,
                +endDate
            ).send({
                from: addresses[0],
                value: new BigNumber(hireFeeAsEth).plus(bondRequiredAsEth)
            })
        }
        catch (err) {
            console.error("Failed with error: " + err)
            throw err
        }
    }

    const machineOptions = initRentalFormMachineOptions(getAvailableCars, createRentalAgreement)
    const [current, send] = useMachine(rentalFormMachine, machineOptions)

    const setSelectedDate = (date: any) => {
        send({
            type: "SET_SELECTED_DATE",
            selectedDate: date
        })
    }

    const setSelectedCar = (car: Car) => {
        send({
            type: "SET_SELECTED_CAR",
            selectedCar: car
        })
    }

    const setSelectedHireDuration = (hours: number) => {
        send({
            type: "SET_SELECTED_HIRE_DURATION",
            duration: hours
        })
    }

    const submitRentalForm = () => {
        send("SUBMIT")
    }

    return <RentalFormContext.Provider value={{ current, setSelectedDate, setSelectedCar, setSelectedHireDuration, submitRentalForm }}>
        {children}
    </RentalFormContext.Provider>
}