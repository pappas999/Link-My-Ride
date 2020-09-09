import { createMachine } from "xstate"

export const rentalFormMachine = createMachine({
    id: "rentalForm",
    initial: "dateUnselected",
    context: {
        selectedDate: new Date().setMinutes(0),
        availableCars: []
    },
    states: {
        dateUnselected: {

        },
        dateSelecting: {
            invoke: {
                src: "getAvailableCars",
                onDone: {
                    actions: "cacheAvailableCars",
                    target: "dateSelected"
                },
                onError: {
                    target: "error"
                }
            }
        },
        dateSelected: {
            on: {
                SET_SELECTED_CAR : {
                    actions: "cacheSelectedCar"
                }
            }
        },
        error: {}
    },
    on: {
        SET_SELECTED_DATE: {
            // todo: check selected date is not empty. If it is transition to 'dateUnselected' state instead
            actions: "cacheSelectedDate",
            target: "dateSelecting"
        }
    }
})