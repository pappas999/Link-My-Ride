import React, { createContext, useContext } from "react"
import { useMachine } from "@xstate/react"
import { addVehicleFormMachine } from "./addVehicleFormMachine"
import { initAddVehicleFormMachineOptions } from "./initAddVehicleFormMachineOptions"
import { Web3Context } from "../web3"
import { Model } from "../../enums"
import { toSolidityFormat } from "../../utils"
import { CurrencyContext } from "../currency"
import axios from "axios"

type ContextProps = {
    current: any,
    submitAddVehicleForm: () => void,
    setSelectedVehicleModel: (model: Model) => void,
    setVehicleDescription: (description: string) => void,
    setVehicleId: (id: string) => void,
    setApiKey: (apiKey: string) => void,
    setHireFee: (hireFee: string) => void,
    setBond: (bond: string) => void,
    setVehicleLat: (lat: number) => void,
    setVehicleLng: (lng: number) => void
}

const defaultValues = {
    current: {},
    submitAddVehicleForm: () => { },
    setSelectedVehicleModel: () => { },
    setVehicleDescription: () => { },
    setVehicleId: () => { },
    setApiKey: () => { },
    setHireFee: () => { },
    setBond: () => { },
    setVehicleLat: () => { },
    setVehicleLng: () => { }
}

export const AddVehicleFormContext = createContext<ContextProps>(defaultValues)

type ProviderProps = {
    children: React.ReactNode
}

export const AddVehicleFormProvider = ({ children }: ProviderProps) => {

    const { linkMyRideContract, web3 } = useContext(Web3Context)

    const { currency: usersCurrency } = useContext(CurrencyContext)

    // Submit the vehicle in an unapproved state
    const submitVehicle = async (context: any, event: any): Promise<any> => {

        const addresses = await web3.eth.getAccounts()

        return linkMyRideContract.methods.newVehicle(
            addresses[0],
            current.context.vehicleId.toString(),
            toSolidityFormat(current.context.hireFee, usersCurrency).toString(),
            toSolidityFormat(current.context.bond, usersCurrency).toString(),
            usersCurrency,
            current.context.selectedVehicleModel,
            current.context.vehicleDescription,
            "36000000",
            "-115000000"
        ).send({
            from: addresses[0]
        })
    }

    // Pass the vehicle ID and api token to the external adapter to validate it and approve the vehicle
    const requestVehicleApproval = async (context: any, event: any): Promise<any> => {

        const headers = {
            "Content-Type": "application/json"
        }

        const addresses = await web3.eth.getAccounts()

        return await axios.post(
            "/.netlify/functions/requestVehicleApproval",
            {
                "email": process.env.REACT_APP_NODE_USERNAME,
                "password": process.env.REACT_APP_NODE_PASSWORD,
                "apiToken": current.context.apiKey.toString(),
                "vehicleId": current.context.vehicleId.toString(),
                "address": addresses[0]
            },
            {
                headers
            }
        )
            .catch((err: any) => {
                console.error(err)
                throw err
            })
    }

    const machineOptions = initAddVehicleFormMachineOptions(submitVehicle, requestVehicleApproval)
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

    const setVehicleLat = (lat: number) => {
        send({
            type: "SET_LAT",
            lat
        })
    }

    const setVehicleLng = (lng: number) => {
        send({
            type: "SET_LNG",
            lng
        })
    }

    const submitAddVehicleForm = () => {
        send("SUBMIT")
    }

    return <AddVehicleFormContext.Provider value={{
        current,
        submitAddVehicleForm,
        setSelectedVehicleModel,
        setVehicleDescription,
        setVehicleId,
        setApiKey,
        setHireFee,
        setBond,
        setVehicleLat,
        setVehicleLng
    }}>
        {children}
    </AddVehicleFormContext.Provider>
}