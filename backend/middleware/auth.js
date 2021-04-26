const dotenv = require("dotenv").config();
const jwt = require("jsonwebtoken"); // Crée et check un token d'identification sécurisé

// FIN MODULES

// MIDDLEWARE AUTH
module.exports = (req, res, next) => { // Vérifie si le token est bon
 
  try {
    if (!req.headers['authorization']) {
      //S'assurer que l'utilisateur est connecté en recherchant les en-têtes d'autorisation
      throw "Merci de vous connecter";
    }
    // Recherche de la partie jeton des en-têtes d'autorisation
    const token = req.headers['authorization'].split(" ")[1];
    // Vérifier s'il correspond à la clé de jeton secrète
    const decodedToken = jwt.verify(token, process.env.TOKEN);
    const userId = decodedToken.userId;
    
    if (req.body.userId && req.body.userId !== userId) {
      throw "userId non valable !";
    } else {
      next();
    }
  } catch (error) {
    res.status(401).json({ error: error || "Requête non authentifiée !" });
  }
  }