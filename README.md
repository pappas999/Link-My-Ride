 <div align=”center”>

![alt](https://github.com/pappas999/Link-My-Ride/blob/master/src/web-app/public/lmr.png)
 </div>

# A decentralized vehicle rental platform powered by Chainlink and Ethereum.

# Description

In the past, Smart Contracts have been integrated with electric vehicles via the use of specialized hardware that plugs directly into the vehicle to obtain real-time data. Not only were these examples restricted to just accessing data, but they also didn't scale well, as each vehicle requires special hardware installed. Tesla electric vehicles have a proper [feature rich API](https://www.teslaapi.io/) that can be leveraged to obtain vehicle data & change the state of the vehicle, which then gives us the ability to create a custom external adapter to connect Smart Contracts to the vehicle via a Chainlink Oracle, giving the Smart Contract full access to the given vehicles data & ability to change its state.

This example demonstrates the design pattern described above, applying it to the use case of the peer to peer sharing economy. In traditional vehicle rental platforms, the vehicle renter relies on the 'brand power' of the company renting the vehicles, and trusts that the bond they submit will be returned if they adhered to the conditions. And as a vehicle owner/provider, going through a trusted centralized platform usually requires sacrificing approximately 30% of revenue earned. But in a peer to peer scenario, both renter and owner are strangers, there is no 'brand power', and there's no guarantee any bond paid will be returned fairly if agreement conditions are met. This is where a Smart contract connected to external data and events can be leveraged to facilitate a digital agreement between a Vehicle Owner & Vehicle Renter in a trust minimized & secure way.


## Demo video

<p align="center">
   <a target="_blank" href="https://youtu.be/yFnXwSGstus">
    <img src="https://github.com/pappas999/Link-My-Ride/blob/master/src/web-app/public/youtube.png"/>
   </a>
</p>

## Live Demo (Kovan network)
https://linkmyri.de/

## Architecture diagram
![alt](https://github.com/pappas999/Link-My-Ride/blob/master/src/web-app/public/architecture.png)

# Build & Run platform
This repository includes:

# [Tesla External Adapter](https://github.com/pappas999/Link-My-Ride/tree/master/src/Tesla-External-Adapter)
This is a custom external adapter to be used by a Chainlink Node to connect to the Tesla Servers via the [Tesla API](https://www.teslaapi.io/), which then connect to the Tesla Cars. There is some config/parameters required to connect to your own Google Cloud Firestore DB (project-id, collection-name). 

In addition to this, the BASE_URL parameter should be modified according to which Tesla Server endpoint you want to connect to:
- http://127.0.0.1:7777 - For a local deployment of the mock server
- https://australia-southeast1-link-my-ride.cloudfunctions.net/teslamock/` - To connect to our adapter deployed on Google Cloud as a Serveless Function. Currently pointing to the mock server also deployed on Google Cloud
- https://owner-api.teslamotors.com/ - If you want to connect to the Production Tesla Servers

# [Mock Tesla API](https://github.com/pappas999/Link-My-Ride/tree/master/src/Teslamock)
This is a mock Tesla server that imitates the Tesla servers, all the end points and the responses, so you can use the app even if you don't have a Tesla. Taken from [https://github.com/mseminatore/teslamock](https://github.com/mseminatore/teslamock)

Take note we have added an endpoint '/values' which you can POST to to update the parameters that we care about. Here is an example json input:
```sh
{ "batteryLevel": "124",
   "odometer": "123.123",
   "longitude": "-22.234242",
   "latitude": "123214.23" 
}
```
# [Web App](https://github.com/pappas999/Link-My-Ride/tree/master/src/web-app)

#### Install dependencies

```sh
# install packages. 
npm install

# compile contracts
truffle compile

# migrate contract
# You can update truffle-config to migrate to Kovan, or you can take the Solidity, paste directly into Remix, change the imports to be the remix ones and deploy/run from there

truffle deploy --reset --network kovan

# Once you have deployed your Chainlinked Smart Contract,you need to obtain the contract public address, and put it in the contract.json file located in /src/web-app/src/features/web3/. You also need to fund it with enough LINK to send 1 LINK for each Rental Agreement created.

#  Start the mock server. It runs on port 7777 by default
cd /src/teslamock/src
npm install
npm start
To deploy the mock server to GCP as a serverless function, you implement the 'app' function

#  Start the external adapter. It runs on port 8080 by default
cd /src/tesla-external-adapter/src
npm install
npm start
To deploy the adapter to GCP as a serverless function, you implement the 'gcpservice' function

#  Start the front end application to test the contract
cd /src/web-app
npm install
npm start

# Check the web app's README for more detailed instructions on running it
```

Once the application is running it can be accessed by local URL <a href="http://localhost:3000/">http://localhost:3000/</a>

## If we had more time to take this proof of concept further we would...

- Ensure financial incentive for both vehicle owner and renter are sufficient to promote good behaviour

- Add features to facilitate vehicle fleet management including reporting and analytics

- Expand to other API-enabled vehicles

- Cover all essential insurance

- Improve Security, & add multiple Chainlink Nodes for better decentralization

- Improve UI/UX (Form validation, responding to events emitted from smart contract, use user's timezone [currently all times in the web app are in UTC] and more)

