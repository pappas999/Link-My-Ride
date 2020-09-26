import { assign } from "xstate"

export const initRentalFormMachineOptions = (
    getAvailableCars: (context: any, event: any) => Promise<Car[]>,
    createRentalAgreement: (context: any, event: any) => Promise<any>
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
        })),
        cacheSelectedHireDuration: assign((_, event: any) => ({
            hireDuration: event.duration
        }))
    },
    guards: {  
        hasDateRangeSelected: (context: any, event: any) => context.selectedDate && context.hireDuration
    },
    services: {
        getAvailableCars,
        createRentalAgreement
    }
})