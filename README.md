# diypowerflow
DIY Powerflow

This a DIY version of the powerflow screen on the Tesla powerwall app.

You can check a running example at:

(https://diypowerflow.herokuapp.com/)

This example uses (for now) mine hardcoded userid of emoncms.

I will include an option to use a userid stored in the browser so that you can use this deployed app with your
own emoncms user and thus not needing to host your own version of code.

Currently it pools the values from emoncms.org API feeds.

I will make it more flexible in the future to allow other options and not only being forced and dependent on emoncms,
like for example if you want to host the code in your system and maybe use values directly from your gear.

##How to post the values from your own components to emoncms:

Depending on your own components you have for solar charging, inverters, powerwall shunt BMS and house/grid meters,
how you can get the values into emoncms is very specific to your own situation.

I currently use MPP PCM60x charger (Solar), Batrium BMS with Shunt (Powerwall) and two SDM120 meters (House & Grid),
and a raspberry PI to get the values from all those components.

If you have the same or similar components (like other MPP inverters) I suggest you check out the ISO for the raspberry that
Daniel Romer from [DIY Tech and Repairs](http://diytechandrepairs.nu/raspberry-solar/) has prepared,
since it includes already a lot of scripts which you can use and adapt for your own specific situation.


