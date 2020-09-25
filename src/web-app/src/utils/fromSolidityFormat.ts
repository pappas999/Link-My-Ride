import { Currency } from "../enums"
import BigNumber from "bignumber.js"

// Converts BigNumber with the amount of decimal places expected by the Solidity to human-friendly amount
export const fromSolidityFormat = (amount: BigNumber, currency: Currency) => {

    const ETH = new BigNumber("1e18")
    const FIAT = new BigNumber("1e8")

    const amountAsBN = new BigNumber(amount)

    let result = new BigNumber(0)

    switch (+currency) {
        case Currency.ETH:
            result = amountAsBN.dividedBy(ETH)
            break
        case Currency.USD:
            result = amountAsBN.dividedBy(FIAT)
            break
        case Currency.GBP:
            result = amountAsBN.dividedBy(FIAT)
            break
        case Currency.AUD:
            result = amountAsBN.dividedBy(FIAT)
            break
    }

    const decimalPlaces = +currency === Currency.ETH ? 3 : 2

    return result.decimalPlaces(decimalPlaces).toFixed(decimalPlaces)
}