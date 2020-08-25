const path = require('path');
const express = require('express');
const hbs = require('hbs');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

const app = express();
const port = process.env.PORT;

// Defined path for Express config

const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// Setup handlebars engine and views location

app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serves

app.use(express.static(publicDirectoryPath));


// Home page

app.get('', (req, res) => {

    res.render('index', {
        title: 'Home - Weather App',
    });
});

// About page

app.get('/about', (req, res) => {

    res.render('about', {
        title: 'About',
    });
});


// Weather - address

app.get('/weather/address', (req, res) => {

    const address = req.query.address;

    if (!address) {

        return res.status(400).send('Error : You must have provide Address');
    }

    geocode.address(address, (error, { latitude, longitude, location } = {}) => {

        if (error) {
            return res.send({
                error
            });
        }

        forecast(latitude, longitude, (error, { lat, lon, current, daily }) => {
            if (error) {
                return res.status(400).send({
                    error
                })
            }

            res.send({
                lat,
                lon,
                location,
                current,
                daily
            })
        })
    })
});

// Weather - coordinate

app.get('/weather/coord', (req, res) => {

    const latitude = req.query.lat
    const longitude = req.query.lon

    if (!latitude || !longitude) {

        return res.status(400).send('Error : You must have provide coordinate');
    }

    geocode.coordinate(latitude, longitude, (error, {location } = {}) => {

        if (error) {
            return res.status(400).send({
                error
            });
        }

        forecast(latitude, longitude, (error, { current, daily } ={}) => {
            if (error) {
                console.log(error);
                return res.send({
                    error
                })
            }

            res.send({
                latitude,
                longitude,
                location,
                current,
                daily
            })
        })
    })
});




// 404 Page

app.get('*', (req, res) => {

    res.render(
        '404', {
            title: '404',
            error: 'Page not found'
        }
    );
});


// Listen

app.listen(port, () => {
    console.log('Server is up on port ' + port);
});