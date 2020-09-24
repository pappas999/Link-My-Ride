import React, { useContext } from "react"
import GoogleMapReact, { ClickEventValue } from "google-map-react"
import { MapPin } from "../../components/map/MapPin"
import { AddVehicleFormContext } from "./AddVehicleFormContext"
import { toSolidityLatOrLong, toRealLatOrLong } from "../../utils"

export const SelectLatLngMap = () => {

    const { current, setVehicleLat, setVehicleLng } = useContext(AddVehicleFormContext)

    const createMapOptions = (maps: any) => ({
        styles: [{ stylers: [{ 'saturation': -100 }, { 'gamma': 0.8 }, { 'lightness': -10 }, { 'visibility': 'simplified' }, { "invert_lightness": "true" }] }]
    })

    const handleClick = (evt: ClickEventValue) => {
        setVehicleLat(toSolidityLatOrLong(+evt.lat.toFixed(6)))
        setVehicleLng(toSolidityLatOrLong(+evt.lng.toFixed(6)))
    }

    return <GoogleMapReact
        bootstrapURLKeys={{
            key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ""
        }}
        defaultCenter={{
            lat: toRealLatOrLong(current.context.lat),
            lng: toRealLatOrLong(current.context.lng)
        }}
        defaultZoom={12}
        onClick={handleClick}
        options={createMapOptions}>
        {
            current.context.lat && current.context.lng && <MapPin
                key={0}
                lat={toRealLatOrLong(current.context.lat)}
                lng={toRealLatOrLong(current.context.lng)} />

        }
    </GoogleMapReact>
}