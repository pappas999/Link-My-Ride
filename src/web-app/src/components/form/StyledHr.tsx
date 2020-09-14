import styled from "styled-components"

export const StyledHr = styled.hr`
    width: 100%;
    max-width: ${({ theme }) => theme.typography.pxToRem(800)};
`