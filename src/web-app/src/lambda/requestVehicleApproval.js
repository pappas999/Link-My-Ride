import axios from "axios"
const axiosCookieJarSupport = require('axios-cookiejar-support').default;
const tough = require('tough-cookie');

export async function handler(event, context) {

    axiosCookieJarSupport(axios)

    const cookieJar = new tough.CookieJar()

    try {
        const {
            email,
            password,
            apiToken,
            vehicleId,
            address
        } = JSON.parse(event.body)

        await axios.post("http://35.189.58.211:6688/sessions",
            {
                "email": email,
                "password": password
            },
            {
                headers: { Accept: "application/json" },
                jar: cookieJar,
                withCredentials: true
            })

        const response = axios.post(
            "http://35.189.58.211:6688/v2/specs/7ce899554ccc4e70b514ff9417bbf645/runs",
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