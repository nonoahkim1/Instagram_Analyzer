<?php

  // grab data from form
  $username = $_POST['username'];
  $title = $_POST['title'];
  $question = $_POST['question'];

  // connect to database!
  include('config.php');

  // validation
  if (!($username && $title && $question) ) {
    header("Location: index.php?error=notfilledin");
    exit();
  }

  // if everything is OK, save the record into
  // the database
  $now = time();

  $sql = "INSERT INTO posts (title, body, name, time) VALUES ('$title', '$question', '$username', $now)";
  $db->query($sql);

  // send them back to index.php
  header("Location: index.php");
  exit();
 ?>
