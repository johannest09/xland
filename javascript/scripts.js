
/**
 * xland application
 * 
 * @author Jóhannes Freyr Þorleifsson
 * @copyright (c) 2012
 */

var xland = {
	
	
	
	init: function() 
	{
		/* styles */
		var reykjavik = new google.maps.LatLng(64.138621,-21.894722);

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
			center: new google.maps.LatLng(64.138621,-21.894722),
		 	zoom: 13,
		 	/* mapTypeId: google.maps.MapTypeId.ROADMAP, */
			mapTypeControlOptions: {
				mapTypeIds: [google.maps.MapTypeId.ROADMAP, MY_MAPTYPE_ID]
			},
			mapTypeId: MY_MAPTYPE_ID
			
		};
		var map = new google.maps.Map(document.getElementById("map-container"), myOptions);
		
		var styledMapOptions = {
			name: 'X-land'
        };

		var jayzMapType = new google.maps.StyledMapType(styles, styledMapOptions);
		
		map.mapTypes.set(MY_MAPTYPE_ID, jayzMapType);
	}
};

$(document).ready(function(){
	
	xland.init();
});