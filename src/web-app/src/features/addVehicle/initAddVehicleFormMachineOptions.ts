import { assign } from "xstate"

export const initAddVehicleFormMachineOptions = (
    submitVehicle: (context: any, event: any) => Promise<any>,
    requestVehicleApproval: (context: any, event: any) => Promise<any>
) => ({
    actions: {
        cacheSelectedVehicleModel: assign((_, event: any) => ({
            selectedVehicleModel: event.selectedVehicleModel
        })),
        cacheVehicleDescription: assign((_, event: any) => ({
            vehicleDescription: event.value
        })),
        cacheVehicleId: assign((_, event: any) => ({
            vehicleId: event.value
        })),
        cacheApiKey: assign((_, event: any) => ({
            apiKey: event.value
        })),
        cacheCurrency: assign((_, event: any) => ({
            currency: event.value
        })),
        cacheHireFee: assign((_, event: any) => ({
            hireFee: event.value
        })),
        cacheBond: assign((_, event: any) => ({
            bond: event.value
        })),
        cacheLat: assign((_, event: any) => ({
            lat: event.lat
        })),
        cacheLng: assign((_, event: any) => ({
            lng: event.lng
        }))
    },
    services: {
        submitVehicle,
        requestVehicleApproval
    }
})