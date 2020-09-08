import React from 'react';
import styled from "styled-components"
import './App.css';
import { AnimatedVisual } from "./features/header"

export const App = () => {
  return (
    <>
      <Header>
        <AnimatedVisual />
      </Header>
      <Main />
    </>
  )
}

const Header = styled.header`
  height: 60rem;
  width: 100%;
`

const Main = styled.main`
  background: rgb(15,43,112);
  background: linear-gradient(0deg, rgba(15,43,112,1) 0%, rgba(36,93,232,1) 100%);
  height: 100vh;
  width: 100%;
`
