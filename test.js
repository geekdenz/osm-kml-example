var kmlLayers = {
	"Pre50s":
			{"url": "kml/50sland.kml",
				"name": "Pre50s",
				"zoom": 14,
				"lat": 55.7230015,
				"lng": -4.8791556},
	"cport":
			{"url": "kml/cport.kml",
				"name": "Clydeport Owned Land",
				"zoom": 14,
				"lat": 55.7230015,
				"lng": -4.8791556},
	"castleowned":
			{"url": "kml/castle.kml",
				"name": "Land owned outright around Castle ",
				"zoom": 14,
				"lat": 55.7230015,
				"lng": -4.8791556},
	"goldowned":
			{"url": "kml/goldenberry.kml",
				"name": "Land owned outright at Goldenberry (pre 2014) ",
				"zoom": 14,
				"lat": 55.7230015,
				"lng": -4.8791556},
	"powerowned":
			{"url": "kml/huntb.kml",
				"name": "Land owned by EDF Energy (pre2014)",
				"zoom": 14,
				"lat": 55.7230015,
				"lng": -4.8791556},
	"powerowned1":
			{"url": "kml/hunta.kml",
				"name": "Land owned by Magnox",
				"zoom": 14,
				"lat": 55.7230015,
				"lng": -4.8791556},
	"newhuntb":
			{"url": "kml/newhuntb.kml",
				"name": "Land owned by EDF Energy (2014)",
				"zoom": 14,
				"lat": 55.7230015,
				"lng": -4.8791556},
	"use":
			{"url": "kml/use.kml",
				"name": "Land Hunterston Estate allowed to use",
				"zoom": 14,
				"lat": 55.7230015,
				"lng": -4.8791556},
	"newgolden":
			{"url": "kml/newgolden.kml",
				"name": "Land owned outright at Goldenberry (2014)",
				"zoom": 14,
				"lat": 55.7230015,
				"lng": -4.8791556}
};

// tiles for background
var raster = new ol.layer.Tile({source: new ol.source.OSM()});

// vector layer
/*
 var vector = new ol.layer.Vector({
 source: new ol.source.GeoJSON({
 projection: 'EPSG:900913',
 text: client.responseText
 }),
 style: new ol.style.Style({
 stroke: new ol.style.Stroke({
 color: '#eedd00',
 width: 1.5
 })
 })
 });
 */
var styleFunction = function (feature, resolution) {
	var opacity = 0.3;
	return [new ol.style.Style({
			fill: new ol.style.Fill({
				color: [0x00, 0xff, 0x00, opacity]
			}),
			stroke: new ol.style.Stroke({
				color: '#ff0000'
			})
		})];
};
var vector = new ol.layer.Vector({
	source: new ol.source.KML({
		extractStyles: false,
		projection: 'EPSG:900913',
		url: kmlLayers.Pre50s.url
	}),
	style: styleFunction
});

//var transformedVector = ol.proj.transform(vector, 'EPSG:4326', 'EPSG:3857');

var latLng = ol.proj.transform([kmlLayers.Pre50s.lng, kmlLayers.Pre50s.lat], 'EPSG:4326', 'EPSG:3857');
// render the map    
var view = new ol.View({
		center: latLng,
		zoom: kmlLayers.Pre50s.zoom
	});
var map = new ol.Map({
	target: 'map',
	layers: [raster, vector],
	view: view
});
var len = kmlLayers.length,
		checkboxStr = '';
for (var key in kmlLayers) {
	if (!kmlLayers.hasOwnProperty(key)) {
		continue;
	}
	var name = kmlLayers[key].name;
	checkboxStr += '<input type="checkbox" value="' + key + '" /> ' + name + '<br />';
}
var cbs = document.getElementById('checkboxes');
cbs.innerHTML = checkboxStr;
var checkboxes = document.querySelectorAll('input');
len = checkboxes.length;
for (var i = 0; i < len; ++i) {
	var c = checkboxes[i];
	c.addEventListener('change', function (evt) {
		var t = evt.target;
		if (t.checked) {
			for (var j = 0; j < len; ++j) {
				if (checkboxes[j] != t) {
					checkboxes[j].checked = false;
				}
			}
			latLng = ol.proj.transform([kmlLayers[t.value].lng, kmlLayers[t.value].lat], 'EPSG:4326', 'EPSG:3857');
			map.removeLayer(vector);
			vector = new ol.layer.Vector({
				source: new ol.source.KML({
					extractStyles: false,
					projection: 'EPSG:900913',
					url: kmlLayers[t.value].url
				}),
				style: styleFunction
			});
			map.addLayer(vector);
			view.setCenter(latLng);
			view.setZoom(kmlLayers[t.value].zoom);
			map.setView(view);
		}
	});
}