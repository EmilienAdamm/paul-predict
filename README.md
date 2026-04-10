# Football AI Prediction Arena

Spécification technique officielle du projet.

---

## 1. Présentation

Football AI Prediction Arena est une plateforme web qui compare plusieurs agents IA sur leur capacité à prédire des matchs de football.

Le projet ne benchmarke pas uniquement des modèles LLM “bruts”. Il benchmarke des **agents IA complets** capables de :

- identifier les informations pertinentes avant un match,
- définir une stratégie de recherche,
- analyser les données récupérées,
- produire une prédiction structurée,
- être évalués objectivement après le match.

L’objectif du projet est de répondre à la question suivante :

> Quel agent IA est le plus performant pour rechercher, analyser et prédire des matchs de football sur une sélection de grosses affiches ?

---

## 2. Objectif du MVP

Le MVP doit permettre de :

- récupérer automatiquement les matchs de football à venir,
- sélectionner les grosses affiches de la semaine,
- exécuter plusieurs agents IA sur chaque match,
- stocker les plans de recherche, résultats de recherche et prédictions,
- récupérer les résultats réels après les matchs,
- calculer un score de performance,
- afficher les comparaisons et leaderboards sur une interface web.

Le MVP doit avant tout valider :

- l’architecture technique,
- le pipeline de prédiction,
- la robustesse du worker,
- la logique de scoring,
- la lisibilité du produit côté frontend.

---

## 3. Positionnement produit

Le produit est une **arène d’agents IA de prédiction football**.

Chaque agent est défini par :

- un modèle LLM via OpenRouter,
- un prompt de planification,
- un prompt de prédiction,
- une stratégie de recherche,
- un contrat de sortie JSON,
- un système de scoring post-match.

Le benchmark compare donc :

- la capacité à chercher les bonnes informations,
- la capacité à synthétiser,
- la capacité à produire une prédiction exploitable,
- la performance réelle dans le temps.

---

## 4. Périmètre du MVP

### Inclus

- sélection hebdomadaire des matchs importants,
- récupération des matchs à venir,
- exécution de plusieurs agents IA,
- stockage des plans de recherche,
- stockage des résultats de recherche,
- stockage des prédictions finales,
- récupération des résultats réels,
- scoring automatique,
- leaderboard,
- page détail par match.

### Hors scope MVP

- conseils de paris ou recommandations de mise,
- gestion des utilisateurs,
- paiement / abonnements,
- SEO avancé,
- live match en temps réel,
- application mobile native,
- support multi-sports,
- analytics produit avancés.

---

## 5. Compétitions ciblées

Le MVP cible en priorité :

- Ligue 1
- Premier League
- Bundesliga
- Champions League
- matchs internationaux / nations

Évolutions possibles ensuite :

- Liga
- Serie A
- Europa League

---

## 6. Volumétrie cible du MVP

Pour garder un périmètre raisonnable :

- 10 à 15 matchs par semaine maximum,
- 4 à 6 agents IA maximum,
- 1 mode principal de benchmark : `research_agent`.

---

## 7. Principe fonctionnel

Chaque semaine, le système :

1. récupère les matchs à venir,
2. sélectionne les plus grosses affiches,
3. crée des missions de benchmark,
4. exécute plusieurs agents IA sur chaque match,
5. stocke leurs recherches et prédictions,
6. récupère les résultats réels après les matchs,
7. calcule les scores,
8. met à jour les leaderboards.

---

## 8. Mode principal du MVP

### `research_agent`

Le mode principal du MVP repose sur un agent IA avec recherche.

Déroulé :

1. le système sélectionne un match,
2. l’agent reçoit les métadonnées du match,
3. l’agent propose un plan de recherche,
4. le backend exécute les recherches,
5. l’agent reçoit les résultats collectés,
6. l’agent produit une prédiction finale structurée.

Ce mode permet de benchmarker :

- la qualité de la planification,
- la pertinence des recherches demandées,
- la qualité d’analyse,
- la qualité de la prédiction finale.

---

## 9. Architecture technique

### Frontend

- **Framework** : Next.js latest
- **UI** : shadcn/ui
- **Hosting** : Vercel
- **Domaine** : `predict.emilienadam.dev`

### Backend API

- **Framework** : Fastify latest
- **Langage** : TypeScript
- **Validation** : Zod
- **ORM / DB layer** : Drizzle
- **Hosting** : Docker sur Proxmox
- **Domaine** : `api-predict.emilienadam.dev`

### Worker

- **Runtime** : Node.js
- **Langage** : TypeScript
- **Queue** : BullMQ
- **Broker / queue backend** : Redis
- **Hosting** : Docker sur Proxmox

### Base de données

- **SGBD** : PostgreSQL

### Reverse proxy

- **Traefik**

### Monorepo

- **Turborepo**
- **Bun**

---

