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

export const App = () => {
  return (
    <MuiThemeProvider theme={theme}>
      <ThemeProvider theme={theme}>
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
              </SecondaryPageLayout>
            </Switch>
          </Main>
        </Router>
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
