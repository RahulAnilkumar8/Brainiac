<?php
//edit schema setup

// data should be in same format as query
$data = json_decode($_REQUEST["data"]);
$con = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);
// question types
// td => term/def
// img => image
// mc => multiple choice
// ref => Txtbk/web reference

//SQL Format: question, type, answer, option1, option2, option3, course_id, question_id, added, topic
$result = mysqli_query($con, "INSERT INTO question VALUES('".$data[question]."','".$data[type]."','".$data[answer]."',".($data[option1]? "'".$data[option1]."'" :"NULL").",".($data[option2]? "'".$data[option2]."'"/ :"NULL").",".($data[option3]? "'".$data[option3]."'" :"NULL").",".$data[course_id].", NULL, CURDATE(),'".$data[topic]."')");

// make sure course_id is in db otherwise it won't work ..
if($result){
  echo "add question successful";
} else {
  echo "unsuccessful question addition";
}

?>