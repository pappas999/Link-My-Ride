import React from "react"
import styled from "styled-components"

export const Logo = () => <Container>
                <Link>Link</Link>
                <My>My</My>
                <Ride>Ride</Ride>
</Container>

const Container = styled.div`
    position: relative;
    width: 120px;
    height: 82px;
`

const TextPart = styled.span`
    position: absolute;
    font-family: Dolphins;
    color: #0EDAE3;
    -webkit-text-stroke: 1px #FFB00E;

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
    font-size: 40px;
    top: 0;
    left: 0;
`

const My = styled(TextPart)`
    font-size: 16px;
    top: 38px;
    left: 16px;
`

const Ride = styled(TextPart)`
    font-size: 40px;
    left: 35px;
    bottom: 0;
`