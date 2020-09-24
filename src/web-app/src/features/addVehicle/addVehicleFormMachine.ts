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
        bond: "",
        lat: -34.9285,
        lng: 138.6007
    },
    states: {
        initial: {

        },
        submitting: {
            invoke: {
                src: "submitVehicle",
                onDone: {
                    target: "requestVehicleApproval",
                    actions: (context, event) => { console.log('Vehicle submitted successfully.') }
                },
                onError: {
                    target: "initial",
                    actions: (context, event) => { console.error('Error submitting vehicle.') }
                }
            }
        },
        requestVehicleApproval: {
            invoke: {
                src: "requestVehicleApproval",
                onDone: {
                    target: "done",
                    actions: (context, event) => { console.log('Vehicle approval request successfully sent to external adapter.') }
                },
                onError: {
                    target: "initial",
                    actions: (context, event) => { console.error('Error while validating vehicle against Tesla server.') }
                }
            }
        },
        done: {
        },
        error: {
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
        SET_LAT: {
            actions: "cacheLat"
        },
        SET_LNG: {
            actions: "cacheLng"
        },
        SUBMIT: {
            target: "submitting"
        }
    }
})