<?php
//edit schema setup

  
  $data = json_decode($_REQUEST["data"]);
  $email = $data;
  //$pass = hash("sha256", $data->pass);
  
  $con = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);
  $result = mysqli_query($con, "SELECT pass FROM student WHERE email='$email'");
  if(!$result || mysqli_num_rows($result) == 0){
    echo "false";
  } else {
      echo "true";
  }
?>