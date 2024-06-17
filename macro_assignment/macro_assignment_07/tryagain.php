<?php

  // destory the cookie
  setcookie('choice', '', time()-3600);

  // send them back to the form
  header("Location: quiz.php");
  exit();

 ?>