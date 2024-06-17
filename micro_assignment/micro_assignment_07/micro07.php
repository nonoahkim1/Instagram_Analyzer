<!DOCTYPE html>
<html lang="en-us">
  <head>
    <title>Micro 07</title>
    <meta charset="utf-8">
    <style type="text/css">
      .number {
        width: 50px;
        height: 50px;
        font-size: 200%;
        font-family: monospace;
      }
    </style>
  </head>

  <body>
    <h1>Login</h1>

    <?php
      if ($_GET["username_error"]) {
        print "FILL OUT THE USERNAME";
      }
      else if ($_GET["password_error"]) {
        print "FILL OUT THE PASSWORD";
      }
      else if ($_GET["login_error"]) {
        print "USERNAME OR PASSWORD IS INCORRECT";
      }

      if ($_GET["login"] || $_COOKIE['login'] ) {
        if ($_GET["login"] ) {
          print "SUCESSFULLY LOGGED IN";
          print "△🞅🞑";

          $filename = getcwd() . "/data/loginLog.txt";
          $data = "successful\n";
          file_put_contents($filename, $data, FILE_APPEND);
        }
        // I wasn't sure if we were supposed to write in text file of successful login
        // if cookies were present so I designed so that when the user accesses the
        // page and has login cookie, it will write successful login in login text.
        else if ($_COOKIE['login'] ) {
          print "you are logged in";

          $filename = getcwd() . "/data/loginLog.txt";
          $data = "successful\n";
          file_put_contents($filename, $data, FILE_APPEND);
        }
      }
      else {
    ?>
    <form action="micro07_process.php" method="POST">
      Username: <input type="text" name="username"><br>
      Password: <input type="text" name="password"><br>
      <input type="submit" value="Log in">
    </form>
    <?php
        }
     ?>
  </body>
</html>
