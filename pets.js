'use strict';
let fs = require('fs');
//let node = process.argv[0];
//let file = process.argv[1];
let cmd = process.argv[2];
let index = process.argv[3];

if (cmd === 'read') {
  readPet();
} else if (cmd === 'create') {
  createPet();
} else if (cmd === 'update') {
  updatePet();
} else if (cmd === 'destroy') {
  destroyPet();
}
else {
  console.error('Usage: node pets.js [read | create | update | destroy]');
  process.exit(1);
}

function readPet() {
  fs.readFile('./pets.json', function (err, data) {
    if (err) {
      throw err;
    }
    let pets = JSON.parse(data);
    if (index === undefined) {
      console.log(pets);
    }
    else if (index < pets.length) {
      console.log(pets[index]);
    } else {
      console.log(`Usage: node pets.js ${cmd} INDEX`);
    }
  });
}

function createPet() {
  fs.readFile('./pets.json', function (err, data) {
    if (err) {
      throw err;
    }
    else if (!process.argv[3] || !process.argv[4] || !process.argv[5]) {
      console.error('Usage: node pets.js create AGE KIND NAME');
      process.exit(1);
    }
    let pets = JSON.parse(data);
    let pet = {};
    pet.age = parseFloat(process.argv[3]);
    pet.kind = process.argv[4];
    pet.name = process.argv[5];
    pets.push(pet);
    let petsJSON = JSON.stringify(pets);
    fs.writeFile('./pets.json', petsJSON, function (writeError) {
      if (writeError) {
        throw writeError;
      }
      console.log(pet);
    });
  });
}

function updatePet() {
  fs.readFile('./pets.json', function (err, data) {
    if (err) {
      throw err;
    }
    else if (!process.argv[3] || !process.argv[4] || !process.argv[5] || !process.argv[6]) {
      console.error('Usage: node pets.js update INreqDEX AGE KIND NAME');
      process.exit(1);
    }
    let pets = JSON.parse(data);
    pets[index].age = parseFloat(process.argv[4]);
    pets[index].kind = process.argv[5];
    pets[index].name = process.argv[6];
    let petsJSON = JSON.stringify(pets);

    fs.writeFile('./pets.json', petsJSON, function (writeError) {
      if (writeError) {
        throw writeError;
      }
      console.log(pets[index]);
    })
  });
}

function destroyPet () {
  fs.readFile('./pets.json', function (err, data) {
    if (err) {
      throw err;
    }
    else if (!process.argv[3]) {
      console.error('Usage: node pets.js destroy INDEX');
      process.exit(1);
    }
    let pets = JSON.parse(data);
    let petTODestroy = pets[index];
    console.log(petTODestroy);
    let petDestroyed = pets.splice(index, 1);
    let petsJSON = JSON.stringify(pets);

    fs.writeFile('./pets.json', petsJSON, function (writeError) {
      if (writeError) {
        throw writeError;
      }
    });
  });
}
