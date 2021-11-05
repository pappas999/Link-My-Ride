The Link My Ride web app was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

#### Note - To avoid [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) issues the web app calls out to a lambda function on the same domain to initiate the job on the Chainlink node which validates entered vehicle details against the Tesla API (or mocked Tesla API) using the external adapter, before relaying the results to the `RentalAgreementFactory` smart contract. <b>The lambda function is therefore required in order for added vehicles to update from the `PENDING` to `APPROVED` status, which is required for them to be available to rent.</b>

Firstly run `npm install` to fetch dependencies. Then...

---

## To run both web app and lambda function in development mode in parallel you may use the  [Netlify CLI](https://github.com/netlify/cli):

Install the CLI globally with `npm install netlify-cli -g`.

Uncomment line and replace placeholders in the `netlify.toml` file with your own Chainlink node details.

Replace placeholders in the `.env` file with your own values.

Then run with `netlify dev`.

Open [http://localhost:8888](http://localhost:8888) to view the app in the browser.

---

## To run just the web app:

Replace placeholders in the `.env` file with your own values.

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

---

## To change the smart contract address

Edit the address found in `/src/features/web3/contract.json`
