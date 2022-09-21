<?php

	$inData = getRequestInfo();
  	$UserID = $inData["UserID"];
	$page = $inData["Page"];
  	$rate = ($page - 1) *10; //set min on intervals of 10
	$searchResults = "";
	$searchCount = 0;
 

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("select * from ContactsTest where UserID = ? AND (FirstName like ? or LastName like ? or Phone like ? or Email like ?)  LIMIT $rate,10");
		$input = "%" . $inData["Search"] . "%";
		$stmt->bind_param("sssss", $UserID, $input, $input, $input, $input);
		$stmt->execute();
		
		$result = $stmt->get_result();
		
		while($row = $result->fetch_assoc())
		{
			if( $searchCount > 0 )
			{
				$searchResults .= ",";
			}
			$searchCount++;
			$searchResults .= '{"UserID" : "' . $row["UserID"] . '", "FirstName" : "' . $row["FirstName"] . '", "LastName" : "' . $row["LastName"] . '", "Phone" : "' . $row["Phone"] . '", "Email" : "' . $row["Email"] . '" }';
		}
		
		if( $searchCount == 0 )
		{
			returnWithError( "No Records Found" );
		}
		else
		{
			returnWithInfo( $searchResults );
		}
		
		$stmt->close();
		$conn->close();
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
	
	function returnWithInfo( $searchResults )
	{
		$retValue = '{"results":[' . $searchResults . '],"error":"0"}';
		sendResultInfoAsJson( $retValue );
	}
	
?>