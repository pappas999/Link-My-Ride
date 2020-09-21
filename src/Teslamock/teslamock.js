//==========================================================================
// This Express sample demonstrates mocking the TeslaJS REST API for testing
//
// Github: https://github.com/mseminatore/teslamock
// NPM: https://www.npmjs.com/package/teslamock
//
// Copyright (c) 2016 Mark Seminatore
//
// Refer to included LICENSE file for usage rights and restrictions
//==========================================================================

var express = require('express');
var program = require('commander');
var bodyParser = require('body-parser');
var logger = require('morgan');
var path = require('path');
var cookieParser = require('cookie-parser');
require('serve-favicon');
require('colors');

// pages
var index = require('./routes/index');
var driveStatePage = require('./routes/driveStatePage');
var climateStatePage = require('./routes/climateStatePage');
var chargeStatePage = require('./routes/chargeStatePage');
var vehicleStatePage = require('./routes/vehicleStatePage');

var chargingTimer;

//var vehicles = [vehicle];

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: false })); // for parsing application/json
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// define routes
app.use('/', index);
app.use('/driveState', driveStatePage);
app.use('/chargeState', chargeStatePage);
app.use('/climateState', climateStatePage);
app.use('/vehicleState', vehicleStatePage);

//
//
//
program
//  .option('-u, --username [string]', 'username (used to mock login validation)')
//  .option('-p, --password [string]', 'password (used to mock login validation)')
  .option('-P, --port <n>', 'port number for the server', parseInt)
  .parse(process.argv);

//[]======================[]
// Global state
//[]======================[]
var vid = 42555797050350366;

//var username = null;
//var password = null;
var valetPin = 0;
var mobileEnabled = true;

/*
var vehicle = {
    "color": "black",
    "display_name": "Kit",
    "id": vid,
    "id_s": vid.toString(),
    "option_codes": "MS01,RENA,TM00,DRLH,PF00,BT85,PBCW,RFPO,WT19,IBMB,IDPB,TR00,SU01,SC01,TP01,AU01,CH00,HP00,PA00,PS00,AD02,X020,X025,X001,X003,X007,X011,X013",
    "user_id": 123,
    "vehicle_id": 1234567890,
    "vin": "5YJSA1CN5CFP01657",
    "tokens": [
        "123",
        "456"],
    "state": "online"
};
*/

var batteryLevel = 55;
var odometer = 50000.12345;
var longitude = -35.008518;
var latitude = 138.575206;


var driveState = {
    "shift_state": null,          //
    "speed": null,                //
    "latitude": 33.794839,        // degrees N of equator
    "longitude": -84.401593,      // degrees W of the prime meridian
    "heading": 4,                 // integer compass heading, 0-359
    "gps_as_of": 1359863204       // Unix timestamp of GPS fix
};

var chargeState = {
    "charging_state": "Complete",  // "Charging", ??
    "charge_to_max_range": false,  // current std/max-range setting
    "max_range_charge_counter": 0,
    "fast_charger_present": false, // connected to Supercharger?
    "battery_range": 219.02,       // rated miles
    "est_battery_range": 155.79,   // range estimated from recent driving
    "ideal_battery_range": 275.09, // ideal miles
    "battery_level": 80,           // integer charge percentage
    "battery_current": -0.6,       // current flowing into battery
    "charge_starting_range": null,
    "charge_starting_soc": null,
    "charger_voltage": 0,          // only has value while charging
    "charger_pilot_current": 40,   // max current allowed by charger & adapter
    "charger_actual_current": 0,   // current actually being drawn
    "charger_power": 0,            // kW (rounded down) of charger
    "time_to_full_charge": null,   // valid only while charging
    "charge_rate": -1.0,           // float mi/hr charging or -1 if not charging
    "charge_port_door_open": false,
    "charge_limit_soc": 90
};

var climateState =
{
    "inside_temp": 17.0,          // degC inside car
    "outside_temp": 9.5,          // degC outside car or null
    "driver_temp_setting": 22.6,  // degC of driver temperature setpoint
    "passenger_temp_setting": 22.6, // degC of passenger temperature setpoint
    "is_auto_conditioning_on": false, // apparently even if on
    "is_front_defroster_on": null, // null or boolean as integer?
    "is_rear_defroster_on": false,
    "fan_status": 0               // fan speed 0-6 or null
};

