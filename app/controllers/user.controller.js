const path = require('path');

exports.userBoard = (req, res) => {
  res.status(200).sendFile(path.join(__dirname, './views/index.html'), (err) => {
    console.log(err);
  });
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.registerPage = (req, res) => {
  res.status(200).sendFile(path.join(__dirname, '..','../views/auth/register.html'), (err) => {
    console.log(err);
  });
};