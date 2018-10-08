# diypowerflow
DIY Powerflow

This a DIY version of the powerflow screen on the Tesla powerwall app.

It gets its values from MQTT topics and uses websockets for pushing the values into the client interface.

I currently use MPP PCM60x charger (Solar), [Batrium BMS](https://www.batrium.com/) with a Shunt (Powerwall) and two SDM120 meters (House & Grid),
and a raspberry PI to get the values from all those components and post them to MQTT.

I will include more documentation (maybe some videos) explaining better how to do this exactly for people who need it.

If you have the same or similar components (like other MPP inverters) I suggest you check out the ISO for the raspberry that
Daniel Römer from [DIY Tech and Repairs](http://diytechandrepairs.nu/raspberry-solar/) has prepared,
since it includes already a lot of scripts which you can use and adapt for your own specific situation.


## TODO/ROADMAP:
* use graphana graphs for detailed information on each component
* show detailed house consumption from sonoffs
* improve dots animations, to better reflect current flowing
* make additional energy sources, like generator and wind turbines.
* ...? what ideas/suggestions do you have? join in!


