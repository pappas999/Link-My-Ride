import React, { useContext, useEffect, useState } from "react"
import styled from "styled-components"
import { Web3Context } from "../web3"
import { Typography } from "@material-ui/core"
import { NoVehicle } from "./NoVehicle"
import { Vehicle } from "./Vehicle"

export const MyVehicle = () => {

    const { linkMyRideContract, web3 } = useContext(Web3Context)

    const [myVehicle, setMyVehicle] = useState<Car>()

    const getMyVehicle = async () => {

        const addresses = await web3.eth.getAccounts()

        const vehicle = await linkMyRideContract.methods.getVehicle(addresses[0]).call()

        if (vehicle[0] != 0) {
            setMyVehicle({
                id: vehicle[0],
                address: vehicle[1],
                apiTokenHash: vehicle[2],
                baseHireFee: vehicle[3],
                bondRequired: vehicle[4],
                model: vehicle[5],
                description: vehicle[6],
                lat: 0,
                lng: 0
            })
        }
    }

    useEffect(() => {
        if (web3 && linkMyRideContract) {
            getMyVehicle()
        }
    }, [web3, linkMyRideContract])

    return <Wrapper>
        <Heading variant="h4">My vehicle:</Heading>
        {
            myVehicle ? <Vehicle car={myVehicle} /> : <NoVehicle />
        }
    </Wrapper>
}

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    padding: ${({ theme }) => theme.spacing(6)};
`

const Heading = styled(Typography)`
    color: ${({ theme }) => theme.palette.common.white};
`