<?php

  $correct_username = "pikachu";
  $correct_password = "pokemon";

  $username = $_POST['username'];
  $password = $_POST['password'];

  $filename = getcwd() . "/data/loginLog.txt";

   if (!$username) {
    $data = "missing\n";
    file_put_contents($filename, $data, FILE_APPEND);
    if ($_COOKIE['login'] ) {
      setcookie('login', '', time()-3600);
    }
    header('Location: micro07.php?username_error=true');
    exit();
  }
  else if (!$password) {
    $data = "missing\n";
    file_put_contents($filename, $data, FILE_APPEND);
    if ($_COOKIE['login'] ) {
      setcookie('login', '', time()-3600);
    }
    header('Location: micro07.php?password_error=true');
    exit();
  }
  else if ($username == "pikachu" && $password == "pokemon") {
    $boolean = true;
    setcookie('login', $boolean);
    //$data = "successful\n";
    //file_put_contents($filename, $data, FILE_APPEND);
    header('Location: micro07.php?login=true');
    exit();
  }
  else {
    $data = "unsuccessful\n";
    file_put_contents($filename, $data, FILE_APPEND);
    if ($_COOKIE['login'] ) {
      setcookie('login', '', time()-3600);
    }
    header('Location: micro07.php?login_error=true');
    exit();
  }

?>
