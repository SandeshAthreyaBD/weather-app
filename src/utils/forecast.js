const request = require('request')

const forecast = (latitude, longitude, callback) => {
    const url='https://api.darksky.net/forecast/147ee745e70f6e028dd551d892d2dca3/' + latitude + ',' + longitude +'?units=si'
    request({url, json: true}, (error, {body}) => {
        if(error) {
            callback('Unable to connect to the API', undefined)
        }else if(body.error === 0) {
            callback('The request is broken or Invalid', undefined)
        } else {
            callback(undefined, `${body.daily.data[0].summary} It is currently ${body.currently.temperature} degrees. The highest temperature today will be ${body.daily.data[0].temperatureHigh} degrees and the lowest temperature today will be ${body.daily.data[0].temperatureLow} degrees. There is a ${body.currently.precipProbability}% chance of rain.`)
        }
    })
}

module.exports = forecast