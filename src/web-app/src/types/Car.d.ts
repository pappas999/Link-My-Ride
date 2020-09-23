interface Car {
    address: string,
    id: number,
    baseHireFee: BigNumber,
    bondRequired: BigNumber,
    model: Model,
    currency: Currency
    description: string,
    lat: number,
    lng: number,
    status: VehicleStatus
}