var vehicleState =
{
    "df": false,                  // driver's side front door open
    "dr": false,                  // driver's side rear door open
    "pf": false,                  // passenger's side front door open
    "pr": false,                  // passenger's side rear door open
    "ft": false,                  // front trunk is open
    "rt": false,                  // rear trunk is open
    "car_version": "2.15.16",     // car firmware version
    "car_type": "",               // either 's' or 'x'
    "locked": true,               // car is locked
    "sun_roof_installed": true,   // panoramic roof is installed
    "sun_roof_state": "unknown",
    "sun_roof_percent_open": 0,   // null if not installed
    "dark_rims": false,           // gray rims installed
    "wheel_type": "Base19",       // wheel type installed
    "has_spoiler": false,         // spoiler is installed
    "roof_color": "None",         // "None" for panoramic roof, "Colored" otherwise
    "perf_config": "Base",
    "vehicle_name": "Kit",        // display name if set
    "valet_mode": false           // true if valet mode is active
};

var guiSettings =
{
    "gui_distance_units": "mi/hr",
    "gui_temperature_units": "F",
    "gui_charge_rate_units": "mi/hr",
    "gui_24_hour_time": false,
    "gui_range_display": "Rated"
};

var resultSuccess = {
    "response": {
        "result": true,
        "reason": ""
    }
};

//
// TODO - find a way for this to go away.  Perhaps add as members of app??
//
app.locals.driveState = driveState;
app.locals.climateState = climateState;
app.locals.vehicleState = vehicleState;
app.locals.chargeState = chargeState;

//=============================
// Update the drive state
//=============================
app.post('/driveState', function (req, res, next) {
    console.log(req.body);

    driveState = req.body;
    app.locals.driveState = driveState;

    res.send("Drive State Updated! <br><br><button onclick=\"location.href='/driveState'\">Go Back</button>");
});

//=============================
// Update the critical values
//=============================
app.post('/values', function (req, res, next) {
    console.log(req.body);

    batteryLevel = req.body.batteryLevel;
	odometer = req.body.odometer;
	latitude = req.body.latitude;
	longitude = req.body.longitude;
 
    res.send("Critical Values Updated!");
});

//=============================
// Update the climate state
//=============================
app.post('/climateState', function (req, res, next) {
    console.log(req.body);

    climateState.inside_temp = parseInt(req.body.inside_temp);
    climateState.outside_temp = parseInt(req.body.outside_temp);
    climateState.driver_temp_setting = parseInt(req.body.driver_temp_setting);
    climateState.passenger_temp_setting = parseInt(req.body.passenger_temp_setting);
    climateState.is_auto_conditioning_on = req.body.is_auto_conditioning_on == "on" ? true : false;
    climateState.is_front_defroster_on = req.body.is_front_defroster_on == "on" ? true : false;
    climateState.is_rear_defroster_on = req.body.is_rear_defroster_on == "on" ? true : false;
    climateState.fan_status = req.body.fan_status;

    app.locals.climateState = climateState;

    res.send("Climate State Updated! <br><br><button onclick=\"location.href='/climateState'\">Go Back</button>");
});

//=============================
// Update the charge state
//=============================
app.post('/chargeState', function (req, res, next) {
    console.log(req.body);

    chargeState.charging_state = req.body.charging_state;
    chargeState.battery_range = parseInt(req.body.battery_range);
    chargeState.est_battery_range = parseInt(req.body.est_battery_range);
    chargeState.ideal_battery_range = parseInt(req.body.ideal_battery_range);
    chargeState.battery_level = parseInt(req.body.battery_level);
    chargeState.charge_limit_soc = parseInt(req.body.charge_limit_soc);
    chargeState.charge_port_door_open = req.body.charge_port_door_open == "on" ? true : false;
    chargeState.fast_charger_present = req.body.fast_charger_present == "on" ? true : false;

    app.locals.chargeState = chargeState;

    res.send("Charge State Updated! <br><br><button onclick=\"location.href='/chargeState'\">Go Back</button>");
});

