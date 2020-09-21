const { Requester, Validator } = require('@chainlink/external-adapter')
const axios = require('axios')


const Firestore = require('@google-cloud/firestore');
const PROJECTID = 'link-my-ride';
const COLLECTION_NAME = 'tesla-api-tokens';
const firestore = new Firestore({
  projectId: PROJECTID,
  timestampsInSnapshots: true,
});
 

//TODO: whitelist to reject any requests if not from specific chainlink node IPs 

//structure for input json is as follows: In this example, jobSpec is 22, & actions can be any of the ones listed below
//{ "id": 22, "data": { 
//   "apiToken": "abcdefghi",
//   "vehicleId": "23423423423423423423",
//   "action": "authenticate" , "vehicles", "wake_up", "vehicle_data", "unlock", "lock", "honk_horn",
//} }

const  createRequest = async (input, callback) => {
  

    //alternate between these 2 depending on if connecting to the mock server or an actual tesla
    //const base_url = `http://127.0.0.1:7777/`
	const base_url = `https://australia-southeast1-link-my-ride.cloudfunctions.net/teslamock/`
    //const base_url = `https://owner-api.teslamotors.com/`
  
    var storedToken;
	var authenticationToken;
	var odometer;
	var chargeLevel;
	var longitude;
	var latitude;
	var finalResponse;
  
    //get input values
    var jobRunID = input.id
    var vehicleId = input.data.vehicleId
	var address;

    //depending on the scnenario, get the authentication token from the request (authentication request), or from Google Cloud Firestore
	if (input.data.action == 'authenticate') {  //get value from request
		authenticationToken = `Bearer ${input.data.apiToken}`
		address = input.data.address
	} else {   //get value from Cloud Firestore		
		const apiTokenRef = firestore.collection(COLLECTION_NAME).doc(vehicleId);
		const doc = await apiTokenRef.get();
		if (!doc.exists) {
			console.log('No such document in firestore!');
		} else {
			console.log('Document data:', doc.data());
			storedToken = doc.data().tokenToStore;
			
		}
		authenticationToken = `Bearer ${storedToken}`

	}

    console.log('authentincation header: ' + authenticationToken);
  
    var endpoint; 
    var finalUrl;
	
	const headers = {
		'Content-Type': 'application/json',
		'Authorization': authenticationToken
	}
     
    //first thing we need to always do is wake the vehicle up. If successful, then its ready to receive a request
	endpoint = `api/1/vehicles/${vehicleId}/wake_up`
    finalUrl = base_url + endpoint;
	console.log('doing wakeup request to: ' + finalUrl);
	//Create the request
	try { 
		await axios.post(finalUrl,null, {headers: headers})
		.then(async function (response) {
			console.log('wakeup successful');
			//Only do callback if we're doing an authenticate, otherwise there'll be other requests to come
			if (input.data.action == 'authenticate' && response.status == 200) {
				
				//authentication was successful, store the key to be used/retrieved for future requests, then do callback
				const tokenToStore = input.data.apiToken;
				console.log('storing token: ' + tokenToStore);
				const res = await firestore.collection(COLLECTION_NAME).doc(vehicleId).set({tokenToStore});
				
				//now that the API token has been stored in the data store, we can do the callback, passing the address back to be used to update vehicle status
				finalResponse = address
				console.log('final response: ' + finalResponse);
				callback(response.status, 
				{
					   jobRunID,
				  data: finalResponse,
				  result: address,
				  statusCode: response.status
				});
			} 
		});
	} catch(error) {
		console.log('wakeup error: ' + error);
		callback(response.status, Requester.errored(jobRunID, error))
	}
  
  //now depending on action, do different requests
  switch(input.data.action) {
  case 'authenticate':
    // vehicle is being created. If the wakeup was successful then we don't need to do anything here, just return the vehicle address
    break;
		
 case 'vehicle_data':
    // pull required vehicle data for contract. This includes odometer, charge level, Longitude & Latitude
	//fields are available in the following json locations:
	//odometer: response.vehicle_state.odometer . this is in miles and in decimals so convert/round to whole number
	//charge level: response.charge_state.battery_level 
	//longitude: response.drive_state.longitude
	//latitude: response.drive_state.latitude
	
	endpoint = `api/1/vehicles/${vehicleId}/vehicle_data`
	finalUrl = base_url + endpoint;
	console.log('doing vehicle data request to: ' + finalUrl);
  
	//Create the request
	try { 
		await axios.get(finalUrl,{headers: headers})
		.then(function (response) {
			console.log('get vehicle data successful');
			//console.log(JSON.stringify(response.data));
			
			odometer = Math.round(response.data.response.vehicle_state.odometer)
			charge = response.data.response.charge_state.battery_level
			longitude = response.data.response.drive_state.longitude * 1000000
			latitude = response.data.response.drive_state.latitude * 1000000
	  
			finalResponse = `{${odometer},${charge},${longitude},${latitude}}`
			console.log('final response: ' + finalResponse);
			callback(response.status, 
			  {
					   jobRunID,
				 data: finalResponse,
			   result: null,
		   statusCode: response.status
    });
		}); 
	} catch(error) {
		console.log('get vehicle data error: ' + error);
		callback(response.status, Requester.errored(jobRunID, error))
	}
    break;
 
 //For both unlock & lock, for this use case we also need to obtain vehicle data values, as the on-chain contract will need them to log specific data 
 case 'unlock':
    //first get vehicle data
	endpoint = `api/1/vehicles/${vehicleId}/vehicle_data`
	finalUrl = base_url + endpoint;
	console.log('doing vehicle data request to: ' + finalUrl);
  
	//Create the request
	try { 
		await axios.get(finalUrl,{headers: headers})
		.then(function (response) {
			console.log('get vehicle data successful');
			//console.log(JSON.stringify(response.data));
			
			odometer = Math.round(response.data.response.vehicle_state.odometer)
			charge = response.data.response.charge_state.battery_level
			longitude = response.data.response.drive_state.longitude * 1000000
			latitude = response.data.response.drive_state.latitude * 1000000
	  
			finalResponse = `{${odometer},${charge},${longitude},${latitude}}`
			console.log('final response: ' + finalResponse);
			
		}); 
	} catch(error) {
		console.log('get vehicle data error: ' + error);
		callback(response.status, Requester.errored(jobRunID, error))
	}
	
	//now that we have the data, we can unlock the vehicle
    endpoint = `api/1/vehicles/${vehicleId}/command/door_unlock`
	finalUrl = base_url + endpoint;
	console.log('doing door unlock request to: ' + finalUrl);
	//Create the request
	try { 
		await axios.post(finalUrl, null, {headers: headers})
		.then(function (response) {
			console.log('unlock successful');
			callback(response.status, 
			  {
					   jobRunID,
				 data: finalResponse,
			   result: null,
		   statusCode: response.status
			});
		}); 
	} catch(error) {
		console.log('unlock error: ' + error);
		callback(response.status, Requester.errored(jobRunID, error))
	}
    break;
	
 case 'lock':
 
	//first get vehicle data
	endpoint = `api/1/vehicles/${vehicleId}/vehicle_data`
	finalUrl = base_url + endpoint;
	console.log('doing vehicle data request to: ' + finalUrl);
  
	//Create the request
	try { 
		await axios.get(finalUrl,{headers: headers})
		.then(function (response) {
			console.log('get vehicle data successful');
			//console.log(JSON.stringify(response.data));
			
			odometer = Math.round(response.data.response.vehicle_state.odometer)
			charge = response.data.response.charge_state.battery_level
			longitude = response.data.response.drive_state.longitude * 1000000
			latitude = response.data.response.drive_state.latitude * 1000000
	  
			finalResponse = `{${odometer},${charge},${longitude},${latitude}}`
			console.log('final response: ' + finalResponse);
			
		}); 
	} catch(error) {
		console.log('get vehicle data error: ' + error);
		callback(response.status, Requester.errored(jobRunID, error))
	}
	
	//now that we have the data, we can unlock the vehicle
    endpoint = `api/1/vehicles/${vehicleId}/command/door_lock`
	finalUrl = base_url + endpoint;
	console.log('doing  door_lock request to: ' + finalUrl);
	//Create the request
	try { 
		await axios.post(finalUrl, null, {headers: headers})
		.then(function (response) {
			console.log('door_lock successful');
			callback(response.status, 
			  {
					   jobRunID,
				 data: finalResponse,
			   result: null,
		   statusCode: response.status
			});
		}); 
	} catch(error) {
		console.log('door_lock error: ' + error);
		callback(response.status, Requester.errored(jobRunID, error))
	}
    break;
	
 case 'honk_horn':
    endpoint = `api/1/vehicles/${vehicleId}/command/honk_horn`
	finalUrl = base_url + endpoint;
	console.log('doing door honk_horn request to: ' + finalUrl);
	//Create the request
	try { 
		await axios.post(finalUrl, null, {headers: headers})
		.then(function (response) {
			console.log('honk_horn successful');
			callback(response.status, Requester.success(jobRunID, response))
		}); 
	} catch(error) {
		console.log('honk_horn error: ' + error);
		callback(response.status, Requester.errored(jobRunID, error))
	}
    break;
	
  case 'vehicles':
    // don't think we need this one
    break;
	
  default:
    console.log('invalid parameter');
  }

}

// This is a wrapper to allow the function to work with
// GCP Functions
exports.gcpservice = (req, res) => {
  createRequest(req.body, (statusCode, data) => {
    res.status(statusCode).send(data)
  })
}

// This is a wrapper to allow the function to work with
// AWS Lambda
exports.handler = (event, context, callback) => {
  createRequest(event, (statusCode, data) => {
    callback(null, data)
  })
}

// This is a wrapper to allow the function to work with
// newer AWS Lambda implementations
exports.handlerv2 = (event, context, callback) => {
  createRequest(JSON.parse(event.body), (statusCode, data) => {
    callback(null, {
      statusCode: statusCode,
      body: JSON.stringify(data),
      isBase64Encoded: false
    })
  })
}

// This allows the function to be exported for testing
// or for running in express
module.exports.createRequest = createRequest
