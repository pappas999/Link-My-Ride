import React from "react"
import styled from "styled-components"
import { Typography } from "@material-ui/core"
import { Card } from "../../components/card"
import { CarImage } from "../../components/car"
import { getCurrencyString, weiToEther, getCarModelString } from "../../utils"

type Props = {
    car: Car
}

export const Vehicle = ({
    car
}: Props) => {

    if (!car) return null

    const { model,
        description,
        baseHireFee,
        bondRequired,
        currency } = car

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
                {/* TODO: Replace currency symbol and 'weiToEther' with some conversion from vehicle currency to user's currency */}
                <Typography variant="h6" color="primary" component="span"><span>{getCurrencyString(currency)}</span>&nbsp;{weiToEther(bondRequired)}</Typography>
            </Field>
            <Field>
                <Typography variant="h6" component="span">Hourly Hire Fee:</Typography>
                {/* TODO: Replace currency symbol and 'weiToEther' with some conversion from vehicle currency to user's currency */}
                <Typography variant="h6" color="primary" component="span"><span>{getCurrencyString(currency)}</span>&nbsp;{weiToEther(baseHireFee)}</Typography>
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
    align-items: flex-start;
    width: 100%;
    margin-bottom: ${({ theme }) => theme.spacing(4)};
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