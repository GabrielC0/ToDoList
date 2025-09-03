# ToDoList - Application Angular

Une application simple de gestion de tâches construite avec Angular et Tailwind CSS.

## Fonctionnalités

- Gestion des tâches (créer, modifier, supprimer)
- Organisation en colonnes Kanban (À faire, En cours, Terminé)
- Système de priorité (Faible, Moyenne, Élevée)
- Interface responsive avec Tailwind CSS

## Technologies

- Angular 17
- Tailwind CSS
- TypeScript
- Angular Signals

## Installation

1. Cloner le projet
2. Installer les dépendances : `npm install`
3. Démarrer le serveur : `npm start`
4. Ouvrir `http://localhost:4200`

## Scripts

- `npm start` - Démarrer le serveur de développement
- `npm run build` - Construire l'application
- `npm run lint` - Vérifier le code
- `npm run format` - Formater le code

## Structure

```
src/
├── app/
│   ├── features/
│   │   ├── auth/          # Module d'authentification
│   │   ├── todos/         # Module de gestion des tâches
│   │   └── admin/         # Module d'administration
│   └── shared/            # Composants partagés
└── styles.scss            # Styles Tailwind CSS
```
