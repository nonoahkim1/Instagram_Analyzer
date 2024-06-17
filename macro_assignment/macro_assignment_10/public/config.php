<?php

  // secret salt for hashing passwords
  $salt = "12345";

  // define file path - you will need to change this when
  // you upload your code to i6!
  $path = '/home/ydk222/databases';

  // open our database
  $db = new SQLite3("$path/database.db");

 ?>
