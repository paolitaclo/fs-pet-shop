'use strict';

const fs = require('fs');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const morgan = require('morgan');
const bodyParser = require('body-parser');
app.disable('x-powered-by');
app.use(morgan('short'));
app.use(bodyParser.json());

app.route('/pets')
  .get((req, res) => {
    res.header("Content-Type", "application/json");
    fs.readFile('./pets.json', (err, petsJSON) => {
      if (err) {
        console.error(err.stack);
        res.sendStatus(500);
        return;
      }
      let pets = JSON.parse(petsJSON);
      res.send(pets);
    });
  })
  .post((req, res) => {
    res.header("Content-Type", "application/json");
    fs.readFile('./pets.json', (err, petsJSON) => {
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
      fs.writeFile('./pets.json', petsUpdatedJSON, writeErr => {
        if (writeErr) {
          console.error(writeErr.stack);
          return res.sendStatus(500);
        }
        res.send(req.body);
      });
    });
  });


app.route('/pets/:id')
  .get((req, res) => {
    res.header("Content-Type", "application/json");
    fs.readFile('./pets.json', (err, petsJSON) => {
      if (err) {
        console.error(err.stack);
        res.sendStatus(500);
        return;
      }
      let id = Number(req.params.id);
      let pets = JSON.parse(petsJSON);

      if (id < 0 || id >= pets.length || Number.isNaN(id)) {
        res.set('Content-Type', 'text/plain');
        res.sendStatus(404);
        return;
      }
      res.send(pets[id]);
    });
  })
  .patch((req, res) => {
    res.header("Content-Type", "application/json");
    fs.readFile('./pets.json', (err, petsJSON) => {
      if (err) {
        console.error(err.stack);
        res.sendStatus(500);
        return;
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
        res.sendStatus(404);
        return;
      }

      fs.writeFile('./pets.json', petsPatchJSON, writeErr => {
        if (writeErr) {
          console.error(writeErr.stack);
          res.sendStatus(500);
          return;
        }
        res.send(pets[id]);
      });
    });
  })
  .delete((req, res) => {
    res.header("Content-Type", "application/json");
    fs.readFile('./pets.json', (err, petsJSON) => {
      if (err) {
        console.error(err.stack);
        res.sendStatus(500);
        return;
      }
      let id = Number(req.params.id);
      let pets = JSON.parse(petsJSON);
      if (id < 0 || id >= pets.length || Number.isNaN(id)) {
        res.set('Content-Type', 'text/plain');
        res.sendStatus(404);
        return;
      }
      let petToDestroy = pets[id];
      let petDeleted = pets.splice(id, 1);
      let petsDeleteJSON = JSON.stringify(pets);


      fs.writeFile('./pets.json', petsDeleteJSON, writeErr => {
        if (writeErr) {
          console.error(writeErr.stack);
          res.sendStatus(500);
          return;
        }
        res.send(petToDestroy);
      });
    });
  });

app.get('*', (req, res) => {
  res.sendStatus(404);
});

app.listen(port, () => {
  console.log('Listening on port ', port);
});

module.exports = app;
