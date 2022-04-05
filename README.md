# Projet Todo List Angular/Firebase
- *Amandine Bray*
- *Louis Volat*

# Lien de production
- [todolist.tuturu.fr](https://todolist.tuturu.fr)

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
- [x] Importer/Importer les todolist (Image non supporter)
- [ ] Importer/Exporter les image contenu dans les todolist
- [ ] Partage des todolistes (QR Code/Lien d'invitation)
- [ ] PWA (Progressive Web App)


# Bug Connu
- [ ] suppression des immage sur ctrl+z lorsque nécessaire (jammais supprimé actuellement)
- [ ] importation de nimporte quelle json fonctionne mais crée une liste vide (erreur à renvoyer si json pas de la bonne structure)
- [ ] exportation de todolist ne prend pas en charge les images
- [ ] impossible d'upload des image ou d'ajouter des items si le localstorage dépasse les 5mb