## 10. Découpage du monorepo

```txt
apps/
  web/        # frontend Next.js
  api/        # backend Fastify
  worker/     # worker BullMQ / orchestration

packages/
  db/         # Drizzle, schémas SQL, accès DB
  shared/     # types, zod schemas, utilitaires
  core/       # logique métier pure
  agents/     # prompts, orchestration agents, clients OpenRouter
  config/     # config partagée
```

---

## 11. Responsabilités par application

### `apps/web`

Responsable de :

- l’interface utilisateur,
- l’affichage des matchs,
- l’affichage des prédictions,
- l’affichage des leaderboards,
- la consommation de l’API.

### `apps/api`

Responsable de :

- servir les données au frontend,
- exposer les endpoints publics,
- exposer les endpoints admin / internes si nécessaire,
- agréger les données lisibles côté front,
- contrôler les accès et valider les payloads.

### `apps/worker`

Responsable de :

- synchroniser les matchs,
- sélectionner les affiches,
- créer les missions,
- exécuter les agents IA,
- récupérer les résultats réels,
- calculer les scores,
- reconstruire les leaderboards.

---

## 12. Infrastructure cible

### Vercel

- déploiement de `apps/web`
- frontend public
- appel de l’API via `https://api-predict.emilienadam.dev`

### Proxmox / Docker

Services dockerisés :

- `traefik`
- `api`
- `worker`
- `postgres`
- `redis`

### Routage

- `predict.emilienadam.dev` -> Vercel
- `api-predict.emilienadam.dev` -> Traefik -> API Fastify

---

## 13. Workflow métier

### 13.1 Sync des matchs

Le système récupère automatiquement les matchs de la période ciblée depuis une source football.

Objectifs :

- créer ou mettre à jour les compétitions,
- créer ou mettre à jour les équipes,
- créer ou mettre à jour les matchs.

### 13.2 Sélection des affiches

Le système calcule un score d’intérêt pour chaque match.

Facteurs possibles :

- importance de la compétition,
- notoriété des équipes,
- rivalité,
- proximité de niveau,
- enjeu du match.

Sortie :

- une liste de 10 à 15 matchs maximum.

### 13.3 Création des missions

Pour chaque match sélectionné :

- création d’une mission,
- création d’un run par agent.

### 13.4 Planification de recherche

Chaque agent reçoit :

- compétition,
- équipe domicile,
- équipe extérieure,
- date du match.

Il doit retourner un JSON contenant :

- les questions importantes,
- les requêtes de recherche,
- les facteurs de prédiction.

### 13.5 Exécution des recherches

Le backend / worker exécute les recherches demandées et stocke :

- requête,
- URL source,
- domaine,
- titre,
- snippet,
- faits extraits éventuels.

### 13.6 Prédiction finale

L’agent reçoit :

- les métadonnées du match,
- les résultats de recherche collectés.

Il doit retourner une prédiction finale en JSON strict.

### 13.7 Ingestion des résultats

Après les matchs, le système récupère :

- score final,
- issue du match,
- buteurs réels.

### 13.8 Scoring

Le système compare la prédiction au résultat réel et attribue un score.

### 13.9 Leaderboard

Les résultats sont agrégés pour produire :

- un classement global,
- un classement par compétition,
- un classement par période,
- un classement par métrique.

---

## 14. Types de prédictions attendues

Chaque agent doit produire :

- `winner` : `home`, `draw`, ou `away`
- `score` : score exact prédit
- `scorers` : 1 à 3 buteurs probables
- `confidence` : niveau de confiance
- `reasoning_summary` : résumé du raisonnement

---

## 15. Contrat JSON de prédiction

Exemple de sortie attendue :

```json
{
  "winner": "home",
  "score": {
    "home": 2,
    "away": 1
  },
  "scorers": [
    {
      "team": "home",
      "player": "Player A"
    },
    {
      "team": "away",
      "player": "Player B"
    }
  ],
  "confidence": 74,
  "key_factors": [
    "home form stronger",
    "away defense weakened"
  ],
  "reasoning_summary": "Short explanation"
}
```

Cette sortie doit être validée avec Zod avant insertion en base.

---

## 16. Scoring MVP

Le scoring du MVP doit rester simple et lisible.

### Résultat du match

- bon 1N2 : +3
- mauvais 1N2 : 0

### Score exact

- score exact : +5
- bon écart de buts : +2
- bon total de buts : +1

### Buteurs

- chaque buteur correctement cité : +2

### Confiance

- bonus léger si confiance forte et bonne prédiction,
- malus léger si confiance forte et mauvaise prédiction.

---

## 17. Modèle de données principal

Entités principales :

- `competitions`
- `teams`
- `players`
- `matches`
- `benchmark_modes`
- `models`
- `prediction_missions`
- `prediction_runs`
- `research_plans`
- `research_results`
- `predictions`
- `predicted_scorers`
- `match_actual_scorers`
- `prediction_scores`

