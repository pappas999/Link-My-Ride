import React from "react"
import styled from "styled-components"
import { Button, Typography } from "@material-ui/core"
import { ButtonProps } from "@material-ui/core/Button"

interface Props extends ButtonProps {
    icon: React.ReactNode,
    label: string,
    component: any,
    to: string
}

export const BigActionButton = ({ icon, label, component, to, ...rest }: Props) => {

    return <Button component={component} to={to} {...rest}>
        <Content>
            <IconWrapper>
                {icon}
            </IconWrapper>
            <Text variant="h4">{label}</Text>
        </Content>
    </Button>
}

const Content = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    max-width: ${({ theme }) => theme.typography.pxToRem(300)};
    background-color: ${({ theme }) => theme.palette.common.white};
    padding: ${({ theme }) => theme.spacing(4)};
    border-radius: ${({ theme }) => theme.typography.pxToRem(12)};
    border: ${({ theme }) => `${theme.typography.pxToRem(8)} solid ${theme.palette.secondary.main}`};
`

const IconWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    max-width: ${({ theme }) => theme.typography.pxToRem(180)};
    width: 100%;
    height: 100%;
    max-height: ${({ theme }) => theme.typography.pxToRem(160)};
`

const Text = styled(Typography)`
    text-align: center;
`