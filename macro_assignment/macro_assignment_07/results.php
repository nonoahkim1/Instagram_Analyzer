<!doctype html>
<style>
  body {
    background-image: url('images/background.webp');
  }
  h1, p, div {
    color: white;
    font-family: "Lucida Console", "Courier New", monospace;
    font-size: 3em;
  }
  p {
    font-size: 2em;
    color: blue;
  }
  div {

  }
</style>
<?php

  // open the file for reading so we can grab the data
  $filename = getcwd() . "/data/votes.txt";
  $data = file_get_contents($filename);

  // figure out the totals for each character
  $lines = explode("\n", $data);

  $homer = 0;
  $marge = 0;
  $bart = 0;
  $lisa = 0;

  for ($i = 0; $i < sizeof($lines); $i++) {
    if ($lines[$i] == "Homer") {
      $homer++;
    }
    else if ($lines[$i] == "Marge") {
      $marge++;
    }
    else if ($lines[$i] == "Bart") {
      $bart++;
    }
    else if ($lines[$i] == "Lisa") {
      $lisa++;
    }
  }

  $homer_width = round($homer/sizeof($lines) * 100, 2);
  $marge_width = round($marge/sizeof($lines) * 100, 2);
  $bart_width = round($bart/sizeof($lines) * 100, 2);
  $lisa_width = round($lisa/sizeof($lines) * 100, 2);
  $vw = "vw";
  $homer_width .= "%";
  $marge_width .= "%";
  $bart_width .= "%";
  $lisa_width .= "%";

  print "<h1>Simpsons Quiz Results</h1>";
  print "<p>In total there have been ". sizeof($lines) ." quiz submissions.</p>";
  print "";

  print "<div style='background-color: lightblue; height:100px; width: $homer_width'>Homer: $homer_width</div>";
  print "<div style='background-color: gray; height:100px; width: $marge_width'>Marge: $marge_width</div>";
  print "<div style='background-color: lightpink; height:100px; width: $bart_width'>Bart: $bart_width</div>";
  print "<div style='background-color: lightgreen; height:100px; width: $lisa_width'>Lisa: $lisa_width</div>";
  


  // display actual results as a bar chart
 ?>

 <a href="quiz.php">Back to Quiz</a>
