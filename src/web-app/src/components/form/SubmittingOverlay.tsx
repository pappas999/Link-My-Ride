import React from "react"
import styled from "styled-components"
import { CircularProgress } from "@material-ui/core"

export const SubmittingOverlay = () => <Overlay>
    <CircularProgress size={120} color="secondary" />
</Overlay>

const Overlay = styled.div`
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    pointer-events: none;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${({theme}) => theme.palette.common.black};
    opacity: 0.5;
    pointer-events: none;
`