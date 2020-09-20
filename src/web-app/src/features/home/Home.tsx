import React from "react"
import styled from "styled-components"
import { AnimatedVisual } from "./AnimatedVisual"
import { Link } from "react-router-dom"
import { BigActionButton } from "../../components/button"
import { Settings, DirectionsCar } from "@material-ui/icons"

export const Home = () => <>
  <StyledAnimatedVisual />
  <Content>
    <ActionButtonsWrapper>
      <BigActionButton
        icon={<Settings color="primary" style={{ fontSize: 100 }} />}
        label="I am a car owner"
        component={Link}
        to="/owner-dashboard"
      />
      <BigActionButton
        icon={<DirectionsCar color="primary" style={{ fontSize: 100 }} />}
        label="I'd like to hire a car"
        component={Link}
        to="/renter-dashboard"
      />
    </ActionButtonsWrapper>
  </Content>
  <Background />
</>

const StyledAnimatedVisual = styled(AnimatedVisual)`
  height: 40rem;
  width: 100%;
`

const Content = styled.div`
  position: absolute;
  top: 36rem;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Background = styled.div`
  min-height: max(calc(100vh - 40rem), 22rem);
  height: 100%;
  background: rgba(36,93,232,1);
  background: linear-gradient(0deg, rgba(21,57,145,1) 0%, rgba(36,93,232,1) 100%);
`

const ActionButtonsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  position: absolute;
`