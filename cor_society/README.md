# Roman Society

Roman Society adds a living social layer to Citizen of Rome.

## Features

- Adds a global `Roman Society` action.
- Groups houses into social orders using existing game data: dynasty prestige, heritage, jobs, inheritance, Senate links, and living members.
- Generates missing houses so every social level has families to interact with.
- Uses vanilla Citizen of Rome portraits for houses and people through `daapi.getCharacterIcon`.
- Falls back to generated Roman-style SVG portraits when the game does not return a usable portrait image.
- Generates persistent Roman-style house shields for the player and every known NPC house.
- Adds a separate global `House Shield` action for editing the player's shield without cluttering the Society menus.
- Tracks persistent relationships, favors, rivalries, patronage, trade ties, and recent affairs.
- Lets the player interact with houses and notable characters.
- Applies real game effects through cash, prestige, influence, revenue modifiers, and monthly events.
- Lets houses play their own monthly social game through wealth, power, stability, agendas, family events, and inter-house relationships.
- Gives each house a separate virtual-player state: AI cash, AI influence, AI prestige, property, focus, and controller marker.
- Can surface family events to the player: office campaigns, marriage alliances, inheritance disputes, trade ventures, scandals, feuds, petitions, and slander.

## Social Orders

- Senatorial houses
- Equestrian houses
- Civic citizens
- Plebeian citizens
- Freedmen
- Urban poor

## Notes

The mod uses the game's existing characters and dynasties first. Generated houses are only added when a social order has too few living non-household characters.

Generated people are created with the game's own `daapi.generateCharacter` flow. Society menus first try to display vanilla character portraits from the game; if that fails on a platform or character, the mod generates a stable portrait from the character's name, age, gender, and look data.

House shields are generated locally as SVG images and saved in the mod state. NPC house shields appear beside family portraits in Society lists. The player shield is configured from the `House Shield` global action and is shown as a small portrait badge when the mod can identify the current player portrait in the UI.

Each month, houses pursue their own agenda. Some affairs only change the social map and appear in `Recent Affairs`; others become decisions for the player and can affect influence, prestige, cash, relationships, favors, rivalries, or revenue.

Roman Society does not use `setCurrentCharacter` and does not take control away from the human player. NPC houses are simulated by the mod as separate virtual players, marked internally as `cor_society_ai`.
