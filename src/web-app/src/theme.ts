import { createMuiTheme } from "@material-ui/core/styles"

export const theme = createMuiTheme({
    palette: {
        type: "dark"
    },
    spacing: factor => `${0.25 * factor}rem`
})