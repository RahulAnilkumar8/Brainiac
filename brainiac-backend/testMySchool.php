<?php
// edit schema setup


$con = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);
// $good = mysqli_query($con, "ALTER TABLE student MODIFY pass longtext NOT NULL");
// echo var_dump($good);
$result = mysqli_query($con, "SELECT * FROM student");


echo var_dump(mysqli_fetch_all($result));
$con->close();
?>