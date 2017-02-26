<?php 
// Upload sign up information
//edit schema setup


$con = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);
if (isset($_REQUEST["data"]) && !empty($_REQUEST["data"])) {
// A request is made so data is saved to DB
// Make sure it isn't in the db already ...
  $data = json_decode($_REQUEST["data"]);

  $name = $data->name;
  $email = $data->email;
  $pass = hash("sha256", $data->pass);
  $courses = $data->courses;
  $body = $data->char;
  $char = "";


  foreach($body as $part=> $value){
    $char.="$value ";
  }
  $char = trim($char);
  $result = mysqli_query($con, "INSERT INTO student VALUES('$name', '$email', '$pass', '$char', '0 0', NULL)");
  if($result){
    $sid = mysqli_insert_id($con);
    foreach($courses as $course){
      // auto enroll in other peoples courses activated:
      // suggested modify course names w/ user id in order to NOT have courses "merged"
      $check = mysqli_query($con, "SELECT course_id FROM courses WHERE name='".$course."'");
      if(mysqli_num_rows($check) != 0){
        $cid = mysqli_fetch_row($check)[0];
        mysqli_query($con, "INSERT INTO student_course VALUES($cid, $sid)");
      } else {
        mysqli_query($con, "INSERT INTO courses VALUES('$course', NULL)"); 
        $cid =  mysqli_insert_id($con);
        mysqli_query($con, "INSERT INTO student_course VALUES($cid, $sid)");
      }
    }
  }
  $con->close();
  echo "true";    
}else{
  echo "false";
}

?> 