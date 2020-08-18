const request = require('request')

const geocode = (address, callback) => {
    // const url = `http://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?access_token=pk.eyJ1IjoibXJ0YWFuIiwiYSI6ImNrZG9tcTloMTF0bmIyeW9mN3MyeDEwNGcifQ.ZOSIZEWIDM117d0FDHKQng&limit=1`;
    const url = `https://api.opencagedata.com/geocode/v1/json?key=d73d247ef47243a3bfd9b9f108043a26&q=${address}&pretty=1`;
    request({ url, json: true }, (error, { body } = {}) => {

        if (error) {
            callback('Unable connection!', undefined)
        } else if (body.results.length === 0) {
            callback('Unable to find location! Please search other place', undefined)
        } else {
            callback(undefined, {
                latitude: body.results[0].geometry.lat,
                longitude: body.results[0].geometry.lng,
                location: body.results[0].formatted
            })
        }
    })
}

module.exports = geocode