import React, { useContext, useEffect, useState } from "react"
import styled from "styled-components"
import { Web3Context } from "../web3"
import { RentalContract } from "./RentalContract"
import { Typography } from "@material-ui/core"

type Props = {
    asOwner?: boolean
}

export const MyRentalContracts = ({
    asOwner = false
}: Props) => {

    const { linkMyRideContract, web3 } = useContext(Web3Context)

    const [myContracts, setMyContracts] = useState<Contract[]>([])

    const getMyContracts = async () => {

        const addresses = await web3.eth.getAccounts()

        // const contracts = await linkMyRideContract.methods.getRentalContracts(asOwner ? 1 : 0, addresses[0]).call()

        const contractAddresses = await linkMyRideContract.methods.getRentalContracts(1, "0x54a47c5e6a6CEc35eEB23E24C6b3659eE205eE35").call()

        const contracts = await Promise.all(contractAddresses.map(async (address: string) => await linkMyRideContract.methods.getRentalContract(address).call()))

        const vehicles = await Promise.all(contracts.map(async (contract: any) => await linkMyRideContract.methods.getVehicle(contract[0]).call()))

        setMyContracts(contracts.map((contract: any) => {

            const vehicle = vehicles.find((vehicle) => vehicle[1] === contract[0])

            return {
                owner: contract[0],
                renter: contract[1],
                startDateTime: new Date(contract[2] * 1000),
                endDateTime: new Date(contract[3] * 1000),
                totalRentCost: contract[4],
                totalBond: contract[5],
                vehicleModel: vehicle[5],
                vehicleDescription: vehicle[6]
            }
        }))
    }

    useEffect(() => {
        if (web3 && linkMyRideContract) {
            getMyContracts()
        }
    }, [web3, linkMyRideContract])

    return <Wrapper>
        <Heading variant="h4">My rental contracts:</Heading>
        <ContractsContainer>
            {
                myContracts.map(contract => <RentalContract
                    contract={contract}
                />)
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
`

const ContractsContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
`