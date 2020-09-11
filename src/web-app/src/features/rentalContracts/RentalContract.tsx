import React from "react"
import styled from "styled-components"
import Web3 from "web3"
import { Typography } from "@material-ui/core"
import { Card } from "../../components/card"
import { EtherSymbol, toEther, toLongDateTime } from "../../utils"

type Props = {
    contract: Contract
}

export const RentalContract = ({
    contract
}: Props) => {

    const { startDateTime, endDateTime, totalRentCost, totalBond } = contract

    return <Card>
        <Field>
            <Typography variant="h6" color="primary">{toLongDateTime(startDateTime)}</Typography>
            <Typography>&nbsp;-&nbsp;</Typography>
            <Typography variant="h6" color="primary">{toLongDateTime(endDateTime)}</Typography>
        </Field>
        <Field>
            <Typography variant="h6">Rental Cost:</Typography>
            <Typography>&nbsp;<EtherSymbol/>&nbsp;{toEther(totalRentCost)}</Typography>
        </Field>
        <Field>
            <Typography variant="h6">Bond:</Typography>
            <Typography>&nbsp;<EtherSymbol/>&nbsp;{toEther(totalBond)}</Typography>
        </Field>
    </Card>
}

const Field = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
`
