
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
			map.panTo(marker.position);
			MapContainer.showInfoWindow(marker.id);
		});

		// add event when marker window is closed to reset map location
		
		google.maps.event.addListener(infowindow,'closeclick', function() {
			//map.setCenter(defaultLatlng);
			//map.setZoom(defaultZoom);
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
		$(".overlay").show();
		var project = $(".overlay");


     	$.ajax({ url: '/server.php',
	        data: {action: 'getProjectById', project_id: id },
	        type: 'post',
	        success: function(result) {
	                	//console.log(result);
	                	var obj = $.parseJSON(result);
	                	console.log(obj);
	                	//console.log(obj[0].contact_person);
	                	project.find(".category-title").html('<span>' + obj[0].project_type + '</span>');
	                	project.find("h1").html(obj[0].project_name);
	                	project.find(".overview").html(obj[0].description);

	                	$(".project-name").html(obj[0].name);
	                	$(".location").html(obj[0].location);
	                	$(".product-owner").html('<h3>Eigandi verkefnis</h3><span>' + obj[0].product_owner + '</span>');
	                	
	                	if(obj[0].project_finished != 0)
	                	{
	                		$(".period").html('<span>' + obj[0].project_started + '</span> - <span>' + obj[0].project_finished + '</span>');
	                	}
	                	else if(obj[0].project_started != 0)
	                	{
	                		$(".period").html('<span>' + obj[0].project_started + '</span>');
	                	}
	                	
	                	$(".size").html(Math.round(obj[0].area_size));
	                	var scale = obj[0].scale;
	                	var scaleabbr = getScale(scale);
	                	$(".scale").html(scaleabbr);

	                	$(".cost").html(obj[0].capital_cost);
	                	
	                	$(".studio-name").html(obj[0].studio);
	                	$(".address").html(obj[0].studio_address);
	                	$(".website").html('<a href="' + obj[0].website + '">' + obj[0].website + '</a>');
	                	$(".email").html('<a href="mailto:' + obj[0].email + '">' + obj[0].email + '</a>');
	                	
	                	if(obj[0].affiliates != "")
	                	{
	                		var affiliates = '<h3>Samstarfsaðilar</h3><span>' + obj[0].affiliates + '</span>';
	                		$(".affiliates").html(affiliates);
	                	}

	                	$(".image").show();
	                	$(".thumbs").show();
	                	$(".text-wrapper").hide();

	                }
		});

		$.ajax({ url: '/server.php',
			data: { action: 'getProjectImagesById', project_id: id },
			type: 'post',
			success: function(result) {
						var obj = $.parseJSON(result);
						$(".thumbs").empty();
						var list = "";
						$.each(obj, function(i, image){
							
							if(image["is_primary"] == 0)
							{
								list += '<li><a href="#" rel="group" data="' + image["name"] + '"><img src="../images/thumbs/' + image["name"] + '" /></a></li>';
							}
							if(image["is_primary"] == 1)
							{
								var main_image = '<a href="javascript:void(0); title="' + image["name"] + '"><img src="../images/resized/' + image["name"] + '" alt="' + image["name"] + '" /></a>'; 
								$(".primary").html(main_image);
								$(".image-text").html(image["image_text"]);

								var thumb = '<img src="../images/thumbs/' + image["name"] + '" alt="' + image["name"] + '" />'; 
								var image = '<a class="fancybox" rel="group" href="../images/resized/' + image["name"] + '"><img src="../images/resized/' + image["name"] + '" alt="' + image["name"] + '" /></a>'; 
								$(".project-thumb").html(thumb);
								$(".image").html(image);
							}
						});
						$(".thumbs").html('<ul>' + list + '</ul><a class="prev" id="prev" href="#"><span>prev</span></a><a class="next" id="next" href="#"><span>next</span></a><div class="pagination" id="pag"></div>');
						$(".thumbs ul").carouFredSel({
							circular: false,
							infinite: false,
							auto: false,
							prev	: {
								button	: "#prev",
								key		: "left"
							},
							next	: {
								button	: "#next",
								key		: "right"
							},
							pagination	: "pag"
						});

						$(".thumbs ul li a").bind("click", function(){
					 		console.log(this);
					 		var selectedImage = $(this).attr("data");
					 		console.log(selectedImage);
					 		var image = '<a class="fancybox" rel="group" href="../images/resized/' + selectedImage + '"><img src="../images/resized/' + selectedImage + '" alt="' + selectedImage + '" /></a>'; 
					 		$(".image").html(image);
					 	});
			}
		}); 
	}
};

$(document).ready(function(){

	$(".fancybox").fancybox(
		{
			maxWidth	: 960,
			maxHeight	: 800,
			width 		: '100%',
			height 		: '100%',
			autosize	: false,
			fitToView	: false,
			padding : 0,

			helpers : {
		        overlay : {
		            css : {
		                'background' : 'rgba(20, 68, 74, 0.90)'
		            }
		        }
		    }
		}
	);


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

 	$(".overlay .closebtn").bind("click", function(){
 		$(".overlay").hide();
 		$(".content").removeClass("description");
 		$(".content").addClass("slides");
 		$(".text-wrapper .text").empty();
 		$(".image").empty();
 		$(".thumbs").empty();
 	});

 	$(".button").bind("click", function() {

 		$(".button").removeClass("selected");
 		$(this).addClass("selected");

 		if($(this).hasClass("one"))
 		{
 			if(!$(".content").hasClass("description"))
 			{
 				$(".content").addClass("description");
 				$(".content").find(".image").hide();
 				$(".content").find(".text-wrapper").show();
 				$(".thumbs").hide();
 				$("#scrollbar1").tinyscrollbar();
 			}

 			$(".content").removeClass("slides");
 		}
 		if($(this).hasClass("two"))
 		{
 			if(!$(".content").hasClass("slides"))
 			{
 				$(".content").addClass("slides");
 				$(".text-wrapper").hide();
 				$(".image").show();
 				$(".thumbs").show();
 			}
 			$(".content").removeClass("description");
 		}
 	});

});

function getScale(scale)
{
	var abbr = "";
	switch(scale)
	{
		case "fermetrar":
			abbr = "m<sup>2</sup>";
			break;
		case "hektarar":
		    abbr = "ha";
		    break;
	}
	return abbr;	
}