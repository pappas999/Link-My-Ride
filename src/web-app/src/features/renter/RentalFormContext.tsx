import React, { createContext, useContext } from "react"
import { useMachine } from "@xstate/react"
import { rentalFormMachine } from "./rentalFormMachine"
import { initRentalFormMachineOptions } from "./initRentalFormMachineOptions"
import { Web3Context } from "../web3"

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

    const getAvailableCars = async (context: any, event: any): Promise<Car[]> => {
        const getVehicleAddresses = async () => linkMyRideContract.methods.getVehicleAddresses().call()

        const getVehicleByAddress = async (address: string) => linkMyRideContract.methods.getVehicle(address).call()

        const addresses = await getVehicleAddresses()

        const vehicleData = await Promise.all(addresses.map(async (address: string) => await getVehicleByAddress(address)))

        // TODO: Remove. This is just for dev purposes
        const getRandomCoord = (min: number, max: number) => {
            return Math.random() * (max - min) + min
        }

        return vehicleData.map((vehicle: any) => ({
            id: vehicle[0],
            address: vehicle[1],
            apiTokenHash: vehicle[2],
            baseHireFee: vehicle[3],
            bondRequired: vehicle[4],
            model: vehicle[5],
            description: vehicle[6],
            lat: getRandomCoord(36.14, 36.16),
            lng: getRandomCoord(-115.12, -115.16),
        }))
    }

    const createRentalAgreement = async (context: any, event: any): Promise<any> => {

        const toEpochSeconds = (dateTime: Date) => dateTime.getTime() / 1000

        const startDate = toEpochSeconds(context.selectedDate)
        const endDate = toEpochSeconds(new Date(context.selectedDate.setHours(context.selectedDate.getHours() + 2)))
        const hireFee = +(context.hireDuration) * context.selectedCar.baseHireFee

        const addresses = await web3.eth.getAccounts()

        return linkMyRideContract.methods.newRentalAgreement(
            context.selectedCar.address,
            addresses[0],
            +startDate,
            +endDate,
            hireFee.toString(),
            context.selectedCar.bondRequired.toString()
        ).send({
            from: addresses[0],
            value: +hireFee + +context.selectedCar.bondRequired 
        })
            .catch((err: any) => {
                console.error("Failed with error: " + err);
            })
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