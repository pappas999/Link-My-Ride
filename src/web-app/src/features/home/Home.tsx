import React from "react"
import styled from "styled-components"
import { AnimatedVisual } from "./AnimatedVisual"
import { Link } from "react-router-dom"
import { BigActionImageButton } from "../../components/button"
import ownerJpg from "../../images/owner.jpg"
import renterJpg from "../../images/renter.jpg"
import { GitHubLink } from "./GitHubLink"

export const Home = () => <>
  <StyledAnimatedVisual />
  <GitHubLink />
  <Content>
    <ActionButtonsWrapper>
      <BigActionImageButton
        imageSrc={ownerJpg}
        label="Vehicle Owners"
        component={Link}
        to="/owner-dashboard"
      />
      <BigActionImageButton
        imageSrc={renterJpg}
        label="Vehicle Renters"
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
  min-height: max(calc(100vh - 40rem), 34rem);
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