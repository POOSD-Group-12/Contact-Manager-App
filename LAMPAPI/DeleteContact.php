<?php

	$inData = getRequestInfo();
	
  $UserID = $inData["UserID"];

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("SELECT * FROM Contacts WHERE UserID = ?");
    $stmt->bind_param("s", $UserID);
    $stmt->execute();
    $result = $stmt->get_result();
    if( $row = $result->fetch_assoc() )
    {
      $stmt = $conn->prepare("DELETE FROM Contacts WHERE UserID=? ");
		  $stmt->bind_param("s", $UserID);
		  $stmt->execute();
		  $stmt->close();
		  $conn->close();
				
      returnWithInfo($UserID);
    }
    else
    {
      returnWithError("Contact with provided UserID does not exist.");
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
		$retValue = '{"UserID":"' . $UserID . '", "Status":"Deleted"}';
		sendResultInfoAsJson( $retValue );
	}
 
 ?>