
//Import dependancies
const https = require('https');
const fs = require('fs');
const express = require('express');
const app = express();


//Global Varibales
    //Constants        
const API_KEY = '55f41d743434449fb4b36e54c55c075b'; //API Key from opencagedata.com

let latitude;
let longtitude;

//Return All users within 50 Miles of London Central
app.get('/users', (req, res) =>{
    getCity('London');
    https.get('https://bpdts-test-app.herokuapp.com/users', res => {
        let responseData = '';    

        res.on('data', data => {
            responseData += data;
        });

        res.on('end', () => {
            let dataResponse = JSON.parse(responseData);
            
            for(var i = 0; i < dataResponse.length; i++){

                let userLat = dataResponse[i].latitude;
                let userLon = dataResponse[i].longtitude;

                let distance = getDistance(userLat, Latitude, userLon, longtitude);

                if(distance <= 50.00 ) users.push(dataResponse[i]);
            }

            return users;
        });

    }).on('error', err => {
        console.error(err.message);
    })
});

//Get users who are currently in a given city
app.get('/:city', (req, res) => {
    https.get(`https://bpdts-test-app.herokuapp.com/city/${req.city}/users`, res => {
        let responseData = '';    

        res.on('data', data => {
            responseData += data;
        });

        res.on('end', () => {
            let parsedData = JSON.parse(responseData);
            for(var i = 0; i < parsedData.length; i++){
                users.push(parsedData[i]);
            } 
            return users;       
        });

    }).on('error', err => {
        console.error(err.message);
    })
});

//Returns the distance in miles of a two give geocoord pairs
function getDistance(lat1, lat2, lon1 , lon2){
    const EarthRadiusKm = 6371

    let dLat = degree2Radiums(lat2 - lat1)
    let dLon = degree2Radiums(lon2 - lon2)

    let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + 
            Math.cos(degree2Radiums(lat1)) * Math.cos(degree2Radiums(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)

    let c = 2 * Math.atan2(Math.sin(a), Math.sqrt(1 - a))

    let d = EarthRadiusKm * c;
    return d * 1.6;
}

//covert Degrees to Radiums
function degree2Radiums(degree){
    return degree * (Math.PI/180)
}

//Set Latitude and longtitude of a given city
function getCity(city){
    https.get(`https://api.opencagedata.com/geocode/v1/json?q=${city}&key=${API_KEY}`, res => {
        let responseData = '';    

        res.on('data', data => {
            responseData += data;
        });

        res.on('end', () => {
            latitude = responseData.results[0].geometry.lat;
            longtitude = responseData.results[0].geometry.lng;
        });

    });
}

//start express server
app.listen('3000', () => {
    console.log('Server Started');
})