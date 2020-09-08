import React, { useContext, useEffect, useState } from "react"
import styled from "styled-components"
import { Typography, CircularProgress } from "@material-ui/core"
import { MuiPickersUtilsProvider, KeyboardDateTimePicker } from "@material-ui/pickers"
import { RentalFormContext } from "./RentalFormContext"
import DateFnsUtils from "@date-io/date-fns"
import { Map } from "../../components/map"
import Web3 from "web3"

export const RentalForm = () => {

    const { current, setSelectedDate } = useContext(RentalFormContext)

    const handleChildClick = (key: any, childProps: any) => {
        console.log("key: " + key)
        console.log("childProps: " + JSON.stringify(childProps))
    }

    const [dummyCarData, setDummyCarData] = useState({})

    const loadBlockchainData = async () => {
        const web3 = new Web3(Web3.givenProvider || "http://localhost:8545")
        const contract = new web3.eth.Contract(
            [
                {
                    "constant": true,
                    "inputs": [],
                    "name": "getRentalContracts",
                    "outputs": [
                        {
                            "name": "",
                            "type": "address"
                        }
                    ],
                    "payable": false,
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "constant": true,
                    "inputs": [],
                    "name": "ORACLE_CONTRACT",
                    "outputs": [
                        {
                            "name": "",
                            "type": "address"
                        }
                    ],
                    "payable": false,
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "constant": true,
                    "inputs": [],
                    "name": "dappWallet",
                    "outputs": [
                        {
                            "name": "",
                            "type": "address"
                        }
                    ],
                    "payable": false,
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "constant": true,
                    "inputs": [],
                    "name": "DAY_IN_SECONDS",
                    "outputs": [
                        {
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "payable": false,
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "constant": false,
                    "inputs": [
                        {
                            "name": "_vehicleOwner",
                            "type": "address"
                        },
                        {
                            "name": "_renter",
                            "type": "address"
                        },
                        {
                            "name": "_startDateTime",
                            "type": "uint256"
                        },
                        {
                            "name": "_endDateTime",
                            "type": "uint256"
                        },
                        {
                            "name": "_totalRentCost",
                            "type": "uint256"
                        },
                        {
                            "name": "_totalBond",
                            "type": "uint256"
                        }
                    ],
                    "name": "newRentalAgreement",
                    "outputs": [
                        {
                            "name": "",
                            "type": "address"
                        }
                    ],
                    "payable": true,
                    "stateMutability": "payable",
                    "type": "function"
                },
                {
                    "constant": false,
                    "inputs": [],
                    "name": "endContractProvider",
                    "outputs": [],
                    "payable": true,
                    "stateMutability": "payable",
                    "type": "function"
                },
                {
                    "constant": true,
                    "inputs": [
                        {
                            "name": "_walletOwner",
                            "type": "address"
                        }
                    ],
                    "name": "getVehicle",
                    "outputs": [
                        {
                            "components": [
                                {
                                    "name": "vehicleId",
                                    "type": "uint256"
                                },
                                {
                                    "name": "ownerAddress",
                                    "type": "address"
                                },
                                {
                                    "name": "apiTokenHash",
                                    "type": "string"
                                },
                                {
                                    "name": "baseHireFee",
                                    "type": "uint256"
                                },
                                {
                                    "name": "bondRequired",
                                    "type": "uint256"
                                },
                                {
                                    "name": "vehicleModel",
                                    "type": "uint8"
                                },
                                {
                                    "name": "renterDescription",
                                    "type": "string"
                                }
                            ],
                            "name": "",
                            "type": "tuple"
                        }
                    ],
                    "payable": false,
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "constant": true,
                    "inputs": [],
                    "name": "LINK_ROPSTEN",
                    "outputs": [
                        {
                            "name": "",
                            "type": "address"
                        }
                    ],
                    "payable": false,
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "constant": false,
                    "inputs": [
                        {
                            "name": "_vehicleOwner",
                            "type": "address"
                        },
                        {
                            "name": "_vehicleId",
                            "type": "uint256"
                        },
                        {
                            "name": "_apiTokenHash",
                            "type": "string"
                        },
                        {
                            "name": "_baseHireFee",
                            "type": "uint256"
                        },
                        {
                            "name": "_bondRequired",
                            "type": "uint256"
                        },
                        {
                            "name": "_vehicleModel",
                            "type": "uint8"
                        },
                        {
                            "name": "_description",
                            "type": "string"
                        }
                    ],
                    "name": "newVehicle",
                    "outputs": [],
                    "payable": false,
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "constant": true,
                    "inputs": [
                        {
                            "name": "_rentalContract",
                            "type": "address"
                        }
                    ],
                    "name": "getRentalContract",
                    "outputs": [
                        {
                            "name": "",
                            "type": "address"
                        },
                        {
                            "name": "",
                            "type": "address"
                        },
                        {
                            "name": "",
                            "type": "uint256"
                        },
                        {
                            "name": "",
                            "type": "uint256"
                        },
                        {
                            "name": "",
                            "type": "uint256"
                        },
                        {
                            "name": "",
                            "type": "uint256"
                        },
                        {
                            "name": "",
                            "type": "uint8"
                        }
                    ],
                    "payable": false,
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "payable": true,
                    "stateMutability": "payable",
                    "type": "constructor"
                },
                {
                    "payable": true,
                    "stateMutability": "payable",
                    "type": "fallback"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": false,
                            "name": "_newAgreement",
                            "type": "address"
                        },
                        {
                            "indexed": false,
                            "name": "_totalFundsHeld",
                            "type": "uint256"
                        }
                    ],
                    "name": "rentalAgreementCreated",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": false,
                            "name": "_vehicleId",
                            "type": "uint256"
                        },
                        {
                            "indexed": false,
                            "name": "_vehicleOwner",
                            "type": "address"
                        },
                        {
                            "indexed": false,
                            "name": "_apiTokenHash",
                            "type": "string"
                        },
                        {
                            "indexed": false,
                            "name": "_baseHireFee",
                            "type": "uint256"
                        },
                        {
                            "indexed": false,
                            "name": "_bondRequired",
                            "type": "uint256"
                        },
                        {
                            "indexed": false,
                            "name": "_vehicleModel",
                            "type": "uint8"
                        },
                        {
                            "indexed": false,
                            "name": "_description",
                            "type": "string"
                        }
                    ],
                    "name": "vehicleAdded",
                    "type": "event"
                }
            ],
            "0x455B25F0bF52Da79AD821E78472f5970A5Af0E96"
        )

        contract.methods.getVehicle("0x54a47c5e6a6CEc35eEB23E24C6b3659eE205eE35").call()
            .then((result: any) => {
                setDummyCarData(result)
            })
    }

    useEffect(() => {
        loadBlockchainData()
    }, [])

    return <FormWrapper>
        {JSON.stringify(dummyCarData)}
        <FormField>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <DatePicker
                    label="When would you like to rent a car?"
                    value={current.context.selectedDate}
                    onChange={setSelectedDate}
                    animateYearScrolling
                    disablePast
                />
            </MuiPickersUtilsProvider>
        </FormField>
        {
            <MapSection>
                {
                    current.matches("dateSelecting") && <CircularProgress />
                }
                {
                    current.matches("dateSelected") && <MapWrapper>
                        <MapLabel>Here are the available cars for that date and time:</MapLabel>
                        <Map cars={current.context.availableCars} onChildSelected={handleChildClick} />
                    </MapWrapper>
                }
            </MapSection>
        }
    </FormWrapper>
}

const FormWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding: ${({ theme }) => theme.spacing(8)};
    color: ${({ theme }) => theme.palette.common.white};
`

const FormField = styled.div`   
    margin: ${({ theme }) => `${theme.spacing(4)} 0`};
`

const DatePicker = styled(KeyboardDateTimePicker)`
    width: ${({ theme }) => theme.typography.pxToRem(300)};
`

const MapSection = styled(FormField)`
    width: ${({ theme }) => theme.typography.pxToRem(800)};
    height: ${({ theme }) => theme.typography.pxToRem(500)};
    display: flex;
    justify-content: center;
    align-items: center;
`

const MapWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    height: 100%;
    width: 100%;
`

const MapLabel = styled(Typography)`

`