import React from "react"
import styled from "styled-components"
import Web3 from "web3"
import { Card, CardContent, Typography } from "@material-ui/core"
import { Model } from "../../enums/Model"
import { EtherSymbol, toEther, getCarModelString } from "../../utils"


type Props = {
    car: Car
}

export const CarDetailsCard = ({ car }: Props) => {

    if (!car) return null

    return <Card>
        <CardContent>
            <Typography variant="h5" component="h2">{getCarModelString(car.model)}</Typography>
            <Description color="textSecondary">{car.description}</Description>
            <Typography variant="h6" component="h4">Base Hire Fee:</Typography>
            <Typography color="textSecondary"><EtherSymbol/>&nbsp;{toEther(car.baseHireFee)}</Typography>
            <Typography variant="h6" component="h4">Bond Required:</Typography>
            <Typography color="textSecondary"><EtherSymbol/>&nbsp;{toEther(car.bondRequired)}</Typography>
        </CardContent>
    </Card>
}

const Description = styled(Typography)`
    margin-bottom: ${({theme}) => theme.spacing(2)}
`