//=============================
// Update the vehicle state
//=============================
app.post('/vehicleState', function (req, res, next) {
    console.log(req.body);

    // copy over the fields that were updated
    vehicleState.car_version = req.body.car_version;
    vehicleState.df = req.body.df;
    vehicleState.dr = req.body.dr;
    vehicleState.pf = req.body.pf;
    vehicleState.pr = req.body.pr;
    vehicleState.locked = req.body.locked;
    vehicleState.ft = req.body.ft;
    vehicleState.rt = req.body.rt;
    vehicleState.sun_roof_installed = req.body.sun_roof_installed;
    vehicleState.sun_roof_percent_open = req.body.sun_roof_percent_open;
    vehicleState.vehicle_name = req.body.vehicle_name;
    vehicleState.valet_mode = req.body.valet_mode;

    app.locals.vehicleState = vehicleState;

    res.send("Vehicle State Updated! <br><br><button onclick=\"location.href='/vehicleState'\">Go Back</button>");
});

//=============================
// Mock the OAuth login command
//=============================
app.post('/oauth/token', function (req, res) {
    console.log(JSON.stringify(req));

    // TODO - validate the request before responding
    res.json({
        "access_token": "bc031af9351deb7a33e92f689be9eaad4b840e98b49f050a5e951347f140493d",
        "token_type": "bearer",
        "expires_in": 7776000,
		"refresh_token": "77bfff0afe006b7093d7ee23e85d3c667d36c23181e1e938a049237c35aba19c",
        "created_at": new Date().getMilliseconds()   // 1457385291
    });
	
});

//==========================
// Mock the GET vehicles cmd
//==========================
app.get('/api/1/vehicles', function (req, res) {
    // TODO - add option_code 'MDLX' if this car is a Model X
    // TODO - add support for multiple vehicles
    res.json({
    "response": [
        {
            "id": 42555797050350370,
            "vehicle_id": 1832501921,
            "vin": "5YJ3F7EB1KF443468",
            "display_name": "LL COOL T",
            "option_codes": "AD15,MDL3,PBSB,RENA,BT37,ID3W,RF3G,S3PB,DRLH,DV2W,W39B,APF0,COUS,BC3B,CH07,PC30,FC3P,FG31,GLFR,HL31,HM31,IL31,LTPB,MR31,FM3B,RS3H,SA3P,STCP,SC04,SU3C,T3CA,TW00,TM00,UT3P,WR00,AU3P,APH3,AF00,ZCST,MI00,CDM0",
            "color": null,
            "access_type": "OWNER",
            "tokens": [
                "7e6c201b322e9a43",
                "3487a30d7e9ff6ec"
            ],
            "state": "asleep",
            "in_service": false,
            "id_s": "42555797050350366",
            "calendar_enabled": true,
            "api_version": 10,
            "backseat_token": null,
            "backseat_token_updated_at": null,
            "vehicle_config": null
        }
    ],
    "count": 1
}
);
});

//================================
// Mock the GET mobile_enabled cmd
//================================
app.get('/api/1/vehicles/:vid/mobile_enabled', function (req, res) {
    res.json({ "response": mobileEnabled });
});

//===============================
// Mock the GET charge_state cmd
//===============================
app.get('/api/1/vehicles/:vid/data_request/charge_state', function (req, res) {
    res.json({
        "response": chargeState
    });
});

//===============================
// Mock the GET climate_state cmd
//===============================
app.get('/api/1/vehicles/:vid/data_request/climate_state', function (req, res) {
    res.json({
        "response": climateState
    });
});

//===============================
// Mock the GET drive_state cmd
//===============================
app.get('/api/1/vehicles/:vid/drive_state', function (req, res) {
    res.json({
        "response": driveState
    });
});

//===============================
// Mock the GET gui_settings cmd
//===============================
app.get('/api/1/vehicles/:vid/data_request/gui_settings', function (req, res) {
    res.json({
        "response": guiSettings
    });
});

//===============================
// Mock the GET vehicle_state cmd
//===============================
app.get('/api/1/vehicles/:vid/data_request/vehicle_state', function (req, res) {
    res.json({
        "response": vehicleState
    });
});


