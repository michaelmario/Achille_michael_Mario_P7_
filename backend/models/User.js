'use strict';
const Sequelize = require('sequelize');
const db = require('../config/database');


const User = db.define("User", {
  id:{
    type: Sequelize.INTEGER, 
     primaryKey: true,
    autoIncrement: true,
       allowNull: false
  },
    name:{
      type: Sequelize.STRING, 
      allowNull: false,        
  },
   email:{
     type:Sequelize.STRING,
     allowNull: false,   
     unique:true
  },
   departement:{
     type:Sequelize.STRING,
    },
   password: {
       type:Sequelize.STRING,
       allowNull: false,
     },
     avatarUrl:{
       type:Sequelize.STRING,
       allowNull: true,
     },
     bio:{
      type:Sequelize.STRING,
      allowNull: true,
    },
     isAdmin: {
       type:Sequelize.BOOLEAN,
      flag: {allowNull: true, defaultValue: false },
       
      }
    });
   User.sync().then(() => {
      console.log('table created');
    });
    module.exports = User;

