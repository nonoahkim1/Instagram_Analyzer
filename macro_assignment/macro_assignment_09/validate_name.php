<?php

  // get the data from the client
  $name = $_POST['name'];

  // check it
  if (!isset($name)) {
    print "missing";
    exit();
  }

  if (strlen($name) >= 5 && ctype_alnum($name)) {
    print "valid";
    exit();
  }

  print "invalid";
  exit();

 ?>
