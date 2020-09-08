import { assign } from "xstate"

const getAvailableCars = (context: any, event: any) => new Promise<{ availableCars: Car[]}>((resolve, reject) => resolve({
    availableCars: [{
        id: "tesla1",
        lat: 36.1407,
        lng: -115.1187
    }]
}))

export const initRentalFormMachineOptions = () => ({
    actions: {
        cacheSelectedDate: assign((_, event: any) => ({
            selectedDate: event.selectedDate
        })),
        cacheAvailableCars: assign((_, event: any) => ({
            availableCars: event.data.availableCars
        })),
        cacheSelectedCar: assign((_, event: any) => ({
            selectedCar: event.data.selectedCar
        }))
    },
    services: {
        getAvailableCars
    }
})