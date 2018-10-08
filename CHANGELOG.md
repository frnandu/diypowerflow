# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0]
- now a node.js app with its own http server, no need for apache or external server
- removed emoncms support, since it became paid service
- uses mqtt + websockets for pushing power values, instead of pulling every x seconds
- kWh and SOC values are now read from influx db instead of emoncms
- added solar kWh prediction based on clouds forecasts (yr.no & darksky.net)and sun position calculation

## [1.0.0]
- initial commit with emoncms feed support
