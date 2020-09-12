import { createMachine } from "xstate"

export const addVehicleFormMachine = createMachine({
    id: "addVehicleForm",
    initial: "initial",
    context: {
        selectedVehicleModel: "",
        vehicleId: "",
        apiKey: ""
    },
    states: {
        initial: {

        }
    },
    on: {
        SET_SELECTED_VEHICLE_MODEL: {
            actions: "cacheSelectedVehicleModel"
        },
        SET_VEHICLE_ID: {
            actions: "cacheVehicleId"
        },
        SET_API_KEY: {
            actions: "cacheApiKey"
        }
    }
})