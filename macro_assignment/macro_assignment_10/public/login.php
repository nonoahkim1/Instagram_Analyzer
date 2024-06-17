<?php

  include("config.php");

  $u = $_POST['u'];
  $p = $_POST['p'];

  if (!$u || !$p) {
    print "missing";
    exit();
  }

  $p = md5($p . $salt);

  $sql = "SELECT * FROM users WHERE (username = '$u' and password = '$p')";
  $result = $db->query($sql)->fetchArray();

  if (!$result) {
    print "error";
    exit();
  }

  session_start();
  session_regenerate_id();
  $_SESSION['username'] = $u;

  print "success";
  exit();

 ?>
