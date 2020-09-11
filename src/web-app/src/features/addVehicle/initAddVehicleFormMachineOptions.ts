import { assign } from "xstate"

export const initAddVehicleFormMachineOptions = (
    submitVehicle: (context: any, event: any) => Promise<any>
) => ({
    actions: {
    },
    services: {
        submitVehicle
    }
})