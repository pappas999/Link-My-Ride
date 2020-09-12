import React, { createContext, useContext } from "react"
import { useMachine } from "@xstate/react"
import { addVehicleFormMachine } from "./addVehicleFormMachine"
import { initAddVehicleFormMachineOptions } from "./initAddVehicleFormMachineOptions"
import { Web3Context } from "../web3"
import { Model } from "../../enums/Model"

type ContextProps = {
    current: any,
    submitAddVehicleForm: () => void,
    setSelectedVehicleModel: (model: Model) => void,
    setVehicleId: (id: string) => void,
    setApiKey: (apiKey: string) => void
}

const defaultValues = {
    current: {},
    submitAddVehicleForm: () => { },
    setSelectedVehicleModel: () => { },
    setVehicleId: () => { },
    setApiKey: () => { }
}

export const AddVehicleFormContext = createContext<ContextProps>(defaultValues)

type ProviderProps = {
    children: React.ReactNode
}

export const AddVehicleFormProvider = ({ children }: ProviderProps) => {

    const { linkMyRideContract, web3 } = useContext(Web3Context)

    const submitVehicle = async (context: any, event: any): Promise<any> => {
        console.log("addVehicle")

        // TODO: Pass the API key to the external adapter to validate it.
        // If valid, hash it and persist to SC, else error.

        return Promise.resolve()
    }

    const machineOptions = initAddVehicleFormMachineOptions(submitVehicle)
    const [current, send] = useMachine(addVehicleFormMachine, machineOptions)

    const setSelectedVehicleModel = (model: Model) => {
        send({
            type: "SET_SELECTED_VEHICLE_MODEL",
            selectedVehicleModel: model
        })
    }

    const setVehicleId = (id: string) => {
        send({
            type: "SET_VEHICLE_ID",
            value: id
        })
    }

    const setApiKey = (apiKey: string) => {
        send({
            type: "SET_API_KEY",
            value: apiKey
        })
    }

    const submitAddVehicleForm = () => {
        send("SUBMIT")
    }

    return <AddVehicleFormContext.Provider value={{ current, submitAddVehicleForm, setSelectedVehicleModel, setVehicleId, setApiKey }}>
        {children}
    </AddVehicleFormContext.Provider>
}