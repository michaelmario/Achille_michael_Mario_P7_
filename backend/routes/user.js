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
// Route d'authentification
router.post("/me", userCtrl.me);

router.put("/:id", auth, userCtrl.updateUser);
router.put("/profilePicture", auth, multer, userCtrl.updateProfilPicture )
router.get("/users", auth, userCtrl.findAllUsers);
// Delete a User with userId
router.delete("/user/:userId", auth, userCtrl.deleteUser);

module.exports = router;
