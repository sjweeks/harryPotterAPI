let UserSchema = require("../models/user");

const getUsers = username => {
  return new Promise((resolve, reject) => {
    UserSchema.find(
      {
        username
      },
      (err, docs) => {
        if (err) reject(err);

        resolve(docs);
      }
    );
  });
};

const getPassword = password => {
  return new Promise((resolve, reject) => {
    UserSchema.find(
      {
        password
      },
      (err, docs) => {
        if (err) reject(err);
        console.log(password);
        resolve(docs);
      }
    );
  });
};

const getName = name => {
  return new Promise((resolve, reject) => {
    UserSchema.find({ username: name }, (err, docs) => {
      if (err) reject(err);
      console.log(docs);

      for (let i = 0; i < docs.length; i++) {
        const element = docs[i];

        if (element.username == name) {
        //   console.log("shoot meeeeeeee!!!!1111!!!!!!!1!!!");

          resolve(docs[i].name);
        }
      }

      resolve("no user found");
    });
  });
};

module.exports = {
  getUsers,
  getPassword,
  getName
};
