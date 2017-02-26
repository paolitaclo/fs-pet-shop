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

app.route('/pets')
  .get(function (req, res) {
    res.header("Content-Type", "application/json");
    fs.readFile('./pets.json', function (err, petsJSON){
      if (err) {
        console.error(err.stack);
        res.sendStatus(500);
        return;
      }
      let pets = JSON.parse(petsJSON);
      res.send(pets);
    });
  })
  .post(function (req, res) {
    fs.readFile('./pets.json', function (err, petsJSON){
      if (err) {
        console.error(err.stack);
        res.sendStatus(500);
        return;
      }
      let pets = JSON.parse(petsJSON);
      let namePet = req.body.name;
      let agePet = parseFloat(req.body.age);
      let kindPet = req.body.kind;
      pets.push(req.body);

      if (namePet.length === 0 || agePet.length === 0 || kindPet.length === 0 ) {
        res.set('Content-Type', 'text/plain');
        res.sendStatus(400);
        return;
      }
      let petsUpdatedJSON = JSON.stringify(pets);
      fs.writeFile('./pets.json', petsUpdatedJSON, function (writeErr) {
        if (writeErr) {
          console.error(writeErr.stack);
          res.sendStatus(500);
          return;
        }
        res.send(req.body);
      });
    });
  });


app.get('/pets/:id', function (req, res) {
  res.header("Content-Type", "application/json");
  fs.readFile('./pets.json', function (err, petsJSON){
    if (err) {
      console.error(err.stack);
      res.sendStatus(500);
      return;
    }
    let id = Number.parseInt(req.params.id);
    let pets = JSON.parse(petsJSON);

    if (id < 0 || id >= pets.length || Number.isNaN(id)) {
      res.set('Content-Type', 'text/plain')
      res.sendStatus(404);
      return;
    }
    res.header("Content-Type", "application/json");
    res.send(pets[id]);
  });
});

app.get('*', function(req, res){
  res.sendStatus(404);
});

app.listen(port, function () {
  console.log('Listening on port ', port);
});

module.exports = app;
