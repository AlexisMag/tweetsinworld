window.onload = function(){
    //Init the the map with leaflet
    var map = L.map('map').setView([48.866667, 2.333333], 2);
    //Tile layer from mapbox
    L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}', {
        maxZoom: 10,
        minZoom: 2,
        accessToken: 'pk.eyJ1IjoiYWxleGlzbWFnIiwiYSI6ImNpeGZyNTd4ajAwMGgyb212ZnV0a2hmMngifQ.0km1uL_iU82H36dpEz9W-w'
    }).addTo(map);

    //Create a socket to communicate with server
    var socket = io.connect();

    //Join the stream
    socket.on('connect', function(){
        socket.emit('joinstream', function(){});
    });

    socket.on('tweet', function(data){
        var position = {};
        var real_position;
        if(data['position']){
            position = data['position'];
        }

        var icon = L.divIcon({
            className:'tweet_marker',
            html:"<div class='tweet_marker "+(data['type'])+"'></div>"
        });


        var marker = L.marker([position['lat'], position['lng']], {icon:icon});
        marker.addTo(map);


        window.setTimeout(function(){
            map.removeLayer(marker);
        }, 500);



    });



};
