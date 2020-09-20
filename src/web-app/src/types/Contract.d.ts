interface Contract {
    address: string
    owner: string,
    renter: string,
    startDateTime: Date,
    endDateTime: Date,
    totalRentCost: number,
    totalBond: number,
    ownerCurrency: Currency,
    vehicleModel: Model,
    vehicleDescription: string,
    status: RentalAgreementStatus
}