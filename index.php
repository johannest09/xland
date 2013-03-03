<!DOCTYPE html>
<html>
	<head>
		<title>X-LAND</title>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
		<meta name="Rating" content="General" />
		<meta name="revisit-after" content="5 Days" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<meta name="title" content="XLAND - Landslagsarkitektúr" />
		<meta name="description" content='See the landscape arcithechture sites in Reykjavik' />
		
		<?php include 'server.php'; ?>

		<link href='http://fonts.googleapis.com/css?family=Ubuntu:400,500,700' rel='stylesheet' type='text/css'>
		<link rel="stylesheet" type="text/css" href="stylesheets/less/main.css" />

		<link rel="stylesheet" type="text/css" href="stylesheets/less/jquery.fancybox.css?v=2.1.3"  media="screen" />
		<link rel="stylesheet" type="text/css" href="stylesheets/less/jquery.fancybox-buttons.css?v=1.0.5" media="screen" />
		<link rel="stylesheet" type="text/css" href="stylesheets/less/jquery.fancybox-thumbs.css?v=1.0.7" media="screen" />

		<!--link rel="stylesheet" type="text/css" href="stylesheets/less/responsive.css" /-->
		
	</head>
	
	<body>
		<header>
			<div class="wrap">
				<div class="header-content">
					<div class="row">
						<div class="col-3">
							<a href="/" class="xland-logo" title="xland"></a>
								
						</div>
						<div class="col-8">
							<nav>
								<ul>
									<li><a href="#" class="structure" rel="Skipulag">Skipulag</a></li>
									<li><a href="#" class="public-space" rel="Almenningsrými">Almenningsrými</a></li>
									<li><a href="#" class="competition" rel="Samkeppni">Samkeppnir</a></li>
									<li><a href="#" class="history" rel="Saga">Saga</a></li>
									<li><a href="#" class="show-all" rel="show-all">Allt</a></li>
									<li><a href="#" class="about">Um X-land</a></li>
								</ul>
							</nav>
						</div>
						<div class="col-1">
							<a href="http://www.fila.is" class="fila">
								<img class="fila-logo" src="images/fila-logo-greyscale.jpg" title="Heimasíða FILA"></img>
							</a>
						</div>
					</div>
				</div>
			</div>
		</header>
		<div class="overlay">
			<div id="project">
				<aside class="left-panel">
					<div class="category-title">
						<span></span>
					</div>
					<div class="panel-wrapper">
						<div class="project-thumb"></div>
						<div class="basic-info">
							<div class="studio">
								<h3>Stofa/þáttakendur</h3>
							</div>
							<div class="designer">
								<h3>Hönnuðir</h3>
							</div>
							<div class="data">
								<div class="period"></div>
								<div class="area-size">
									<h3>Stærð</h3><span class="size"></span><span class="scale"></span>
								</div>
								<div class="cost">
									<h3>Kostnaður</h3>
								</div>
							</div>
						</div>
						<div class="social-media">
							<ul>
								<li><a href="#" class="facebook"></a></li>
								<li><a href="#" class="twitter"></a></li>
								<li><a href="#" class="google"></a></li>
							</ul>
						</div>
					</div>
				</aside>
				<div class="project-container">
					<div class="top">
						<h1></h1>
						<div class="buttons">
							<a href="javascript:void(0);" class="button one">Lýsing verkefnis<span class="arrow"></span></a>
							<a href="javascript:void(0);" class="button two">Myndefni<span class="arrow"></span></a>
							<a href="javascript:void(0);" class="closebtn"></a>
						</div>
					</div>
					<div class="content slides">
						<a href="javascript:void(0)" class="forward"></a>
						<a href="javascript:void(0)" class="back"></a>
						
						<div class="text-wrapper">
							<div class="text"></div>
						</div>
					</div>
					<div class="bottom">
						<div class="thumbs"></div>
					</div>
				</div>
			</div>
		</div>

		<section id="map-canvas"></section>

		<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>
		<script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?key=AIzaSyCe-U-BLvwE6b8biTRNaYPmboqbJhrlhpU&sensor=true"></script>
		<script type="text/javascript" src="javascript/jquery.ui.map.js"></script>
		<script src="javascript/map.js" type="text/javascript"></script>

		<script type="text/javascript" src="javascript/jquery.fancybox.pack.js?v=2.1.3"></script>
		<script type="text/javascript" src="javascript/jquery.fancybox-buttons.js?v=1.0.5"></script>
		<script type="text/javascript" src="javascript/jquery.fancybox-media.js?v=1.0.5"></script>
		<script type="text/javascript" src="javascript/jquery.fancybox-thumbs.js?v=1.0.7"></script>

	</body>
</html>