//===============================
// Mock the GET vehicle_data cmd
//===============================
app.get('/api/1/vehicles/:vid/vehicle_data', function (req, res) {
    res.json({
    "response": {
        "id": 42555797050350370,
        "user_id": 613893,
        "vehicle_id": 1832501921,
        "vin": "5YJ3F7EB1KF443468",
        "display_name": "LL COOL T",
        "option_codes": "AD15,MDL3,PBSB,RENA,BT37,ID3W,RF3G,S3PB,DRLH,DV2W,W39B,APF0,COUS,BC3B,CH07,PC30,FC3P,FG31,GLFR,HL31,HM31,IL31,LTPB,MR31,FM3B,RS3H,SA3P,STCP,SC04,SU3C,T3CA,TW00,TM00,UT3P,WR00,AU3P,APH3,AF00,ZCST,MI00,CDM0",
        "color": null,
        "access_type": "OWNER",
        "tokens": [
            "dba4738cd5ad38c7",
            "7e6c201b322e9a43"
        ],
        "state": "online",
        "in_service": false,
        "id_s": "42555797050350366",
        "calendar_enabled": true,
        "api_version": 10,
        "backseat_token": null,
        "backseat_token_updated_at": null,
        "vehicle_config": {
            "can_accept_navigation_requests": true,
            "can_actuate_trunks": true,
            "car_special_type": "base",
            "car_type": "model3",
            "charge_port_type": "CCS",
            "ece_restrictions": false,
            "eu_vehicle": true,
            "exterior_color": "PearlWhite",
            "has_air_suspension": false,
            "has_ludicrous_mode": false,
            "key_version": 2,
            "motorized_charge_port": true,
            "plg": false,
            "rear_seat_heaters": 1,
            "rear_seat_type": null,
            "rhd": true,
            "roof_color": "Glass",
            "seat_type": null,
            "spoiler_type": "Passive",
            "sun_roof_installed": null,
            "third_row_seats": "<invalid>",
            "timestamp": 1598935524027,
            "use_range_badging": true,
            "wheel_type": "Stiletto20"
        },
        "charge_state": {
            "battery_heater_on": false,
            "battery_level": `${batteryLevel}`,
            "battery_range": 154.77,
            "charge_current_request": 16,
            "charge_current_request_max": 16,
            "charge_enable_request": false,
            "charge_energy_added": 3.15,
            "charge_limit_soc": 95,
            "charge_limit_soc_max": 100,
            "charge_limit_soc_min": 50,
            "charge_limit_soc_std": 90,
            "charge_miles_added_ideal": 13,
            "charge_miles_added_rated": 13,
            "charge_port_cold_weather_mode": false,
            "charge_port_door_open": false,
            "charge_port_latch": "Engaged",
            "charge_rate": 0,
            "charge_to_max_range": true,
            "charger_actual_current": 0,
            "charger_phases": null,
            "charger_pilot_current": 16,
            "charger_power": 0,
            "charger_voltage": 1,
            "charging_state": "Disconnected",
            "conn_charge_cable": "<invalid>",
            "est_battery_range": 150.53,
            "fast_charger_brand": "<invalid>",
            "fast_charger_present": false,
            "fast_charger_type": "<invalid>",
            "ideal_battery_range": 154.77,
            "managed_charging_active": false,
            "managed_charging_start_time": null,
            "managed_charging_user_canceled": false,
            "max_range_charge_counter": 1,
            "minutes_to_full_charge": 0,
            "not_enough_power_to_heat": null,
            "scheduled_charging_pending": false,
            "scheduled_charging_start_time": null,
            "time_to_full_charge": 0,
            "timestamp": 1598935524027,
            "trip_charging": false,
            "usable_battery_level": 54,
            "user_charge_enable_request": null
        },
        "climate_state": {
            "battery_heater": false,
            "battery_heater_no_power": null,
            "climate_keeper_mode": "off",
            "defrost_mode": 0,
            "driver_temp_setting": 22,
            "fan_status": 0,
            "inside_temp": 15.5,
            "is_auto_conditioning_on": false,
            "is_climate_on": false,
            "is_front_defroster_on": false,
            "is_preconditioning": false,
            "is_rear_defroster_on": false,
            "left_temp_direction": 0,
            "max_avail_temp": 28,
            "min_avail_temp": 15,
            "outside_temp": 14.5,
            "passenger_temp_setting": 22,
            "remote_heater_control_enabled": false,
            "right_temp_direction": 0,
            "seat_heater_left": 0,
            "seat_heater_rear_center": 0,
            "seat_heater_rear_left": 0,
            "seat_heater_rear_right": 0,
            "seat_heater_right": 0,
            "side_mirror_heaters": false,
            "timestamp": 1598935524027,
            "wiper_blade_heater": false
        },
        "drive_state": {
            "gps_as_of": 1598935049,
            "heading": 49,
            "latitude": `${latitude}`,
            "longitude": `${longitude}`,
            "native_latitude": -34.86952,
            "native_location_supported": 1,
            "native_longitude": 138.711122,
            "native_type": "wgs",
            "power": 0,
            "shift_state": null,
            "speed": null,
            "timestamp": 1598935524027
        },
        "gui_settings": {
            "gui_24_hour_time": false,
            "gui_charge_rate_units": "kW",
            "gui_distance_units": "km/hr",
            "gui_range_display": "Rated",
            "gui_temperature_units": "C",
            "show_range_units": false,
            "timestamp": 1598935524027
        },
        "vehicle_state": {
            "api_version": 10,
            "autopark_state_v2": "ready",
            "autopark_style": "dead_man",
            "calendar_supported": true,
            "car_version": "2020.32.3 b9bd4364fd17",
            "center_display_state": 0,
            "df": 0,
            "dr": 0,
            "fd_window": 0,
            "fp_window": 0,
            "ft": 0,
            "is_user_present": false,
            "last_autopark_error": "no_error",
            "locked": false,
            "media_state": {
                "remote_control_enabled": true
            },
            "notifications_supported": true,
            "odometer": `${odometer}`,
            "parsed_calendar_supported": true,
            "pf": 0,
            "pr": 0,
            "rd_window": 0,
            "remote_start": false,
            "remote_start_enabled": true,
            "remote_start_supported": true,
            "rp_window": 0,
            "rt": 0,
            "sentry_mode": false,
            "sentry_mode_available": true,
            "smart_summon_available": true,
            "software_update": {
                "download_perc": 0,
                "expected_duration_sec": 2700,
                "install_perc": 1,
                "status": "",
                "version": ""
            },
            "speed_limit_mode": {
                "active": false,
                "current_limit_mph": 50.621371,
                "max_limit_mph": 90,
                "min_limit_mph": 50,
                "pin_code_set": true
            },
            "summon_standby_mode_enabled": false,
            "timestamp": 1598935524027,
            "valet_mode": false,
            "valet_pin_needed": true,
            "vehicle_name": "LL COOL T"
        }
    }


    });
});


