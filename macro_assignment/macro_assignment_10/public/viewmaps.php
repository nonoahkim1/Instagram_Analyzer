<!doctype html>
<html lang="en-us">
  <head>
    <title>Design Your own Hogwarts!</title>
    <style type="text/css">
      #canvas {
        width: 320px;
        height: 320px;
        border: 1px solid black;
        float: left;
        margin: 10px;
      }
      .box {
        width: 32px;
        height: 32px;
        float: left;
        box-sizing: border-box;
      }
      </style>
  </head>

  <body>
    <a href="index.php"><h1>Design Your Own Hogwarts!</h1></a>
    <hr>
    <?php
    $db = new SQLite3('/home/ydk222/databases/maps.db');
    $sql = "SELECT * FROM maps";
    $result = $db->query($sql);
    while ($row = $result->fetchArray() ) {
      ?>
      <div id="canvas">
      <?php
      $split_source = explode("Blank", $row['source']);
      //print count($split_source);
      for ($x=0; $x < count($split_source); $x++) {
        ?>

        <?php
        if ($split_source[$x] == "") {
          print "<div class='box'></div>";

        }
        else {
          //print $split_source[$x];
          //print "<br>";
          print "<div class='box'><img src='$split_source[$x]'></div>";
        }

        //print $split_source[$x];
      }
      ?>
      </div>
      <?php
    }
     ?>
  </body>
</html>
