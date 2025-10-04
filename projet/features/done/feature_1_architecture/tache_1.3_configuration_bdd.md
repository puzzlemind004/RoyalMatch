# Tâche 1.3 : Configuration de la base de données PostgreSQL

## Objectif
Configurer PostgreSQL et créer le schéma de base de données pour RoyalMatch.

## Technologies
- PostgreSQL 15+
- Lucid ORM (AdonisJS)
- Migrations Adonis

## Actions à réaliser

### Installation et configuration
- Installer PostgreSQL localement (ou Docker)
- Créer la base de données `royalmatch_dev`
- Configurer la connexion dans AdonisJS (`config/database.ts`)
- Tester la connexion avec `node ace db:check`

### Schéma de données initial

#### Table `users`
- `id` : UUID (primary key)
- `username` : string (unique)
- `email` : string (unique)
- `password` : string (hash)
- `created_at` : timestamp
- `updated_at` : timestamp

#### Table `games`
- `id` : UUID (primary key)
- `target_score` : integer
- `max_players` : integer (2-6)
- `status` : enum (waiting, in_progress, finished)
- `current_round` : integer
- `winner_id` : UUID (nullable, foreign key users)
- `created_at` : timestamp
- `updated_at` : timestamp

#### Table `game_players`
- `id` : UUID (primary key)
- `game_id` : UUID (foreign key games)
- `user_id` : UUID (nullable, foreign key users) - null si IA
- `is_ai` : boolean
- `player_order` : integer
- `total_score` : integer
- `created_at` : timestamp

#### Table `rounds`
- `id` : UUID (primary key)
- `game_id` : UUID (foreign key games)
- `round_number` : integer
- `dominant_color` : enum (hearts, diamonds, clubs, spades)
- `weak_color` : enum (hearts, diamonds, clubs, spades)
- `status` : enum (in_progress, finished)
- `created_at` : timestamp
- `updated_at` : timestamp

#### Table `player_objectives`
- `id` : UUID (primary key)
- `round_id` : UUID (foreign key rounds)
- `game_player_id` : UUID (foreign key game_players)
- `objective_type` : string
- `objective_data` : jsonb
- `is_completed` : boolean
- `points_earned` : integer
- `created_at` : timestamp

#### Table `turns`
- `id` : UUID (primary key)
- `round_id` : UUID (foreign key rounds)
- `turn_number` : integer
- `winner_player_id` : UUID (foreign key game_players)
- `created_at` : timestamp

#### Table `played_cards`
- `id` : UUID (primary key)
- `turn_id` : UUID (foreign key turns)
- `game_player_id` : UUID (foreign key game_players)
- `card_value` : string (2-A)
- `card_suit` : enum (hearts, diamonds, clubs, spades)
- `effect_activated` : boolean
- `created_at` : timestamp

### Migrations
- Créer les migrations Adonis pour toutes les tables
- Ajouter les index nécessaires (foreign keys, recherches fréquentes)
- Créer un seeder pour les données de test

## Points d'attention
- Utiliser UUID pour les IDs (meilleure sécurité)
- Prévoir les index sur les colonnes de recherche (game_id, user_id, etc.)
- Utiliser JSONB pour les données flexibles (objectifs, effets)
- Configurer les contraintes de clés étrangères avec ON DELETE CASCADE
- Prévoir un système de soft delete si nécessaire

## Résultat attendu
- Base de données créée et accessible
- Toutes les migrations exécutées avec succès
- Modèles Lucid créés et fonctionnels
- Seeders de test disponibles