//===============================
// Mock the POST wake_up cmd
//===============================
app.post('/api/1/vehicles/:vid/wake_up', function (req, res) {
    res.json(resultSuccess);
});

//=================================
// Mock the POST set_valet_mode cmd
//=================================
app.post('/api/1/vehicles/:vid/command/set_valet_mode', function (req, res) {
    if (req.body.on && valetPin === 0) {
        vehicleState.valet_mode = true;
        valetPin = req.body.password;

        app.locals.vehicleState = vehicleState;
        res.json(resultSuccess);
        return;
    }

    if (!req.body.on && valetPin == req.body.password) {
        vehicleState.valet_mode = false;
        valetPin = 0;

        app.locals.vehicleState = vehicleState;
        res.json(resultSuccess);
        return;
    }

    res.json({
        "response": {
            "result": false,
            "reason": "invalid_pin"
        }
    });
});

//==================================
// Mock the POST reset_valet_pin cmd
//==================================
app.post('/api/1/vehicles/:vid/command/reset_valet_pin', function (req, res) {
    // TODO - does this reset valet mode?
    vehicleState.valet_mode = false;
    valetPin = 0;

    app.locals.vehicleState = vehicleState;
    res.json(resultSuccess);
});

//========================================
// Mock the POST charge_port_door_open cmd
//========================================
app.post('/api/1/vehicles/:vid/command/charge_port_door_open', function (req, res) {
    chargeState.charge_port_door_open = true;

    app.locals.chargeState = chargeState;
    res.json(resultSuccess);
});

