import { VehicleStatus } from "../enums"

export const getVehicleStatusString = (status: VehicleStatus) => {
    let result = ""

    switch (+status) {
        case VehicleStatus.PENDING:
            result = "Pending"
            break
        case VehicleStatus.APPROVED:
            result = "Approved"
            break
    }

    return result
}