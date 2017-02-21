'use strict';
//console.log('Usage: node pets.js [read | create | update | destroy]');
let fs = require('fs');
let node = process.argv[0];
let file = process.argv[1];
let cmd = process.argv[2];
let index = process.argv[3];

if (index) {
  fs.readFile('./pets.json', function (err, data) {
    if (err) {
      throw err;
    }
    let pets = JSON.parse(data);
    if (index < pets.length) {
      console.log(pets[index]);
    } else {
      console.log(`Usage: node pets.js ${cmd} INDEX`);
    }
  });
}
else if (cmd === 'read') {
  fs.readFile('./pets.json', function (err, data) {
    if (err) {
      throw err;
    }
    let pets = JSON.parse(data);
    console.log(pets);
  });
}
else if (cmd === 'create') {
  fs.readFile('./pets.json', function (err, data) {
    if (err) {
      throw err;
    }
    else if (!process.argv[3] || !process.argv[4]|| !process.argv[5]) {
      console.log('Usage: node pets.js create AGE KIND NAME');
    }
    let pets = JSON.parse(data);
    let pet = {};
    pet.age = process.argv[3];
    pet.kind = process.argv[4];
    pet.name = process.argv[5];
    pets.push(pet);
    console.log(pet);
  });
} else {
  console.error('Usage: node pets.js [read | create | update | destroy]');
  process.exit(1);
}
