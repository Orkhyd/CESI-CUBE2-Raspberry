# CESI-CUBE2-Raspberry
Projet CESI de Pierre, Nicolas et Marius consistant à récupérer des informations d'un Raspberry Pi PICO W et à les envoyer à travers une API sur un site web avec une interface graphique.
- Nous avons utilisé un stack MEAN ( MySQL, Express, Angular, NodeJS ) en plus de passer par du Micropython pour programmer les requêtes depuis la Raspberry.
- Nous avons également utilisé railway.app pour le déploiement de l'API mais nous travaillons actuellement sur une solution accessible par SSH.

### Il nous reste à faire :
- [ ] Déploiement du front-end angular à travers une route Express
- [ ] Déploiement secondaire sur le serveur accessible en SSH
- [ ] Résolution du problème de urequests qui ne fonctionne qu'en HTTP/1.0 ( soit réceptionner les requêtes 1.0 depuis le serveur Node, soit passer par un autre package et/où protocole, par exemple CoAP )
- [ ] Création d'un système d'authentification permettant de laisser exclusivement à la Raspberry avec la bonne clé d'accéder à l'API
- [ ] Front Responsive
- [ ] Implémentation de graphiques de données
