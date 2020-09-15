import styled from "styled-components"

export const StyledForm = styled.form`
    & .MuiInput-root {
        color: ${({theme}) => theme.palette.common.white};
    }

    & .MuiInput-underline:before {
        border-bottom: ${({theme}) => `1px solid ${theme.palette.common.white}`};
    }

    & .MuiInput-underline:after {
        border-bottom: ${({theme}) => `2px solid ${theme.palette.secondary.light}`};
    }

    & .MuiFormLabel-root { 
        color: ${({theme}) => theme.palette.common.white};
    }

    & .MuiFormLabel-root.Mui-focused { 
        color: ${({theme}) => theme.palette.secondary.light};
    }

    & .MuiSelect-icon {
        color: ${({theme}) => theme.palette.common.white};
    }

    & .MuiButton-textSecondary {
        color: ${({theme}) => theme.palette.common.black};
        background-color: ${({theme}) => theme.palette.secondary.main};

        &:hover {
            background-color: ${({theme}) => theme.palette.secondary.dark};
        }
    }

    & .MuiTypography-colorTextSecondary {
        color: ${({theme}) => theme.palette.common.white};
    }
`