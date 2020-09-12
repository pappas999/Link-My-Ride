import React, { createContext, useContext } from "react"
import { useMachine } from "@xstate/react"
import { addVehicleFormMachine } from "./addVehicleFormMachine"
import { initAddVehicleFormMachineOptions } from "./initAddVehicleFormMachineOptions"
import { Web3Context } from "../web3"
import { Model } from "../../enums/Model"

type ContextProps = {
    current: any,
    submitAddVehicleForm: () => void,
    setSelectedVehicleModel: (model: Model) => void
}

const defaultValues = {
    current: {},
    submitAddVehicleForm: () => { },
    setSelectedVehicleModel: () => { }
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

    const setSelectedVehicleModel = (model: Model) => {
        send({
            type: "SET_SELECTED_VEHICLE_MODEL",
            selectedVehicleModel: model
        })
    }

    const submitAddVehicleForm = () => {
        send("SUBMIT")
    }

    return <AddVehicleFormContext.Provider value={{ current, submitAddVehicleForm, setSelectedVehicleModel }}>
        {children}
    </AddVehicleFormContext.Provider>
}