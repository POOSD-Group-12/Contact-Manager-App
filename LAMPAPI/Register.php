<?php

	$inData = getRequestInfo();
	
  $LastName = $inData["LastName"];
  $FirstName = $inData["FirstName"];
	$Login = $inData["Login"];
  $Password = = $inData["Password"];

  // Code below is a placeholder and needs the username password and name of database.
	$conn = new mysqli("localhost", "TheBeast", "011ee91355156a86cc8ae431e11014966cb21fa05d43c89c", "COP4331");
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
   
		$stmt = $conn->prepare("Insert into User (LastName, FirstName, Login, Password) VALUES(?,?)");
		$stmt->bind_param("ssss", $LastName, $FirstName, $Login, $Password);
		$stmt->execute();
		$stmt->close();
		$conn->close();
		returnWithError("");
	}
	
	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $FirstName, $LastName, $Login, $Password, $id )
	{
		$retValue = '{"id":' . $id . ',"firstName":"' . $FirstName . '","lastName":"' . $LastName . '","login":"' . $Login . '","password":"' . $Password . '" ,"error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
