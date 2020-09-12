import { assign } from "xstate"

export const initAddVehicleFormMachineOptions = (
    submitVehicle: (context: any, event: any) => Promise<any>
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
        cacheHireFee: assign((_, event: any) => ({
            hireFee: event.value
        })),
        cacheBond: assign((_, event: any) => ({
            bond: event.value
        }))
    },
    services: {
        submitVehicle
    }
})