import { createTheme } from "@mui/material/styles";

const theme = createTheme ({
    typography: {
        fontFamily: "Latto"
    },
    palette: {
        primary: {
            light: "#45c09f",
            main: "#00a278",
            dark: "#00845c",
            contrastText: "#fff",
        },
    },
});

export default theme;
