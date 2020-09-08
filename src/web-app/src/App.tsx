import React from 'react';
import styled from "styled-components"
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom"
import { AnimatedVisual } from "./features/header"

export const App = () => {
  return (
    <Router>
      <Main>
        <Switch>
          <Route path="/rent-a-car">
            <div>rental form</div>
          </Route>
          <Route path="/">
            <StyledAnimatedVisual />
            <Content />
          </Route>
        </Switch>
      </Main>
    </Router>
  )
}

const StyledAnimatedVisual = styled(AnimatedVisual)`
  height: 40rem;
  width: 100%;
`

const Content = styled.div`
  min-height: calc(100vh - 40rem);
  background: rgba(36,93,232,1);
  background: linear-gradient(0deg, rgba(21,57,145,1) 0%, rgba(36,93,232,1) 100%);
`

const Main = styled.main`
  background: rgba(36,93,232,1);
  background: linear-gradient(0deg, rgba(15,43,112,1) 0%, rgba(36,93,232,1) 100%);
  min-height: 100vh;
  width: 100%;
`