//========================================
// Mock the POST charge_standard cmd
//========================================
app.post('/api/1/vehicles/:vid/command/charge_standard', function (req, res) {
    if (chargeState.charge_limit_soc == 90) {
        res.json({
            "response": {
                "result": false,
                "reason": "already_standard"
            }
        });
    }

    chargeState.charge_limit_soc = 90;
    res.json(resultSuccess);
});

//========================================
// Mock the POST charge_max_range cmd
//========================================
app.post('/api/1/vehicles/:vid/command/charge_max_range', function (req, res) {
    if (chargeState.charge_limit_soc == 100) {
        res.json({
            "response": {
                "result": false,
                "reason": "already_max_range"
            }
        });
    }

    chargeState.charge_limit_soc = 100;
    res.json(resultSuccess);
});

//========================================
// Mock the POST set_charge_limit cmd
//========================================
app.post('/api/1/vehicles/:vid/command/set_charge_limit', function (req, res) {
//    var auth = req.get('Authorization');
    // TODO - validate the auth token

    // ensure valid percent value
    var percent = req.body.percent;
    if (percent < 50) {
        percent = 50;
    }

    if (percent > 100) {
        percent = 100;
    }

    // process the state change
    chargeState.charge_limit_soc = percent;

    // TODO - validate the vehicleID matches
//    console.log(req.params.vid);

    res.json(resultSuccess);
});

//
//
//
function socToRatedMiles(soc) {
    // 265 rated miles at 100% SOC
    return Math.round(soc * 2.65);
}

//
//
//
function ratedToIdealMiles(rated) {
    return Math.round(rated * 350 / 265);
}

//
//
//
function chargePowerToRatedRange(power) {
    return Math.round(power/1000 * 3);
}

//
//
//
function updateChargeCB() {
    console.log("Charging tick.");

    if (chargeState.battery_level < chargeState.charge_limit_soc) {
        chargeState.battery_level = 1.0 + chargeState.battery_level;
        chargeState.battery_range = socToRatedMiles(chargeState.battery_level);
        chargeState.ideal_battery_range = ratedToIdealMiles(chargeState.battery_range);
        chargeState.est_battery_range = Math.round(chargeState.battery_range * 0.85);
        // TODO - recompute finish time and update time_to_full_charge
    }
    else {
        if (chargingTimer) {
            clearInterval(chargingTimer);
            chargingTimer = null;
            chargeState.charging_state = "Complete";
            console.log("Charging complete.");
        }
    }
}

//========================================
// Mock the POST charge_start cmd
//========================================
app.post('/api/1/vehicles/:vid/command/charge_start', function (req, res) {
    if (chargeState.battery_level < chargeState.charge_limit_soc) {
        var tickRate;

        if (chargeState.fast_charger_present) {
            chargeState.charger_actual_current = 360;
            chargeState.charger_voltage = 390;
            tickRate = 1000;
        }
        else {
            chargeState.charger_actual_current = 40;
            chargeState.charger_voltage = 240;
            tickRate = 5000;
        }

        chargeState.charging_state = "Charging";
        chargeState.charger_power = parseInt(chargeState.charger_actual_current) * parseInt(chargeState.charger_voltage);
        chargeState.time_to_full_charge = 10000;
        chargeState.charge_rate = chargePowerToRatedRange(chargeState.charger_power);

        // set timer to update simulation
        chargingTimer = setInterval(updateChargeCB, tickRate);
    }

    app.locals.chargeState = chargeState;
    res.json(resultSuccess);
});

//========================================
// Mock the POST charge_stop cmd
//========================================
app.post('/api/1/vehicles/:vid/command/charge_stop', function (req, res) {
    if (chargingTimer) {
        clearInterval(chargingTimer);
        chargingTimer = null;
    }

    app.locals.chargeState = chargeState;
    res.json(resultSuccess);
});

