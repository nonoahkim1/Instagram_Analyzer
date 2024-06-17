<?php

  // grab data from form
  $id = $_GET['id'];
  $username = $_POST['username'];
  $comment = $_POST['comment'];

  // connect to database!
  include('config.php');

  // validation
  if (!($username && $comment) ) {
    header("Location: view.php?id=" . $row['id'] . ".php?error=notfilledin");
    exit();
  }

  // if everything is OK, save the record into the database

  $now = time();

  $sql = "INSERT INTO comments (post_id, body, name, time)
          VALUES ('$id', '$comment', '$username', $now)";
  $db->query($sql);

  // send them back to index.php
  header("Location: view.php?id=" . $id);
  exit();
 ?>
