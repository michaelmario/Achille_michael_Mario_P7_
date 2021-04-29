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
// Récupérer tous les utilisateurs
router.get("/users", auth, userCtrl.findAllUsers);

// Récupérer un utilisateur
router.get("/:id/profile", auth, userCtrl.getProfile);

router.put("/:id", auth, userCtrl.updateUser);
router.post("/:id", auth, userCtrl.updateProfilPicture);

// Delete a User with userId
router.delete("/:id", auth, userCtrl.deleteUser);

module.exports = router;
