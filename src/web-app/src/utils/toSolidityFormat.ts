import { Currency } from "../enums"
import BigNumber from "bignumber.js"

// Converts human-friendly amount to BigNumber with the amount of decimal places expected by the Solidity
export const toSolidityFormat = (amount: string, currency: Currency) => {

    if (!amount) return amount

    const ETH = new BigNumber("1e18")
    const FIAT = new BigNumber("1e8")

    const amountAsBN = new BigNumber(amount)

    let result = new BigNumber(0)

    switch (+currency) {
        case Currency.ETH:
            result = amountAsBN.multipliedBy(ETH)
            break
        case Currency.USD:
            result = amountAsBN.multipliedBy(FIAT)
            break
        case Currency.GBP:
            result = amountAsBN.multipliedBy(FIAT)
            break
        case Currency.AUD:
            result = amountAsBN.multipliedBy(FIAT)
            break
    }

    return result
}