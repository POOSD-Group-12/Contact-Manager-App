<?php
	$inData = getRequestInfo();
	
	$UserID = $inData["UserID"];
 
  // Code below is a placeholder and needs the username password and name of database.
	$conn = new mysqli("localhost", "TheBeast", "011ee91355156a86cc8ae431e11014966cb21fa05d43c89c", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("DELETE FROM Contacts WHERE ID=? ");
		$stmt->bind_param("i", $UserID);
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
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
?>