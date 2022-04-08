# Projet Todo List Angular/Firebase
- *Amandine Bray*
- *Louis Volat*

# Lien de production
- [todo.tuturu.fr](https://todo.tuturu.fr/)

# Fontionalité
- [x] Création/Edition/Suppression des tâches
- [x] Cocher/Décocher une ou toutes les tâches
- [x] Filtrage des tâches par status (tous/actifs/complétés)
- [x] <kbd>Ctrl</kbd>+<kbd>Z</kbd> / <kbd>Ctrl</kbd>+<kbd>Y</kbd> pour les actions dans les todo-list
- [X] <kbd>Ctrl</kbd>+<kbd>Z</kbd> / <kbd>Ctrl</kbd>+<kbd>Y</kbd> sur les todolist (edition suppression selections)
- [x] Attachement d'une image à une tâche
- [x] Authentification
- [x] Stockage local et Synchronisation des données avec Firebase si autentifié
- [x] Création/Edition/Suppression des todolistes
- [x] Selection des todolistes
- [x] Importer/Exporter les todolist
- [x] Importer/Exporter les image contenu dans les todolist
- [ ] Partage des todolistes (QR Code/Lien d'invitation)
- [ ] PWA (Progressive Web App)


# Bug Connu
- [ ] suppression des images sur ctrl+z lorsque nécessaire (jamais supprimé definitivement)
- [ ] importation de nimporte quelle json fonctionne, mais crée une liste vide (erreur à renvoyer si json pas de la bonne structure)
- [x] bug d'importation/exportation lié au images (qui ne sont pas supporter)
  - [x] importation/exportation d'image non fonctionnelle, mais peut fonctionner en localstorage si sur même navigateur que l'export et sur firebase si sur même compte utilisateur que l'export, car conserve UUID d'image.
  - [x] importation d'une todolist depuis un autre compte firebase générer des erreur 404 et en localstorage renvoie mon erreur notfound.
  - [x] exportation de todolist ne prend pas en charge les images
- [ ] impossible d'upload des images ou d'ajouter des items si le localstorage dépasse les 5mb pas de prise en compte de l'erreur

# ATTENTION
Pour évité les erreur CORS (Cross-Origin Resource Sharing) veuillez suivre les étape suivante :
- installer [gsutil](https://cloud.google.com/storage/docs/gsutil_install#install) (suivre les instructions)
- executer la commande `gcloud int` connecter vous et indiquer le projet sur lequel vous souhaitez travailler
- dans un fichier json ecriver le code suivant (permet d'autoriser sur votre projet les request de toutes origines en get pas trés sécure, mais ok):
```json
[
  {
    "origin": ["*"],
    "method": ["GET"],
    "maxAgeSeconds": 3600
  }
]
```
- executer la commande suivante : `gsutil cors set nom-de-votre-json.json gs://adresse-de-votre-bucket-firesbase`
- si tous, c'est bien passé les request de toutes origines en get sur votre bucket firebase sont autorisées
