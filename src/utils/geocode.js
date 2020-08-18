const request = require('request')

const geocode = (address, callback) => {
    const url = `http://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?access_token=pk.eyJ1IjoibXJ0YWFuIiwiYSI6ImNrZG9tcTloMTF0bmIyeW9mN3MyeDEwNGcifQ.ZOSIZEWIDM117d0FDHKQng&limit=1`;

    request({ url, json: true }, (error, { body } = {}) => {

        if (error) {
            callback('Unable connection!', undefined)
        } else if (body.features.length === 0) {
            callback('Unable to find location! Please search other place', undefined)
        } else {

            callback(undefined, {
                latitude: body.features[0].center[1],
                longitude: body.features[0].center[0],
                location: body.features[0].place_name
            })
        }
    })
}

module.exports = geocode