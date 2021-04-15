// MODULES
const db = require('../config/database');
const User = require('../models/User');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const bcrypt = require('bcrypt'); // Pour crypter le mot de passe
const jwt = require("jsonwebtoken"); // Génère un token sécurisé
const fs = require("fs"); // Permet de gérer les fichiers stockés
// FIN MODULES

// MIDDLEWARE SIGNUP  - Inscription de l'utilisateur et hashage du mot de passe
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const email = req.body.email;
            const name = req.body.name;
            const departement = req.body.departement;
            const password = hash;
            const newUser = new User({
                name,
                email,
                departement,
                password
            });
            const newUserCreated = newUser.save();
            res.status(201).json({ message: "New user Created", newUser: newUserCreated });

        }).catch(err => res.status(500).json({ error: err.message }))

}
// FIN MIDDLEWARE


// MIDDLEWARE LOGIN avec vérification de l'email unique
exports.login = async (req, res, next) => {
    const email = req.body.email;
    const password  = req.body.password;
    User.findOne({ where: { email}}) // Finding the user in DB
        .then((user) => {
            if (!user) {
                return res.status(401).json({
                    error: "Aucun compte ne correspond à l'adresse email renseingée !", // Return error if user is not found un DB
                });
            }
            //si l'utilisateur existe, vérification du mot de passe
            bcrypt.compare(password, user.password)
                .then(valid => {
                    //si le mot de passe est incorrect
                    if (!valid) {
                        return res.status(401).json({ error: "Mot de passe incorrect !" });
                    }
                    const maxAge = 3 * 24 * 60 * 60;
                    const newToken = jwt.sign(
                        { userId: user.id },
                        process.env.TOKEN,
                        { expiresIn: maxAge }
                    );
                    res.status(200).json({ userId: user.id, token: newToken });

                })
                .catch((error) => res.status(401).json({ error }));

        }).catch(e => res.status(500).json(e));
};
// FIN MIDDLEWARE






