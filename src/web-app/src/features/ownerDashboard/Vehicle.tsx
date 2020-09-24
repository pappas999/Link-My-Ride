import React, { useContext, useEffect, useState, useCallback } from "react"
import styled from "styled-components"
import { Typography } from "@material-ui/core"
import { Card } from "../../components/card"
import { CarImage } from "../../components/car"
import { getCurrencyString, getCarModelString, fromSolidityFormat, getVehicleStatusString } from "../../utils"
import { CurrencyContext } from "../currency"
import BigNumber from "bignumber.js"

type Props = {
    car: Car
}

export const Vehicle = ({
    car
}: Props) => {

    const { currency: usersCurrency, convertCurrency } = useContext(CurrencyContext)

    const [convertedBond, setConvertedBond] = useState(new BigNumber(0))
    const [convertedHireFee, setConvertedHireFee] = useState(new BigNumber(0))

    const getConvertedBond = useCallback(async () => {
        setConvertedBond(await convertCurrency(new BigNumber(car.bondRequired), car.currency, usersCurrency))
    }, [usersCurrency, car, convertCurrency, setConvertedBond])

    const getConvertedHireFee = useCallback(async () => {
        setConvertedHireFee(await convertCurrency(new BigNumber(car.baseHireFee), car.currency, usersCurrency))
    }, [usersCurrency, car, convertCurrency, setConvertedHireFee])

    useEffect(() => {
        getConvertedBond()
        getConvertedHireFee()
    }, [usersCurrency, getConvertedBond, getConvertedHireFee])

    if (!car) return null

    const { model, description, status } = car

    return <StyledCard>
        <CarDetailsWrapper>
            <CarDetailsTextWrapper>
                <Typography variant="h5" component="span">{getCarModelString(model)}</Typography>
                <VehicleDescription variant="body2">{description}</VehicleDescription>
            </CarDetailsTextWrapper>
            <StyledCarImage model={model} />
        </CarDetailsWrapper>
        <ContractDetailsWrapper>
            <Field>
                <Typography variant="h6" component="span">Required Bond:</Typography>
                <Typography variant="h6" color="primary" component="span">&nbsp;<span>{getCurrencyString(usersCurrency)}</span>&nbsp;{fromSolidityFormat(convertedBond, usersCurrency).toString()}</Typography>
            </Field>
            <Field>
                <Typography variant="h6" component="span">Hourly Hire Fee:</Typography>
                <Typography variant="h6" color="primary" component="span">&nbsp;<span>{getCurrencyString(usersCurrency)}</span>&nbsp;{fromSolidityFormat(convertedHireFee, usersCurrency).toString()}</Typography>
            </Field>
            <Field>
                <VehicleStatusIndicator variant="h6" component="span">{getVehicleStatusString(status)}</VehicleStatusIndicator>
            </Field>
        </ContractDetailsWrapper>
    </StyledCard>
}

const StyledCard = styled(Card)`
    max-width: ${({ theme }) => theme.typography.pxToRem(450)};
`

const Field = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
`

const VehicleDescription = styled(Typography)`
    margin-bottom: ${({ theme }) => theme.spacing(4)};
`

const StyledCarImage = styled(CarImage)`
    width: 200px;
`

const CarDetailsWrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;
    width: 100%;
    margin-bottom: ${({ theme }) => theme.spacing(4)};
    flex-wrap: wrap-reverse;
`

const CarDetailsTextWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
`

const ContractDetailsWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: flex-start;
`

const VehicleStatusIndicator = styled(Typography)`
    text-transform: uppercase;
` as typeof Typography