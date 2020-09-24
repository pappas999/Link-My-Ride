import React from "react"
import styled from "styled-components"
import { AnimatedVisual } from "./AnimatedVisual"
import { Link } from "react-router-dom"
import { BigActionImageButton } from "../../components/button"
import ownerJpg from "../../images/owner.jpg"
import renterJpg from "../../images/renter.jpg"

export const Home = () => <>
  <StyledAnimatedVisual />
  <Content>
    <ActionButtonsWrapper>
      <BigActionImageButton
        imageSrc={ownerJpg}
        label="I am a vehicle owner"
        component={Link}
        to="/owner-dashboard"
      />
      <BigActionImageButton
        imageSrc={renterJpg}
        label="I'd like to hire a vehicle"
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
  top: 26rem;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
`

const Background = styled.div`
  min-height: max(calc(100vh - 40rem), 30rem);
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