 <div align=”center”>

![alt](https://github.com/pappas999/Link-My-Ride/blob/master/src/web-app/public/lmr.png)
 </div>

# A decentralized vehicle rental platform powered by Chainlink and Ethereum.

# Description

In the past, people have integrated a Smart Contract to an electric vehicle via the use of specialized hardware that plugs directly into the vehicle to obtain vehicle data. Not only was it just restricted to pulling data, but it also didn't scale well, as each vehicle requires special hardware and an always on internet connection. When the vehicle has a proper feature rich API that can be leveraged to obtain vehicle data & change its state, we can create a custom external adapter to connect to the vehicle via a Chainlink Oracle, giving the Smart Contract full access to the given vehicles data & ability to change its state.

This submission demonstrates this design pattern, applying it to the use case of the peer to peer sharing economy. In traditional vehicle rental platforms, the vehicle renter relies on the 'brand power' of the company, and trusts that the bond they submit will be returned if they adhered to the conditions. And as a vehicle owner/provider, going through a trusted centralized platform usually costs 30% of revenue. But in a peer to peer scenario, both renter and owner are strangers. This is where a Smart contract connected to external data and events can be leveraged to facilitate a digital agreement between a Vehicle Owner & Vehicle Renter in a trust minimized & secure way. 


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
This repository consists of:

- [Tesla External Adapter](https://github.com/pappas999/Link-My-Ride/tree/master/src/Tesla-External-Adapter)

- [Mock Tesla API](https://github.com/pappas999/Link-My-Ride/tree/master/src/Teslamock)

- [Web App](https://github.com/pappas999/Link-My-Ride/tree/master/src/web-app)

#### Install dependencies

```sh
# install packages. 
npm install

# compile contracts
truffle complie

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
```

Once the application is running it can be accessed by local URL <a href="http://localhost:3000/">http://localhost:3000/</a>

## If we had more time to take this proof of concept further we would...

- Ensure financial incentive for both vehicle owner and renter are sufficient to promote good behaviour

- Add features to facilitate vehicle fleet management including reporting and analytics

- Expand to other API-enabled vehicles

- Cover all essential insurance

- Improve Security, & add multiple Chainlink Nodes for better decentralization

- Improve UI/UX (Form validation, responding to events emitted from smart contract, use user's timezone [currently all times in the web app are in UTC] and more)

