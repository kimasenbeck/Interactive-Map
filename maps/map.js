
// See post: http://asmaloney.com/2014/01/code/creating-an-interactive-map-with-leaflet-and-openstreetmap/

//create the map object
var map = L.map( 'map', {
    center: [20.0, 5.0],
    minZoom: 2,
    zoom: 2
});

map.setMaxBounds([
      [-85, -180],
      [85, 180]
    ]);

//create the map tile layer
L.tileLayer('http://api.tiles.mapbox.com/v4/mapbox.light/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoia2ltYXNlbmJlY2siLCJhIjoiNjk4YmMyNjNmOTM3NmU1OGY0ZjdjZWZmMjVmNGE1Y2UifQ.ZFVEvt_1Do1ogEqOueEOkg', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> Created by <a href="http://www.kimasenbeck.com">Kim Asenbeck</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    accessToken: 'pk.eyJ1Ijoia2ltYXNlbmJlY2siLCJhIjoiNjk4YmMyNjNmOTM3NmU1OGY0ZjdjZWZmMjVmNGE1Y2UifQ.ZFVEvt_1Do1ogEqOueEOkg'
}).addTo(map);


//creating info box for top right corner
 var info = L.control();

  info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
  };

  // method that we will use to update the control based on feature properties passed
  info.update = function (props) {
    var grades = [0, 10000, 20000];
    this._div.innerHTML =  '<h4>Official Development </br> Assistance (ODA)<br/></h4>' + '<i>(in millions of USD, </br>between 2009 and 2013)<br/><br/></i>' + (props ?
      '<b>' + props.name + '</b><br />' + props.oda
      : 'Hover over a donor country <br/>(indicated by green color)<br /><br />');
    // if (!props) {
    //   for (var i = 0; i < grades.length; i++) {
    //     this._div.innerHTML +=
    //       '<i class="legend-i" style="background:'+ getColor(grades[i] + 1) + '"></i>"<span class="legend-label">' +
    //       grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '</span><br>' : '+'
    //         );
    //   }
    // }
  };

  info.addTo(map);

  //info.style.padding: "6px 8px";
  //info.style.font: "14px/16px Arial, Helvetica, sans-serif";
  //$(info).css('backgroundColor', 'white');
  //info.style.background: 'white';
  //info.style.backgroundColor: 'white';
  //info.style.box-shadow: '0 0 15px rgba(0,0,0,0.2)';
  //info.style.border-radius: '5px';});


// var legend = L.control({position: 'bottomright'});

// legend.onAdd = function (map) {

//     var div = L.DomUtil.create('div', 'info legend'),
//         grades = [0, 10000, 20000],
//         labels = [];

//     // loop through our density intervals and generate a label with a colored square for each interval
//     for (var i = 0; i < grades.length; i++) {
//         div.innerHTML +=
//             '<i style="background:' + '#000' + '"></i> ' +
//             grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
//     }

//     return div;
// };

// legend.addTo(map);


//adding the geojson country outlines
var geojson;
 
geojson = L.geoJson(countries, {
  style: coloring,
  onEachFeature: onEachFeature
}).addTo(map);

// function getColor(d) {  //this method performs the color gradiation. come back to this when we have more data. 
//     return d > 5000 ? '#E5F5E0' :
//            d > 1000  ? '#A1D99B' :
//            d = 0  ? '#E5F5E0' :
//            //d = "China" ? '#E5F5E0';
//  }

// function getColor(d) {
//     return d > 1000 ? '#800026' :
//            d > 500  ? '#BD0026' :
//            d > 200  ? '#E31A1C' :
//            d > 100  ? '#FC4E2A' :
//            d > 50   ? '#FD8D3C' :
//            d > 20   ? '#FEB24C' :
//            d > 10   ? '#FED976' :
//                       '#FFEDA0';
// }

//modify the color of the borders, and the fill
function coloring(feature) {
    return {
        fillColor: ((feature.properties.oda == "N/A")? '#000' : '#327D14'),//getColor(feature.properties.oda), //  //
        weight: 1,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.3
    };
}

//highlight the outline of the countries if you mouse over
function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 1,
        color: '#265E0F',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera) {
        layer.bringToFront();
    }
    info.update(layer.feature.properties);
}

//remove the highlight after the mouse exits
function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update();
}

//zoom in on a country when you click on it
function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}


//perform the following functions on each feature
function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}


var myURL = jQuery( 'script[src$="leaf-demo.js"]' ).attr( 'src' ).replace( 'leaf-demo.js', '' );

var myIcon = L.icon({
    iconUrl: myURL + 'images/pin24.png',
    iconRetinaUrl: myURL + 'images/pin48.png',
    iconSize: [29, 24],
    iconAnchor: [9, 21],
    popupAnchor: [0, -14]
});

// for ( var i=0; i < markers.length; ++i ) 
// {
//    L.marker( [markers[i].lat, markers[i].lng], {icon: myIcon} )
//       .bindPopup('<b>' + "Country: " + '</b>' + markers[i].name + '</br>' + '<b>' + "Official Development Assistance </br> (In millions of USD): " + '</b>' + markers[i].oda + '</b>' )
//       .addTo( map );
// }

for ( var i=0; i < donordata.length; ++i ) 
{
   L.marker( [donordata[i].latitude, donordata[i].longitude], {icon: myIcon} )
      .bindPopup('<b>' + "Country: " + '</b>' + donordata[i].Country + '</br>' + '<b>' + "Total aid flow 2009-2013 </br> (In millions of USD): " + '</b>' + donoraidflow[i].Sum + '</b>' )
      .addTo( map );
}


