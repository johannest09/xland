
/**
 * xland application
 * 
 * @author Jóhannes Freyr Þorleifsson
 * @copyright (c) 2012
 */
// 64.138621,-21.894722
var defaultZoom = 11;
var defaultLatlng = new google.maps.LatLng(64.152123,-21.816328);
var infowindow;
var markerList = {};
var map;
var mapStyle = "/mapstyle.js";

var map;
var overlay;
MyOverlay.prototype = new google.maps.OverlayView();
MyOverlay.prototype.onAdd = function() { }
MyOverlay.prototype.onRemove = function() { }
MyOverlay.prototype.draw = function() { }
function MyOverlay(map) { this.setMap(map); }

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
		overlay = new MyOverlay(map);
		// create new info window for marker detail pop-up
		infowindow = new google.maps.InfoWindow({disableAutoPan: true});
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
		    animation: google.maps.Animation.DROP,
		    icon: markerColor
		});

		// add marker to list used later to get content and additional marker information
		markerList[marker.id] = marker;

		// add event listener when marker is clicked
		// currently the marker data contain a dataurl field this can of course be done different
		google.maps.event.addListener(marker, 'click', function() {

			var newCenter = overlay.getProjection().fromLatLngToContainerPixel(marker.position);
			newCenter.y -= 100;
			newCenter = overlay.getProjection().fromContainerPixelToLatLng(newCenter);
			MapContainer.showInfoWindow(marker.id);
			map.panTo(newCenter);
		});

		// add event when marker window is closed to reset map location
		google.maps.event.addListener(infowindow,'closeclick', function() {
			//map.setCenter(defaultLatlng);
			//map.setZoom(defualtZoom);
		});
		
	},

	showInfoWindow : function(markerId)
	{
		var marker = markerList[markerId];

		$.ajax({ url: '/server.php',
		        data: {action: 'getInfoWindowDataById', project_id: markerId },
		        type: 'post',
		        success: function(result) {
		                	var data = $.parseJSON(result);
		                	var imagenamefix = data['image'].replace(/ /g,"-").replace("JPG", "jpg").replace("jpeg", "jpg");
							var html = '<div class="infowindow"><h2>' + data['project']['project_name'] + '</h2><img src="../images/thumbs/' + imagenamefix + '" class="marker-image"></img><p>' + data['project']['abstract'].substring(0, 200) + ' ...</p><a href="javascript:void(0);" rel="' + data['project']['id'] + '" title="Nánar um verkefni" class="more">Skoða verkefni</a> </div>';
		                	infowindow.setContent(html);
							infowindow.open(map, marker);
		                }
		});

	},

	navigationFilter : function()
	{
		$("nav ul li a").bind("click", function(){
		
			var current = $(this);
			$("nav ul li a").each(function(){
				$(this).removeClass("active");
			});
			$(current).addClass("active");

			if( !( $(this).attr("rel") == "about" ) )
			{
				xland.showCategory($(this).attr("rel"));
			}
			return false;
		});
	},

	showCategory: function(category)
	{
		for(id in markerList)
		{
			if(category == "show-all" || markerList[id].category == category) 
			{
				markerList[id].setMap(map);

				if(category == "show-all")
				{
					$("nav ul li a").each(function() {
						if(!$(this).hasClass("about")) 
							$(this).addClass("active");
					});
				}
			}
			else{
				markerList[id].setMap(null);
			}		
		}
	},

	showProject: function(id)
	{
		$(".overlay").show();
		$("#project").show();

     	$.ajax({ url: '/server.php',
	        data: {action: 'getProjectById', project_id: id },
	        type: 'post',
	        success: function(result) {
	                	var obj = $.parseJSON(result);	                	
	                	/* insert */

	                	$(".category-title").html('<span>' + obj[0].project_type + '</span>');
	                	$(".top h1").html(obj[0].project_name);
	                	$("#scrollbar1 .overview").html(obj[0].description);

	                	$(".project-name").html(obj[0].name);
	                	$(".location").html(obj[0].location);
	                	$(".studio-name").html(obj[0].studio);
	                	$(".address").html(obj[0].studio_address);
	                	$(".website").html('<a href="' + obj[0].website + '">' + obj[0].website + '</a>');
	                	$(".email").html('<a href="mailto:' + obj[0].email + '">' + obj[0].email + '</a>');
	                	
	                	if(obj[0].affiliates != "")
	                	{
	                		var affiliates = '<h3>Samstarfsaðilar</h3><span>' + obj[0].affiliates + '</span>';
	                		$(".affiliates").html(affiliates);
	                	}

	                	var projectData = "";
	                	if(obj[0].project_finished != 0)
	                	{
	                		projectData += '<li class="period" ><span>' + obj[0].project_started + '</span> - <span>' + obj[0].project_finished + '</span></li>';
	                	}
	                	else if(obj[0].project_started != 0)
	                	{
	                		if(obj[0].in_progress != 0)
	                		{
								projectData += '<li class="period" ><span>' + obj[0].project_started + '</span> - <span class="in-progress">Í vinnslu</span></li>';
	                		}
	                		else
	                		{
	                			projectData += '<li class="period" ><span>' + obj[0].project_started + '</span></li>';
	                		}
	                	}
	                	if(obj[0].area_size != 0)
	                	{
	                		var scale = obj[0].scale;
	                		var scaleabbr = getScale(scale);
	                		projectData += '<li class="area-size"><h3>Stærð</h3><span class="size">' + parseFloat(obj[0].area_size) + '</span><span class="scale">' + scaleabbr +'</span></li>';
	                	}
	                	if(obj[0].capital_cost != 0)
	                	{
	                		projectData += '<li class="project-cost"><h3>Kostnaður</h3><span class="cost">' + obj[0].capital_cost + '</span></li>';
	                	}
	                	$("li.data ul").html(projectData);	
	                	
	                	$(".project-owner").html('<h3>Verkkaupi</h3><span>' + obj[0].product_owner + '</span>');

	                	if(obj[0].product_owner != "")
	                	{
	                		$(".project-owner").show();
							$(".project-owner").html('<h3>Verkkaupi</h3><span>' + obj[0].product_owner + '</span>');
	                	}
	                	else
	                	{
	                		$(".project-owner").hide();
	                	}
	                	if(obj[0].contractor != "")
	                	{
	                		$(".contractor").show();
	                		$(".contractor").html('<h3>Framkvæmdaraðili</h3><span>' + obj[0].contractor + '</span>');
	                	}
	                	else
	                	{
	                		$(".contractor").hide();
	                	}

	                	$(".image").show();
	                	$(".thumbs").show();
	                	$(".text-wrapper").hide();
	                	$("#scrollbar2").tinyscrollbar_update();
	                }
		});

		$.ajax({ url: '/server.php',
			data: { action: 'getProjectImagesById', project_id: id },
			type: 'post',
			success: function(result) {
						var obj = $.parseJSON(result);
						var list = "";
						$.each(obj, function(i, image){
							var imagenamefix = image["name"].replace(/ /g,"-").replace("JPG", "jpg").replace("jpeg", "jpg");
							list += '<li><a class="fancybox" href="../images/resized/' + imagenamefix + '" rel="group" data="' + imagenamefix + '"><img src="../images/thumbs/' + imagenamefix + '" rel="' + image["id"] + '"/></a></li>';
							if(image["is_primary"] == 1)
							{
								var thumb = '<img src="../images/thumbs/' + imagenamefix + '" alt="' + imagenamefix + '" />'; 
								$(".project-thumb").html(thumb);
								var mainImage = '<a class="fancybox" rel="group" href="../images/resized/' + imagenamefix + '" style="display: block; background: url(\'/images/resized/' + imagenamefix + '\') no-repeat; width: 725px; height: 480px; background-position: 100% 100%; background-size: cover;"></a>';
								$(".image").html(mainImage);
							}
						});
						$(".thumbs ul").html(list);
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
					 		var selectedImage = $(this).attr("data");
					 		var imageId = $(this).find("img").attr("rel");
					 		var mainImage = '<a class="fancybox" rel="group" href="../images/resized/' + selectedImage + '" style="display: block; background: url(\'/images/resized/' + selectedImage + '\') no-repeat; width: 725px; height: 480px; background-position: 100% 100%; background-size: cover;"></a>';
					 		$(".image").html(mainImage);
					 		getImageText(imageId);
					 		return false;
					 	});
			}

		});
		
		$.ajax({ url: 'server.php',
			data: { action: 'getProjectVideosById', project_id: id },
			type: 'post',
			success: function(result) {
				var obj = $.parseJSON(result);
				var videoList ="";
				$.each(obj, function(i, video){
					videoList += '<li><a class="video" href="javascript:void(0);" class="" data="' + video["id"] + '"><img src="../images/play.png" /></a></li>';
				});
				$(".thumbs ul").append(videoList);
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
				$(".thumbs ul li a.video").bind("click", function(){
					var selectedVideoId = $(this).attr("data");
					getVideoById(selectedVideoId);
					return false;
				})
			}
		});

	}
};

