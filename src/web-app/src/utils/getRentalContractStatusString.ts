import { RentalAgreementStatus } from "../enums"

export const getRentalContractStatusString = (status: RentalAgreementStatus) => {
    let result = ""

    switch (+status) {
        case RentalAgreementStatus.PROPOSED:
            result = "Proposed"
            break
        case RentalAgreementStatus.APPROVED:
            result = "Approved"
            break
        case RentalAgreementStatus.REJECTED:
            result = "Rejected"
            break
        case RentalAgreementStatus.ACTIVE:
            result = "Active"
            break
        case RentalAgreementStatus.COMPLETED:
            result = "Completed"
            break
        case RentalAgreementStatus.ENDED_ERROR:
            result = "Ended in error"
            break
    }

    return result
}