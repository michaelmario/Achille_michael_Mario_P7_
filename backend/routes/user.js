// MODULES - Routeur Express
const express = require("express");
const router = express.Router();
// FIN MODULES

// IMPORTATION USER CONTROLLERS - Importe le controller
const userCtrl = require("../controllers/user");
// FIN IMPORTATION

// IMPORTATION MIDDLEWARES
const auth = require("../middleware/auth"); // Crée un token d'identification
const multer = require("../middleware/multer-config"); // Permet d'envoyer un fichier dans la requête
// FIN IMPORTATION

// ROUTE
router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);



module.exports = router;