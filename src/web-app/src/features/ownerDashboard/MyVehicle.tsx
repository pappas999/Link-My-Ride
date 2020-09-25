import React, { useContext, useCallback, useEffect, useState } from "react"
import styled from "styled-components"
import { Web3Context } from "../web3"
import { Typography } from "@material-ui/core"
import { NoVehicle } from "./NoVehicle"
import { Vehicle } from "./Vehicle"
import { useInterval } from "../../utils"

export const MyVehicle = () => {

    const POLLING_INTERVAL = 5000 // Poll for updates every 5 seconds

    const { linkMyRideContract, web3 } = useContext(Web3Context)

    const [myVehicle, setMyVehicle] = useState<Car>()

    const getMyVehicle = useCallback(async () => {

        const addresses = await web3.eth.getAccounts()

        const vehicle = await linkMyRideContract.methods.getVehicle(addresses[0]).call()

        if (vehicle[0] !== "0") {
            setMyVehicle({
                id: +vehicle[0],
                address: vehicle[1],
                baseHireFee: vehicle[2],
                bondRequired: vehicle[3],
                currency: vehicle[4],
                model: vehicle[5],
                description: vehicle[6],
                lat: +vehicle[7],
                lng: +vehicle[8],
                status: vehicle[9]
            })
        }
    }, [linkMyRideContract, web3])

    useEffect(() => {
        if (web3 && linkMyRideContract) {
            getMyVehicle()
        }
    }, [web3, linkMyRideContract, getMyVehicle])

    useInterval(async () => {
        if (web3 && linkMyRideContract) {
            getMyVehicle()
        }
    }, [POLLING_INTERVAL])

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