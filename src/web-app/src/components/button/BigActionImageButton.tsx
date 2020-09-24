import React from "react"
import styled from "styled-components"
import { Button, Typography } from "@material-ui/core"
import { ButtonProps } from "@material-ui/core/Button"

interface Props extends ButtonProps {
    imageSrc: string,
    label: string,
    component: any,
    to: string
}

export const BigActionImageButton = ({ imageSrc, label, component, to, ...rest }: Props) => {

    return <Button component={component} to={to} {...rest}>
        <Content>
            <Image src={imageSrc} />
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
    max-width: ${({ theme }) => theme.typography.pxToRem(400)};
    background-color: ${({ theme }) => theme.palette.common.white};
    border-radius: ${({ theme }) => theme.typography.pxToRem(12)};
    border: ${({ theme }) => `${theme.typography.pxToRem(8)} solid ${theme.palette.secondary.main}`};
`

const Image = styled.img`
    border-radius: ${({ theme }) => `${theme.typography.pxToRem(4)} ${theme.typography.pxToRem(4)} 0 0`};
    max-width: ${({ theme }) => theme.typography.pxToRem(400)};
    width: 100%;
`

const Text = styled(Typography)`
    text-align: center;
    padding: ${({ theme }) => theme.spacing(4)};
`