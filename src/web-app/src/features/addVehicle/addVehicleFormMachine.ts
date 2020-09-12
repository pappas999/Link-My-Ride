import { createMachine } from "xstate"

export const addVehicleFormMachine = createMachine({
    id: "addVehicleForm",
    initial: "initial",
    context: {
        selectedVehicleModel: "",
        vehicleDescription: "",
        vehicleId: "",
        apiKey: "",
        hireFee: "",
        bond: ""
    },
    states: {
        initial: {

        }
    },
    on: {
        SET_SELECTED_VEHICLE_MODEL: {
            actions: "cacheSelectedVehicleModel"
        },
        SET_VEHICLE_DESCRIPTION: {
            actions: "cacheVehicleDescription"
        },
        SET_VEHICLE_ID: {
            actions: "cacheVehicleId"
        },
        SET_API_KEY: {
            actions: "cacheApiKey"
        },
        SET_HIRE_FEE: {
            actions: "cacheHireFee"
        },
        SET_BOND: {
            actions: "cacheBond"
        }
    }
})