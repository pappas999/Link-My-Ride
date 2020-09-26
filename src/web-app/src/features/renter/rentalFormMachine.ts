import { createMachine } from "xstate"

export const rentalFormMachine = createMachine({
    id: "rentalForm",
    initial: "idle",
    context: {
        selectedDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), new Date().getHours(), 0, 0),
        selectedCar: null,
        availableCars: [],
        hireDuration: ""
    },
    states: {
        idle: {
            initial: "dateUnselected",
            states: {
                dateUnselected: {

                },
                checkDateSelecting: {
                    on: {
                        "": [
                            {
                                cond: "hasDateRangeSelected",
                                target: "dateSelecting"
                            },
                            {
                                target: "dateUnselected"
                            }
                        ]
                    }
                },
                dateSelecting: {
                    invoke: {
                        src: "getAvailableCars",
                        onDone: {
                            actions: "cacheAvailableCars",
                            target: "dateSelected"
                        },
                        onError: {
                            target: "#rentalForm.error"
                        }
                    }
                },
                dateSelected: {
                    on: {
                        SET_SELECTED_CAR: {
                            actions: "cacheSelectedCar"
                        },
                        SUBMIT: {
                            target: "#rentalForm.submitting"
                        }
                    }
                }
            },
            on: {
                SET_SELECTED_DATE: {
                    // todo: check selected date is not empty. If it is transition to 'dateUnselected' state instead
                    actions: "cacheSelectedDate",
                    target: ".checkDateSelecting"
                },
                SET_SELECTED_HIRE_DURATION: {
                    actions: "cacheSelectedHireDuration",
                    target: ".checkDateSelecting"
                }
            }
        },
        submitting: {
            invoke: {
                src: "createRentalAgreement",
                onDone: {
                    target: "done",
                    actions: (context, event) => { console.log('done') }
                },
                onError: {
                    target: "idle",
                    actions: (context, event) => { console.log('error') }
                }
            }
        },
        done: {
        },
        error: {
        }
    }
})