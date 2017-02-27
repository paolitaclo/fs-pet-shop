'use stric';

const fs = require('fs');
const express = require('express');
const app = express();
const port = process.env.PORT || 8000;
const morgan = require('morgan');
const bodyParser = require('body-parser');

app.use(morgan('short'));
app.use(bodyParser.json());
app.disable('x-powered-by');

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
          res.sendStatus(500);
          return;
        }
        res.send(req.body);
      });
    });
  });


app.get('/pets/:id', (req, res) => {
  res.header("Content-Type", "application/json");
  fs.readFile('./pets.json', (err, petsJSON) => {
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

app.get('*', (req, res) => {
  res.sendStatus(404);
});

app.listen(port, () => {
  console.log('Listening on port ', port);
});

module.exports = app;
