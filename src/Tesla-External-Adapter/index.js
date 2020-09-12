const { Requester, Validator } = require('@chainlink/external-adapter')
const axios = require('axios')

// Define custom error scenarios for the API.
// Return true for the adapter to retry.
const customError = (data) => {
  if (data.Response === 'Error') return true
  return false
}

// Define custom parameters to be used by the adapter.
// Extra parameters can be stated in the extra object,
// with a Boolean value indicating whether or not they
// should be required.
const customParams = {
  apiToken: ['apiToken'],
  action: ['action'],
  endpoint: false
}

 

//TODO: whitelist to reject any requests if not from specific chainlink node IPs 

//structure for input json is as follows: In this example, jobSpec is 22, & actions can be any of the ones listed below
//{ "id": 22, "data": { 
//   "apiToken": "abcdefghi",
//   "vehicleId": "23423423423423423423",
//   "action": "authenticate" , "vehicles", "wake_up", "vehicle_data", "unlock", "lock", "honk_horn",
//} }



const  createRequest = async (input, callback) => {
  
    //alternate between these 2 depending on if connecting to the mock server or an actual tesla
    const base_url = `http://127.0.0.1:7777/`
    //const base_url = `https://owner-api.teslamotors.com/`
  
    const token = process.env.API_KEY;
  
    //get input values
    var jobRunID = input.id
    var vehicleId = input.data.vehicleId

    //comment one of these 2 out depending on if you're using windows or mac/unix. For windows dev am just passing in the token in each request.
    var authenticationToken = `Authorization: Bearer ${token}`
    var authenticationToken = `Authorization: Bearer ${input.data.apiToken}`
    console.log('authentincation header: ' + authenticationToken);
  
    var endpoint; 
    var finalUrl;
     
    //first thing we need to always do is wake the vehicle up. If successful, then its ready to receive a request
	endpoint = `api/1/vehicles/${vehicleId}/wake_up`
    finalUrl = base_url + endpoint;
	console.log('doing wakeup request to: ' + finalUrl);
	//Create the request
	try { 
		await axios.post(finalUrl, {headers: {authenticationToken}})
		.then(function (response) {
			console.log('wakeup successful');
			//Only do callback if we're doing an authenticate, otherwise there'll be other requests to come
			if (input.data.action == 'authenticate') {
				callback(response.status, Requester.success(jobRunID, response))
			}
		}); 
	} catch(error) {
		console.log('wakeup error: ' + error);
		callback(response.status, Requester.errored(jobRunID, error))
	}
  
  //now depending on action, do different requests
  switch(input.data.action) {
  case 'authenticate':
    // vehicle is being created. If the wakeup was successful then we don't need to do anything here
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
	var odometer;
	var chargeLevel;
	var longitude;
	var latitude;
	var finalResponse;
  
	//Create the request
	try { 
		await axios.get(finalUrl, {headers: {authenticationToken}})
		.then(function (response) {
			console.log('get vehicle data successful');
			//console.log(JSON.stringify(response.data));
			
			odometer = Math.round(response.data.response.vehicle_state.odometer)
			charge = response.data.response.charge_state.battery_level
			longitude = response.data.response.drive_state.longitude
			latitude = response.data.response.drive_state.latitude
	  
			finalResponse = `{${odometer},${charge},${longitude},${latitude}}`
			console.log('final response: ' + finalResponse);
			//callback(response.status, Requester.success(jobRunID, finalResponse))
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
	
 case 'unlock':
    endpoint = `api/1/vehicles/${vehicleId}/command/door_unlock`
	finalUrl = base_url + endpoint;
	console.log('doing door unlock request to: ' + finalUrl);
	//Create the request
	try { 
		await axios.post(finalUrl, {headers: {authenticationToken}})
		.then(function (response) {
			console.log('unlock successful');
			callback(response.status, Requester.success(jobRunID, response))
		}); 
	} catch(error) {
		console.log('unlock error: ' + error);
		callback(response.status, Requester.errored(jobRunID, error))
	}
    break;
	
 case 'lock':
    endpoint = `api/1/vehicles/${vehicleId}/command/door_lock`
	finalUrl = base_url + endpoint;
	console.log('doing door door_lock request to: ' + finalUrl);
	//Create the request
	try { 
		await axios.post(finalUrl, {headers: {authenticationToken}})
		.then(function (response) {
			console.log('door_lock successful');
			callback(response.status, Requester.success(jobRunID, response))
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
		await axios.post(finalUrl, {headers: {authenticationToken}})
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
