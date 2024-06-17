<?php

  include("config.php");

  $u = $_POST['u'];
  $p = $_POST['p'];

  if (!$u || !$p) {
    print "missing";
    exit();
  }

  $p = md5($p . $salt);

  $sql = "SELECT * FROM users WHERE (username = '$u')";
  $result = $db->query($sql)->fetchArray();

  if ($result) {
    print "duplicate";
    exit();
  }

  $sql = "INSERT INTO users (username, password) VALUES ('$u', '$p')";
  $db->query($sql);
  print "success";
  exit();

 ?>
