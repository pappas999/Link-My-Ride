import React, { createContext } from "react"
import Web3 from "web3"
import contract from "./contract.json"

type ContextProps = {
    linkMyRideContract: any
}

const defaultValues = {
    linkMyRideContract: null
}

export const Web3Context = createContext<ContextProps>(defaultValues)

type ProviderProps = {
    children: React.ReactNode
}

export const Web3Provider = ({ children }: ProviderProps) => {

    const web3 = new Web3(Web3.givenProvider || "http://localhost:8545")

    // @ts-ignore
    const linkMyRideContract = new web3.eth.Contract(contract.abi, contract.address)

    return <Web3Context.Provider value={{ linkMyRideContract }}>
        {children}
    </Web3Context.Provider>
}