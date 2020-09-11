import React from "react"
import styled from "styled-components"
import Web3 from "web3"
import { Typography } from "@material-ui/core"
import { Card } from "../../components/card"
import { CarImage } from "../../components/car"
import { EtherSymbol, toEther, toLongDateTime, getCarModelString } from "../../utils"

type Props = {
    contract: Contract
}

export const RentalContract = ({
    contract
}: Props) => {

    const { startDateTime, endDateTime, totalRentCost, totalBond, vehicleModel, vehicleDescription } = contract

    return <Card>
        <CarDetailsWrapper>
            <CarDetailsTextWrapper>
                <Typography variant="h5" component="span">{getCarModelString(vehicleModel)}</Typography>
                <VehicleDescription variant="body2">{vehicleDescription}</VehicleDescription>
            </CarDetailsTextWrapper>
            <StyledCarImage model={vehicleModel} />
        </CarDetailsWrapper>
        <ContractDetailsWrapper>
            <Field>
                <Typography variant="h6" color="primary" component="span">{toLongDateTime(startDateTime)}</Typography>
                <Typography>&nbsp;-&nbsp;</Typography>
                <Typography variant="h6" color="primary" component="span">{toLongDateTime(endDateTime)}</Typography>
            </Field>
            <Field>
                <Typography variant="h6" component="span">Bond:</Typography>
                <Typography variant="h6" color="primary" component="span">&nbsp;<EtherSymbol />{toEther(totalBond)}</Typography>
            </Field>
            <Field>
                <Typography variant="h6" component="span">Rental Cost:</Typography>
                <Typography variant="h6" color="primary" component="span">&nbsp;<EtherSymbol />{toEther(totalRentCost)}</Typography>
            </Field>
        </ContractDetailsWrapper>
    </Card>
}

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