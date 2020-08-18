const path = require('path');
const express = require('express');
const hbs = require('hbs');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

const app = express();


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
        title: 'About Me',
    });
});


// Weather page

app.get('/weather', (req, res) => {

    if (!req.query.address) {

        return res.send('Error : You must have provide Address');
    }

    const address = req.query.address;
    geocode(address, (error, { latitude, longitude, location } = {}) => {

        if (error) {

            return res.send({
                error
            });
        }

        forecast(latitude, longitude, (error, { lat, lon, timezone, current, daily }) => {


            if (error) {
                return res.send({
                    error
                })
            }

            res.send({
                lat,
                lon,
                timezone,
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
            name: 'Who are you?',
            error: 'Page not found'
        }
    );
});


// Listen

app.listen(3000, () => {
    console.log('Server is up on port 3000!');
});