$(document).ready(function(){
	$("#scrollbar2").tinyscrollbar();
	$("a.fancybox").attr('rel', 'group1').fancybox(
		{
			maxWidth	: 960,
			maxHeight	: 800,
			width 		: '100%',
			height 		: '100%',
			autosize	: false,
			fitToView	: false,
			padding 	: 0,
			transitionIn: 'elastic',
			transitionOut: 'elastic',
			speedIn		: 600,
			speedOut	: 200,

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

 	$(".overlay #project .closebtn").bind("click", function(){
 		$(".overlay").hide();
 		$(".content").removeClass("description");
 		$(".content").addClass("slides");
 		
 		/* Cleanup */
 		$(".text-wrapper .text").empty();
    	$(".category-title").empty();
    	$(".top h1").empty();
    	$("#scrollbar1 .overview").empty();
    	$(".project-name").empty();
    	$(".location").empty();
    	$(".studio-name").empty();
    	$(".address").empty();
    	$(".website").empty();
    	$(".email").empty();
    	$(".affiliates").empty();
    	$("li.data ul").empty();
    	$(".project-owner").empty();
    	$(".image").empty();
 		$(".thumbs ul").empty();
 		$(".project-thumb").empty();
 		$(".contractor").empty();
 		$(".infobox").remove();

 	});

 	$(".overlay #about .closebtn").bind("click", function(){
 		$(".overlay").hide();
 		$("#about").hide();
 		$("nav ul li a.about").removeClass("active");
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

 	$("nav .about").bind("click", function(){
 		$(".overlay").show();
 		$("#project").hide();
 		$("#about").show();
 		return false;
 	});

});

function getScale(scale)
{
	var abbr = "";
	switch(scale)
	{
		case "fermetrar":
			abbr = " m<sup>2</sup>";
			break;
		case "hektarar":
		    abbr = " ha";
		    break;
	}
	return abbr;	
}

function getVideoById(id) {
	$.ajax({ url: '/server.php',
		data: { action: 'getVideo', project_id: id },
		type: 'post',
		success: function(result) {
			var obj = $.parseJSON(result);
			$(".image").html(obj[0].embed);
		}
	});
}

function getImageText(id)
{
	$.ajax({ url: '/server.php',
		data: { action: 'getImageText', project_id: id },
		type: 'post',
		success: function(result) {
			var obj = $.parseJSON(result);
			var imagetext = obj[0].imagetext;
			if(imagetext)
			{
				$(".infobox").remove();
				var infoboxhtml = '<div class="infobox"><span class="infotext">' + imagetext + '</span><a href="#" class="info-closebtn"></a><a href="#" class="infosym" title="Skoða myndatexta"></a></div>';
				$(".image").append(infoboxhtml);
					$(".infosym").bind("click", function(){
						$(".infobox").addClass("open");
						return false;
					});
					$(".info-closebtn").bind("click", function(){
						$(".infobox").removeClass("open");
						return false;
					});
				}
			}
			
	});
}