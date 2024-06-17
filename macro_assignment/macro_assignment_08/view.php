<!doctype html>
<html>
  <head>
    <title>Discussion Forum</title>
    <style>
    textarea {
      resize: none;
      width: 300px;
      height: 100px;
    }
    #body {
      margin-left: 35px;
    }
    #comment {
      display: block;
      font-size: 1.2em;
      font-weight: bold;
      margin-bottom: 20px;
    }
    .hidden {
      display: none;
    }
    </style>
  </head>
  <body>
    <?php
      // grab the ID of the question
      $id = $_GET['id'];


      // connect to database!
      include('config.php');

      date_default_timezone_set('America/New_York');

      // run a query against the database that grabs this post
      $sql = "SELECT * FROM posts WHERE id = $id";
      $result = $db->query($sql);
      $row = $result->fetchArray();
      print "<a href=index.php>
      <h1>Discussion Forum:</a> <br> " . $row['title'] . "</h1>";
      ?>

      <hr>
      <p>Posted by <?php print $row['name']; ?> on <?php print date("F j, Y, g:i a", $row['time']); ?> </p>
      <p id="body"><?php print $row['body']; ?> </p>
      <a id="comment" href="#">Add Comment</a>

      <?php
        if ($_GET['error'] == 'notfilledin') {
          print "<div id='missing'>Missing information, please try again</div>";
        }
      ?>
      <?php
        $url = 'savecomment.php?id='. $id;
       ?>
      <form class="hidden" id="comment_form" method='post' action='<?=$url?>'>
        Username:
        <br>
        <input type="text" name="username">
        <br>
        Comment:
        <br>
        <textarea name="comment"></textarea>
        <br>
        <input type="submit">
      </form>

      <hr>
      <h3>Comments</h3>

      <?php
      // Sorting
      print "<a href=view.php?sort=oldest&id=". $id .">Sort By Oldest</a>";
      print " - <a href=view.php?sort=newest&id=". $id .">Sort By Newest</a>";

      // grab all posts
      $sql2 = "SELECT * FROM comments";

      // Sorting
      if ($_GET['sort'] == 'oldest') {
        $sql2 = "SELECT * FROM comments";
      }
      else if ($_GET['sort'] == 'newest') {
        $sql2 = "SELECT * FROM comments ORDER BY time DESC";
      }

      $result2 = $db->query($sql2);

      // iterate over posts and display
      while ($row2 = $result2->fetchArray() ) {
        if ($row2['post_id'] == $id) {
          ?>

          <div>
            <p>Posted by <?php print $row2['name']; ?> on <?php print date("F j, Y, g:i a", $row2['time']); ?> </p>
            <p>Comment: <?php print $row2['body']; ?></p>
          </div>
          <hr>
          <?php
        }
      }
      ?>

  </body>
  <script>
    const comment = document.getElementById("comment");
    const comment_form = document.getElementById("comment_form");


    comment.onclick = function() {
      comment_form.classList.remove("hidden");
    }

  </script>
</html>
