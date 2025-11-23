import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import { SnackbarProvider } from "../context/SnackbarContext";
import { router } from "../router";
import theme from "../theme";

export const AppProviders = ({ children }) => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthProvider>
                <SnackbarProvider>
                    {children ?? <RouterProvider router={router} />}
                </SnackbarProvider>
            </AuthProvider>
        </ThemeProvider>
    );
};

export default AppProviders;
