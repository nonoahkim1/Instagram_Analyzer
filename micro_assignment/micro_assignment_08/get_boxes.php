<?php

  // step 1: make sure that the file path in 'config.php' points to
  // your 'databases' folder!
  include('config.php');

  // step 2: open a database connection
  $db = new SQLite3($path.'/boxes.db');

  // step 3: write a SQL query to obtain all boxes
  $sql = "SELECT * FROM boxes ORDER BY id";

  // step 4: execute query and obtain results
  $results = $db->query($sql);

  // step 5: create an array to hold all of our results
  // (we are going to send this back to the client)
  $data_to_send_back = array();

  // step 5: iterate over results
  while ($row = $results->fetchArray()) {
    // construct an array to hold our data
    $data = array();
    $data['id'] = $row[0];
    $data['color'] = $row[1];

    // push it into the global array that we will send back
    array_push($data_to_send_back, $data);
  }

  // step 6: send data back by convering our array into a
  // JSON object.  JSON stands for JavaScript Object Notation and
  // is basically a string representation of a data structure
  // that can be transmitted to another program
  print json_encode($data_to_send_back);

 ?>
