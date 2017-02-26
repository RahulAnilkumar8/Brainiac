<?php
  //  Choose a random question given email account of user
  // To Do: make sure that the given question isn't already in list
  // retrieve *n* questions (up to but if less question available, then give less)
  
  // get 2 questions from last week
  // otherwise get 
  function testYesterday($val){
       if($val["added"] ==  date("Y-m-d",strtotime("-1 day")) ){
           return true;
       }
  }
  
  function testLastWeek($val){
       if(date($val["added"]) >  date(strtotime("-8 days")) && date($val["added"]) < date(strtotime("-1 day"))){
           return true;
       }
  } 
  
  function chooseQuestion($questions, $choices){
      $chosen_ones = array();
      // choose questions from yesterday
      
      $yesterday = array_filter($questions, "testYesterday");
      if(count($yesterday < $choices[0])){
          $yesterday = $questions;
      }
      $keys = array_keys($yesterday);
      shuffle($keys);
      $keys = array_splice($keys, 0,$choices[0]);
      
      $temp = array();
      foreach($keys as $key){
          array_push($temp,$yesterday[$key]);
      }
      sort($keys);
      $keys = array_reverse($keys);
      foreach($keys as $key){
          array_splice($questions, $key, 1);
      }
      $temp = array_values($temp);     
      
      $chosen_ones =  array_merge($chosen_ones, $temp);
         
      //choose questions from last week
      
      $lastWeek = array_filter($questions, "testLastWeek");
      if(count($lastWeek < $choices[0])){
          $lastWeek = $questions;
      }
      $keys = array_keys($lastWeek);
      shuffle($keys);
      $keys = array_splice($keys, 0,$choices[1]);
      
      $temp = array();
      foreach($keys as $key){
          array_push($temp,$lastWeek[$key]);
      } 
      sort($keys);
      $keys = array_reverse($keys);
      foreach($keys as $key){
          array_splice($questions, $key, 1);
      }
      $temp = array_values($temp);   
      
      $chosen_ones = array_merge($chosen_ones, $temp);
      
      //choose questions from random
      shuffle($questions);
      $chosen_ones = array_merge($chosen_ones,  array_slice($questions, 0, $choices[2]));
      
      return $chosen_ones;
}
//edit schema setup


  $data= json_decode($_REQUEST["data"]); 
  $email = $data->email;
  $boss = $data->boss;
  // need 11 questions total for boss and 7 total for regular
  //array(from last week, from yesterday, from last 7 days, from random)
  $choices = $boss?array(3,5,3):array(3,4,0);
  
  $con = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);
  
  // get all questions
  //  {added < CURDATE() AND} if I don't want questions from today too
  $result = mysqli_query($con, "SELECT * FROM question WHERE course_id IN (SELECT course_id FROM student_course WHERE student_id IN (SELECT student_id FROM student WHERE email='$email'))");
  if(!$result || mysqli_num_rows($result) == 0){
    // no questions or mysql failure
    echo "false";
  } else {
    $questions = mysqli_fetch_all($result, MYSQLI_ASSOC);
    if(count($questions) < 7){
        // not enough questions to battle
        echo '"not enough"';
    } else {
        // if not enough quessions then revert from boss fight
      if(count($questions) < 11 && $boss){
          $boss = false;
          $choices = array(3,4,0);
      }
      
      echo json_encode(chooseQuestion($questions, $choices));
    }
  }
  
?>