<?php
  // send them away if they aren't logged in
  if ($_COOKIE['PHPSESSID']) {
    header('Location: index_loggedin.php');
    exit();
  }
 ?><!doctype html>
<html>
  <head>
    <title>Log in to Design Your Own Hogwarts!</title>

    <!-- bring in the jQuery library -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js" integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=" crossorigin="anonymous"></script>

    <!-- custom styles -->
    <style>
      body {
        font-family: sans-serif;
      }

      .hidden {
        display: none;
      }

      .error {
        color: red;
      }

      .confirmation {
        color: green;
      }

    </style>
  </head>
  <body>
    <h1>Log in to Design Your Own Hogwarts!</h1>

    <div id="buttons">
      <button id="button_login">Log In</button>
      <button id="button_register">Register</button>
    </div>

    <div id="panel_login" class="hidden">
      <h2>Login</h2>
      <div>
        Username:<br>
        <input type="text" id="login_username">
      </div>
      <div>
        Password:<br>
        <input type="text" id="login_password">
        <button id="button_process_login">Log In</button>
        <div class="error hidden" id="login_error">Login failed</div>
      </div>
    </div>

    <div id="panel_register" class="hidden">
      <h2>Register</h2>
      <div>
        Username:<br>
        <input type="text" id="register_username">
      </div>
      <div>
        Password:<br>
        <input type="text" id="register_password">
        <button id="button_save_register">Log In</button>
      </div>
      <div class="error hidden" id="register_error">Registration failed</div>
      <div class="confirmation hidden" id="register_confirmation">Registration successful.  Click the "Log In" button to log into the system.</div>
    </div>

    <script>

      $(document).ready(function() {

        let button_register = document.getElementById('button_register');
        let button_login = document.getElementById('button_login');

        let panel_register = document.getElementById('panel_register');
        let register_username = document.getElementById('register_username');
        let register_password = document.getElementById('register_password');
        let button_save_register = document.getElementById('button_save_register');
        let register_confirmation = document.getElementById('register_confirmation');
        let register_error = document.getElementById('register_error');

        let panel_login = document.getElementById('panel_login');
        let login_username = document.getElementById('login_username');
        let login_password = document.getElementById('login_password');
        let button_process_login = document.getElementById('button_process_login');
        let login_error = document.getElementById('login_error');


        // toggle register / login panels
        button_register.addEventListener('click', function(e) {
          panel_register.classList.remove('hidden');
          panel_login.classList.add('hidden');
        });

        button_login.addEventListener('click', function(e) {
          panel_register.classList.add('hidden');
          panel_login.classList.remove('hidden');
        });

        // save registration
        button_save_register.addEventListener('click', function(e) {
          $.ajax({
            url: 'register.php',
            type: 'post',
            data: {
              u: register_username.value,
              p: register_password.value
            },
            success: function(data, status) {
              console.log(data);
              if (data == 'success') {
                register_error.classList.add('hidden');
                register_confirmation.classList.remove('hidden');
              }
              else {
                register_error.classList.remove('hidden');
                register_confirmation.classList.add('hidden');
              }
            }
          });
        });


        // save login
        button_process_login.addEventListener('click', function(e) {

          $.ajax({
            url: 'login.php',
            type: 'post',
            data: {
              u: login_username.value,
              p: login_password.value
            },
            success: function(data, status) {
              if (data == 'success') {
                // redirect the user to the application
                <?php
                include("config.php");
                $sql = "SELECT * FROM users WHERE (username = '$u')";
                $result = $db->query($sql)->fetchArray();
                $id = $result['password'];
                ?>

                location.href = "index.php?id='$id'>";
              }
              else {
                login_error.classList.remove('hidden');
              }
            }
          });

        });


      });

    </script>

  </body>
</html>
