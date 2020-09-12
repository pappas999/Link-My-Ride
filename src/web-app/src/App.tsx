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
import { RentalForm, RentalFormProvider } from "./features/renter"
import { SecondaryPageLayout } from "./features/layout/SecondaryPageLayout"
import { Web3Provider } from "./features/web3"
import { OwnerDashboard } from "./features/ownerDashboard"
import { RenterDashboard } from "./features/renterDashboard"
import { AddVehicleFormProvider, AddVehicleForm } from "./features/addVehicle"

export const App = () => {
  return (
    <MuiThemeProvider theme={theme}>
      <ThemeProvider theme={theme}>
        <Web3Provider>
          <Router>
            <Main>
              <Switch>
                <Route exact path="/">
                  <Home />
                </Route>
                <SecondaryPageLayout>
                  <Route path="/rent-a-car">
                    <RentalFormProvider>
                      <RentalForm />
                    </RentalFormProvider>
                  </Route>
                  <Route path="/owner-dashboard">
                    <OwnerDashboard />
                  </Route>
                  <Route path="/renter-dashboard">
                    <RenterDashboard />
                  </Route>
                  <Route path="/add-vehicle">
                    <AddVehicleFormProvider>
                      <AddVehicleForm />
                    </AddVehicleFormProvider>
                  </Route>
                </SecondaryPageLayout>
              </Switch>
            </Main>
          </Router>
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
