<?php

	$inData = getRequestInfo();
 
	$FirstName = $inData["FirstName"];
	$LastName = $inData["LastName"];
	$Login = $inData["Login"];
	$Password = $inData["Password"];
	

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331"); 	
	if( $conn->connect_error )
  {
    returnWithError( $conn->connect_error );
  }
  else
  {
    //check if User with provided login already exists
    $stmt = $conn->prepare("SELECT * FROM Users WHERE Login = ?");
    $stmt->bind_param("s", $Login);
    $stmt->execute();
    $result = $stmt->get_result();
    if( $row = $result->fetch_assoc() )
    {
      // Returns with an error since that login name is already taken
      returnWithError("1");
      $stmt->close();
    }
    else
    {
      //insert new user to database 
  		$stmt = $conn->prepare("INSERT into Users (FirstName,LastName,Login,Password) VALUES(?,?,?,?)");
		  $stmt->bind_param("ssss", $FirstName, $LastName, $Login, $Password);
		  $stmt->execute();
		  $stmt->close();
		  $conn->close();
   
		  returnWithInfo($FirstName, $LastName, $Login, $Password, 0);
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
	
	function returnWithInfo( $FirstName, $LastName, $Login, $Password, $var)
	{
		$retValue = '{"FirstName":"' . $FirstName . '","LastName":"' . $LastName . '","Login":"' . $Login . '","Password":"' . $Password . '", "Error": "' . $var . '"}';
		sendResultInfoAsJson( $retValue );
	}
 
 ?>