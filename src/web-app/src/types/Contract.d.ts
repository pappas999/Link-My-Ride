interface Contract {
    owner: string,
    renter: string,
    startDateTime: Date,
    endDateTime: Date,
    totalRentCost: number,
    totalBond: number
}