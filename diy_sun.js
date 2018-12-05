'use strict';

var SunCalc = require('suncalc');
var moment = require('moment');
var request = require('sync-request');
var fastXmlParser = require('fast-xml-parser');


function calculateHourWh(panels, lat, lon, sunrise, sunset, sun, hour) {

    var sum = 0;
    var count = 0;
    for (var min = 0; min < 60; min++) {
        hour.set('minute',min);
        hour.set('second',59);
        if (hour.isAfter(sunrise) && hour.isBefore(sunset)) {
            var sunPos = SunCalc.getPosition(hour, lat, lon);
            var sunAzimuth = sunPos.azimuth * 180 / Math.PI;
            var sunAngle = 90 - sunPos.altitude * 180 / Math.PI;

            var panelsWh = 0;
            panels.forEach(function(panel) {
                var azimuthDiff = Math.abs(panel.azimuth - sunAzimuth);
                if (azimuthDiff > 90 ) {
                    azimuthDiff = 90;
                }
                var azimuthFactor = 1 - azimuthDiff/90
                var angleDiff = Math.abs(panel.angle - sunAngle);
                if (angleDiff > 90 ) {
                    angleDiff = 90;
                }
                var angleFactor = 1 - angleDiff/90
                var wh = panel.wattPeak * sun * azimuthFactor * angleFactor;
                panelsWh +=wh;
            });
            sum +=panelsWh;
            count++;
        }
    }
    var hourWh = 0;
    if (count>0) {
        hourWh = sum / count;
    }
    return hourWh;
}

function getYR(panels_cfg, lat, lon, msl, sunrise, sunset) {
    var res = request('GET', 'https://api.met.no/weatherapi/locationforecast/1.9/?lat='+lat+'&lon='+lon+'&msl='+msl);
    var options = {
        attributeNamePrefix : "",
        attrNodeName: false,
        textNodeName : "#text",
        ignoreAttributes : false,
        ignoreNameSpace : false,
        allowBooleanAttributes : false,
        parseNodeValue : true,
        parseAttributeValue : true,
        trimValues: true,
        decodeHTMLchar: false,
    };
    var yr = fastXmlParser.parse(res.getBody('utf8'),options);

    var totalWh = 0;

    var sunriseHour = sunrise.clone().set('minute',0).add(-1,'minute');

    yr.weatherdata.product.time.forEach(function(time){
        var hour = moment(time.from);
        if (hour.isSameOrAfter(sunriseHour) && hour.isBefore(sunset) && time.location.cloudiness) {
            var low = time.location.lowClouds.percent;
            var medium = time.location.mediumClouds.percent;
            var high = time.location.highClouds.percent;

            var clouds = (parseFloat(low)*0.9 + parseFloat(medium)*0.5 + parseFloat(high)*0.3) / 100;
            if (clouds>1.0) {
                clouds = 1.0;
            }
            var sunniness = 1.0 - clouds;
            if (sunniness < 0.05) {
                sunniness = 0.05;
            }
            var hourWh = calculateHourWh(panels_cfg, lat, lon, sunrise, sunset, sunniness,hour);
            totalWh += hourWh;
        }
    });
    return totalWh;
}

function getDarksky(panels_cfg, lat, lon, darkskyApi, sunrise, sunset) {
    var res = request('GET', 'https://api.darksky.net/forecast/'+darkskyApi+'/'+lat+','+lon+"?exclude=daily,currently,minutely,alerts,flags");
    var json = JSON.parse(res.getBody('utf8'));

    var totalWh = 0;

    var sunriseHour = sunrise.clone().set('minute',0).add(-1,'minute');

    json.hourly.data.forEach(function(time){
        var hour = moment(time.time*1000);
        if (hour.isSameOrAfter(sunriseHour) && hour.isBefore(sunset) && time.cloudCover) {

            var clouds = time.cloudCover;

            var sunniness = 1.0 - clouds;
            if (sunniness < 0.05) {
                sunniness = 0.05;
            }

            var hourWh = calculateHourWh(panels_cfg, lat, lon, sunrise, sunset, sunniness,hour);
            totalWh += hourWh;
        }
    });
    return totalWh;
}

/*
example for
panels_cfg = [
        // azimuth: in degrees (direction along the horizon, measured from south to west), e.g. 0 is south and 90 is west
        // angle: angle the panels are facing relative to the horizon in degrees, e.g. 0 they are vertical, 90 they are flat
        // wattPeak: the Wp of the panels
        {
            name: 'Roof',
            azimuth: 8,
            angle: 45,
            wattPeak: 1560
         },
         {
            name: 'Terrace',
            azimuth: 8,
            angle: 57,
            wattPeak: 1560
         }
        ];
*/

exports.solar_prediction_kwh = function(panels_cfg, day_offset, lat, lon, msl, darkskyApi, yr_weight, darksky_weight) {

    var day = moment();

    //console.log(new Date());

    day = moment().add(day_offset, 'day');
    //console.log(day);

    var times = SunCalc.getTimes(day, lat,lon);
    //console.log(times);
    var sunrise = moment(times.sunrise);
    var sunset = moment(times.sunset);

//    console.log(sunrise.format('YYYY-MM-DD')+ " sunrise: "+sunrise.format('HH:mm')+" sunset: "+sunset.format('HH:mm'));

    var yr = getYR(panels_cfg, lat, lon, msl, sunrise,sunset);

    if (typeof darkskyApi !== 'undefined' && darkskyApi !='') {
        var darksky = getDarksky(panels_cfg, lat, lon, darkskyApi, sunrise,sunset);
        var prediction = Math.round(yr * yr_weight + darksky * darksky_weight);
  //      console.log('yr:'+Math.round(yr)+' darksky:'+Math.round(darksky)+' ~= '+ prediction);

    } else {
        prediction = yr;
    }

    return prediction  / 1000;
};

