const hbs = require("express-handlebars");
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

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

app.get('/', async (req, res) => {
    let data = await harryPotterData(character);
    console.log(data);

    // let name = data.name;
    // let house = data.house;
    // console.log(name);
    // console.log(house);
    
    res.render('index');
});

app.get('/characters', async(req, res) => {
    res.render('characters');
  })

app.get('/sortingHat', async(req, res) => {
  res.render('sortingHat');
})

app.get('/spells', async(req, res) => {
  res.render('spells');
})

// app.post('/', async(req, res) => {
//     let data = await harryPotterData();
//     console.log(data);
    
//     res.render("index", {data: {
//         character
//     }})

// })

app.listen(3004, () => {
    console.log("server listening on 3004");
  });