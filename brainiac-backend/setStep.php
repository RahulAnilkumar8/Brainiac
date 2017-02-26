<?php 
// save current step on map
//edit schema setup


$con = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);


  $data = json_decode($_REQUEST["data"]);

  $email = $data->email;
  $step = $data->step;

  $result = mysqli_query($con, "UPDATE student SET loc={$step} WHERE email='$email'");
  $con->close();
if($result){
    echo "true";
  } else{
  echo "false";
}

?> 