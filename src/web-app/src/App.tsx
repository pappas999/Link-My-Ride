import React from 'react';
import styled, { ThemeProvider } from "styled-components"
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom"
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles"
import { theme } from "./theme"
import { Home } from "./features/home"
import { RentVehicle } from "./features/renter"
import { SecondaryPageLayout } from "./features/layout/SecondaryPageLayout"
import { Web3Provider } from "./features/web3"
import { CurrencyProvider } from "./features/currency"
import { OwnerDashboard } from "./features/ownerDashboard"
import { RenterDashboard } from "./features/renterDashboard"
import { AddVehicle } from "./features/addVehicle"
import { ToastContainer, Flip } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

export const App = () => {
  return (
    <MuiThemeProvider theme={theme}>
      <ThemeProvider theme={theme}>
        <Web3Provider>
          <CurrencyProvider>
            <Router>
              <Main>
                <StyledToastContainer
                  position="top-center"
                  autoClose={5000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  transition={Flip}
                />
                <Switch>
                  <Route exact path="/">
                    <Home />
                  </Route>
                  <SecondaryPageLayout>
                    <Route path="/rent-a-car">
                      <RentVehicle />
                    </Route>
                    <Route path="/owner-dashboard">
                      <OwnerDashboard />
                    </Route>
                    <Route path="/renter-dashboard">
                      <RenterDashboard />
                    </Route>
                    <Route path="/add-vehicle">
                      <AddVehicle />
                    </Route>
                  </SecondaryPageLayout>
                </Switch>
              </Main>
            </Router>
          </CurrencyProvider>
        </Web3Provider>
      </ThemeProvider>
    </MuiThemeProvider>
  )
}

const Main = styled.main`
  background: rgba(36,93,232,1);
  background: linear-gradient(0deg, rgba(15,43,112,1) 0%, rgba(36,93,232,1) 100%);
  min-height: 100vh;
  width: 100%;
`

const StyledToastContainer = styled(ToastContainer)`
  & .Toastify__toast-body {
    font-family: 'Solway', serif;
  }
`