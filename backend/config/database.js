const Sequelize = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

module.exports =  new Sequelize('groupomania','root','',{
  host: 'localhost',
  dialect: 'mysql',
  

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
});
