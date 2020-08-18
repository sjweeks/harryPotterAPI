const request = require("request");
const { promisify } = require("util");

const fetch = require("node-fetch");

const harryPotterData = async (character) => {
  const URL = `https://www.potterapi.com/v1/characters/?name=${character}&key=${process.env.key}`;
  let data = await fetch(URL);

  let JSObject = await data.json();
  return JSObject;
};

require("dotenv").config();

const promisifiedRequest = promisify(request);

// const harryPotterData = async (character) => {
//   let data = await promisifiedRequest({
//     uri: `https://www.potterapi.com/v1/characters/?name=${character}&key=${process.env.key}`,
//     // uri: `https://www.potterapi.com/v1/characters/5a0fa4daae5bc100213c232e/?key=${process.env.key}`,
//     json: true,
//     // placeholder: "Enter Character Name",
//   });

//   return data.body;
// };
const aliasData = async (character) => {
  let data = await promisifiedRequest({
    uri: `https://www.potterapi.com/v1/characters/?alias=${character}&key=${process.env.key}`,
    // uri: `https://www.potterapi.com/v1/characters/5a0fa4daae5bc100213c232e/?key=${process.env.key}`,
    json: true,
    // placeholder: "Enter Alias Name",
  });

  return data.body;
};

const dataToggle = async () => {
  let characterData = true;
  let toggle = [];

  if (characterData == true) {
    let newData = await harryPotterData(characterChosen);
    toggle.push(newData);
    console.log("Character Data");
    characterData = false;
  } else if (characterData == false) {
    let newData = await aliasData(characterChosen);
    toggle.push(newData);
    console.log("Character Alias");
  }
};

const sortingHatData = async (houses) => {
  let data = await promisifiedRequest({
    uri: `https://www.potterapi.com/v1/sortingHat/?key=${process.env.key}`,
    json: true,
  });
  return data.body;
};

const houseData = async () => {
  let data = await promisifiedRequest({
    uri: `https://www.potterapi.com/v1/houses/?key=${process.env.key}`,
    // uri: `https://www.potterapi.com/v1/characters/5a0fa4daae5bc100213c232e/?key=${process.env.key}`,
    json: true,
  });
  return data.body;
};

const spellData = async (spells) => {
  let data = await promisifiedRequest({
    uri: `https://www.potterapi.com/v1/spells/?key=${process.env.key}`,
    json: true,
  });
  return data.body;
};

module.exports = {
  harryPotterData,
  aliasData,
  houseData,
  sortingHatData,
  spellData,
  dataToggle,
};
