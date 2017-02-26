<?php
// modify courses or delete courses
// potentially incomplete
//edit schema setup

  $success = true;
  $data = json_decode($_REQUEST["data"]);
  //$data->added = [["New Course"], ["Joined", id], ["Joined 2", id]]
  //$data->deleted = [id1, id2, id3]
  //$data->email
  
  
  
  $con = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);
  
  $sid = mysqli_query($con, 'SELECT student_id FROM student WHERE email="'.$data->email .'"');
  if(!$result || mysqli_num_rows($result) == 0){
          $success = !$success;
  }else{
      $sid = $sid[0][0];
  }
  
  for($i = 0; $i < count($data->added); $i++){
      if(count($data->added[i]) - 2){
          // new course
          $name = $data->added[i][0];   
          
          $result = mysqli_query($con, 'INSERT INTO courses VALUES($name, NULL)');
          $cid =  mysqli_insert_id($con);
          $result = mysqli_query($con, 'INSERT INTO student_course VALUES($cid, $sid)');
          if(!$result || mysqli_num_rows($result) == 0){
            $success = !$success;
          }
          
          
      } else{
          // join old course
          $cid = $data->added[i][1];
          $result mysqli_query($con, 'INSERT INTO student_course VALUES($cid, $sid)');
          if(!$result || mysqli_num_rows($result) == 0){
            $success = !$success;
          }
      }
  }
  
  for($i = 0; $i < count($data->deleted); $i++){
      $id = $data->deleted[i];
      $result = mysqli_query($con, 'DELETE FROM courses WHERE course_id=$id AND student_id=$sid');
      if(!$result || mysqli_num_rows($result) == 0){
          $success = !$success;
      }
  }
  
  
?>