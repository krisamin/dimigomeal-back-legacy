const { HttpException } = require('../../exceptions');

const getMeal = async (req, res) => {
  //res.sendStatus(200);
  res.send("Hello World!");
};

module.exports = {
  getMeal,
};