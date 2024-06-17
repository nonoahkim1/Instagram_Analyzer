<!doctype html>
<html>
  <head>
    <title>Discussion!</title>
    <style>
      textarea {
        resize: none;
        width: 300px;
        height: 100px;
      }
      #missing {
        background-color: red;
        color: white;
        padding: 6px;
        width: 99%;
        font-weight: bold;
      }
      #title{
        margin-left: 35px;
        font-style: italic;
        font-weight: bold;
      }
      #search_form {
        position: absolute;
        right: 20px;
        top: 30px;
      }
      #search {
        width: 200px;
      }
      .hidden {
        display: none;
      }
    </style>
  </head>
  <body>
    <h1>Discussion!</h1>
    <?php
      if ($_GET['error'] == 'notfilledin') {
        print "<div id='missing'>Missing information, please try again</div>";
      }
    ?>
    <button id="addBtn">Add New Post</button>
    <form id="post_form" class='hidden' method="post" action="save.php">
      Username:
      <br>
      <input type="text" style="width: 300px" name="username">
      <br>
      Title:
      <br>
      <input type="text" style="width: 300px" name="title">
      <br>
      Question:
      <br>
      <textarea name="question"></textarea>
      <br>
      <input type="submit">
    </form>

    <hr>

    <?php

      // connect to databases
      include('config.php');

      date_default_timezone_set('America/New_York');

      // Sorting
      print "<a href=index.php?sort=oldest>Sort By Oldest</a>";
      print " - <a href=index.php?sort=newest>Sort By Newest</a>";

      // grab all posts
      $sql = "SELECT * FROM posts";

      // Sorting
      if ($_GET['sort'] == 'oldest') {
        $sql = "SELECT * FROM posts";
      }
      else if ($_GET['sort'] == 'newest') {
        $sql = "SELECT * FROM posts ORDER BY time DESC";
      }

      $result = $db->query($sql);

      // iterate over posts and display
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

     <form id="search_form" method="post" action="search.php">
       <input id="search" type="text" placeholder="search" name="keyword">
       <input type="submit">
     </form>

  </body>
  <script>
    const addBtn = document.getElementById("addBtn");
    const post_form = document.getElementById("post_form");
    addBtn.onclick = function() {
      post_form.classList.remove("hidden");
    }

  </script>
</html>
