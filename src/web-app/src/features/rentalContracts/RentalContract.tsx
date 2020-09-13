import React, { useContext, useState, useEffect } from "react"
import styled from "styled-components"
import { Typography, CardActions, Button } from "@material-ui/core"
import { Card } from "../../components/card"
import { CarImage } from "../../components/car"
import { EtherSymbol, toEther, toLongDateTime, getCarModelString, getRentalContractStatusString } from "../../utils"
import { RentalAgreementStatus } from "../../enums"
import { Web3Context } from "../web3"
import rentalContractSC from "./rentalContractSC.json"

type Props = {
    contract: Contract,
    asOwner: boolean
}

export const RentalContract = ({
    contract,
    asOwner
}: Props) => {


    const { address, startDateTime, endDateTime, totalRentCost, totalBond, vehicleModel, vehicleDescription, status } = contract

    const { web3 } = useContext(Web3Context)

    const [rentalContractSmartContract, setRentalContractSmartContract] = useState()

    useEffect(() => {
        // @ts-ignore
        web3 && setRentalContractSmartContract(new web3.eth.Contract(rentalContractSC.abi, address))
    }, [web3])

    const awaitingApproval = status == RentalAgreementStatus.PROPOSED

    const approved = status == RentalAgreementStatus.APPROVED

    const handleRejectContract = async () => {
        if (!rentalContractSmartContract) return

        const addresses = await web3.eth.getAccounts()

        await rentalContractSmartContract.methods.rejectContract()
            .send({
                from: addresses[0]
            })
    }

    const handleApproveContract = async () => {
        if (!rentalContractSmartContract) return

        const addresses = await web3.eth.getAccounts()

        await rentalContractSmartContract.methods.approveContract()
            .send({
                from: addresses[0]
            })
    }

    const handleActivateContract = async () => {
        if (!rentalContractSmartContract) return

        const addresses = await web3.eth.getAccounts()

        await rentalContractSmartContract.methods.activateRentalContract()
            .send({
                from: addresses[0]
            })
    }

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
                <Typography variant="h6" component="span">Total Hire Fee:</Typography>
                <Typography variant="h6" color="primary" component="span">&nbsp;<EtherSymbol />{toEther(totalRentCost)}</Typography>
            </Field>
            <Field>
                <RentalAgreementStatusIndicator variant="h6" component="span">{getRentalContractStatusString(status)}</RentalAgreementStatusIndicator>
            </Field>
        </ContractDetailsWrapper>
        {
            asOwner && awaitingApproval &&
            <StyledCardActions>
                <Button size="small" color="secondary" onClick={handleRejectContract}>
                    Reject
            </Button>
                <Button size="small" color="primary" onClick={handleApproveContract}>
                    Approve
            </Button>
            </StyledCardActions>
        }
        {
            !asOwner && approved &&
            <StyledCardActions>
                <Button size="small" color="primary" onClick={handleActivateContract}>
                    Activate
                </Button>
            </StyledCardActions>
        }
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

const StyledCardActions = styled(CardActions)`
    justify-content: flex-end;
`

const RentalAgreementStatusIndicator = styled(Typography)`
    text-transform: uppercase;
` as typeof Typography