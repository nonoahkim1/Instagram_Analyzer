<?php
  
  // open database
  $db = new SQLite3('/home/ydk222/databases/maps.db');

  // get post variables
  $filename = $_POST['filename'];
  $source = $_POST['source'];

  $split_source = explode("Blank", $source);

  // make sure there's a message here
  if (strlen($filename) > 0) {

    //$now = time();

    // add to database
    $sql = "INSERT INTO maps (filename, source) VALUES ('$filename', '$source')";
    //print $sql;
    $db->query($sql);

    print "success";
    exit();
  }
  print "fail";
  exit();


 ?>
