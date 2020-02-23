const request = require("request");
const {promisify} = require("util");

require("dotenv").config();

const prosifiedRequest = promisify(request);

const harryPotterData = async (character) => {
    let data = await prosifiedRequest({
        uri:`https://www.potterapi.com/v1/characters/${character}?key=${process.env.key}`,
        json: true,
    })

    return data.body
}

module.exports = {harryPotterData}