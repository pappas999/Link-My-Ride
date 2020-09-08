import React from "react"
import styled from "styled-components"
import { DirectionsCar as CarIcon } from "@material-ui/icons"

export const MapPin = ({ ...rest }) => <IconContainer {...rest}>
    <CarIcon fontSize="large"></CarIcon>
    <PinPoint />
</IconContainer>

const IconContainer = styled.div`
    position: absolute;
    transform: translate(-50%, calc(-50% - 36px));
    width: 69.28px;
    height: 40px;
    background: #245DE8;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;

    &::before {
        content: "";
        position: absolute;
        top: -20px;
        left: 0;
        width: 0;
        height: 0;
        border-left: 34.64px solid transparent;
        border-right: 34.64px solid transparent;
        border-bottom: 20px solid #245DE8;
    }

    &::after {
        content: "";
        position: absolute;
        bottom: -20px;
        left: 0;
        width: 0;
        height: 0;
        border-left: 34.64px solid transparent;
        border-right: 34.64px solid transparent;
        border-top: 20px solid #245DE8;
    }
`

const PinPoint = styled.div`
    position: absolute;
    background-color: white;
    border-radius: 50%;
    height: 8px;
    width: 8px;
    border: 2px solid black;
    bottom: -30px;
`