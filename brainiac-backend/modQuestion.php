<?php



// Change question or delete question
// edit schema setup

  
  $question = json_decode($_REQUEST["data"]);
  //question, type, answer, option1, option2, option3, course_id, question_id, topic
  
  
  $con = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);
  
  if(!$question->remove){
    $result = mysqli_query($con, 'UPDATE question SET question="'.$question->question.'", type="'.$question->type .'", answer="'.$question->answer .'", option1='.($question->option1?'"'.$question->option1 .'"':'NULL').', option2='.($question->option1?'"'.$question->option2 .'"':'NULL').', option3='.($question->option3?'"'.$question->option3 .'"':'NULL').'course_id='.$question->course_id .', topic='.$question->topic .' WHERE question_id='.$question->question_id);
  } else {
      $result = mysqli_query($con, 'DELETE FROM question WHERE question_id='.$question->question_id);
  }
  if(!$result || mysqli_num_rows($result) == 0){
    // no courses or mysql failure
    echo "false";
  } else {
    echo true;
  }
?>