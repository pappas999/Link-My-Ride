import React, { createContext, useContext } from "react"
import { useMachine } from "@xstate/react"
import { addVehicleFormMachine } from "./addVehicleFormMachine"
import { initAddVehicleFormMachineOptions } from "./initAddVehicleFormMachineOptions"
import { Web3Context } from "../web3"
import { Model } from "../../enums"
import { toSolidityFormat } from "../../utils"
import { CurrencyContext } from "../currency"

type ContextProps = {
    current: any,
    submitAddVehicleForm: () => void,
    setSelectedVehicleModel: (model: Model) => void,
    setVehicleDescription: (description: string) => void,
    setVehicleId: (id: string) => void,
    setApiKey: (apiKey: string) => void,
    setHireFee: (hireFee: string) => void,
    setBond: (bond: string) => void
}

const defaultValues = {
    current: {},
    submitAddVehicleForm: () => { },
    setSelectedVehicleModel: () => { },
    setVehicleDescription: () => { },
    setVehicleId: () => { },
    setApiKey: () => { },
    setHireFee: () => { },
    setBond: () => { }
}

export const AddVehicleFormContext = createContext<ContextProps>(defaultValues)

type ProviderProps = {
    children: React.ReactNode
}

export const AddVehicleFormProvider = ({ children }: ProviderProps) => {

    const { linkMyRideContract, web3 } = useContext(Web3Context)
    
    const { currency: usersCurrency } = useContext(CurrencyContext)

    const submitVehicle = async (context: any, event: any): Promise<any> => {
        // TODO: Pass the API key to the external adapter to validate it.
        // If valid, hash it and persist to SC, else error.
        const fakeApiKeyHash = "123123123"

        const addresses = await web3.eth.getAccounts()

        return linkMyRideContract.methods.newVehicle(
            addresses[0],
            current.context.vehicleId.toString(),
            fakeApiKeyHash,
            toSolidityFormat(current.context.hireFee, usersCurrency).toString(),
            toSolidityFormat(current.context.bond, usersCurrency).toString(),
            usersCurrency,
            current.context.selectedVehicleModel,
            current.context.vehicleDescription
        ).send({
            from: addresses[0]
        })
    }

    const machineOptions = initAddVehicleFormMachineOptions(submitVehicle)
    const [current, send] = useMachine(addVehicleFormMachine, machineOptions)

    const setSelectedVehicleModel = (model: Model) => {
        send({
            type: "SET_SELECTED_VEHICLE_MODEL",
            selectedVehicleModel: model
        })
    }

    const setVehicleDescription = (description: string) => {
        send({
            type: "SET_VEHICLE_DESCRIPTION",
            value: description
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

    const setHireFee = (hireFee: string) => {
        send({
            type: "SET_HIRE_FEE",
            value: hireFee
        })
    }

    const setBond = (bond: string) => {
        send({
            type: "SET_BOND",
            value: bond
        })
    }

    const submitAddVehicleForm = () => {
        send("SUBMIT")
    }

    return <AddVehicleFormContext.Provider value={{ current, submitAddVehicleForm, setSelectedVehicleModel, setVehicleDescription, setVehicleId, setApiKey, setHireFee, setBond }}>
        {children}
    </AddVehicleFormContext.Provider>
}