import React, { useContext, useState, useEffect, useCallback } from "react"
import styled from "styled-components"
import { Typography, CardActions, Button } from "@material-ui/core"
import { Card } from "../../components/card"
import { CarImage } from "../../components/car"
import { toLongDateTime, getCarModelString, getRentalContractStatusString, fromSolidityFormat, getCurrencyString } from "../../utils"
import { RentalAgreementStatus } from "../../enums"
import { Web3Context } from "../web3"
import { CurrencyContext } from "../currency"
import rentalContractSC from "./rentalContractSC.json"
import { isAfter, addHours } from "date-fns"
import BigNumber from "bignumber.js"
import { Currency } from "../../enums"

type Props = {
    contract: Contract,
    asOwner: boolean
}

export const RentalContract = ({
    contract,
    asOwner
}: Props) => {

    const { currency: usersCurrency, convertCurrency } = useContext(CurrencyContext)

    const CONTRACT_TERMINATION_GRACE_PERIOD_HOURS = 2

    const { address, startDateTime, endDateTime, totalRentCost, totalBond, vehicleModel, vehicleDescription, status } = contract

    const [convertedBond, setConvertedBond] = useState(new BigNumber(0))
    const [convertedHireFee, setConvertedHireFee] = useState(new BigNumber(0))

    const getConvertedBond = useCallback(async () => {
        setConvertedBond(await convertCurrency(new BigNumber(totalBond), Currency.ETH, usersCurrency))
    }, [usersCurrency, convertCurrency, setConvertedBond, totalBond])

    const getConvertedHireFee = useCallback(async () => {
        setConvertedHireFee(await convertCurrency(new BigNumber(totalRentCost), Currency.ETH, usersCurrency))
    }, [usersCurrency, convertCurrency, setConvertedHireFee, totalRentCost])

    useEffect(() => {
        getConvertedBond()
        getConvertedHireFee()
    }, [usersCurrency, getConvertedBond, getConvertedHireFee])

    const { web3 } = useContext(Web3Context)

    const [rentalContractSmartContract, setRentalContractSmartContract] = useState()

    useEffect(() => {
        // @ts-ignore
        web3 && setRentalContractSmartContract(new web3.eth.Contract(rentalContractSC.abi, address))
    }, [web3, address])

    const isAwaitingApproval = +status === RentalAgreementStatus.PROPOSED

    const isApproved = +status === RentalAgreementStatus.APPROVED

    const isActive = +status === RentalAgreementStatus.ACTIVE

    const ownerCanTerminateContract = isActive && isAfter(new Date(), addHours(endDateTime, CONTRACT_TERMINATION_GRACE_PERIOD_HOURS))

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

    const handleCompleteContract = async () => {
        if (!rentalContractSmartContract) return

        const addresses = await web3.eth.getAccounts()

        await rentalContractSmartContract.methods.endRentalContract()
            .send({
                from: addresses[0]
            })
    }

    const handleForceCompleteContract = async () => {
        if (!rentalContractSmartContract) return

        const addresses = await web3.eth.getAccounts()

        await rentalContractSmartContract.methods.forceEndRentalContract()
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
            <DateRangeField>
                <Typography variant="h6" color="primary" component="span">{toLongDateTime(startDateTime)}</Typography>
                <Typography>&nbsp;-&nbsp;</Typography>
                <Typography variant="h6" color="primary" component="span">{toLongDateTime(endDateTime)}</Typography>
            </DateRangeField>
            <Field>
                <Typography variant="h6" component="span">Bond:</Typography>
                <Typography variant="h6" color="primary" component="span">&nbsp;<span>{getCurrencyString(usersCurrency)}</span>&nbsp;{fromSolidityFormat(convertedBond, usersCurrency).toString()}</Typography>
            </Field>
            <Field>
                <Typography variant="h6" component="span">Total Hire Fee:</Typography>
                <Typography variant="h6" color="primary" component="span">&nbsp;<span>{getCurrencyString(usersCurrency)}</span>&nbsp;{fromSolidityFormat(convertedHireFee, usersCurrency).toString()}</Typography>
            </Field>
            <Field>
                <RentalAgreementStatusIndicator variant="h6" component="span">{getRentalContractStatusString(status)}</RentalAgreementStatusIndicator>
            </Field>
        </ContractDetailsWrapper>
        {
            asOwner && isAwaitingApproval &&
            <StyledCardActions>
                <NegativeActionButton size="small" onClick={handleRejectContract}>
                    Reject
                </NegativeActionButton>
                <ActionButton size="small" color="primary" onClick={handleApproveContract}>
                    Approve
                </ActionButton>
            </StyledCardActions>
        }
        {
            !asOwner && isApproved &&
            <StyledCardActions>
                <ActionButton size="small" color="primary" onClick={handleActivateContract}>
                    Activate
                </ActionButton>
            </StyledCardActions>
        }
        {
            !asOwner && isActive &&
            <StyledCardActions>
                <ActionButton size="small" color="primary" onClick={handleCompleteContract}>
                    End contract
                </ActionButton>
            </StyledCardActions>
        }
        {
            asOwner && ownerCanTerminateContract &&
            <StyledCardActions>
                <NegativeActionButton size="small" color="primary" onClick={handleForceCompleteContract}>
                    Terminate contract
                </NegativeActionButton>
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

const DateRangeField = styled(Field)`
    flex-wrap: wrap;
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

const StyledCardActions = styled(CardActions)`
    justify-content: flex-end;
`

const RentalAgreementStatusIndicator = styled(Typography)`
    text-transform: uppercase;
` as typeof Typography

const ActionButton = styled(Button)`
    &.MuiButton-root {
        border: ${({ theme }) => `solid 2px ${theme.palette.primary.main}`};
        padding: ${({ theme }) => theme.spacing(4)};

        &:hover {
            background-color: ${({ theme }) => theme.palette.primary.main};
            color: ${({ theme }) => theme.palette.common.white};
        }
    }
`

const NegativeActionButton = styled(ActionButton)`
    &.MuiButton-root {
        border: ${({ theme }) => `solid 2px ${theme.palette.error.main}`};
        padding: ${({ theme }) => theme.spacing(4)};
        color: ${({ theme }) => theme.palette.error.main};

        &:hover {
            background-color: ${({ theme }) => theme.palette.error.main};
            color: ${({ theme }) => theme.palette.common.white};
        }
    }
`