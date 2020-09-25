import axios from "axios"
const axiosCookieJarSupport = require('axios-cookiejar-support').default;
const tough = require('tough-cookie');

export async function handler(event, context) {
    axiosCookieJarSupport(axios)

    const cookieJar = new tough.CookieJar()

    try {
        const {
            apiToken,
            vehicleId,
            address
        } = JSON.parse(event.body)

        const email = process.env.REACT_APP_NODE_USERNAME
        const password = process.env.REACT_APP_NODE_PASSWORD

        console.log("posting to: http://35.189.58.211:6688/sessions")
        console.log("email: " + email)
        console.log("password: " + password)

        const authResponse = await axios.post("http://35.189.58.211:6688/sessions",
            {
                "email": email,
                "password": password
            },
            {
                headers: { Accept: "application/json" },
                jar: cookieJar,
                withCredentials: true
            })

        console.log("posting to: http://35.189.58.211:6688/v2/specs/fc2498cbfa984f7d94812802e46b7508/runs")
        console.log("apiToken: " + apiToken)
        console.log("vehicleId: " + vehicleId)
        console.log("address: " + address)

        const response = await axios.post(
            "http://35.189.58.211:6688/v2/specs/fc2498cbfa984f7d94812802e46b7508/runs",
            {
                "apiToken": apiToken,
                "vehicleId": vehicleId,
                "action": "authenticate",
                "address": address
            },
            {
                headers: { Accept: "application/json" },
                jar: cookieJar,
                withCredentials: true
            }
        )

        const data = response.data

        console.log("Returning successful response 200")
        return {
            statusCode: 200,
            body: JSON.stringify({ msg: data })
        }
    } catch (err) {
        console.log(err) // output to netlify function log
        return {
            statusCode: 500,
            body: JSON.stringify({ msg: err.message })
        }
    }
}