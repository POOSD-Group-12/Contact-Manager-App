<?php
	$inData = getRequestInfo();
	
  $FirstName = $inData["FirstName"];
  $LastName = $inData["LastName"];
  $Phone = $inData["Phone"];
	$Email = $inData["Email"];
	$UserID = $inData["UserID"];
 

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		
		//check if contact exists
    $stmt = $conn->prepare("SELECT * FROM Contacts WHERE UserID = ?");
    $stmt->bind_param("s", $UserID);
    $stmt->execute();
    $result = $stmt->get_result();
    if( $row = $result->fetch_assoc() ) //If yes 
    {
      $stmt = $conn->prepare("UPDATE Contacts SET LastName=?, FirstName=?, Phone=?, Email=? WHERE UserID=? ");
		  $stmt->bind_param("sssss", $LastName, $FirstName, $Phone, $Email, $UserID);
		  $stmt->execute();
		  $stmt->close();
		  $conn->close();
	  
      returnWithInfo($FirstName, $LastName, $Phone, $Email, $UserID);
    }
    else
    {
      // Returns with an error since that login name is already taken
      returnWithError("Provided Contact does not exist.");
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
	
function returnWithInfo( $FirstName, $LastName, $Phone, $Email, $UserID )
	{
		$retValue = '{"UserID":"' . $UserID . '", "FirstName":"' . $FirstName . '","LastName":"' . $LastName . '","Phone":"' . $Phone . '","Email":"' . $Email . '", "Status":"UPDATED"}';
		sendResultInfoAsJson( $retValue );
	}
 
 ?>