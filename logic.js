

var emoncms_userid = 20722;

var emon = "proxy.php?csurl=http://emoncms.org/feed/list.json?userid="+emoncms_userid;


// feed names
var solar_watt_name = "pcm60x";
var solar_kwh_name = "pcm60x kwhd";
var grid_watt_name = "sdm120";
var grid_kwh_name = "grid kwh today";
var house_watt_name = "house watt";
var house_kwh_name = "house kwh today";
var powerwall_watt_name = "Shunt Watt";
var powerwall_soc_name = "SOC";

var solar_watt = 0;
var solar_kwh = 0;
var grid_watt = 0;
var grid_kwh = 0;
var house_watt = 0;
var house_kwh = 0;
var powerwall_watt = 0;
var powerwall_soc = 0;


function loadEmoncmsValues() {
    $.getJSON(emon, function(data){
        updateValuesFromEmonFeed(data);
        refresh_ui();
    });
}

function updateValuesFromEmonFeed(data) {
    for (var i = 0, len = data.length; i < len; i++) {
       // SOLAR
       if (data[i].name == solar_watt_name) {
         solar_watt = data[i].value;
       }
       if (data[i].name == solar_kwh_name) {
         solar_kwh = data[i].value;
       }
        // GRID
       if (data[i].name == grid_watt_name) {
         grid_watt = data[i].value;
       }
       if (data[i].name == grid_kwh_name) {
         grid_kwh = data[i].value;
       }

        // HOUSE
       if (data[i].name == house_watt_name) {
         house_watt = data[i].value;
       }
       if (data[i].name == house_kwh_name) {
         house_kwh = data[i].value;
       }
        // POWERWALL
       if (data[i].name == powerwall_watt_name) {
         powerwall_watt = data[i].value;
       }
       if (data[i].name == powerwall_soc_name) {
         powerwall_soc = data[i].value;
       }
    }
}

function electronTime(watt) {
    w = Math.abs(watt);
    if (w<50) {
        return 6;
    }
    if (w<200) {
        return 4;
    }
    if (w<500) {
        return 2
    }
    if (w<1000) {
        return 1;
    }
    if (w<2000) {
        return 0.5;
    }

   if (w < 3000) {
       return 0.25;
    }
    return 0;
}

function setAnimationTime(watt,selector1,selector2) {
    var time = electronTime(watt)+"s";

    $(selector1).each(function( index ) {
        if ($(this).attr("dur")!=time) {
            $(this).attr("dur",time);
        }
    });
   $(selector2).each(function( index ) {
        if ($(this).attr("begin")!=time) {
            $(this).attr("begin",time);
            $(this).attr("dur",time);
        }
    });
}

function refresh_ui() {
    if (solar_watt>0) {
        $("#solar").addClass("on");
        $("#solar_watt").text(solar_watt+" w");
        $("#solar-line").addClass("on");
        $("#solar-dot").addClass("on");
    } else {
        $("#solar").removeClass("on");
        $("#solar-line").removeClass("on");
        $("#solar-dot").removeClass("on");
    }
    prec = (solar_kwh>0)? 2:1;
    $("#solar_kwh").text(parseFloat(solar_kwh).toPrecision(prec)+" kWh");
    setAnimationTime(solar_watt,"#solar-dot animate.dot1","#solar-dot animate.dot2");

    if (grid_watt!=0) {
        $("#grid").addClass("on");
        $("#grid_watt").text(grid_watt+" w");
        $("#grid-line").addClass("on");
        if (grid_watt>0) {
            $("#grid-dot-out").addClass("on");
            $("#grid-dot-in").removeClass("on");
        } else {
            $("#grid-dot-in").addClass("on");
            $("#grid-dot-out").removeClass("on");
        }
    } else {
        $("#grid").removeClass("on");
        $("#grid-line").removeClass("on");
        $("#grid-dot-out").removeClass("on");
        $("#grid-dot-in").removeClass("on");
    }
    prec = (grid_kwh>0)? 2:1;
    $("#grid_kwh").text(parseFloat(grid_kwh).toPrecision(prec)+" kWh");
    setAnimationTime(grid_watt,"#grid-dot-in animate.dot1, #grid-dot-out animate.dot1","#grid-dot-in animate.dot2, #grid-dot-out animate.dot2");

    if (house_watt>0) {
        $("#house").addClass("on");
        $("#house_watt").text(Math.round(house_watt)+" w");
        $("#house-line").addClass("on");
        $("#house-dot").addClass("on");
    } else {
        $("#house").removeClass("on");
        $("#house-line").removeClass("on");
        $("#house-dot").removeClass("on");
    }
    prec = (house_kwh>0)? 3:1;
    $("#house_kwh").text(parseFloat(house_kwh).toPrecision(prec)+" kWh");

    setAnimationTime(house_watt,"#house-dot animate.dot1, #house animate.glow","#house-dot animate.dot2");

    if (powerwall_watt!=0) {
        $("#powerwall").addClass("on");
        $("#powerwall_watt").text(Math.round(powerwall_watt)+" w");
        $("#powerwall-line").addClass("on");
        if (powerwall_watt>0) {
            $("#powerwall-dot-out").removeClass("on");
            $("#powerwall-dot-in").addClass("on");
        } else {
            $("#powerwall-dot-out").addClass("on");
            $("#powerwall-dot-in").removeClass("on");
        }
    } else {
        $("#powerwall").removeClass("on");
        $("#powerwall-line").removeClass("on");
        $("#powerwall-dot-out").removeClass("on");
        $("#powerwall-dot-in").removeClass("on");
    }
    $("#powerwall_soc").text(powerwall_soc+"%");

    setAnimationTime(powerwall_watt,"#powerwall-dot-in animate.dot1, #powerwall-dot-out animate.dot1, #powerwall animate.glow","#powerwall-dot-in animate.dot2, #powerwall-dot-out animate.dot2");
}

loadEmoncmsValues();

var interval = setInterval(function() {
    loadEmoncmsValues();
}, 9000);

