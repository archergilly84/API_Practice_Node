const https = require('https');
const fs = require('fs');

const londonLat = 51.5074;
const londonLon = 0.1278;

https.get('https://bpdts-test-app.herokuapp.com/users', res => {
    let responseData = '';
    let users = [];

    res.on('data', data => {
        responseData += data;
    });

    res.on('end', () => {

        let dataResponse = JSON.parse(responseData);
        for(var i = 0; i < dataResponse.length; i++){

            let userLat = dataResponse[i].latitude;
            let userLon = dataResponse[i].longtitude;

            let distance = getDistance(userLat, londonLat, userLon, londonLon);

            if(distance <= 50.00) users.push(dataResponse[i]);
        }

        console.log(users[0]);
    });

    

}).on('error', err => {
    console.error(err.message);
})



function getDistance(lat1, lat2, lon1 , lon2){
    const EarthRadiusKm = 6371

    let dLat = degree2Radiums(lat2 - lat1)
    let dLon = degree2Radiums(lon2 - lon2)

    let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + 
            Math.cos(degree2Radiums(lat1)) * Math.cos(degree2Radiums(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)

    let c = 2 * Math.atan2(Math.sin(a), Math.sqrt(1 - a))

    let d = EarthRadiusKm * c;
    return d;
}

function degree2Radiums(degree){
    return degree * (Math.PI/180)
}