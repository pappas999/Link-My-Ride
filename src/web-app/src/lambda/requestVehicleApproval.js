import axios from "axios"
const axiosCookieJarSupport = require('axios-cookiejar-support').default;
const tough = require('tough-cookie');

export async function handler(event, context) {

    axiosCookieJarSupport(axios)

    const cookieJar = new tough.CookieJar()

    console.log("event.body: " + JSON.stringify(event.body))

    try {
        const {
            apiToken,
            vehicleId,
            address
        } = JSON.parse(event.body)

        const email = process.env.REACT_APP_NODE_USERNAME
        const password = process.env.REACT_APP_NODE_PASSWORD

        console.log("email: " + email)
        console.log("passsword: " + password)

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
            "http://35.189.58.211:6688/v2/specs/47fa53e0ddce4773b42d84365dbc8afa/runs",
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