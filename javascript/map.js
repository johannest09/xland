
/**
 * xland application
 * 
 * @author Jóhannes Freyr Þorleifsson
 * @copyright (c) 2012
 */

var defaultZoom = 12;
var defaultLatlng = new google.maps.LatLng(64.138621,-21.894722);
var infowindow;
var markerList = {};
var map;
var mapStyle = "/mapstyle.js";

var xland = {
	
	loadMap: function() 
	{
		var MY_MAPTYPE_ID = 'reykjavikMap';

		$.getJSON("./javascript/mapstyle.js", function(data) {
			var styledMapOptions = { name: 'X-land' };
			var xlandMapType = new google.maps.StyledMapType(data, styledMapOptions);
			map.mapTypes.set(MY_MAPTYPE_ID, xlandMapType);
		});
		
		var myOptions = {
			center: defaultLatlng,
		 	zoom: defaultZoom,
		 	panControl: false,
		 	zoomControl: true,
		 	streetViewControl: false,
		 	mapTypeControl: true,
			mapTypeControlOptions: {
				mapTypeIds: [google.maps.MapTypeId.ROADMAP, MY_MAPTYPE_ID],
				style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
			},
			zoomControlOptions: {
      			style: google.maps.ZoomControlStyle.SMALL,
      			position: google.maps.ControlPosition.LEFT_BOTTOM
    		},
			mapTypeId: MY_MAPTYPE_ID	
		};
		
		map = new google.maps.Map(document.getElementById("map-canvas"), myOptions);
		
		// create new info window for marker detail pop-up
		infowindow = new google.maps.InfoWindow();
		return map;
	},

	//Todo: add a category as a parameter
	loadMarkers : function()
	{
		var MapContainer = this;
		$.getJSON("../markers.js", function(data) {		
			 $.each(data, function(i, item) {
				MapContainer.loadMarker(item);
			});
		});
	},

	loadMarker : function(markerData)
	{
		var location = markerData.lat_long.split(",");
		var lat = location[0];
		var lng = location[1];

		var markerColor; 
		
		if(markerData.project_type === "Skipulag")
		{
			markerColor = "../images/marker_orange.png";
		}
		else if(markerData.project_type === "Almenningsrými")
		{
			markerColor = "../images/marker_green.png";
		}
		else if(markerData.project_type === "Samkeppni")
		{
			markerColor = "../images/marker_purple.png";
		}
		else if(markerData.project_type === "Saga")
		{
			markerColor = "../images/marker_yellow.png";
		}
		else
		{
			markerColor = "../images/marker_green.png";
		}
		
		var MapContainer = this;
		var Latlng = new google.maps.LatLng(lat,lng);

		// create new marker
		var marker = new google.maps.Marker({
		    id: markerData["id"],
		    map: map,
		    title: markerData["project_name"],
		    category: markerData["project_type"],
		    position: Latlng,
		    icon: markerColor
		});

		// add marker to list used later to get content and additional marker information
		markerList[marker.id] = marker;

		// add event listener when marker is clicked
		// currently the marker data contain a dataurl field this can of course be done different
		google.maps.event.addListener(marker, 'click', function() {
			// show marker when clicked
			MapContainer.showInfoWindow(marker.id);
		});

		// add event when marker window is closed to reset map location
		
		google.maps.event.addListener(infowindow,'closeclick', function() {
			map.setCenter(defaultLatlng);
			map.setZoom(defaultZoom);
		});
		
	},

	showInfoWindow : function(markerId)
	{
		var marker = markerList[markerId];

		$.ajax({ url: '/server.php',
		        data: {action: 'getInfoWindowDataById', project_id: markerId },
		        type: 'post',
		        success: function(result) {
		                	//console.log(result);
		                	var data = $.parseJSON(result);
							var html = '<div class="infowindow"><h2>' + data['project']['project_name'] + '</h2><img src="../images/thumbs/' + data['image'] + '" class="marker-image"></img><p>' + data['project']['abstract'].substring(0, 120) + ' ...</p><a href="javascript:void(0);" rel="' + data['project']['id'] + '" title="Nánar um verkefni" class="more">Skoða verkefni</a> </div>';
		                	infowindow.setContent(html);
							infowindow.open(map, marker);
		                }
		});


		// get marker information from marker list
		
	},

	navigationFilter : function()
	{
		$("nav ul li a").bind("click", function(){
		
			var current = $(this);
			xland.showCategory($(this).attr("rel"));

			$("nav ul li a").each(function(){
				$(this).removeClass("active");
			});

			$(current).addClass("active");

			return false;
		});
	},

	showCategory: function(category)
	{
		for(id in markerList)
		{
			/*
			console.log(markerList[id]);
			console.log("____")
			console.log(category)
			console.log(markerList[id].category);
			console.log(typeof(markerList[id].category))
			console.log("____")
			*/

			if(category == "show-all" || markerList[id].category == category){
				markerList[id].setMap(map);
			}
			else{
				markerList[id].setMap(null);
			}		
		}
	},

	showProject: function(id)
	{
		$("#project").show();
		var project = $("#project");


     	$.ajax({ url: '/server.php',
	        data: {action: 'getProjectById', project_id: id },
	        type: 'post',
	        success: function(result) {
	                	//console.log(result);
	                	var obj = $.parseJSON(result);
	                	console.log(obj);
	                	//console.log(obj[0].contact_person);
	                	project.find(".category").html(obj[0].project_type);
	                	project.find(".project-name").html(obj[0].project_name);
	                	project.find(".description").html(obj[0].description);
	                }
		});

		$.ajax({ url: '/server.php',
			data: { action: 'getProjectImagesById', project_id: id },
			type: 'post',
			success: function(result) {
						var obj = $.parseJSON(result);
						//console.log(obj);
						 $(".images").empty();

						$.each(obj, function(i, image){
							//console.log(item["name"])
							var html = '<a href="javascript:void(0);" title="' + image["name"] + '"><img src="../images/thumbs/' + image["name"] + '" /></a>';
							$(".images").append(html);
						});
			}
		}); 
	}
};

$(document).ready(function(){

	//$(".fancybox").fancybox();

	google.maps.event.addListenerOnce(xland.loadMap(), 'idle', function(){
		xland.navigationFilter();
		xland.loadMarkers();
	});

	google.maps.event.addListener(infowindow, 'domready', function() { 
         
		$(".infowindow").find("a").bind("click", function(){
			var id = $(this).attr("rel");
			xland.showProject(id);
		});
 	});

 	$("#project .close-project").bind("click", function(){
 		$("#project").hide();
 	});



});