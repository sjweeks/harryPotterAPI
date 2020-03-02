let {Router} = require("express");
let router = Router();

const hbs = require("express-handlebars");
const path = require("path");
const getInfo = require("../lib/getUsers");
const getSession = require("../lib/getSession");
const bodyParser = require("body-parser");
const UserSchema = require("../models/user");
const nanoID = require("nanoid");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const methods = require("../routes/methods");

const harryPotterData = require("../lib/harryPotter");

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/characters", async (req, res) => {
  let loggedIN = await getSession(req.session.userID);

  if (loggedIN) {
    res.render("characters", {});
  } else {
    res.render("login");
  }
  // res.render("characters");
});

router.post("/characters", async (req, res) => {
  let characterChosen = encodeURIComponent(req.body.character);
  console.log(characterChosen);

  let data = await harryPotterData.harryPotterData(characterChosen);
  console.log(data);

  if (data[0]) {
    let name = data[0].name;
    let role = data[0].role;
    let house = data[0].house;
    let alias = data[0].alias;
    let animagus = data[0].animagus;
    let wand = data[0].wand;
    let ministryOfMagic = data[0].ministryOfMagic;
    let orderOfThePhoenix = data[0].orderOfThePhoenix;
    let dumbledoresArmy = data[0].dumbledoresArmy;
    let deathEater = data[0].deathEater;
    let bloodStatus = data[0].bloodStatus;

    res.render("characters", {
      data: {
        name,
        role,
        house,
        alias,
        animagus,
        wand,
        ministryOfMagic,
        orderOfThePhoenix,
        dumbledoresArmy,
        deathEater,
        bloodStatus
      }
    });
  }
});

router.get("/houses", async (req, res) => {
  let loggedIN = await getSession(req.session.userID);

  if (loggedIN) {
    res.render("houses", {});
  } else {
    res.render("login");
  }
  // res.render("houses");
});

router.post("/houses", async (req, res) => {
  let input = encodeURIComponent(req.body.houses);

  let data = await harryPotterData.houseData();
  // console.log(data);

  let houses = [];

  for (const item of data) {
    houses.push({
      name: item.name,
      mascot: item.mascot,
      headOfHouse: item.headOfHouse,
      houseGhost: item.houseGhost,
      founder: item.founder,
      values: item.values
    });
  }

  for (const house of houses) {
    if (house.name == input) {
      res.render("houses", {
        house
      });
      return;
    }
  }

  res.render("houses", {
    err: "Error."
  });
});

router.get("/sortingHat", async (req, res) => {
  let loggedIN = await getSession(req.session.userID);

  if (loggedIN) {
    res.render("sortingHat", {});
  } else {
    res.render("login");
  }
  // res.render("sortingHat");
});

router.post("/sortingHat", async (req, res) => {
  let house = await harryPotterData.sortingHatData();
  // console.log(data);

  res.render("sortingHat", {
    house,
    title: `${house}!!`
  });
});

router.get("/spells", async (req, res) => {
  let loggedIN = await getSession(req.session.userID);

  if (loggedIN) {
    res.render("spells", {});
  } else {
    res.render("login");
  }
});

router.post("/spells", async (req, res) => {
  let input = encodeURIComponent(req.body.spells);
  let data = await harryPotterData.spellData(input);
  // console.log(data);

  let spells = [];

  for (const item of data) {
    spells.push({
      spell: item.spell,
      type: item.type,
      effect: item.effect
    });
  }

  for (const spell of spells) {
    if (spell.spell == input) {
      res.send("spells", {
        spell
      });
      return;
    }
  }

  res.render("spells", {
    err: "Error."
  });
});

router.get("/signup", async (req, res) => {
  res.render("signup");
});

router.post("/signup", async (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  let name = req.body.name;
  let email = req.body.email;

  let docs = await getInfo.getUsers(username);

  if (docs.length > 0) {
    res.render("signup", {
      err: "A user with this Username already exists"
    });
    return;
  }

  console.log(docs);

  const user = new UserSchema({
    username: username,
    password: password,
    name: name,
    email: email
  });
  req.user.save();
  req.session.userID = nanoID();
  req.session.name = req.body.name;
  req.session.save();
  // console.log("Session created");

  res.render("account", {
    name,
    username
  });
});

router.get("/login", async (req, res) => {
  let username = req.body.username;
  let loggedIN = await getSession(req.session.userID);
  let usersName = await getInfo.getName(req.name);

  if (loggedIN) {
    res.render("account", {
      name: usersName,
      username: username
    });
  } else {
    res.render("login");
  }
});

router.post("/login", async (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  let name = username.name;

  let docs = await getInfo.getUsers(username);
  let verify = await getInfo.getPassword(password);
  let usersName = await getInfo.getName(req.name);
  console.log(usersName);

  let names = [];

  for (const item of docs) {
    names.push({
      username: item.username,
      name: item.usersName
    });
  }

  console.log(usersName);

  if (docs.length > 0 && verify.length > 0) {
    req.session.userID = nanoID();
    req.session.name = req.body.name;
    req.session.save();
    res.render("account", {
      name,
      username
    });
    return;
  } else if (docs.length > 0 || verify.length > 0) {
    res.render("login", {
      err: "Username or Password incorrect - try again"
    });
    return;
  } else {
    res.render("signup", {
      err: "Create an account"
    });
    return;
  }
});

router.get("/account", async (req, res) => {
  let loggedIN = await getSession(req.session.userID);

  if (loggedIN) {
    res.render("account", {
      name,
      username
    });
  } else {
    res.render("login");
  }
});

router.post("/account", (req, res) => {
  res.render("account");
});

router.post("/logout", async (req, res) => {
  req.session.destroy();

  res.render("login", {
    logout: "You have successfully logged out"
  });
});

module.exports = router;