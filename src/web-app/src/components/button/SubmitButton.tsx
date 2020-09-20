import { Button } from "@material-ui/core"
import styled from "styled-components"

export const SubmitButton = styled(Button)`
    &.MuiButtonBase-root {
        margin-top: ${({ theme }) => theme.spacing(16)};
        margin-top: ${({ theme }) => theme.spacing(12)};
        padding: ${({ theme }) => theme.spacing(6)};
    }
`