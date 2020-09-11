import React from "react"
import styled from "styled-components"
import Web3 from "web3"
import { Typography } from "@material-ui/core"
import { Card } from "../../components/card"
import { format } from "date-fns"

type Props = {
    contract: Contract
}

export const RentalContract = ({
    contract
}: Props) => {

    const { startDateTime, endDateTime, totalRentCost, totalBond } = contract

    return <Card>
        <Field>
            <Typography variant="h6" color="primary">{format(startDateTime, "dd MMM yyyy haaa")}</Typography>
            <Typography>&nbsp;-&nbsp;</Typography>
            <Typography variant="h6" color="primary">{format(endDateTime, "dd MMM yyyy haaa")}</Typography>
        </Field>
        <Field>
            <Typography variant="h6">Rental Cost:</Typography>
            <Typography>&nbsp;&#x39e; {Web3.utils.fromWei(totalRentCost.toString(), 'ether')}</Typography>
        </Field>
        <Field>
            <Typography variant="h6">Bond:</Typography>
            <Typography>&nbsp;&#x39e; {Web3.utils.fromWei(totalBond.toString(), 'ether')}</Typography>
        </Field>
    </Card>
}

const Field = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
`
