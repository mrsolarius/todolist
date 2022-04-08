# Projet Todo List Angular/Firebase
- *Amandine Bray*
- *Louis Volat*

# Lien de production
- [todo.tuturu.fr](https://todo.tuturu.fr/)

# Fonctionnalités
- [x] Création/Edition/Suppression des tâches
- [x] Cocher/Décocher une ou toutes les tâches
- [x] Filtrage des tâches par statuts (tous/actifs/complétés)
- [x] <kbd>Ctrl</kbd>+<kbd>Z</kbd> / <kbd>Ctrl</kbd>+<kbd>Y</kbd> pour les actions dans les todo-list
- [X] <kbd>Ctrl</kbd>+<kbd>Z</kbd> / <kbd>Ctrl</kbd>+<kbd>Y</kbd> sur les todolist (édition suppression sélection)
- [x] Attachement d'une image à une tâche
- [x] Authentification
- [x] Stockage local et Synchronisation des données avec Firebase si elle est authentifiée
- [x] Création/Edition/Suppression des todolistes
- [x] Sélection des todolistes
- [x] Importer/Exporter les todolistes
- [x] Importer/Exporter les images contenues dans les todolistes
- [ ] Partage des todolistes (QR Code/Lien d'invitation)
- [ ] PWA (Progressive Web App)
# Bug Connu
- [ ] le ctrl+z ne prend pas en charge les images, il fonctionne donc, mais ne restaurera pas les images de même il n'entrainera pas leur suppression.
  - Pour résoudre ce bug il aurait falus une autre structure de données pour stocker les images qui dans l'attribut photo contienne la base64 ou l'url de l'image ainsi que sont id 
- [x] importation de n'importe quel fichier json fonctionne, mais crée une liste vide (erreur à renvoyer si json pas de la bonne structure)
- [x] bug d'importation/exportation lié au images (qui ne sont pas supporter)
  - [x] importation/exportation d'image non fonctionnelle, mais elle peut fonctionner en localstorage si on se trouve sur même navigateur que l'export et sur firebase si on est sur le même compte utilisateur que l'export, car elle conserve UUID d'image.
  - [x] importation d'une todolist depuis un autre compte firebase génère des erreurs 404 et en localstorage il renvoie mon erreur notfound.
  - [x] exportation de todolist ne prend pas en charge les images
- [ ] impossible d'upload des images ou d'ajouter des items si le localstorage dépasse les 5mb (pas de prise en compte de l'erreur)

# ATTENTION
Pour évité les erreurs CORS (Cross-Origin Resource Sharing) veuillez suivre les étapes suivantes :
- installer [gsutil](https://cloud.google.com/storage/docs/gsutil_install#install) (suivre les instructions)
- exécuter la commande `gcloud int`, connecter vous et indiquer le projet sur lequel vous souhaitez travailler
- dans un fichier json écrivez le code suivant (permet d'autoriser sur votre projet les request de toutes origines en get mais il n'est pas très sécurisé, mais il est bon ):
```json
  [
    {
      "origin": ["*"],
      "method": ["GET"],
      "maxAgeSeconds": 3600
    }
  ]
```
- exécuter la commande suivante : `gsutil cors set nom-de-votre-json.json gs://adresse-de-votre-bucket-firesbase`
- si tous, c'est bien passé les request de toutes origines en get sur votre bucket firebase sont autorisées
