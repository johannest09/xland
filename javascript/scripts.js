
/**
 * xland application
 * 
 * @author Jóhannes Freyr Þorleifsson
 * @copyright (c) 2012
 */

var defaultZoom = 13;
var defaultLatlng = new google.maps.LatLng(64.138621,-21.894722);
var infowindow;
var markerList = {};

var xland = {
	
	init: function() 
	{
		/* styles */

		var MY_MAPTYPE_ID = 'reykjavikMap';
		
		var styles = [
		  {
		    "featureType": "landscape",
		    "stylers": [
		      { "color": "#d5d6d6" },
		      { "weight": 0.1 }
		    ]
		  },{
		    "featureType": "road.highway",
		    "stylers": [
		      { "color": "#5b5b5b" }
		    ]
		  },{
		    "featureType": "road.arterial",
		    "stylers": [
		      { "color": "#bfc1c2" }
		    ]
		  },{
		    "featureType": "road.local",
		    "stylers": [
		      { "color": "#ffffff" }
		    ]
		  },{
		    "featureType": "water",
		    "stylers": [
		      { "color": "#a1a1a1" }
		    ]
		  },{
		    "featureType": "poi.park",
		    "stylers": [
		      { "saturation": -100 }
		    ]
		  },{
		    "featureType": "poi",
		    "stylers": [
		      { "hue": "#77ff00" },
		      { "lightness": -12 },
		      { "saturation": -58 }
		    ]
		  }
		];
		
		
		var myOptions = {
			center: defaultLatlng,
		 	zoom: 13,
		 	/* mapTypeId: google.maps.MapTypeId.ROADMAP, */
			mapTypeControlOptions: {
				mapTypeIds: [google.maps.MapTypeId.ROADMAP, MY_MAPTYPE_ID]
			},
			mapTypeId: MY_MAPTYPE_ID
			
		};
		var map = new google.maps.Map(document.getElementById("map-container"), myOptions);

		// create new info window for marker detail pop-up
		infowindow = new google.maps.InfoWindow();
		
		var styledMapOptions = {
			name: 'X-land'
        };

		var jayzMapType = new google.maps.StyledMapType(styles, styledMapOptions);
		
		map.mapTypes.set(MY_MAPTYPE_ID, jayzMapType);

		return map;
	},

	loadMarkers : function()
	{
		console.log("test1");

		$.getJSON("./javascript/places.js", function(data) {
			// loop through all markers
			console.log(data)
			$.each(data.markers, function(i, item){

				// add marker to the map
				//loadMarker(item);
				console.log(item);
			});
		});
	},

	loadMarker : function(markerData)
	{
		var myLatlng = new google.maps.LatLng(markerData['lat'],markerData['lng']);

		// create new marker
		var marker = new google.maps.Marker({
		    id: markerData['name'],
		    map: map,
		    title: markerData['name'] ,
		    position: myLatlng
		});

		// add marker to list used later to get content and additional marker information
		markerList[marker.id] = marker;

		// add event listener when marker is clicked
		// currently the marker data contain a dataurl field this can of course be done different
		google.maps.event.addListener(marker, 'click', function() {
	 
			// show marker when clicked
			showMarker(marker.id);
		});

		// add event when marker window is closed to reset map location
		google.maps.event.addListener(infowindow,'closeclick', function() {
			map.setCenter(defaultLatlng);
			map.setZoom(defaultZoom);
		});
	},

	showMarker : function(markerId)
	{
		// get marker information from marker list
		var marker = markerList[markerId];
	 
		// check if marker was found
		if( marker )
		{
			// get marker detail information from server
			$.get( 'data/' + marker.id + '.html' , function(data) {
				// show marker window
				infowindow.setContent(data);
				infowindow.open(map,marker);
			});
		}
		else
		{
			alert('Error marker not found: ' + markerId);
		}
	},


	setMarker : function(map, locations)
	{
		console.log(map)
		var myLatlng = new google.maps.LatLng(64.145279,-21.930992);

		var marker = new google.maps.Marker({
		    position: myLatlng,
		    title:"Landslag ehf"
		});

		marker.setMap(map);
	}
};

$(document).ready(function(){
	
	var theMap = xland.init();
	var mapLocations = null;
	xland.loadMarkers();

	//xland.setMarker(theMap, mapLocations);
});