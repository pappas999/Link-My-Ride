import React from "react"
import styled from "styled-components"
import bgSvg from "./web3-streets.svg"
import { AnimatedLogo } from "../../components/logo"
import { Typography } from "@material-ui/core"

export const AnimatedVisual = ({ ...rest }) => {

  return <Container {...rest}>
    <Scroller svg={bgSvg} />
    <Overlay />
    <LogoWrapper>
      <AnimatedLogo />
      <Slogan variant="h3" component="h2">Decentralized vehicle rental platform.<br/>#PoweredByChainlink</Slogan>
    </LogoWrapper>
  </Container>
}

const LogoWrapper = styled.div`
    height: 25rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`

const Container = styled.div`
    position: relative;
    width: 100%;
    height: 40rem;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
`

const Overlay = styled.div`
    background: rgb(36,93,232);
    background: radial-gradient(ellipse at left top, rgba(36,93,232,0.07234768907563027) 0%, rgba(36,93,232,1) 70%, rgba(36,93,232,1) 100%);
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
`

const Scroller = styled.div<{ svg: string }>`
  @keyframes slide{
    0%{
      transform: translate3d(0, 0, 0);
    }
    100%{
      transform: translate3d(-1663px, -960px, 0);
    }
  }

  background: url(${({ svg }) => svg}) repeat left top;
  animation: slide 24s linear infinite;
  background-size: 831.5px, 960px;
  height: 2000em;
  width: 2000em;
  position: absolute;
`

const Slogan = styled(Typography)`
  z-index: 1;
  color: ${({theme}) => theme.palette.common.white};
  text-align: center;

  &.MuiTypography-root {
    margin-top: ${({theme}) => theme.spacing(6)};

    @media(max-width: 600px) {
      font-size: 2rem;
    }
  }
` as typeof Typography
