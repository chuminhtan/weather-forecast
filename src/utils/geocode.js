const request = require('request')
const keyAPI = process.env.OPEN_CAGE_DATA_KEY

const address = (address, callback) => {
    
    const url = `https://api.opencagedata.com/geocode/v1/json?key=${keyAPI}&q=${address}&pretty=1`;
    
    request({ url, json: true }, (error, { body } = {}) => {

        if (error) {
            callback(error, undefined)

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

const coordinate = (latitude, longitude, callback) => {
    
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${keyAPI}`

    request({ url, json: true }, (error, { body } = {}) => {

        if (error) {
            callback('Unable connection!', undefined)

        } else if (body.results.length === 0) {
            console.log(body.results)
            callback('Unable to find location! Please search other place', undefined)

        } else {

            callback(undefined, {
                location: body.results[0].formatted
            })
        }
    })
}

module.exports = {
    address,
    coordinate
}