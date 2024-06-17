let now = new Date();
let minutes = now.getMinutes();
let hours = now.getHours();
let period;
let greeting;
let day;

//ask for number input
let input = prompt("Enter a positive number greater than or equal to 3: ");
while (isNaN(input) || parseInt(input) < 3) {
  input = prompt("Enter a positive number greater than or equal to 3: ");
}
input = parseInt(input);
// array of words to choose from
const words = ['Awesome', 'Fantastic', 'Fabulous', 'Superb', 'Perfect', 'Brilliant', 'Coming up Roses'];

// pick a random word from the array
let index = parseInt( Math.random() * words.length );

// generate the necessary title for the page
document.getElementById('everything').innerHTML = `Everything is ${words[index]}!`;

//set period
if (hours > 12) {
  period = "pm";
}
else {
  period = "am";
}

// set greetings
if (period =="am" && hours < 6) {
  greeting = "Good Night!";
  day = "images/backgrounds/night.png";
}
else if (period == "am" && hours >= 6) {
  greeting = "Good Morning!";
  day = "images/backgrounds/morning.png";
}
else if (period == "pm" && hours < 18) {
  greeting = "Good Afternoon!";
  day = "images/backgrounds/afternoon.png";
}
else if (period == "pm" && hours >= 18) {
  greeting = "Good Evening!";
  day = "images/backgrounds/evening.png";
}

// change hour 0 to hour 12
if (hours == 0) {
  hours = 12;
}

//adjust time to 12 o clock
if (hours > 12) {
  hours -= 12;
}


// change the backgound according to time
document.getElementById("background").src = `${day}`;

// generate random lucky number
let lucky_number = [];
for (let i = 0; i < 3; i++) {
  let random_number = Math.floor(Math.random() * (input+1));
  while (lucky_number.includes(random_number) ) {
    random_number = Math.floor(Math.random() * (input+1));
  }
  lucky_number.push(random_number);
}

// display time, greeting, and lucky numbers
document.getElementById('timeAndNumber').innerHTML =
`The time is currently ${hours}:${minutes}${period} - ${greeting} <br/>
Your three lucky numbers today are ${lucky_number[0]}, ${lucky_number[1]}, and ${lucky_number[2]}`;

//change lego head
let random_head = Math.floor(Math.random() * (6) + 1);
document.getElementById("legohead").src = `images/heads/head${random_head}.png`;

//change lego body
let random_body = Math.floor(Math.random() * (6) + 1);
document.getElementById("legobody").src = `images/bodies/body${random_body}.png`;

//change lego body
let random_helmet = Math.floor(Math.random() * (4) + 1);
document.getElementById("helmet").src = `images/helmets/helmet${random_helmet}.png`;
