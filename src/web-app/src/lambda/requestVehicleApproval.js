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

        const email = process.env.NODE_USERNAME
        const password = process.env.NODE_PASSWORD
        const nodeAddress = process.env.NODE_ADDRESS
        const jobSpecId = process.env.JOBSPEC_ID

        console.log(`Posting to: ${nodeAddress}/sessions`)
        console.log("email: " + email)
        console.log("password: " + password)

        await axios.post(`${nodeAddress}/sessions`,
            {
                "email": email,
                "password": password
            },
            {
                headers: { Accept: "application/json" },
                jar: cookieJar,
                withCredentials: true
            })

        console.log(`Posting to: ${nodeAddress}/v2/specs/${jobSpecId}/runs`)
        console.log("apiToken: " + apiToken)
        console.log("vehicleId: " + vehicleId)
        console.log("address: " + address)

        const response = await axios.post(
            `${nodeAddress}/v2/specs/${jobSpecId}/runs`,
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