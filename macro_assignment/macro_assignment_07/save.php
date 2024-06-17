<?php

  // grab the incoming data
  $job = $_POST['job'];
  $food = $_POST['food'];
  $hobby = $_POST['hobby'];
  $fear = $_POST['fear'];

  // make sure the data is valid
  if (strlen($job) == 0 || strlen($food) == 0 || strlen($hobby) == 0 || strlen($fear) == 0) {
    header('Location: quiz.php?error=notfilledin');
    exit();
  }

  // figure out which character they are
  $homer = 0;
  $bart = 0;
  $marge = 0;
  $lisa = 0;
  if ($job == 'homer') {
    $homer++;
  }
  else if ($job == 'bart') {
    $bart++;
  }
  else if ($job == 'marge') {
    $marge++;
  }
  else if ($job == 'lisa') {
    $lisa++;
  }

  if ($food == 'homer') {
    $homer++;
  }
  else if ($food == 'bart') {
    $bart++;
  }
  else if ($food == 'marge') {
    $marge++;
  }
  else if ($food == 'lisa') {
    $lisa++;
  }

  if ($hobby == 'homer') {
    $homer++;
  }
  else if ($hobby == 'bart') {
    $bart++;
  }
  else if ($hobby == 'marge') {
    $marge++;
  }
  else if ($hobby == 'lisa') {
    $lisa++;
  }

  if ($fear == 'homer') {
    $homer++;
  }
  else if ($fear == 'bart') {
    $bart++;
  }
  else if ($fear == 'marge') {
    $marge++;
  }
  else if ($fear == 'lisa') {
    $lisa++;
  }

  if ($homer >= $bart && $homer >= $marge && $homer >= $lisa) {
    $choice = "Homer";
  }
  else if ($bart >= $homer && $bart >= $marge && $bart >= $lisa) {
    $choice = "Bart";
  }
  else if ($marge >= $homer && $marge >= $bart && $marge >= $lisa) {
    $choice = "Marge";
  }
  else if ($lisa >= $homer && $lisa >= $bart && $lisa >= $marge) {
    $choice = "Lisa";
  }

  // if valid, save into a file for later use
  $filename = getcwd() . "/data/votes.txt";
  $data = "$choice\n";
  file_put_contents($filename, $data, FILE_APPEND);

  // drop a cookie on the client's computer to remember that
  // they filled out the form
  setcookie('choice', $choice);

  // send them back to the quiz
  header("Location: quiz.php");
  exit();
 ?>