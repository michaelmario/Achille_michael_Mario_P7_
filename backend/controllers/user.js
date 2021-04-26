// MODULES
const db = require('../config/database');
const User = require('../models/User');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const bcrypt = require('bcrypt'); // Pour crypter le mot de passe
const jwt = require("jsonwebtoken"); // Génère un token sécurisé
const fs = require("fs"); // Permet de gérer les fichiers stockés
const jwtoken = require("../utils/jwtValidation");

// Seuls les caractères spéciaux présents dans la régex suivante sont autorisés :
const regex = /^[A-Za-z\d\s.,;:!?"()/%-_'éèêëà#@ô^öù*ç€$£≠÷°]*$/;
const  avatartUrl = '../images/avatar2.png';
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
                password,
                avatartUrl:avatartUrl
            });
            const newUserCreated = newUser.save().then(user => {
                if (!user) {
                    res.status(401).json({ message: "New user has not been Created" });
                } else {
                    res.status(201).json({ message: "New user Created", newUser: user });
                }
            });


        }).catch(err => res.status(500).json({ error: err.message }))

}
// FIN MIDDLEWARE


// MIDDLEWARE LOGIN avec vérification de l'email unique
exports.login = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ where: { email } }) // Finding the user in DB
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
exports.me = (req, res, next) => {
    const data = JSON.parse(req.body.data);
      if (!data || !regex.test(data)) {
        res.status(400).json({ message: "Requête erronée." });
    } else {
        const token = data.userId;
        
        if (token === "invalid signature") {
            res.status(401).json({ error: "Vous n'êtes pas connecté " });
        } else {
            const userId = token;
           
            User.findOne({ where: { id: userId } })
                .then((user) => res.status(200).json(user))
                .catch((error) => res.status(404).json(error));
        }
    }
};
// MIDDLEWARE PROFILE
exports.profile = (req, res, next) => {
  const userID = res.locals.userID;
  let userIDAsked = req.params.id;
  
  if (userIDAsked === userID) {
    
  User.findOne({where:{id:userIDAsked}}).then((result)=>{
     res.status(200).json(result);
  }).catch((e)=>{
     return res.status(500).json(e.message);
  })
}
}
  

exports.updateUser = (req, res, next) => {
  const data = req.body;  
  if (
    !regex.test(data.name) ||
    !regex.test(data.departement)||
    !regex.test(data.bio)   
  ) {
    res.status(400).json({ message: "Requête erronée." });
  } else {
    const token = jwtoken.getUserId(req.headers.authorization);
    const userId = token.userId;

   User.findOne({ where: { id: userId} })
      .then((user) => {
        if (user.id === userId) {
          //const newUsername = data.firstname + " " + data.lastname;
          User.update(
            {
              email: data.email,
              bio: data.bio,
              name: data.name,
              departement: data.departement,
              updatedAt: new Date(),
            },
            { where: { id: userId } }
          )
            .then(() => {
              User.findOne({ where: { id: userId } })
                .then((user) => res.status(200).json(user))
                .catch((error) => res.status(404).json(error));
            })
            .catch((error) => res.status(501).json(error));
        } else {
          res.status(403).json({ message: "Action non autorisée." });
        }
      })
      .catch((error) => res.status(500).json(error));
  }
}

exports.updateProfilPicture = (req, res, next) => {
  const image = req.body;
   console.log(image)
  if (!image || !req.headers.authorization) {
    res.status(400).json({ message: "Requête erronée." });
  } else {
    const token = jwt.getUserId(req.headers.authorization);
    const userId = token.userId;

    User.findOne({ where: { id: userId } })
      .then((user) => {
        if (user.id === userId) {
          if (user.avatarUrl) {
            // Supprimer l'ancienne image du server
            const filename = user.avatarUrl.split("/images/")[1];
            fs.unlink(`images/${filename}`, (err) => {
              if (err) throw err;
            });
          }

         User.update(
            {
              avatarUrl: `${req.protocol}://${req.get("host")}/images/${
                req.file.filename
              }`,
              updatedAt: new Date(),
            },
            { where: { id: user.id } }
          )
            .then(() => {
              User.findOne({ where: { id: userId } })
                .then((user) => res.status(200).json(user))
                .catch((error) => res.status(404).json(error));
            })
            .catch((error) => res.status(501).json(error));
        } else {
          res.status(403).json({ message: "Action non autorisée." });
        }
      })
      .catch((error) => res.status(500).json(error));
  }
};


exports.deleteUser = (req, res, next) => {
  if (!req.params.id || !req.headers.authorization) {
    res.status(400).json({ message: "Requête erronée." });
  } else {
    const token = jwt.getUserId(req.headers.authorization);
    const userId = token.userId;
    const isAdmin = token.isAdmin;

   User.findOne({ where: { id: req.params.id } })
      .then((user) => {
        if (user.id == userId || isAdmin) {
          if (user.imageUrl) {
            // Supprimer la photo de profil du server
            const filename = user.imageUrl.split("/images/")[1];
            fs.unlink(`images/${filename}`, () => {
              User.destroy({ where: { id: user.id } })
                .then(() =>
                  res.status(204).json({ message: "Elément supprimé." })
                )
                .catch((error) => res.status(501).json(error));
            });
          } else {
            User.destroy({ where: { id: user.id } })
              .then(() =>
                res.status(204).json({ message: "Elément supprimé." })
              )
              .catch((error) => res.status(501).json(error));
          }
        } else {
          res.status(403).json({ message: "Action non autorisée." });
        }
      })
      .catch((error) => res.status(500).json(error));
  }
};
// Retrieve all Users from the database.
exports.findAllUsers = (req, res, next) => { 
   User.findAll({
    attributes: {
      exclude: ['password'],
    },
    order: [['id','DESC']]})
  .then((users) => {
    
    res.status(200).json(users)
  })
  .catch((error) => res.status(400).json({ error }));
};    
  

// FIN MIDDLEWARE






