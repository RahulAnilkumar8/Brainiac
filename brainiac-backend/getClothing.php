<?php 
//get current Step from db
//edit schema setup


$con = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);
if (isset($_REQUEST["data"]) && !empty($_REQUEST["data"])) {

  $data = json_decode($_REQUEST["data"]);
  $email = $data;

  $result = mysqli_query($con, "SELECT clothing FROM student WHERE email='$email'");
  if($result){
    if(mysqli_num_rows($result) > 0){
        echo json_encode((mysqli_fetch_all($result)[0][0]));
    }
    else{
        echo "false";
    }
  }
  $con->close();  
}else{
  echo "false";
}

?> 