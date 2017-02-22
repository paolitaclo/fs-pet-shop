'use stric';

let fs = require('fs');
let express = require('express');
let app = express();
let port = process.env.PORT || 8000;

app.disable('x-powered-by');

app.get('/pets', function (req, res) {
  res.header("Content-Type", "application/json");
  fs.readFile('./pets.json', function (err, petsJSON){
    if (err) {
      console.error(err.stack);
      return res.sendStatus(500);
    }
    let pets = JSON.parse(petsJSON);
    res.send(pets);
  });
});

app.get('/pets/:id', function (req, res) {
  res.header("Content-Type", "application/json");
  fs.readFile('./pets.json', function (err, petsJSON){
    if (err) {
      console.error(err.stack);
      return res.sendStatus(500);
    }
    let id = Number.parseInt(req.params.id);
    let pets = JSON.parse(petsJSON);

    if (id < 0 || id >= pets.length || Number.isNaN(id)) {
      res.set('Content-Type', 'text/plain')
      return res.sendStatus(404);
    }
    res.header("Content-Type", "application/json");
    res.send(pets[id]);
  });
});

app.use(function (req, res) {
  res.sendStatus(200);
});

app.listen(port, function () {
  console.log('Listening on port ', port);
});

module.exports = app;
