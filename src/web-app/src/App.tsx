import React from 'react';
import styled from "styled-components"
import './App.css';

export const App = () => {
  return (
    <Main />
  )
}

const Main = styled.main`
  background: rgb(15,43,112);
  background: linear-gradient(0deg, rgba(15,43,112,1) 0%, rgba(36,93,232,1) 100%);
  height: 100vh;
  width: 100%;
`
