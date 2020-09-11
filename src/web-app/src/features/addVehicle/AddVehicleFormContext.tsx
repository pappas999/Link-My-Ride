import React, { createContext, useContext } from "react"
import { useMachine } from "@xstate/react"
import { addVehicleFormMachine } from "./addVehicleFormMachine"
import { initAddVehicleFormMachineOptions } from "./initAddVehicleFormMachineOptions"
import { Web3Context } from "../web3"

type ContextProps = {
    current: any,
    submitAddVehicleForm: () => void
}

const defaultValues = {
    current: {},
    submitAddVehicleForm: () => { }
}

export const AddVehicleFormContext = createContext<ContextProps>(defaultValues)

type ProviderProps = {
    children: React.ReactNode
}

export const AddVehicleFormProvider = ({ children }: ProviderProps) => {

    const { linkMyRideContract, web3 } = useContext(Web3Context)

    const submitVehicle = async (context: any, event: any): Promise<any> => {
        console.log("addVehicle")

        return Promise.resolve()
    }

    const machineOptions = initAddVehicleFormMachineOptions(submitVehicle)
    const [current, send] = useMachine(addVehicleFormMachine, machineOptions)

    const submitAddVehicleForm = () => {
        send("SUBMIT")
    }

    return <AddVehicleFormContext.Provider value={{ current, submitAddVehicleForm }}>
        {children}
    </AddVehicleFormContext.Provider>
}