import React from "react"
import styled from "styled-components"
import { WindupChildren, Pace, CharWrapper } from "windups"

export const AnimatedLogo = () => {
    const FadeChar = ({ children }: any) => {
        return <StyledChar>{children}</StyledChar>
    }

    return <Container>
        <WindupChildren>
            <CharWrapper element={FadeChar}>
                <Pace ms={100}>
                    <Link>Link</Link>
                    <My>My</My>
                    <Ride>Ride</Ride>
                </Pace>
            </CharWrapper>
        </WindupChildren>
    </Container>
}

const StyledChar = styled.span`
    @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
      animation-name: fadeIn;
      animation-duration: 3s;
      animation-iteration-count: 1;
      position: relative;
`

const Container = styled.div`
    position: relative;
    width: 240px;
    height: 164px;
`

const generateChunkyTextShadow = (chunkiness: number, color: string) => {
    var shadows = []
    for (let i = 1; i < chunkiness; i++) {
        shadows.push(`-${i * 0.5}px ${i}px 0 ${color}`)
        shadows.push(`-${i * 0.2}px ${i}px 0 ${color}`)
    }
    return shadows.join(", ")
}

const TextPart = styled.span`
    position: absolute;
    font-family: Dolphins;
    color: #0EDAE3;
    -webkit-text-stroke: 2px #FFB00E;
    text-shadow: ${generateChunkyTextShadow(24, "#245CE8")};

    & span:nth-child(1) {
        z-index: 4
    }

    & span:nth-child(2) {
        z-index: 3
    }

    & span:nth-child(3) {
        z-index: 2
    }

    & span:nth-child(4) {
        z-index: 1
    }
`

const Link = styled(TextPart)`
    font-size: 80px;
    top: 0;
    left: 0;
`

const My = styled(TextPart)`
    font-size: 32px;
    top: 76px;
    left: 32px;
`

const Ride = styled(TextPart)`
    font-size: 80px;
    left: 70px;
    bottom: 0;
`