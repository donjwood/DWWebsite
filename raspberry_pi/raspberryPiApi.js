const config = require('../config');
const axios = require('axios');
var jwt = require('jsonwebtoken');

var dummySenseHatData = {
    pressure: 993,
    temperature: 21,
    temperatureFromPressure: 21,
    humidity: 30,
    pitch: 0,
    roll: 0,
    yaw: 0,
    cpuTemp: 46
};

// The Raspberry Pi API Token
var apiToken = '';
var apiUser = ''

// Method to get the api token
async function getApiToken() {
    if (!apiToken ||
        hasTokenExpired(apiToken)) {

        let res = await axios.post(
            config.raspberryPi.url  + '/userapi/gettoken',
            {
                "userName": config.raspberryPi.username,
                "password": config.raspberryPi.password
            }
        );

        apiUser = res.data.user;
        apiToken = res.data.token;

    }

    return apiToken;
}

// See if the jwt has expired.
function hasTokenExpired(token) {

    let decodedToken = jwt.decode(token);

    var currentTimestamp = Math.floor(Date.now() / 1000);

    return Math.floor(Date.now() / 1000) > decodedToken.exp;

}

exports.getSenseHatData = async function () {

    axios.defaults.headers.common['x-access-token'] = await getApiToken();

    let res = await axios.get(
        config.raspberryPi.url + '/sensehatapi/getsensehatdata'
        );

    return res.data;

};

