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
		$stmt = $conn->prepare("select * from ContactsTestv2 where UserID = ? AND (FirstName like ? or LastName like ? or Phone like ? or Email like ? or ConcatName like ?)  LIMIT $rate,10");
		$input = "%" . $inData["Search"] . "%";
		$stmt->bind_param("ssssss", $UserID, $input, $input, $input, $input, $input);
		$stmt->execute();
		
		$result = $stmt->get_result();
		
		while($row = $result->fetch_assoc())
		{
			if( $searchCount > 0 )
			{
				$searchResults .= ",";
			}
			$searchCount++;
			$searchResults .= '{"UserID" : "' . $row["UserID"] . '", "ContactID" : "' . $row["ID"] . '", "FirstName" : "' . $row["FirstName"] . '", "LastName" : "' . $row["LastName"] . '", "ConcatName" : "' . $row["ConcatName"] . '", "Phone" : "' . $row["Phone"] . '", "Email" : "' . $row["Email"] . '" }';
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
		$retValue = '{"Error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $searchResults )
	{
		$retValue = '{"results":[' . $searchResults . '],"error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>