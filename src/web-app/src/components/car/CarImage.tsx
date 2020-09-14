import React from "react"
import { Model } from "../../enums"
import cybertruck from "./images/cybertruck.jpg"
import model3 from "./images/model-3.jpg"
import modelS from "./images/model-s.jpg"
import modelX from "./images/model-x.jpg"
import modelY from "./images/model-y.jpg"
import roadster from "./images/roadster.jpg"

type Props = {
    model: Model
}

export const CarImage = ({
    model,
    ...rest
}: Props) => {

    const getImageSrc = (model: Model) => {
        let src = ""

        switch (+model) {
            case Model.Model_S:
                src = modelS
                break
            case Model.Model_X:
                src = modelX
                break
            case Model.Model_Y:
                src = modelY
                break
            case Model.Model_3:
                src = model3
                break
            case Model.Cybertruck:
                src = cybertruck
                break
            case Model.Roadster:
                src = roadster
                break
        }
    
        return src
    }

    return <img {...rest} alt="a car" src={getImageSrc(model)} />
}