<?php

	$inData = getRequestInfo();
	
  $FirstName = $inData["FirstName"];
  $LastName = $inData["LastName"];
  $Phone = $inData["Phone"];
  $Email = $inData["Email"];
  $UserID = $inData["UserID"];
 
  // Code below is a placeholder and needs the username password and name of database.
	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("INSERT into Contacts (FirstName,LastName,Phone,Email,UserID) VALUES(?,?,?,?,?)");
		$stmt->bind_param("sssss", $FirstName, $LastName, $Phone, $Email, $UserID);
		$stmt->execute();
		$stmt->close();
		$conn->close();
   
		returnWithInfo($FirstName, $LastName, $Phone, $Email, $UserID);
		
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
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $FirstName, $LastName, $Phone, $Email, $UserID )
	{
		$retValue = '{"UserID":"' . $UserID . '", "FirstName":"' . $FirstName . '","LastName":"' . $LastName . '","Phone":"' . $Phone . '","Email":"' . $Email . '", "Status":"ADDED"}';
		sendResultInfoAsJson( $retValue );
	}
 
 ?>