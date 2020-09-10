import React from "react"
import styled from "styled-components"
import { AnimatedVisual } from "./AnimatedVisual"
import { MyRentalContracts } from "../rentalContracts"

export const Home = () => <>
  <StyledAnimatedVisual />
  <Content>
    <MyRentalContracts />
  </Content>
</>

const StyledAnimatedVisual = styled(AnimatedVisual)`
  height: 40rem;
  width: 100%;
`

const Content = styled.div`
  min-height: calc(100vh - 40rem);
  background: rgba(36,93,232,1);
  background: linear-gradient(0deg, rgba(21,57,145,1) 0%, rgba(36,93,232,1) 100%);
`