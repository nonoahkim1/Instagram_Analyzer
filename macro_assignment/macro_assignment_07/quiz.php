<!doctype html>
<html>
  <head>
    <title>Quiz!</title>
    <style>
      body {
        background-image: url('images/background.webp');
      }
      h1 {
        font-size: 3em;
      }
      p, a, select {
        font-family: Arial, Helvetica, sans-serif; 
        font-size: 2em;
      }
      select {
        font-size: 0.9em;
      }
      form {
        background-color: rgba(255,255,255, 0.7);
        padding: 10px;
      }
      a {
        margin: 20px;
        background-color: rgba(255,255,255, 1);
        font-size: 1.5em;
      }
    </style>
  </head>

  <body>
    <h1>Which Simpson Character Am I?</h1>

    <?php

      if ($_GET['error'] == 'notfilledin') {
        print "<p style='color: white; '>Error! Fill in the form</p>";
      }

      if ($_COOKIE['choice']) {
        print "<p style='color: purple; background-color: rgba(255,255,255, 0.7)'>You are " . $_COOKIE['choice']."</p>";
        print '<img src="images/' .  $_COOKIE['choice'] . '.png">';
        print '<a href=tryagain.php>Try again</a>';
      }
      else {

     ?>

    <form method="POST" action="save.php">
     <p>
        What's your ideal job?<br>
        <select name="job" id="job">
          <option value="">Select a job</option>
          <option value="homer">Working at a bakery</option>
          <option value="marge">French tutor</option>
          <option value="bart">Prank phone call specialist</option>
          <option value="lisa">College professor</option>
        </select>
      </p>

      <p>What is your favorite food?<br>
        <select name="food" id="food">
          <option value="">Select a food</option>
          <option value="homer">Donuts</option>
          <option value="marge">Apple pie</option>
          <option value="bart">Krusty Flakes</option>
          <option value="lisa">Anything organic and locally sourced</option>
        </select>
      </p>

      <p>What is your favorite hobby?<br>
        <select name="hobby" id="hobby">
          <option value="">Select a hobby</option>
          <option value="homer">Watching TV</option>
          <option value="marge">Knitting</option>
          <option value="bart">Skateboarding</option>
          <option value="lisa">Reading</option>
        </select>
      </p>

      <p>What is your biggest fear?<br>
        <select name="fear" id="fear">
          <option value="">Select a fear</option>
          <option value="homer">Sock puppets</option>
          <option value="marge">Flying</option>
          <option value="bart">I'm fearless, man</option>
          <option value="lisa">Getting anything below an A in school</option>
        </select>
      </p>

      <input type="submit">
    </form>

    <?php

        }

     ?>


    <a href="results.php">Click here for results</a>

  </body>
</html>