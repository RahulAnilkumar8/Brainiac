<?php
// get course name of enrolled course
  //edit schema setup

  
  $course_id = json_decode($_REQUEST["data"]);
  
  $con = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);
  $result = mysqli_query($con, "SELECT name FROM courses WHERE course_id=$course_id");
  if(!$result || mysqli_num_rows($result) == 0){
    // no courses or mysql failure
    echo "false";
  } else {
    echo json_encode(mysqli_fetch_all($result)[0][0]);
  }
?>