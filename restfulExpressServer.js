'use strict';

let fs = require('fs');
let express = require('express');
let app = express();
let port = process.env.PORT || 3000;
let morgan = require('morgan');
let bodyParser = require('body-parser');
app.disable('x-powered-by');
app.use(morgan('short'));
app.use(bodyParser.json());

app.route('/pets')
  .get(function (req, res) {
    res.header("Content-Type", "application/json");
    fs.readFile('./pets.json', function (err, petsJSON){
      if (err) {
        console.error(err.stack);
        return res.sendStatus(500);
      }
      let pets = JSON.parse(petsJSON);
      res.send(pets);
    });
  })
  .post(function (req, res) {
    fs.readFile('./pets.json', function (err, petsJSON){
      if (err) {
        console.error(err.stack);
        return res.sendStatus(500);
      }
      let pets = JSON.parse(petsJSON);
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

app.get('/pets/:id', function (req, res) {
  res.header("Content-Type", "application/json");
  fs.readFile('./pets.json', function (err, petsJSON){
    if (err) {
      console.error(err.stack);
      return res.sendStatus(500);
    }
    let id = Number(req.params.id);
    let pets = JSON.parse(petsJSON);

    if (id < 0 || id >= pets.length || Number.isNaN(id)) {
      res.set('Content-Type', 'text/plain');
      return res.sendStatus(404);
    }
    res.send(pets[id]);
  });
});


app.patch('/pets/:id', function (req, res) {
  res.header("Content-Type", "application/json");
  fs.readFile('./pets.json', function (err, petsJSON){
    if (err) {
      console.error(err.stack);
      return res.sendStatus(500);
    }
    let id = Number(req.params.id);
    let pets = JSON.parse(petsJSON);

    if (req.body.age && req.body.name && req.body.kind) {
      pets[id].age = parseFloat(req.body.age);
      pets[id].name = req.body.name;
      pets[id].kind = req.body.kind;
    } else if (req.body.age) {
      pets[id].age = parseFloat(req.body.age);
    }else if (req.body.name) {
      pets[id].name = req.body.name;
    }else if (req.body.kind) {
      pets[id].kind = req.body.kind;
    }
    let petsPatchJSON = JSON.stringify(pets);
    console.log(req.body);
    if (id < 0 || id >= pets.length || Number.isNaN(id) ) {
      res.set('Content-Type', 'text/plain');
      return res.sendStatus(404);
    }

    fs.writeFile('./pets.json', petsPatchJSON, function (writeErr) {
      if (writeErr) {
        console.error(writeErr.stack);
        return res.sendStatus(500);
      }
      res.send(pets[id]);
    });
  });
});

app.delete('/pets/:id', function (req, res) {
  fs.readFile('./pets.json', function (err, petsJSON){
    if (err) {
      console.error(err.stack);
      return res.sendStatus(500);
    }
    let id = Number(req.params.id);
    let pets = JSON.parse(petsJSON);
    if (id < 0 || id >= pets.length || Number.isNaN(id)) {
      res.set('Content-Type', 'text/plain');
      return res.sendStatus(404);
    }
    let petToDestroy = pets[id];
    let petDeleted = pets.splice(id, 1);
    let petsDeleteJSON = JSON.stringify(pets);


    fs.writeFile('./pets.json', petsDeleteJSON, function (writeErr) {
      if (writeErr) {
        console.error(writeErr.stack);
        return res.sendStatus(500);
      }
      res.header("Content-Type", "application/json");
      res.send(petToDestroy);
    });
  });
});

app.get('*', function(req, res){
  res.sendStatus(404);
});

app.listen(port, function () {
  console.log('Listening on port ', port);
});

module.exports = app;
