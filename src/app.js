const path = require('path')
const express = require('express')
const hbs = require('hbs')

const forecast = require('./utils/forecast')
const geocode = require('./utils/geocode')

const app = express ();
const port = process.env.PORT || 3000

//Define paths for express config
const punlicPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

//Setting up handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

//Setup static directory to serve
app.use(express.static(punlicPath))

hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
  });

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Sandesh Athreya'
    })
})

app.get('/about', (req,res) => {
    res.render('about', {
        title: 'About me',
        name: 'Sandesh Athreya',
        description: 'Hey folks! My name is Sandesh Athreya I am a Product Designer (UI/UX) and a Web Developer, Currently based in Heidelberg, Germany'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        helpText: 'This application is created using the DarkSky API for Location and Mapbox API for the forecast. An Example location would be Boston or New York or Bangalore. An Example PIN would be 69221 or 69115 etc.',
        title: 'Help',
        name: 'Sandesh Athreya',
    })
})

app.get('/weather', (req, res) => {
    if(!req.query.address) {
        res.send({
            error:'You must provide an address'
        })
    }

    geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {
        if(error) {
            return res.send({error})
        }

        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({error})
            }

            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
    })
})

app.get('/products', (req,res) => {
    if(!req.query.search) {
        res.send({
            error:'You must provide a search term'
        })
    }
    console.log(req.query)
    res.send({
        products: []
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Sandesh Athreya',
        errorMessage: 'Help article not found'
    })
})

app.get('*', (req,res) => {
    res.render('404', {
        title: '404',
        name: 'Sandesh Athreya',
        errorMessage: 'Page not found'
    })
})

app.listen(port , () => {
    console.log('Server is up and running on port ' + port)
})