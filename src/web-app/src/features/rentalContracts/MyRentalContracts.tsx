import React, { useContext, useCallback, useEffect, useState } from "react"
import styled from "styled-components"
import { Web3Context } from "../web3"
import { RentalContract } from "./RentalContract"
import { Typography } from "@material-ui/core"
import { NoRentalContract } from "./NoRentalContract"
import rentalContractSC from "./rentalContractSC.json"
import { useInterval } from "../../utils"

type Props = {
    asOwner?: boolean
}

export const MyRentalContracts = ({
    asOwner = false
}: Props) => {

    const POLLING_INTERVAL = 5000 // Poll for updates every 5 seconds

    const { linkMyRideContract, web3 } = useContext(Web3Context)

    const [myContracts, setMyContracts] = useState<Contract[]>([])

    const getMyContracts = useCallback(async () => {

        const addresses = await web3.eth.getAccounts()

        const contractAddresses = await linkMyRideContract.methods.getRentalContracts(asOwner ? 1 : 0, addresses[0]).call()

        const contracts = await Promise.all(contractAddresses.map(async (address: string) => {

            // @ts-ignore
            const rentalAgreementContract = await new web3.eth.Contract(rentalContractSC.abi, address)

            const agreementDetails = await rentalAgreementContract.methods.getAgreementDetails().call()

            const agreementData = await rentalAgreementContract.methods.getAgreementData().call()

            const paymentDetails = await rentalAgreementContract.methods.getPaymentDetails().call()

            return {
                address,
                details: agreementDetails,
                agreementData,
                paymentDetails
            }
        }))

        const vehicles = await Promise.all(contracts.map(async (contract: any) => await linkMyRideContract.methods.getVehicle(contract.details[0]).call()))

        setMyContracts(contracts.map((contract: any) => {

            const vehicle = vehicles.find((vehicle) => vehicle[1] === contract.details[0])

            return {
                address: contract.address,
                owner: contract.details[0],
                renter: contract.details[1],
                startDateTime: new Date(contract.details[2] * 1000),
                endDateTime: new Date(contract.details[3] * 1000),
                totalRentCost: contract.details[4],
                totalBond: contract.details[5],
                status: contract.details[6],
                ownerCurrency: vehicle[4],
                vehicleModel: vehicle[5],
                vehicleDescription: vehicle[6],
                startOdometer: contract.agreementData[0],
                startChargeState: contract.agreementData[1],
                startVehicleLongitude: contract.agreementData[2],
                startVehicleLatitude: contract.agreementData[3],
                endOdometer: contract.agreementData[4],
                endChargeState: contract.agreementData[5],
                endVehicleLongitude: contract.agreementData[6],
                endVehicleLatitude: contract.agreementData[7],
                rentalAgreementEndDateTime: new Date(contract.paymentDetails[0] * 1000),
                totalLocationPenalty: contract.paymentDetails[1],
                totalOdometerPenalty: contract.paymentDetails[2],
                totalChargePenalty: contract.paymentDetails[3],
                totalTimePenalty: contract.paymentDetails[4],
                totalPlatformFee: contract.paymentDetails[5],
                totalRentPayable: contract.paymentDetails[6],
                totalBondReturned: contract.paymentDetails[7]
            }
        }))
    }, [asOwner, linkMyRideContract, web3])

    useEffect(() => {
        if (web3 && linkMyRideContract) {
            getMyContracts()
        }
    }, [web3, linkMyRideContract, getMyContracts])

    useInterval(async () => {
        if (web3 && linkMyRideContract) {
            getMyContracts()
        }
    }, [POLLING_INTERVAL])


    return <Wrapper>
        <Heading variant="h4">My rental contracts:</Heading>
        <ContractsContainer>
            {
                myContracts.length > 0 ? myContracts.map((contract, index) => <RentalContract
                    key={index}
                    contract={contract}
                    asOwner={asOwner}
                />) : <NoRentalContract asOwner={asOwner} />
            }
        </ContractsContainer>
    </Wrapper>
}

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
`

const Heading = styled(Typography)`
    color: ${({ theme }) => theme.palette.common.white};

    &.MuiTypography-root {
        margin-top: ${({ theme }) => theme.spacing(8)};
    }
    
`

const ContractsContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    padding: ${({ theme }) => theme.spacing(2)};
`