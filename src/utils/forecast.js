const request = require('request');
const fs = require('fs');

const forecast = (latitude, longitude, location, callback) => {

    const url = `http://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=metric&lang=en&appid=246c5e4f723877cd167ed8ad4e8229ee`;

    request({ url, json: true }, (error, { body }) => {

        if (error) {

            callback('Unable to connect to weather service!', undefined);
        } else if (body.message) {

            callback('Unable to find location', undefined);
        } else {

            callback(undefined, {
                lat: body.lat,
                lon: body.lon,
                location: location,
                current: body.current,
                daily: body.daily
            });
        }
    });
};
module.exports = forecast;