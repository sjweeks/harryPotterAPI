let {
	Router
} = require("express");
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

// username = username
// name = name
// userID = userID

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
		res.render("houses");
	} else {
		res.render("login", {
			err: "Please log in"
		});
	}
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
		res.render("sortingHat");
	} else {
		res.render("login", {
			err: "Please log in"
		});
	}
});

router.post("/sortingHat", async (req, res) => {
	let house = await harryPotterData.sortingHatData();

	res.render("sortingHat", {
		house,
		title: `${house}!!`
	});
});

router.get("/spells", async (req, res) => {
	let loggedIN = await getSession(req.session.userID);

	if (loggedIN) {
		res.render("spells");
	} else {
		res.render("login", {
			err: "Please log in"
		});
	}
});

router.post("/spells", async (req, res) => {
	let input = encodeURIComponent(req.body.spells);
	let data = await harryPotterData.spellData();

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
			res.render("spells", {
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

	const user = new UserSchema({
		username: username,
		password: password,
		name: name,
		email: email
	});
	user.save();
	req.session.userID = nanoID();
	req.session.name = req.body.username;
	req.session.save();

	res.render("profile", {
		name,
		username
	});
});

router.get("/login", async (req, res) => {
	let username = req.body.username;
	let loggedIN = await getSession(req.session.userID);
	let actualName = await getInfo.getName(username);

	if (loggedIN) {
		res.render("profile", {
			name: actualName,
			username: username
		});
	} else {
		res.render("login");
	}
});

router.post("/login", async (req, res) => {
	let username = req.body.username;
	let password = req.body.password;
	let docs = await getInfo.getUsers(username);
	let verify = await getInfo.getPassword(password);

	let actualName = await getInfo.getName(username);

	if (docs.length > 0 && verify.length > 0) {
		req.session.userID = nanoID();
		req.session.name = req.body.username; // tidy the variables names out
		req.session.save();

		res.render("profile", {
			name: actualName,
			username: username,
			welcome: `Welcome back ${actualName}!`
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

router.get("/profile", async (req, res) => {
	let username = req.session.name
	let loggedIN = await getSession(req.session.userID);
	let actualName = await getInfo.getName(username);

	console.log(actualName);

	if (loggedIN) {
		res.render("profile", {
			username:req.session.name,
			name: actualName
		});
	} else {
		res.render("login");
	}
});

router.post("/profile", (req, res) => {
	res.render("profile");
});

router.post("/logout", async (req, res) => {
	req.session.destroy();

	res.render("login", {
		logout: "You have successfully logged out"
	});
});

module.exports = router;