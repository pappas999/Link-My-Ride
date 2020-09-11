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
            main: "#245de8"
        }
    }
})