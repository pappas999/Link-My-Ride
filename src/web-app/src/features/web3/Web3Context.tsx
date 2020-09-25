import React, { createContext, useEffect, useState } from "react"
import Web3 from "web3"
import contract from "./contract.json"
// @ts-ignore
import detectEthereumProvider from "@metamask/detect-provider"
import { toast } from "react-toastify"

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
        
        // @ts-ignore
        if (provider) {
            // @ts-ignore
            if (provider !== window.ethereum) {
                console.error('Do you have multiple wallets installed?')
            }

            // @ts-ignore
            const web3 = new Web3(provider)
            setWeb3(web3)

            const network = await web3.eth.net.getNetworkType()
            if (network !== "kovan") {
                toast.error('🧪 Please switch to the Kovan Testnet', {
                    autoClose: false
                })
            }

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
            toast.error('🤖 Please install an Ethereum-compatible browser or extension like MetaMask to use this dApp', {
                autoClose: false
            })
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