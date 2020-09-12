import { Model } from "../enums"

export const getCarModelString = (model: Model) => {
    let result = ""

    switch (+model) {
        case Model.Model_S:
            result = "Model S"
            break
        case Model.Model_X:
            result = "Model X"
            break
        case Model.Model_Y:
            result = "Model Y"
            break
        case Model.Model_3:
            result = "Model 3"
            break
        case Model.Cybertruck:
            result = "Cybertruck"
            break
        case Model.Roadster:
            result = "Roadster"
            break
    }

    return result
}