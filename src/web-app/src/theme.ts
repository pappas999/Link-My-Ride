import { createMuiTheme } from "@material-ui/core/styles"

export const theme = createMuiTheme({
    // palette: {
    //     type: "dark"
    // },
    typography: {
        fontFamily: "'Solway', serif"
    },
    spacing: factor => `${0.25 * factor}rem`,
    palette: {
        primary: {
            light: "#6e8aff",
            main: "#245de8",
            dark: "#0035b5"
        },
        secondary: {
            light: "#6bffff",
            main: "#0edae3",
            dark: "#00a8b1"
        }
    }
})