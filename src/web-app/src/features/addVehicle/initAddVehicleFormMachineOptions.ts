import { assign } from "xstate"

export const initAddVehicleFormMachineOptions = (
    submitVehicle: (context: any, event: any) => Promise<any>
) => ({
    actions: {
        cacheSelectedVehicleModel: assign((_, event: any) => ({
            selectedVehicleModel: event.selectedVehicleModel
        })),
    },
    services: {
        submitVehicle
    }
})