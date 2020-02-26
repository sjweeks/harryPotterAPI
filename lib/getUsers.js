let UserSchema = require("../models/user");

const getUsers = username => {
  return new Promise((resolve, reject) => {
    UserSchema.find({ username }, (err, docs) => {
      if (err) reject(err);

      resolve(docs);
    });
  });
};

module.exports = getUsers;
