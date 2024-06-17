<!DOCTYPE html>
<html lang="en-us">
  <head>
    <title>Micro 06</title>
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
    ?>

    <form action="micro06_process.php" method="POST">
      Username: <input type="text" name="username"><br>
      Password: <input type="text" name="password"><br>
      <input type="submit" value="Log in">
    </form>
    <?php
      if ($_GET["login"]) {
        print "SUCESSFULLY LOGGED IN";
        print "△🞅🞑";
      }
    ?>
  </body>
</html>
