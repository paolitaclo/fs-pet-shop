'use stric';

let fs = require('fs');
let express = require('express');
let app = express();
let port = process.env.PORT || 8000;
let morgan = require('morgan');
let bodyParser = require('body-parser');

app.use(morgan('short'));
app.use(bodyParser.json());
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

app.post('/pets', function (req, res) {
  fs.readFile('./pets.json', function (err, petsJSON){
    if (err) {
      console.error(err.stack);
      return res.sendStatus(500);
    }
    let pets = JSON.parse(petsJSON);
    // req.body.name = name;
    let namePet = req.body.name;
    let agePet = parseFloat(req.body.age);
    let kindPet = req.body.kind;
    pets.push(req.body);

    if (namePet.length === 0 || agePet.length === 0 || kindPet.length === 0 ) {
      res.set('Content-Type', 'text/plain');
      return res.sendStatus(400);
    }
    let petsUpdatedJSON = JSON.stringify(pets);
    fs.writeFile('./pets.json', petsUpdatedJSON, function (writeErr) {
      if (writeErr) {
        console.error(writeErr.stack);
        return res.sendStatus(500);
      }
      res.send(req.body);
    });
  });
});

app.get('*', function(req, res){
  res.sendStatus(404);
});

app.use(function (req, res) {
  res.sendStatus(200);
});



app.listen(port, function () {
  console.log('Listening on port ', port);
});

module.exports = app;
