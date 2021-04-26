
// MODULES
const express = require('express');
const bodyParser = require('body-parser');
const path = require("path");
const cors = require('cors');
const app = express();


// Security Requires
const dotenv = require("dotenv").config();
const helmet = require("helmet");
const expressSanitizer = require('express-sanitizer');
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const xssClean = require("xss-clean");

// FIN MODULES
const db = require('./config/database');
db.authenticate()
.then(()=>console.log('database connected...'))
.catch(err=> console.log('Error:' + err))

// IMPORTATION ROUTES
const userRoutes = require("./routes/user");
//const postRoutes = require("./routes/post");
const { connected } = require('process');
// FIN IMPORTATIONS

// HELMET
app.use(helmet()); // Protège l'app en paramétrant des Headers (notamment contre les failles XSS)
// FIN HELMET

app.use(cors());
// PARAMETRAGE DES HEADERS
app.use((req, res, next) => { // Evite les erreurs CORS
// on indique que les ressources peuvent être partagées depuis n'importe quelle origine
    res.setHeader('Access-Control-Allow-Origin', '*');
// on indique les entêtes qui seront utilisées après la pré-vérification cross-origin afin de donner l'autorisation
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
// on indique les méthodes autorisées pour les requêtes HTTP
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader("x-powered-by" , false);
    res.setHeader('Content-Security-Policy', "default-src 'self'");
    next();
   
});
// FIN PARAMETRAGE

// BODYPARSER
app.use(bodyParser.json()); // Rend le corps de la requête exploitable facilement
app.use(
    bodyParser.urlencoded({
      extended: false,
    })
  );
// FIN BODYPARSER

app.use(expressSanitizer()); // Protège contre les failles XSS

// ROUTES
app.use("/images", express.static(path.join(__dirname, "images")));
// middleware Morgan pour créer des logs  au format combiné Apache dans STDOUT
app.use(morgan("combined"));

//middleware  HTTP pour se protéger contre les attaques de pollution des paramètres HTTP 
app.use(hpp());

//methode faille xss nettoie
// les entrées utilisateur provenant du corps POST, des requêtes GET et des paramètres d'URL
app.use(xssClean());

// Va servir les routes dédiées aux utilisateurs
app.use("/api/user", userRoutes);
// Va servir les routes dédiées aux posts
//app.use("/api/post", postRoutes);
// FIN ROUTES

// Export de l'application express pour déclaration dans server.js

//Gere les erreurs global 
app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).json({message:'Something broke!'});
})
module.exports = app;
