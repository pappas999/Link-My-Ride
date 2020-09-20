import React, { useContext } from "react"
import styled from "styled-components"
import { Select, MenuItem, Typography } from "@material-ui/core"
import { Currency } from "../../enums"
import { getCurrencyString } from "../../utils"
import { CurrencyContext } from "../currency"

export const CurrencySelector = () => {

    const { currency, setCurrency } = useContext(CurrencyContext)

    const handleCurrencyChange = (event: any) => {
        setCurrency(event.target.value)
    }

    return <Container>
        <Label variant="h6" component="span">Select currency:</Label>
        <CurrencySelect
            value={currency}
            onChange={handleCurrencyChange}
        >
            <MenuItem key={Currency.ETH} value={Currency.ETH}>{getCurrencyString(Currency.ETH)}</MenuItem>
            <MenuItem key={Currency.USD} value={Currency.USD}>{getCurrencyString(Currency.USD)}</MenuItem>
            <MenuItem key={Currency.GBP} value={Currency.GBP}>{getCurrencyString(Currency.GBP)}</MenuItem>
            <MenuItem key={Currency.AUD} value={Currency.AUD}>{getCurrencyString(Currency.AUD)}</MenuItem>
        </CurrencySelect>
    </Container>
}

const Container = styled.div`
    background-color: ${({theme}) => theme.palette.common.white};
    padding: ${({theme}) => theme.spacing(4)};
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    border-radius: ${({theme}) => `${theme.typography.pxToRem(10)} 0 0 ${theme.typography.pxToRem(10)}`};
    border: ${({theme}) => `${theme.typography.pxToRem(4)} solid ${theme.palette.secondary.main}`};
`

const Label = styled(Typography)`
    padding-right: ${({theme}) => theme.spacing(2)};

    @media (max-width: 600px) {
        display: none;
    }
` as typeof Typography

const CurrencySelect = styled(Select)`
    padding: ${({theme}) => `0 ${theme.spacing(4)}`};
`