<!doctype html>
<html>
  <head>
    <title>Let's Chat</title>

    <!-- bring in the jQuery library -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js" integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=" crossorigin="anonymous"></script>

    <!-- custom styles -->
    <style>
    body {
      text-align: center;
      background-image: url("background.png");
    }
      #chat_log {
        display: block;
        margin: auto;
        width: 500px;
        height: 300px;
      }
      .hidden {
        display: none;
      }
      h1 {
        text-align: center;
      }
      #error_message, #error_message2, #error_message3{
        color: red;
      }
      #message {
        width: 390px;
      }
    </style>
  </head>
  <body>
    <h1>Let's Chat</h1>

    <div id="panel_name">
      <h2>Login</h2>
      <p>Select a username (5 or more alpha-numeric characters):</p>
      Name: <input type="text" id="username">
      <button id="button_save">Let's Chat!</button>
      <div id="error_message"></div>
    </div>





    <div id="panel_chat" class="hidden">

      <div id="change_room">
        Select chat room!
        <select id="chat_room" name="chat_room">
          <option value="webdev">Web Development</option>
          <option value="interactive">Interactive Computing</option>
          <option value="drawing">Drawing on the Web</option>
        </select>
      </div>
      <input type="text" id="changed_username">
      <button id="change_username">Change Username</button>

      <textarea readonly id="chat_log"></textarea>
      <input type="text" id="message">
      <button id="button_send">Send Message</button>
      <div class="hidden" id="error_message2">Invalid Messages, try again</div>
      <div class="hidden" id="error_message3">Inappropriate word, try again</div>
    </div>

    <script>
      let selectedName;

      $(document).ready(function() {


        // DOM refs
        let panel_name = document.getElementById('panel_name');
        let username = document.getElementById('username');
        let button_save = document.getElementById('button_save');
        let panel_chat = document.getElementById('panel_chat');
        let chat_log = document.getElementById('chat_log');
        let message = document.getElementById('message');
        let button_send = document.getElementById('button_send');
        let error_message = document.getElementById('error_message');
        let error_message2 = document.getElementById('error_message2');
        let error_message3 = document.getElementById('error_message3');
        let chat_room = document.getElementById('chat_room');
        let change_username = document.getElementById('change_username');
        let changed_username = document.getElementById('changed_username');

        <?php
        date_default_timezone_set('America/New_York');
        ?>

        if (window.localStorage.getItem("username") !== null){
          panel_name.classList.add('hidden');
          panel_chat.classList.remove('hidden');
        }

        change_username.onclick = function() {
          if (changed_username.value.length >= 5) {
            selectedName = changed_username.value;
            window.localStorage.setItem("username", selectedName);
          }

          //console.log(selectedName)
        }

        button_save.addEventListener('click', function() {
          // validate the user's name using an AJAX call to the server
          $.ajax({
            url: 'validate_name.php',
            type: 'post',
            data: {
              name: username.value
            },
            success: function(data, status) {
              //console.log(data)
              if (data == 'valid') {
                selectedName = username.value;
                window.localStorage.setItem("username", selectedName);
                panel_name.classList.add('hidden');
                panel_chat.classList.remove('hidden');
              }
              else {
                error_message.innerHTML = "Invalid username, try again";
              }
            }
          });

          // if valid, hide the panel_name panel and show the
          // panel_chat panel


        })

        function save() {
          //console.log(selectedName);
          // make an ajax call to the server to save the message
          $.ajax({
            url: 'save_message.php',
            type: 'post',
            data: {
              room: chat_room.value,
              name: selectedName,
              message: message.value
            },
            success: function(data, status) {
              console.log(data)
              if (data == "success") {
                error_message2.classList.add("hidden");
                error_message3.classList.add("hidden");
                chat_log.value += selectedName + ': ' + message.value + "\n";
                message.value = "";
              }
              else if (data == "fail") {
                error_message2.classList.remove("hidden");
              }
              else if (data == "filtered") {
                error_message3.classList.remove("hidden");
              }
            }
          });
          // when it's successful we should add the message to
          // the chat log so we can see it
        }

        document.addEventListener('keypress', function(e) {
          if (e.key === "Enter") {
            save();
            message.value = "";
          }
        });

        button_send.addEventListener('click', save);
        function getData() {

          $.ajax({
            url: 'get_messages.php',
            type: 'post',
            data: {
              room: chat_room.value
            },
            success: function(data, status) {
              let parsed = JSON.parse(data);
              //console.log(data)
              let newChatroom = '';
              for (let i = 0; i < parsed.length; i++) {
                /*if (chatroom.value == "webdev" && pased[i].room == "webdev") {
                  newChatroom += parsed[i].name + ': ' + parsed[i].message + "\n";
                }*/
                newChatroom += parsed[i].name + ': ' + parsed[i].message + "\n";

              }
              chat_log.value = newChatroom;

              setTimeout(function() {
                getData();
                chat_log.onmouseout = function() {
                  chat_log.scrollTop = chat_log.scrollHeight;
                }

              }, 2000 );
            }
          })

        }

        getData();

      });

    </script>

  </body>
</html>
