import React from "react"
import styled from "styled-components"
import { Tooltip, IconButton } from "@material-ui/core"
import { GitHub } from "@material-ui/icons"

export const GitHubLink = () => {

    return <Container>
        <Tooltip title="GitHub repo" aria-label="github repo">
            <a href="https://github.com/pappas999/Link-My-Ride">
                <StyledIconButton>
                    <GitHub />
                </StyledIconButton>
            </a>
        </Tooltip>
    </Container>
}

const Container = styled.div`
    position: absolute;
    width: ${({ theme }) => theme.typography.pxToRem(66)};
    height: ${({ theme }) => theme.typography.pxToRem(66)};
    top: ${({ theme }) => theme.spacing(4)};
    right: ${({ theme }) => theme.spacing(4)};
    display: flex;
    border-radius: 50%;
    justify-content: center;
    align-items: center;
    color: ${({ theme }) => theme.palette.common.white};
    background-color: ${({ theme }) => theme.palette.secondary.dark};
`

const StyledIconButton = styled(IconButton)`
    &.MuiIconButton-root{
        color: ${({ theme }) => theme.palette.common.white};
    }   
`