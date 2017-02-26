<?php
// Check Enrolled Courses
//edit schema setup


  $email = json_decode($_REQUEST["data"]);
  
  $con = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);
  $result = mysqli_query($con, "SELECT name, course_id FROM courses WHERE course_id IN (SELECT course_id FROM student_course WHERE student_id IN (SELECT student_id FROM student WHERE email='$email'))");
  if(!$result || mysqli_num_rows($result) == 0){
    // no courses or mysql failure
    echo "false";
  } else {
    // return multi-dimensional array w/ course [name, id]
    echo json_encode(mysqli_fetch_all($result));
  }
?>