import { createMachine } from "xstate"
import { Model } from "../../enums"

export const addVehicleFormMachine = createMachine({
    id: "addVehicleForm",
    initial: "initial",
    context: {
        selectedVehicleModel: Model.Model_S,
        vehicleDescription: "",
        vehicleId: "",
        apiKey: "",
        hireFee: "",
        bond: ""
    },
    states: {
        initial: {

        },
        submitting: {
            invoke: {
                src: "submitVehicle",
                onDone: {
                    target: "done"
                },
                onError: {
                    target: "error"
                }
            }
        },
        done: {
            on: {
                "": {
                    actions: (context, event) => { console.log('done') }
                }
            }
        },
        error: {
            on: {
                "": {
                    actions: (context, event) => { console.log('error') }
                }
            }
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
        },
        SUBMIT: {
            target: "submitting"
        }
    }
})