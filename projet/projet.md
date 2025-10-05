RoyalMatch – Cahier des charges fonctionnel

1. Présentation

RoyalMatch est un jeu de cartes compétitif et stratégique jouable :

En multijoueur (2 à 4 joueurs).

En solo contre IA (une ou plusieurs IA pouvant remplacer des joueurs humains).

En mode spectateur, pour observer une partie en temps réel.

Le jeu se déroule en manches successives jusqu’à ce qu’un joueur atteigne le score de victoire défini au départ.

2. Objectif du jeu

Chaque joueur doit remplir des objectifs pour marquer des points et atteindre en premier le score requis.
Les objectifs sont des conditions particulières liées à la manière dont les plis sont gagnés ou perdus (ex. « gagner exactement 3 plis », « perdre tous ses plis », « ne pas gagner de carte rouge », etc.).

3. Structure d’une partie

Une partie se joue en plusieurs manches, et chaque manche est composée de plusieurs tours.

Déroulement d’une partie :

Création de la partie : nombre de joueurs, score cible, choix IA éventuelles.

Boucle de manches :

Lancer une manche.

À la fin de la manche, attribuer les points selon les objectifs.

Vérifier si un joueur atteint le score cible → victoire.

Fin de partie : affichage du classement final.

4. Déroulement d’une manche

Roulette des couleurs

Une couleur aléatoire est désignée forte pour la manche.

Sa couleur opposée devient faible.

Les couleurs fortes battent toutes les autres, les faibles perdent contre toutes, les deux restantes se départagent par leur relation rouge/noir.
→ Résultat : il n’existe jamais d’égalité.

Distribution des objectifs

Chaque joueur reçoit 3 objectifs.

Il peut en écarter jusqu’à 2 mais doit en garder au moins 1.

Distribution des cartes

Chaque joueur reçoit 13 cartes.

Il en choisit 5 pour constituer sa main de départ, le reste formant son deck personnel.

Tours de jeu

Une manche comporte autant de tours qu’il y a de cartes par joueur (13 si on part sur 13 cartes).

Déroulement d’un tour (cf. section 5).

Fin de manche

Quand tous les joueurs ont épuisé leur main et leur deck.

Vérification des objectifs.

Attribution des points.

Nouveau départ si aucun joueur n’a atteint le score cible.

5. Déroulement d’un tour

Chaque tour se déroule en temps réel avec une limite de temps de réflexion.

Résolution des effets activés :
Les effets des cartes jouées au tour précédent s’appliquent maintenant.

Pioche :
Chaque joueur pioche 1 carte de son deck personnel (si possible).

Choix simultané :

Chaque joueur choisit une carte de sa main.

Il peut décider d’activer ou non son effet.

Révélation :

Toutes les cartes sont révélées en même temps.

Le vainqueur du pli est déterminé par :

La valeur (2 < … < As).

En cas de valeur égale : application de la règle des couleurs avec dominante/faible → jamais d’égalité.

Programmation des effets :
Les effets des cartes jouées sont mis en attente et s’activeront au début du prochain tour.

Fin du tour :
Passage au tour suivant jusqu’à épuisement des cartes.

6. Mode spectateur

Un joueur peut rejoindre une partie en mode spectateur.

Un spectateur :

Voit les cartes jouées et révélées.

Suit en direct la roulette de dominante, la distribution des objectifs (sans voir le choix final), les plis gagnés.

Accède au score et aux objectifs remplis en fin de manche.

Les spectateurs peuvent aussi suivre des parties IA vs IA, ce qui permettra de tester l’équilibrage du jeu.

7. IA (jouer seul ou compléter une partie)

Le jeu doit proposer un mode solo en remplaçant les autres joueurs par des IA.

Les IA doivent pouvoir :

Choisir des objectifs.

Sélectionner 5 cartes de départ.

Jouer une carte à chaque tour et décider d’activer ou non son effet.

Les IA seront testées en leur faisant jouer des parties entières en mode spectateur, afin d’observer leurs choix et l’équilibre du jeu.

8. Règles fonctionnelles importantes

Chaque carte possède un effet optionnel, qui s’applique au début du tour suivant si activé.

Les effets sont plus faibles pour les cartes basses, plus puissants pour les cartes hautes.

Les couleurs donnent une tonalité aux effets :

Cœur : orienté vers les objectifs, positif pour soi.

Carreau : orienté pioche, gestion de la main/deck.

Trèfle : orienté chance, hasard et aléatoire.

Pique : orienté agressif, impact sur les adversaires.

Aucune égalité n’est possible dans les plis.
