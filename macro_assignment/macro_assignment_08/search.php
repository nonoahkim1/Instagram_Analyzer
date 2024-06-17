<!doctype html>
<html>
  <head>
    <title>Discussion Search</title>
  </head>
  <body>
    <?php
    // grab data from form
    $keyword = $_POST['keyword'];

    print "<a href=index.php>
    <h1>Discussion!</a> <br> Search: $keyword </h1>";
    ?>
    <hr>

    <?php


    // connect to database!
    include('config.php');

    date_default_timezone_set('America/New_York');

    // validation
    if (!$keyword) {
      header("Location: index.php");
      exit();
    }

    print "<h2>Posts:</h2>";
    $sql = "SELECT * FROM posts WHERE body LIKE '%$keyword%'";
    $result = $db->query($sql);

    while ($row = $result->fetchArray()) {
      ?>
      <div>
        <p>Posted by <?php print $row['name']; ?> on <?php print date("F j, Y, g:i a", $row['time']); ?> </p>
        <p id="title">Title: <?php print $row['title']; ?>
        <?php print " - <a href=view.php?id=" . $row['id'] . ">expand</a>";?></p>
      </div>
      <hr>
      <?php
    }

     ?>
     <?php
     print "<h2>Comments:</h2>";
     $sql2 = "SELECT * FROM comments WHERE body LIKE '%$keyword%'";
     $result2 = $db->query($sql2);

     while ($row2 = $result2->fetchArray() ) {
       ?>

       <div>
         <p>Posted by <?php print $row2['name']; ?> on <?php print date("F j, Y, g:i a", $row2['time']); ?> </p>
         <p>Comment: <?php print $row2['body']; ?></p>
       </div>
       <hr>
       <?php
     }
     ?>

     <?php
     print "<h2>Username:</h2>";
     $sql3 = "SELECT * FROM posts WHERE name LIKE '%$keyword%'";
     $result3 = $db->query($sql3);

     while ($row3 = $result3->fetchArray()) {
       ?>
       <div>
         <p>Posted by <?php print $row3['name']; ?> on <?php print date("F j, Y, g:i a", $row3['time']); ?> </p>
         <p id="title">Title: <?php print $row3['title']; ?>
         <?php print " - <a href=view.php?id=" . $row3['id'] . ">expand</a>";?></p>
       </div>
       <hr>
       <?php
     }
     ?>
     
  </body>
</html>
