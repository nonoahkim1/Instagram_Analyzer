// when you do this require, you get a function back
const express = require('express');

const path = require('path');

// this is where we will stash our static files
// path.resolve will construct this path using the current
// directory name and public
const publicPath = path.resolve(__dirname, 'public');





// use function to create application object
// (web application, allows you to serve web pages)
const app = express();

// sets the templating system for our express app (default is pug, but we
// want handlebars
app.set('view engine', 'hbs');


// middleware .... just a function that can be called before or after regular route 
// handling to manipulate the req object, the res object, or circumvent regular
// route handling by responding directly
// to activate / register middleware, call app.use... 
// signature is flexible (path, fn)... or just (fn)
// activate express static middleware:
// 1. look at path in req object
// 2. see if path exists within our static file folder (publicPath)
// 3. if it does formulate the response (set appropriate headers, status code)
//    for the file found (if it's an image, serve image/png, send back 200)
// 4. if it doesn't find it, go ahead with regular route handling
app.use(express.static(publicPath));



// add paths that our app will respond to
// pika homer
// app object ... will how you add paths, do configuration, add middleware, etc.
// app.get adds a new route:
// * 1st arg is path to support
// * 2nd arg is callback function
//  * arguments... are request and response object
//  * these two object are passed over to your callback from your app when a
//  * request is received for that path
//  * these objects have methods and props that have to do w http request and response
//  * req.path, res.send()....
//  I'm look for a request /pika..... that's GET request
app.get('/pika', (req, res) => {
  // body as argument.... and it sends back a response and closes connection
  // it'll do its best to guess the content type
  // by default, it'll send 200 OK
  res.send("<h1>pika</h1>");
});

// this will handle only post requests
// app.post()


/*
app.get('/homer', (req, res) => {
  res.send(');
});
*/


app.get('/mabel', (req, res) => {
  // set a header where first is header name, and second is val
  res.set('X-foo', 'bar');
  // status allows us to eplicitly set status
  // status gives back itself (response object) so you can chain commands
  // off of it
  // res.status(200).send('mabel')
  // look in views for template called mabel.hbs
  // 2nd argument is object
  // dictates the values of your template variables
  // in your template, you can use prop names to drop values from object into 
  // template
  res.render('mabel', {"characterName": "does this work? Mabel", "show":"gravity falls"});
});








// make sure to listen to bind to a port
app.listen(3000);





