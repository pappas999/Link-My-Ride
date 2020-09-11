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
  apiToken: false,
  action: true
}

//whitelist to reject any requests if not from node

//structure for input json is as follows:
//{ 
//	 "apiToken": "abcdefghi",
//   "vehicleId": "23423423423423423423",
//   "action": "authenticate" , "vehicles", "wake_up", "vehicle_data", "unlock", "lock", "honk_horn",
//}

//authenticator is used when adding vehicle to ensure all works ok

const createRequest = (input, callback) => {
  // The Validator helps you validate the Chainlink request data
  const validator = new Validator(callback, input, customParams)
  
  const base_url = `http://127.0.0.1:7777/`
  //const base_url = `https://owner-api.teslamotors.com/${endpoint}`
  const appid = process.env.API_KEY;
  var vehicleId = input.vehicleId
  
  const jobRunID = validator.validated.id
  var endpoint; //= validator.validated.data.endpoint || 'price'
  var finalUrl;
  var authenticationToken = `Authorization: Bearer ${apiToken}`
  //const fsym = validator.validated.data.base.toUpperCase()
  //const tsyms = validator.validated.data.quote.toUpperCase()

  const params = {
    fsym,
    tsyms
  }

  var config = {
    url,
    params
  }
  
  //first thing we need to always do is wake the vehicle up. If successful, then its ready to receive a request
  //URL https://owner-api.teslamotors.com/api/1/vehicles/42555797050350366/wake_up
	endpoint = `api/1/vehicles/${vehicleId}/wake_up`
	finalUrl = base_url + endpoint;
	console.log('doing wakeup request to: ' + finalUrl);
	//Create the request
	try { 
		await axios.post(finalUrl, jobSpec, {headers: {${authenticationToken}}})
		.then(function (response) {
			console.log('wakeup successful:' + response);
			callback(response.status, Requester.success(jobRunID, response))
		}); 
	} catch(error) {
		console.log('wakeup error: ' + error);
		callback(response.status, Requester.errored(jobRunID, error))
	}
  
  //now depending on action, do different requests
  switch(input.action) {
  case 'authenticate':
    // vehicle is being created. If the wakeup was successful then we don't need to do anything here
    break;
	
  case 'vehicles':
    // don't think we need this one
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
	console.log('doing wakeup request to: ' + finalUrl);
	var odometer;
	var chargeLevel;
	var longitude;
	var latitude;
	var finalResponse;
	
	var config = {
		finalUrl
	}
  
	//Create the request
	
	Requester.request(config, customError)
    .then(response => {
	  //Now we need to parse each element from the result
	  odometer = response.response.vehicle_state.odometer
	  charge = response.response.vehicle_state.charge
	  longitude = response.response.vehicle_state.longitude
	  latitude = response.response.vehicle_state.latitude
	  
	  finalResponse = `{${odometer},${charge},${longitude},${latitude}}`
	  
	  
      callback(response.status, Requester.success(jobRunID, finalResponse))
    })
    .catch(error => {
      callback(500, Requester.errored(jobRunID, error))
    })
	
	
    break;
 case 'unlock':
    endpoint = `api/1/vehicles/${vehicleId}/command/door_unlock`
	finalUrl = base_url + endpoint;
	console.log('doing door unlock request to: ' + finalUrl);
	//Create the request
	try { 
		await axios.post(finalUrl, jobSpec, {headers: {${authenticationToken}}})
		.then(function (response) {
			console.log('unlock successful:' + response);
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
		await axios.post(finalUrl, jobSpec, {headers: {${authenticationToken}}})
		.then(function (response) {
			console.log('door_lock successful:' + response);
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
		await axios.post(finalUrl, jobSpec, {headers: {${authenticationToken}}})
		.then(function (response) {
			console.log('honk_horn successful:' + response);
			callback(response.status, Requester.success(jobRunID, response))
		}); 
	} catch(error) {
		console.log('honk_horn error: ' + error);
		callback(response.status, Requester.errored(jobRunID, error))
	}
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
