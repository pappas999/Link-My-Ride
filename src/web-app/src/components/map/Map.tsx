import React, { useMemo } from "react"
import GoogleMapReact from "google-map-react"
import { MapPin } from "./MapPin"

type Props = {
    cars: Car[],
    onChildSelected: (key: number, childProps: any) => void
}

export const Map = ({
    cars,
    onChildSelected
}: Props) => {
    const createMapOptions = (maps: any) => ({
        styles: [{ stylers: [{ 'saturation': -100 }, { 'gamma': 0.8 }, { 'lightness': -10 }, { 'visibility': 'simplified' }, { "invert_lightness": "true" }] }]
    })

    const addCoords = (runningTotal: number, coord: number) => runningTotal + coord

    const getDefaultCenter = useMemo(() => {
        const numCars = cars.length
        const averageLat = cars.map((car: Car) => car.lat).reduce(addCoords, 0) / numCars
        const averageLng = cars.map((car: Car) => car.lng).reduce(addCoords, 0) / numCars

        return {
            lat: averageLat,
            lng: averageLng
        }
    }, [cars])

    return <GoogleMapReact
        bootstrapURLKeys={{
            key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ""
        }}
        defaultCenter={getDefaultCenter}
        defaultZoom={14}
        onChildClick={onChildSelected}
        options={createMapOptions}>
        {
            cars
                .map((car: Car) => <MapPin
                    key={car.id}
                    lat={car.lat}
                    lng={car.lng} />)
        }
    </GoogleMapReact>
}