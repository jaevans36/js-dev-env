import express from 'express';
import path from 'path';
import open from 'open';
import compression from 'compression';

/* eslint-disable no-console */

const port = 3000;
const app = express();

app.use(compression()); // This is not for actual production, but is useful for hosting the minified production build locally for debugging
app.use(express.static('dist'));

app.get('/', function (req, res){
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.get('/users', function(req, res) {
  // Hard coding for simplicity. Pretend this hits a real/production database
  res.json([
    {"id": 1,"firstName":"Jay","lastName":"Evans","email":"jaymail@gmail.com"},
    {"id": 2,"firstName":"Jade","lastName":"Evans","email":"jademail@gmail.com"},
    {"id": 3,"firstName":"David","lastName":"Evans","email":"davidmail@gmail.com"}
  ]);
});

app.listen(port, function(err) {
  if (err) {
    console.log(err);
  } else {
    open('http://localhost:' + port);
  }
});
