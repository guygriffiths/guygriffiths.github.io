var earthquakeFeedBase = "http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/";
var map;
var markers = []
var quakeMarker = {
    url: 'img/quake_marker.png',
    anchor: new google.maps.Point(10, 39)
};

function quakesMain() {
    initMap();
    feedChanged();
}

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 0,
            lng: 0
        },
        zoom: 2
    });
}

function feedChanged() {
    $.getJSON(getQuakeFeedUrl(), displayQuakes);
}

function displayQuakes(data) {
    var i, quake, qLatLon, marker;
    for (i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }

    for (i in data.features) {
        quake = data.features[i];
        qLatLon = {
            lng: quake.geometry.coordinates[0],
            lat: quake.geometry.coordinates[1]
        };
        marker = new google.maps.Marker({
            position: qLatLon,
            map: map,
            title: quake.code,
            icon: quakeMarker
        });
        marker.addListener('click', function () {
            // This is what a closure is!  By wrapping in a function which returns a function, we keep the correct context of quake here
            var q = quake;
            return function () {
                console.log(q);
                openTwitterSearch(q);
            }
        }());
        markers.push(marker);
    }
}

function openTwitterSearch(quake) {
    var date = new Date(quake.properties.time);
    console.log("Quake occurred at:" + date);
    var until = formatDate(date);
    date.setDate(date.getDate() - 1);
    var since = formatDate(date);
    var url = "https://twitter.com/search?q=earthquake near:\"" + quake.geometry.coordinates[1] + "," + quake.geometry.coordinates[0] + "\" within:100km since:" + since + " until:" + until;
    window.open(url);
}

function formatDate(date) {
    var month = date.getMonth();
    if (month < 10) {
        month = '0' + month;
    }
    return date.getFullYear() + "-" + month + "-" + date.getDate();
}

function getQuakeFeedUrl() {
    return earthquakeFeedBase + $("#strength").val() + "_" + $("#frequency").val() + ".geojson";
}

$(document).ready(quakesMain());