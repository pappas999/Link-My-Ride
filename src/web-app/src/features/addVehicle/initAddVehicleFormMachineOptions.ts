import { assign } from "xstate"

export const initAddVehicleFormMachineOptions = (
    submitVehicle: (context: any, event: any) => Promise<any>
) => ({
    actions: {
        cacheSelectedVehicleModel: assign((_, event: any) => ({
            selectedVehicleModel: event.selectedVehicleModel
        })),
        cacheVehicleId: assign((_, event: any) => ({
            vehicleId: event.value
        })),
        cacheApiKey: assign((_, event: any) => ({
            apiKey: event.value
        })),
    },
    services: {
        submitVehicle
    }
})