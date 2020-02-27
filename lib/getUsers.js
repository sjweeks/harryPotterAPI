let UserSchema = require("../models/user");

const getUsers = username => {
  return new Promise((resolve, reject) => {
    UserSchema.find({ username }, (err, docs) => {
      if (err) reject(err);

      resolve(docs);
    });
  });
};

const getPassword = password => {
    return new Promise((resolve, reject) => {
      UserSchema.find({ password }, (err, docs) => {
        if (err) reject(err);
  
        resolve(docs);
      });
    });
  };

const getName = name => {
    return new Promise((resolve, reject) => {
      UserSchema.findOne({ name }, (err, docs) => {
        if (err) reject(err);
  
        resolve(docs);
      });
    });
  };

module.exports = {
    getUsers,
    getPassword,
    getName,
}
