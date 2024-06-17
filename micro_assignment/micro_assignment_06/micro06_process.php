<?php

  $correct_username = "pikachu";
  $correct_password = "pokemon";

  $username = $_POST['username'];
  $password = $_POST['password'];

  if (!$username) {
    header('Location: micro06.php?username_error=true');
  }
  else if (!$password) {
    header('Location: micro06.php?password_error=true');
  }
  else if ($username == "pikachu" && $password == "pokemon") {
    header('Location: micro06.php?login=true');
  }
  else {
    header('Location: micro06.php?login_error=true');
  }

?>
