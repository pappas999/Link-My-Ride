import React, { createContext, useEffect, useState } from "react"
import Web3 from "web3"
import contract from "./contract.json"
// @ts-ignore
import detectEthereumProvider from "@metamask/detect-provider"

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

    const [web3, setWeb3] = useState()
    const [linkMyRideContract, setLinkMyRideContract] = useState(null)

    const detectProvider = async () => {
        const provider = await detectEthereumProvider()
        console.log(provider)

        // Modern DApp Browsers
        // @ts-ignore
        if (provider) {
            // @ts-ignore
            if (provider !== window.ethereum) {
                console.error('Do you have multiple wallets installed?')
            }

            // @ts-ignore
            setWeb3(new Web3(provider))
            try {
                // @ts-ignore
                provider.enable().then(function () {
                    // User has allowed account access to DApp...
                })
            } catch (e) {
                // User has denied account access to DApp...
            }
        }
        else {
            alert('Please install an Ethereum-compatible browser or extension like MetaMask to use this dApp')
        }
    }

    useEffect(() => {
        detectProvider()
    }, [])

    useEffect(() => {
        // @ts-ignore
        web3 && setLinkMyRideContract(new web3.eth.Contract(contract.abi, contract.address))
    }, [web3])

    return <Web3Context.Provider value={{ linkMyRideContract, web3 }}>
        {children}
    </Web3Context.Provider>
}