import React, { createContext, useContext, useState } from "react"
import { Web3Context } from "../web3"
import { Currency } from "../../enums"
import BigNumber from "bignumber.js"

type ContextProps = {
    currency: Currency,
    setCurrency: (currency: Currency) => void,
    convertCurrency: (value: BigNumber, fromCurrency: Currency, toCurrency: Currency) => Promise<BigNumber>
}

const defaultValues = {
    currency: Currency.ETH,
    setCurrency: () => {},
    convertCurrency: () => Promise.resolve(new BigNumber(0))
}

export const CurrencyContext = createContext<ContextProps>(defaultValues)

type ProviderProps = {
    children: React.ReactNode
}

export const CurrencyProvider = ({ children }: ProviderProps) => {

    const { linkMyRideContract } = useContext(Web3Context)

    const [currency, setCurrency] = useState<Currency>(Currency.ETH)

    const convertCurrency = async (value: BigNumber, fromCurrency: Currency, toCurrency: Currency): Promise<BigNumber> => {

        // No conversion to do
        if (fromCurrency === toCurrency) return value

        // First get the value as ETH
        let asEth = value
        if (fromCurrency !== Currency.ETH) {
            asEth = await linkMyRideContract.methods.convertFiatToEth(value.toString(), fromCurrency.toString()).call()
        }

        // Convert from ETH and return
        if (toCurrency === Currency.ETH) {
            return asEth
        }
        else {
            return await linkMyRideContract.methods.convertEthToFiat(asEth.toString(), toCurrency.toString()).call()
        }
    }

    return <CurrencyContext.Provider value={{ currency, setCurrency, convertCurrency }}>
        {children}
    </CurrencyContext.Provider>
}