import React, { createContext, useEffect, useState } from "react"
import Web3 from "web3"
import contract from "./contract.json"

type ContextProps = {
    linkMyRideContract: any,
    web3: Web3
}

const defaultValues = {
    linkMyRideContract: null,
    web3: new Web3()
}

export const Web3Context = createContext<ContextProps>(defaultValues)

type ProviderProps = {
    children: React.ReactNode
}

export const Web3Provider = ({ children }: ProviderProps) => {

    const [web3, setWeb3] = useState(new Web3())
    const [linkMyRideContract, setLinkMyRideContract] = useState(null)

    useEffect(() => {
        // Modern DApp Browsers
        // @ts-ignore
        if (window.ethereum) {
            // @ts-ignore
            setWeb3(new Web3(window.ethereum))
            try {
                // @ts-ignore
                window.ethereum.enable().then(function () {
                    // User has allowed account access to DApp...
                })
            } catch (e) {
                // User has denied account access to DApp...
            }
        }
        // Legacy DApp Browsers
        // @ts-ignore
        else if (window.web3) {
            // @ts-ignore
            setWeb3(new Web3(window.web3.currentProvider))
        }
        // Non-DApp Browsers
        else {
            alert('You have to install MetaMask !')
        }
    }, [])

    useEffect(() => {
        // @ts-ignore
        web3 && setLinkMyRideContract(new web3.eth.Contract(contract.abi, contract.address))
    }, [web3])

    return <Web3Context.Provider value={{ linkMyRideContract, web3 }}>
        {children}
    </Web3Context.Provider>
}