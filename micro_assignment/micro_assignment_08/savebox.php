<?php

  // do we have the necessary data?
  $color = $_POST['color'];
  if (!isset($color)) {
    print "error";
    exit();
  }

  // step 1: make sure that the file path in 'config.php' points to
  // your 'databases' folder!
  include('config.php');

  // step 2: open a database connection
  $db = new SQLite3($path.'/boxes.db');

  // step 3: write a SQL query to save this box
  $sql = "INSERT INTO boxes (color) VALUES ('$color')";

  // step 4: execute the query
  $result = $db->query($sql);

  // step 5: did the query work?
  $rows_affected = $db->changes();
  if (!$rows_affected) {
    print "error";
    exit();
  }
  else {
    print "success";
    exit();
  }
?>