//========================================
// Mock the POST flash_lights cmd
//========================================
app.post('/api/1/vehicles/:vid/command/flash_lights', function (req, res) {
    // no state changes here
	res.json({
		"response": {
			"reason": "",
			"result": true
		}
	});	
    res.json(resultSuccess);
});

//========================================
// Mock the POST honk_horn cmd
//========================================
app.post('/api/1/vehicles/:vid/command/honk_horn', function (req, res) {
    // no state changes here
	res.json({
		"response": {
			"reason": "",
			"result": true
	}
	});	
    res.json(resultSuccess);
});

//========================================
// Mock the POST door_unlock cmd
//========================================
app.post('/api/1/vehicles/:vid/command/door_unlock', function (req, res) {
    vehicleState.locked = false;

    app.locals.vehicleState = vehicleState;
	
	res.json({
		"response": {
			"reason": "",
			"result": true
		}
	});	
    res.json(resultSuccess);
});

//========================================
// Mock the POST door_lock cmd
//========================================
app.post('/api/1/vehicles/:vid/command/door_lock', function (req, res) {
    vehicleState.locked = true;

    app.locals.vehicleState = vehicleState;
	res.json({
		"response": {
			"reason": "",
			"result": true
		}
	});	
    res.json(resultSuccess);
});

//========================================
// Mock the POST set_temps cmd
//========================================
app.post('/api/1/vehicles/:vid/command/set_temps', function (req, res) {
    var driverTemp = req.body.driver_temp;
    var passTemp = req.body.passenger_temp;

    // TODO - clamp temp values to appropriate ranges

    climateState.driver_temp_setting = driverTemp;
    climateState.passenger_temp_setting = passTemp;

    app.locals.climateState = climateState;
    res.json(resultSuccess);
});

//========================================
// Mock the POST auto_conditioning_start cmd
//========================================
app.post('/api/1/vehicles/:vid/command/auto_conditioning_start', function (req, res) {
    climateState.is_auto_conditioning_on = true;
    climateState.fan_status = 6;

    climateState.inside_temp = climateState.driver_temp_setting;

    app.locals.climateState = climateState;
    res.json(resultSuccess);
});

//========================================
// Mock the POST auto_conditioning_stop cmd
//========================================
app.post('/api/1/vehicles/:vid/command/auto_conditioning_stop', function (req, res) {
    climateState.is_auto_conditioning_on = false;
    climateState.fan_status = 0;

    climateState.inside_temp = climateState.outside_temp;

    app.locals.climateState = climateState;
    res.json(resultSuccess);
});

//========================================
// Mock the POST sun_roof_control cmd
//========================================
app.post('/api/1/vehicles/:vid/command/sun_roof_control', function (req, res) {
    vehicleState.sun_roof_percent_open = req.body.percent;

    // TODO - clamp percent values

    res.json(resultSuccess);
});

//========================================
// Mock the POST remote_start_drive cmd
//========================================
app.post('/api/1/vehicles/:vid/command/remote_start_drive', function (req, res) {
    res.json(resultSuccess);
});

//========================================
// Mock the POST trunk_open cmd
//========================================
app.post('/api/1/vehicles/:vid/command/trunk_open', function (req, res) {
    vehicleState.rt = true;

    app.locals.vehicleState = vehicleState;
    res.json(resultSuccess);
});

//========================================
// Mock the POST trigger_homelink cmd
//========================================
app.post('/api/1/vehicles/:vid/command/trigger_homelink', function (req, res) {
    res.json(resultSuccess);
});

//========================================
// Mock the POST upcoming_calendar_entries cmd
//========================================
app.post('/api/1/vehicles/:vid/command/upcoming_calendar_entries', function (req, res) {
    res.json(resultSuccess);
});

//[]===============================[]
// Setup our listen server
//[]===============================[]
var port = program.port || 7777;

app.listen(port, function () {
    var str = "http://127.0.0.1:" + port;
    console.log("TeslaMock".cyan + " listening at " + str.green);
});

//========================================
// catch 404 and forward to error handler
//========================================
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

//[]===============================[]
// error handlers
//[]===============================[]

//========================================
// development error handler
// will print stacktrace
//========================================
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

//========================================
// production error handler
// no stacktraces leaked to user
//========================================
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
module.exports = {app};

