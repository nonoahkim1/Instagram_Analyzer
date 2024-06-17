<?php

  // open database
  $db = new SQLite3('/home/ydk222/databases/chat.db');

  $room = $_POST['room'];

  //print $room;
  // grab all messages from db


  if ($room == "webdev") {
    $sql = "SELECT * FROM chats WHERE room='webdev'";
  }
  elseif ($room == "interactive") {
    $sql = "SELECT * FROM chats WHERE room='interactive'";
  }
  elseif ($room == "drawing") {
    $sql = "SELECT * FROM chats WHERE room='drawing'";
  }
  else {
    $sql = "SELECT * FROM chats";
  }
  //print $sql;

  $results = $db->query($sql);

  $return_array = array();

  while ($row = $results->fetchArray()) {

    $result_array = array();
    $result_array['id'] = $row['id'];
    $result_array['name'] = $row['name'];

    $result_array['message'] = html_entity_decode(stripslashes($row['message']));

    array_push($return_array, $result_array);

  }

  print json_encode($return_array);


  // package up and send to client


  exit();
 ?>
