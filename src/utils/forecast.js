const request = require('request');
const keyAPI = process.env.OPEN_WEATHER_MAP_KEY

const forecast = (latitude, longitude, callback) => {
    
    const url = `http://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=metric&lang=en&appid=${keyAPI}`

    request({ url, json: true }, (error, { body }) => {

        if (error) {

            callback('Unable to connect to weather service!', undefined);
        } else if (body.message) {

            callback('Unable to get data weather', undefined);
        } else {

            callback(undefined, {
                lat: body.lat,
                lon: body.lon,
                current: body.current,
                daily: body.daily
            });
        }
    });
};
module.exports = forecast;