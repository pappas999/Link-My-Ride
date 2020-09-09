import { assign } from "xstate"

export const initRentalFormMachineOptions = (
    getAvailableCars: (context: any, event: any) => Promise<Car[]>
) => ({
    actions: {
        cacheSelectedDate: assign((_, event: any) => ({
            selectedDate: event.selectedDate
        })),
        cacheAvailableCars: assign((_, event: any) => ({
            availableCars: event.data
        })),
        cacheSelectedCar: assign((_, event: any) => ({
            selectedCar: event.selectedCar
        }))
    },
    services: {
        getAvailableCars
    }
})