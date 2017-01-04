window.onload = function(){
    //Init the the map with leaflet
    var map = L.map('map').setView([48.866667, 2.333333], 2);
    //Tile layer from mapbox
    L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}', {
        maxZoom: 10,
        minZoom: 2,
        accessToken: 'pk.eyJ1IjoiYWxleGlzbWFnIiwiYSI6ImNpeGZyNTd4ajAwMGgyb212ZnV0a2hmMngifQ.0km1uL_iU82H36dpEz9W-w'
    }).addTo(map);
};
