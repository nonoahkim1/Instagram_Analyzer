<?php
  // send them away if they aren't logged in
  if (!$_COOKIE['PHPSESSID']) {
    header('Location: index_notloggedin.php');
    exit();
  }
  session_start();
 ?><!doctype html>
<html>
  <head>
    <title>Your Application</title>

    <!-- bring in the jQuery library -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js" integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=" crossorigin="anonymous"></script>

    <!-- custom styles -->
    <style>
      body {
        font-family: sans-serif;
      }
    </style>
  </head>
  <body>
    <h1>Your Application</h1>

    <div id="buttons">
      <a href="logout.php"><button id="logout">Logout</button></a>
    </div>

  </body>
</html>
