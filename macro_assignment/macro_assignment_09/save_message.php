<?php

  // open database
  $db = new SQLite3('/home/ydk222/databases/chat.db');

  // get post variables
  $room = $_POST['room'];
  $name = $_POST['name'];
  $message = $_POST['message'];

  // make sure there's a message here
  if (strlen($message) > 0) {
    // filter
    $sql1 = "SELECT * FROM filter";
    $result1 = $db->query($sql1);

    while ($row = $result1->fetchArray()) {

      if (strpos($message, $row['word']) !== false) {
        print "filtered";
        exit();
      }
    }


    // add to database
    $message = $db->escapeString(addslashes(htmlspecialchars($message)));

    $sql = "INSERT INTO chats (room, name, message) VALUES ('$room', '$name', '$message')";
    //print $sql;
    $db->query($sql);

    print "success";
    exit();
  }
  print "fail";
  exit();


 ?>
