const multer = require("multer");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

const storage = multer.diskStorage({
  // Création d'un objet de configuration pour multer
  destination: (req, file, callback) => {
    callback(null, "./images/");
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(".")[0].split(" ").join("_");
    const extension = MIME_TYPES[file.mimetype];
    //Créer un nom pour l'image
    callback(null, name + Date.now() + "." + extension); 
  },
});

const fileFilter = (req, file, callback) => {
  const extension = MIME_TYPES[file.mimetype]; 
  // Recherche du type mime du fichier téléchargé
  if (extension === "jpg" || extension === "png") {
     // S'assurer qu'il s'agit d'un png ou d'un jpg 
    callback(null, true); 
  } else {
    callback("Erreur : Mauvais type de fichier", false);
  }
};

module.exports = multer({
  storage, // Ajout l'objet multer
  //Définition d'une taille de fichier maximale à télécharger à 100 Mo
  limits: { fileSize: 104857600 }, 
  //Application du filtre d'extension
  fileFilter,
}).single("image"); // S'assurer que le fichier téléchargé par l'utilisateur est un fichier unique et non plusieurs
