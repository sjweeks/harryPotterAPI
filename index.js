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

app.get('/', (req, res) => {
    // let data = await harryPotterData();
    // console.log(data);
    
    res.render('index');
});

app.post('/', async(req, res) => {
    let data = await harryPotterData.harryPotterData(character);
    console.log(data);
    
    res.render("index", {data: {
        character
    }})

})

app.listen(3004, () => {
    console.log("server listening on 3004");
  });