---

## 18. Endpoints API

### Public

- `GET /api/matches`
- `GET /api/matches/:id`
- `GET /api/leaderboard`
- `GET /api/predictions?matchId=:id`
- `GET /api/predictions/:id`

### Admin / interne

- `POST /api/admin/sync-matches`
- `POST /api/admin/select-featured`
- `POST /api/admin/create-missions`
- `POST /api/admin/run-predictions`
- `POST /api/admin/ingest-results`
- `POST /api/admin/score`
- `POST /api/admin/rebuild-leaderboards`

---

## 19. Jobs du worker

Le worker doit gérer au minimum :

- `sync-matches`
- `select-featured`
- `create-missions`
- `run-research-plan`
- `run-research-fetch`
- `run-final-prediction`
- `ingest-results`
- `score-predictions`
- `rebuild-leaderboards`

---

## 20. Pages du frontend

### Home

Doit afficher :

- les grosses affiches de la semaine,
- un leaderboard principal,
- les agents les plus performants,
- les derniers matchs scorés.

### Match detail

Doit afficher :

- les équipes,
- la compétition,
- la date,
- le score réel si disponible,
- les prédictions de chaque agent,
- les plans de recherche,
- les sources consultées,
- les points obtenus.

### Leaderboard

Doit afficher :

- le classement global,
- des filtres par période,
- des filtres par compétition,
- des filtres par métrique.

---

## 21. Validation et normalisation

### Validation

Toutes les entrées et sorties critiques doivent être validées avec Zod :

- payloads API,
- réponses du worker,
- réponses LLM,
- structures de scoring.

### Normalisation

Le système doit normaliser :

- noms d’équipes,
- noms de joueurs,
- alias connus,
- formats de scores,
- noms de compétitions.

Objectif :

- éviter les faux négatifs,
- faciliter le matching,
- garantir un scoring cohérent.

---

## 22. Observabilité

Le système doit journaliser au minimum :

- le modèle utilisé,
- le mode,
- la version du prompt,
- les requêtes de recherche,
- les résultats de recherche,
- le coût estimé,
- la durée d’exécution,
- le statut du job,
- les erreurs éventuelles.

---

## 23. Contraintes de conception

- garder PostgreSQL comme source de vérité unique,
- garder une sortie JSON stricte et validée,
- séparer clairement API publique et worker,
- ne pas mélanger orchestration des agents et serving API,
- limiter la concurrence des jobs au début,
- garder une trace des recherches demandées,
- éviter une navigation web totalement opaque.

---

## 24. Critères de réussite du MVP

Le MVP est considéré comme réussi si :

1. les matchs de la semaine remontent automatiquement,
2. les grosses affiches sont correctement sélectionnées,
3. plusieurs agents produisent des prédictions valides,
4. les résultats réels sont récupérés correctement,
5. le scoring est fiable,
6. le frontend affiche les comparaisons clairement,
7. le leaderboard permet d’identifier les meilleurs agents.

---

## 25. Risques principaux

### Données football bruitées

Certaines sources peuvent être contradictoires ou incomplètes.

### Coût LLM

Le nombre de matchs, d’agents et de recherches peut faire monter les coûts.

### Variabilité des recherches

Les résultats de recherche peuvent être instables selon les sources disponibles.

### Hallucinations

Les agents peuvent produire :

- des joueurs inexistants,
- des structures JSON invalides,
- des incohérences métier.

---

## 26. Roadmap MVP

### Phase 1

- monorepo Turborepo initialisé,
- frontend Next.js,
- API Fastify,
- worker BullMQ,
- Drizzle + PostgreSQL,
- sync des matchs,
- sélection des affiches,
- stockage des runs.

### Phase 2

- planification de recherche,
- exécution des recherches,
- prédictions finales,
- ingestion des résultats réels,
- scoring.

### Phase 3

- pages frontend complètes,
- leaderboard,
- détail match,
- observabilité minimale,
- amélioration de la robustesse.

---

## 27. Résumé opérationnel

Football AI Prediction Arena est une plateforme de benchmark d’agents IA appliqués à la prédiction football.

Le MVP doit permettre de :

- sélectionner les matchs importants,
- faire travailler plusieurs agents IA dessus,
- stocker tout le pipeline de recherche et de prédiction,
- récupérer les résultats réels,
- scorer les agents,
- afficher les performances sur une interface web claire.

Le système repose sur un monorepo moderne avec :

- Next.js côté frontend,
- Fastify côté API,
- Node.js + BullMQ côté worker,
- Redis pour la queue,
- PostgreSQL pour la donnée,
- Drizzle pour l’accès DB,
- Zod pour la validation,
- Traefik pour le reverse proxy,
- Docker sur Proxmox pour l’infra backend.
