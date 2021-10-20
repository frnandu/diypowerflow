# diypowerflow
DIY Powerflow

![alt text](https://github.com/frnandu/diypowerflow/blob/master/diypowerflow.PNG?raw=true)

This a DIY version of the powerflow screen on the Tesla powerwall app.

It gets its values from MQTT topics and uses websockets for pushing the values into the client interface.

It includes a solar kwh prediction mechanism which allows for flexible solar panels configuration. It bases on Yr.no and darksky.net API forecasts.

I currently use MPP PCM60x charger (Solar), [Batrium BMS](https://www.batrium.com/) with a Shunt (Powerwall) and two SDM120 meters (House & Grid),
and a raspberry PI to get the values from all those components and post them to MQTT.

I will include more documentation (maybe some videos) explaining better how to do this exactly for people who need it.

If you have the same or similar components (like other MPP inverters) I suggest you check out the ISO for the raspberry that
Daniel Römer from [DIY Tech and Repairs](http://diytechandrepairs.nu/raspberry-solar/) has prepared,
since it includes already a lot of scripts which you can use and adapt for your own specific situation.

## How to run it
It requires a running MQTT server from which to get its power values. 
Also it uses influx for the kWh values and powerwall SOC.
So make sure you have both installed and running somewhere in your network.

Open project.js and configure it for your usecase.
then run
```
npm install
```
to ensure all dependecies are available

and then run
```
node project.js
```

default port is 3333, change it in project.js if you need.

and point your favorite browser to 
```
http://localhost:3333
```

in order for solar prediction mechanism to use darksky.net, you have to get an API key from https://darksky.net/dev

## TODO/ROADMAP:
* use grafana graphs for detailed information on each component
* show detailed house consumption from sonoffs
* improve dots animations, to better reflect current flowing
* make additional energy sources, like generator and wind turbines.
* ...? what ideas/suggestions do you have? join in!


