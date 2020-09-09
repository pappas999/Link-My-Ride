import React, { createContext, useContext } from "react"
import { useMachine } from "@xstate/react"
import { rentalFormMachine } from "./rentalFormMachine"
import { initRentalFormMachineOptions } from "./initRentalFormMachineOptions"
import { Web3Context } from "../web3"

type ContextProps = {
    current: any,
    setSelectedDate: (date: any) => void
    setSelectedCar: (car: Car) => void
}

const defaultValues = {
    current: {},
    setSelectedDate: () => { },
    setSelectedCar: () => { }
}

export const RentalFormContext = createContext<ContextProps>(defaultValues)

type ProviderProps = {
    children: React.ReactNode
}

export const RentalFormProvider = ({ children }: ProviderProps) => {

    const { linkMyRideContract } = useContext(Web3Context)

    const getAvailableCars = async (context: any, event: any): Promise<Car[]> => {
        const getVehicleAddresses = async () => linkMyRideContract.methods.getVehicleAddresses().call()

        const getVehicleByAddress = async (address: string) => linkMyRideContract.methods.getVehicle(address).call()

        const addresses = await getVehicleAddresses()

        const vehicleData = await Promise.all(addresses.map(async (address: string) => await getVehicleByAddress(address)))

        return vehicleData.map((vehicle: any) => ({
            id: vehicle[0],
            address: vehicle[1],
            apiTokenHash: vehicle[2],
            baseHireFee: vehicle[3],
            bondRequired: vehicle[4],
            model: vehicle[5],
            description: vehicle[6], 
            lat: vehicle[0] === "123" ? 36.1407 : 36.1507,
            lng: vehicle[0] === "123" ? -115.1187 : -115.1587,
        }))
    }

    const machineOptions = initRentalFormMachineOptions(getAvailableCars)
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

    return <RentalFormContext.Provider value={{ current, setSelectedDate, setSelectedCar }}>
        {children}
    </RentalFormContext.Provider>
}