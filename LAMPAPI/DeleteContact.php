<?php
	$inData = getRequestInfo();
	

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("DELETE FROM Contacts WHERE UserID=? ");
		$stmt->bind_param("s", $inData["UserID"]);
		$stmt->execute();
		$stmt->close();
		$conn->close();
				
    returnWithInfo($inData["UserID"]);
		
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
		$retValue = '{"UserID":"' . $UserID . '", "Status":"Deleted"}';
		sendResultInfoAsJson( $retValue );
	}
 
 ?>