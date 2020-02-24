const hbs = require("express-handlebars");
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();

const harryPotterData = require("./lib/harryPotter");

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.engine(
  ".hbs",
  hbs({
    defaultLayout: "layout",
    extname: ".hbs"
  })
);
app.set("view engine", ".hbs");

app.get('/characters', async (req, res) => {
    let data = await harryPotterData();
    // console.log(data);

    // fs.writeFileSync("harryPotter.json", data)

    let name = data.name;
    let role = data.role;
    let house = data.house;
    let animagus = data.animagus;
    let ministryOfMagic = data.ministryOfMagic;
    let orderOfThePhoenix = data.orderOfThePhoenix;
    let dumbledoresArmy = data.dumbledoresArmy;
    let deathEater = data.deathEater;
    let bloodStatus = data.bloodStatus;

    // let house = data.house;
    // console.log(name);
    // console.log(role);
    // console.log(house);
    // console.log(animagus);
    // console.log(ministryOfMagic);
    // console.log(orderOfThePhoenix);
    // console.log(dumbledoresArmy);
    // console.log(deathEater);
    // console.log(bloodStatus);

    
    res.render('characters');
});

app.get('/login', async(req, res) => {
    res.render('login');
  })

  app.get('/signup', async(req, res) => {
    res.render('signup');
  })

app.get('/', async(req, res) => {
    res.render('index');
  })

app.get('/sortingHat', async(req, res) => {
  res.render('sortingHat');
})

app.get('/spells', async(req, res) => {
  res.render('spells');
})


app.post("/characters", async (req,res) => {
    let character = req.body.character;
    console.log(character);

    let data = await harryPotterData();

    let name = data.name;
    let role = data.role;
    let house = data.house;
    let animagus = data.animagus;
    let ministryOfMagic = data.ministryOfMagic;
    let orderOfThePhoenix = data.orderOfThePhoenix;
    let dumbledoresArmy = data.dumbledoresArmy;
    let deathEater = data.deathEater;
    let bloodStatus = data.bloodStatus;

    res.render("characters", {data: {

        name,
        role,
        house,
        animagus,
        ministryOfMagic,
        orderOfThePhoenix,
        dumbledoresArmy,
        deathEater,
        bloodStatus,
    }})

})

app.listen(3004, () => {
    console.log("server listening on 3004");
  });