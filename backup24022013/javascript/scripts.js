
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
var map;
var mapStyle = "/mapstyle.js";

var categories = ["Almenningsrými", "Samkeppnir", "Skipulag", "Landslagsarkitektar"];

var xland = {
	
	init: function() 
	{
		/* styles */

		var MY_MAPTYPE_ID = 'reykjavikMap';
		var stylesArray = [];

		// load map styles

		$.getJSON("./javascript/mapstyle.js", function(data) {
			$.each(data, function(i, item) {
				stylesArray[i] = item;
			});
		});
		
		var myOptions = {
			center: defaultLatlng,
		 	zoom: 13,
		 	panControl: false,
		 	zoomControl: true,
		 	streetViewControl: false,
		 	mapTypeControl: true,
			mapTypeControlOptions: {
				mapTypeIds: [google.maps.MapTypeId.ROADMAP, MY_MAPTYPE_ID],
				style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
			},
			zoomControlOptions: {
      			style: google.maps.ZoomControlStyle.SMALL
    		},
			mapTypeId: MY_MAPTYPE_ID
			
		};
		map = new google.maps.Map(document.getElementById("map-container"), myOptions);

		// create new info window for marker detail pop-up
		infowindow = new google.maps.InfoWindow();
		
		var styledMapOptions = {
			name: 'X-land'
        };

		var xlandMapType = new google.maps.StyledMapType(stylesArray, styledMapOptions);
		
		map.mapTypes.set(MY_MAPTYPE_ID, xlandMapType);

	},

	//Todo: add a category as a parameter
	loadMarkers : function()
	{
		var MapContainer = this;

		$.getJSON("./javascript/places.js", function(data) {
			// loop through all markers and push into array
			var jsonArray = [];
			 $.each(data, function(i, item) {
				jsonArray.push(item);
			});
			
			for(var i = 0; i < jsonArray.length; i++)
			{
				MapContainer.loadMarker(jsonArray[i]);
			}
			
		});
	},

	loadMarker : function(markerData)
	{
		var MapContainer = this;
		var myLatlng = new google.maps.LatLng(markerData.markers['lat'],markerData.markers['lng']);
		var image = '../images/marker_stofur.png';

		// create new marker
		var marker = new google.maps.Marker({
		    id: markerData["id"],
		    map: map,
		    title: markerData["name"] ,
		    category: markerData["category"],
		    position: myLatlng,
		    icon: image
		});

		// add marker to list used later to get content and additional marker information
		markerList[marker.id] = marker;
		//markerList.push(marker);

		// add event listener when marker is clicked
		// currently the marker data contain a dataurl field this can of course be done different
		google.maps.event.addListener(marker, 'click', function() {
			// show marker when clicked
			MapContainer.showMarker(marker.id);
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

	dropdown : function()
	{
		$(".dropdown-menu").bind("click", function(){

			$(this).toggleClass("active");
			event.stopPropagation();
		});
	},

	showCategory: function(category)
	{
		for(id in markerList)
		{
			if(category == "Allt" || markerList[id].category == category){
				markerList[id].setMap(map);
			}
			else{
				markerList[id].setMap(null);
			}		
		}
	}
};

$(document).ready(function(){

	$(".fancybox").fancybox();
	
	var theMap = xland.init();
	xland.dropdown();

	$(".dropdown ul li a").bind("click", function(){
		xland.showCategory($(this).attr("rel"));
	});

	xland.loadMarkers();
});
