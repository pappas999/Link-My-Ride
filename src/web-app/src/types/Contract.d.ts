interface Contract {
    address: string
    owner: string,
    renter: string,
    startDateTime: Date,
    endDateTime: Date,
    totalRentCost: number,
    totalBond: number,
    vehicleModel: number,
    vehicleDescription: string,
    status: RentalAgreementStatus
}