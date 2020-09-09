import React from "react"
import styled from "styled-components"
import Web3 from "web3"
import { Card, CardContent, Typography } from "@material-ui/core"
import { Model } from "../../enums/Model"

type Props = {
    car: Car
}

export const CarDetailsCard = ({ car }: Props) => {

    if (!car) return null

    const getCarModelString = (model: Model) => {
        let result = ""

        switch (+model) {
            case Model.Model_S:
                result = "Model S"
                break
            case Model.Model_X:
                result = "Model X"
                break
            case Model.Model_Y:
                result = "Model Y"
                break
            case Model.Model_3:
                result = "Model 3"
                break
            case Model.Cybertruck:
                result = "Cybertruck"
                break
            case Model.Roadster:
                result = "Roadster"
                break
        }

        return result
    }

    return <Card>
        <CardContent>
            <Typography variant="h5" component="h2">{getCarModelString(car.model)}</Typography>
            <Description color="textSecondary">{car.description}</Description>
            <Typography variant="h6" component="h4">Base Hire Fee:</Typography>
            <Typography color="textSecondary">&#x39e; {Web3.utils.fromWei(car.baseHireFee.toString(), "ether")}</Typography>
            <Typography variant="h6" component="h4">Bond Required:</Typography>
            <Typography color="textSecondary">&#x39e; {Web3.utils.fromWei(car.bondRequired.toString(), "ether")}</Typography>
        </CardContent>
    </Card>
}

const Description = styled(Typography)`
    margin-bottom: ${({theme}) => theme.spacing(2)}
`