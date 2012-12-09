
/**
 * xland application
 * 
 * @author Jóhannes Freyr Þorleifsson
 * @copyright (c) 2012
 */

var xland = {
	
	init: function() 
	{
		var myOptions = {
		  center: new google.maps.LatLng(64.138621,-21.894722),
		  zoom: 13,
		  mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		var map = new google.maps.Map(document.getElementById("map-container"), myOptions);
	}
};

$(document).ready(function(){
	
	xland.init();
});