<?php

	$inData = getRequestInfo();
	
  	$ContactID = $inData["ContactID"];

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("SELECT * FROM ContactsTestv2 WHERE ID = ?");
    	$stmt->bind_param("s", $ContactID);
    	$stmt->execute();
    	$result = $stmt->get_result();
    	if( $row = $result->fetch_assoc() )
    	{
      		$stmt = $conn->prepare("DELETE FROM ContactsTestv2 WHERE ID=? ");
		  	$stmt->bind_param("s", $ContactID);
		  	$stmt->execute();
		  	$stmt->close();
		  	$conn->close();
				
      		returnWithInfo($ContactID);
    	}
    	else
    	{
      		returnWithError("Contact with provided ContactID does not exist.");
      		$stmt->close();
      		$conn->close();
    	}
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
	
	function returnWithInfo($UserID )
	{
		$retValue = '{"ContactID":"' . $UserID . '", "Status":"Deleted"}';
		sendResultInfoAsJson( $retValue );
	}
?>