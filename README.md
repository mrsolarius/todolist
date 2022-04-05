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
- [ ] <kbd>Ctrl</kbd>+<kbd>Z</kbd> / <kbd>Ctrl</kbd>+<kbd>Y</kbd> sur les todolist (edition suppression selections)
- [x] Attachement d'une image à une tâche
- [x] Authentification
- [x] Stockage local et Synchronisation des données avec Firebase si autentifié
- [x] Création/Edition/Suppression des todolistes
- [x] Selection des todolistes
- [x] Importer/Exporter les todolist (Image non supporter/supporter dans des condition spécifique cf. [bug connu](#bug-connu))
- [ ] Importer/Exporter les image contenu dans les todolist
- [ ] Partage des todolistes (QR Code/Lien d'invitation)
- [ ] PWA (Progressive Web App)


# Bug Connu
- [ ] suppression des images sur ctrl+z lorsque nécessaire (jamais supprimé definitivement)
- [ ] importation de nimporte quelle json fonctionne, mais crée une liste vide (erreur à renvoyer si json pas de la bonne structure)
- [ ] bug d'importation/exportation lié au images (qui ne sont pas supporter)
  - [ ] importation/exportation d'image non fonctionnelle, mais peut fonctionner en localstorage si sur même navigateur que l'export et sur firebase si sur même compte utilisateur que l'export, car conserve UUID d'image.
  - [ ] importation d'une todolist depuis un autre compte firebase générer des erreur 404 et en localstorage renvoie mon erreur notfound.
  - [ ] exportation de todolist ne prend pas en charge les images
- [ ] impossible d'upload des images ou d'ajouter des items si le localstorage dépasse les 5mb pas de prise en compte de l'erreur
