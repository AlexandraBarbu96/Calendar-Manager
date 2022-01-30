const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const app = express();

var corsOptions = {
  origin: "http://localhost:3001"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const db = require("./app/models");
const dbConfig = require("./app/config/db.config");
const User = require("./app/models/user.model");
const { checkRolesExisted } = require("./app/middlewares/verifyRegister");
const Role = db.role;

db.mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });

require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);

// set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      var roleIds = [];

      //add user role
      new Role({
        name: "user"
      })
      .save()
      .then(role =>{
        roleIds.push(role._id);
        console.log("added 'user' to roles collection");
      })
      .catch(err => {
          console.log("[Add user role error]", err);
      });

      //add admin role
      new Role({
          name: "admin"
      })
      .save()
      .then(function (role) {
        roleIds.push(role._id);
        console.log("added 'admin' to roles collection");

        //add admin user
        new User({
          username: "admin",
          password: bcrypt.hashSync("Administrator!1", 8),
          roles: roleIds
        })
        .save()
        .then(user => {
          console.log("added administrator to users collection");
        })
        .catch(err => {
          console.log("[Add admin user error]", err);
        });
      })
      .catch((err) => {
        if(err)
          console.log("[Add admin role error]", err);
      });;
    }
  });
}