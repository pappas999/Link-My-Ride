import { createMachine } from "xstate"

export const rentalFormMachine = createMachine({
    id: "rentalForm",
    initial: "dateUnselected",
    context: {
        selectedDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), new Date().getHours(), 0, 0),
        selectedCar: null,
        availableCars: [],
        hireDuration: ""
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
                SET_SELECTED_CAR: {
                    actions: "cacheSelectedCar"
                },
                SET_SELECTED_HIRE_DURATION: {
                    actions: "cacheSelectedHireDuration"
                },
                SUBMIT: {
                    target: "submitting"
                }
            }
        },
        submitting: {
            invoke: {
                src: "createRentalAgreement",
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
        SET_SELECTED_DATE: {
            // todo: check selected date is not empty. If it is transition to 'dateUnselected' state instead
            actions: "cacheSelectedDate",
            target: "dateSelecting"
        }
    }
})