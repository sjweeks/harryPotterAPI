const hbs = require("express-handlebars");
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const mongoose = require("mongoose");
const UserSchema = require("./models/user");

const app = express();

const harryPotterData = require("./lib/harryPotter");

mongoose.connect(
  `mongodb+srv://${process.env.username}:${process.env.password}@usersignup-teuih.mongodb.net/userdb?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// let email = req.body.email
// let password = req.body.password

// const user = new UserSchema({
//   email: email,
//   password: password
// })

app.engine(
  ".hbs",
  hbs({
    defaultLayout: "layout",
    extname: ".hbs"
  })
);
app.set("view engine", ".hbs");

// app.get("/", async (req, res) => {
//   res.render("index");
// });

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/characters", async (req, res) => {
  res.render("characters");
});

app.post("/characters", async (req, res) => {
  let characterChosen = encodeURIComponent(req.body.character);
  console.log(characterChosen);

  let data = await harryPotterData.harryPotterData(characterChosen);
  console.log(data);
  // When adding a second function into the JavaScript file (harryPotter.js) then you need to define the function by putting harryPotterData.harryPotterData. Or if calling another function it would be harryPotterFunction.(name of function)

  if (data[0]) {
    /*

      why would we want [0] after data? What is the point? What does it mean?
      what is the error if you remove it? Is there one?

      Error message when [0] is removed: ...
      There isn't any errors being thrown back. However when [0] is removed from data and also the specific data we're trying to pull back, it just returns as blank. The [0] is needed to be able to define what we are looking for and pull the relevant information back from the array. When it's not there, the information is rendered, ie name, however the specific data is not returned.

    */

    let name = data[0].name;
    let role = data[0].role;
    let house = data[0].house;
    let animagus = data[0].animagus;
    let wand = data[0].wand;
    let ministryOfMagic = data[0].ministryOfMagic;
    let orderOfThePhoenix = data[0].orderOfThePhoenix;
    let dumbledoresArmy = data[0].dumbledoresArmy;
    let deathEater = data[0].deathEater;
    let bloodStatus = data[0].bloodStatus;

  //   if (data[0].house == "Gryffindor") {
  //     console.log("Hello, Gryffindor");
  // }

    res.render("characters", {
      data: {
        name,
        role,
        house,
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
  // res.render('characters', {
  //   err: 'no character found'
  // })
});

app.get("/sortingHat", async (req, res) => {
  // let data = await harryPotterData.sortingHatData();
  // console.log(data);

  // fs.writeFileSync("houseData.json", data)

  res.render("sortingHat");
});

app.post("/sortingHat", async (req, res) => {
  let houseDisplayed = encodeURIComponent(req.body.houses);
  console.log(houseDisplayed);

  let data = await harryPotterData.sortingHatData();
  console.log(data);

  if (data[0]) {
    let name = data[0].name;
    let mascot = data[0].mascot;
    let headOfHouse = data[0].headOfHouse;
    let houseGhost = data[0].houseGhost;
    let founder = data[0].founder;

    console.log(founder);
    
    res.render("sortingHat", {
      data: {
        name,
        mascot,
        headOfHouse,
        houseGhost,
        founder
      }
    });
  }
});

app.get("/spells", async (req, res) => {
  // let data = await harryPotterData.spellData();
  // console.log(data);

  // fs.writeFileSync("spellData.json", data)

  res.render("spells");
});

app.post("/spells", async(req, res) => {
  let spellChosen = encodeURIComponent(req.body.spells)
  let data = await harryPotterData.spellData(spellChosen);
  // console.log(data);




  
  if (data[0]) {
    let spells = data[0].spell;
    let type = data[0].type;
    let effect = data[0].effect;
    
    res.render("spells", {
      data: {
        spells,
        type,
        effect
      }
    });
  }
});

app.get("/signup", async (req, res) => {
  res.render("signup");
});

app.get("/login", async (req, res) => {
  res.render("login");
});


app.post("/login", (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  const user = new UserSchema({
    email: email,
    password: password
  });
  user.save();
  console.log(user);

  res.render("login");
});


app.listen(3004, () => {
  console.log("server listening on 3004");
});
