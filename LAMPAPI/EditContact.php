<?php
	$inData = getRequestInfo();
	
  $FirstName = $inData["FirstName"];
  $LastName = $inData["LastName"];
  $ConcatName = $inData["ConcatName"];
  $Phone = $inData["Phone"];
	$Email = $inData["Email"];
	$ContactID = $inData["ContactID"];
 

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		
		//check if contact exists
    $stmt = $conn->prepare("SELECT * FROM ContactsTestv2 WHERE ID = ?");
    $stmt->bind_param("s", $ContactID);
    $stmt->execute();
    $result = $stmt->get_result();
    if( $row = $result->fetch_assoc() ) //If yes 
    {
      $stmt = $conn->prepare("UPDATE ContactsTestv2 SET LastName=?, FirstName=?, ConcatName=?, Phone=?, Email=? WHERE ID=? ");
		  $stmt->bind_param("ssssss", $LastName, $FirstName, $ConcatName, $Phone, $Email, $ContactID);
		  $stmt->execute();
		  $stmt->close();
		  $conn->close();
	  
      returnWithInfo( $LastName, $FirstName, $ConcatName, $Phone, $Email, $ContactID);
    }
    else
    {
      // Returns with an error contact doesnt exist.
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
		$retValue = '{"Error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
function returnWithInfo(  $LastName, $FirstName, $ConcatName, $Phone, $Email, $ContactID )
	{
		$retValue = '{"ContactID":"' . $ContactID . '", "FirstName":"' . $FirstName . '","LastName":"' . $LastName . '","ConcatName":"' . $ConcatName . '","Phone":"' . $Phone . '","Email":"' . $Email . '", "Status":"UPDATED"}';
		sendResultInfoAsJson( $retValue );
	}
 
 ?>