<?php
	include 'classes/project.php';
	include 'classes/images.php';

	init();

	function init()
	{
		getMarkers();
	}

	function createConnection()
	{
		// Connect to database
		$connection = mysql_connect("localhost","11_xlandis","joi2919");
		mysql_select_db("11_xlandis");

		if(!$connection)
		{
			die('Could not connect: ' . mysql_error());
		}
		mysql_set_charset('utf8',$connection);

		return $connection;
	}

	function closeConnection($connection)
	{
		mysql_close($connection);
	}
	
	
	function getMarkers()
	{
		$connection = createConnection();
		$query = "SELECT id, project_name, project_type, lat_long FROM Projects";

		$sth = mysql_query($query);
		$rows = array();
		while($r = mysql_fetch_assoc($sth)) {
		    $rows[] = $r;
		}
		$jsonData = json_encode($rows);
		//print $jsonData;
		$fp = fopen('markers.js', 'w');
		fwrite($fp, $jsonData);
		fclose($fp);

		closeConnection($connection);
	}

	function getInfoWindowDataById($id)
	{
		$connection = createConnection();
		$project_query = mysql_query("SELECT id, project_name, abstract FROM Projects WHERE id = $id");
		$image_query = mysql_query("SELECT name FROM Images WHERE project_id = $id AND is_primary = 1");
		
	    $data = array();
	    $jsonArr = array();

		while ( $row = mysql_fetch_assoc($project_query) )
		{
			$jsonArr['id'] = $row['id'];
		    $jsonArr['project_name'] = $row['project_name'];
		    $jsonArr['abstract'] = $row['abstract'];
		    $data['project'] = $jsonArr;
		}
		while ( $row = mysql_fetch_assoc($image_query) )
		{
			$data['image'] = $row['name'];
		}

		closeConnection($connection);
		echo json_encode( $data );
	}

	function getProjectById($id)
	{
		//echo "The id of the project is ".$id;
		$connection = createConnection();
		$result = mysql_query("SELECT * FROM Projects WHERE id = $id");
		
	    $data = array();
		while ( $row = mysql_fetch_assoc($result) )
		{
		    $data[] = $row;
		}
		closeConnection($connection);
		echo json_encode( $data );
	}

	function getProjectImagesById($id)
	{
		$connection = createConnection();

		$sth = mysql_query("SELECT id, project_id, name, type, imagetext, image_category, is_primary FROM Images WHERE project_id = $id");
		$data = array();
		while($r = mysql_fetch_assoc($sth)) 
		{
		    $data[] = $r;
		}
		closeConnection($connection);
		echo json_encode( $data );
	}

	if(isset($_POST['action']) && !empty($_POST['action'])) {
	    $action = $_POST['action'];
	    $id = $_POST['project_id'];
	    
	    switch($action) {
	    	case 'getInfoWindowDataById' : getInfoWindowDataById($id); break;
	    	case 'getProjectImagesById': getProjectImagesById($id); break;
	        case 'getProjectById' : getProjectById($id); break;
	    }
	}



?>