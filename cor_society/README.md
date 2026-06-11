# Roman Society

Roman Society adds a living social layer to Citizen of Rome.

## Features

- Adds a global `Roman Society` action and does not add a character action, keeping entry points predictable on Android.
- Groups houses into social orders using existing game data: dynasty prestige, heritage, jobs, inheritance, Senate links, and living members.
- Generates missing houses so every social level has families to interact with.
- Seeds generated houses with real game characters at startup, including visible family members, spouse links, and children where age makes sense.
- Uses vanilla Citizen of Rome portraits for houses and people through `daapi.getCharacterIcon`.
- Falls back to generated Roman-style SVG portraits when the game does not return a usable portrait image.
- Gives generated characters vanilla Citizen of Rome traits through `daapi.addTrait`.
- Generates persistent Roman-style house shields for the player and every known NPC house.
- Adds a separate global `House Shield` action for editing the player's shield without cluttering the Society menus.
- Tracks persistent relationships, favors, rivalries, patronage, trade ties, allies, rivals, and past affairs.
- Splits allies/patrons and rivals into separate menus.
- Shows past affairs as paged notification-style entries with their own event icons.
- Uses copied vanilla interface icons for social orders and Society actions where the mod API allows local assets.
- Lets the player inspect every known living dynasty member through Notables, Established members, and Common kin.
- Lets the player interact with houses and characters, including Society actions plus vanilla / other mod character actions when the game exposes them.
- Adds character family navigation: vanilla known-family/full-tree navigation uses the game's selected-character store state, with a Society fallback tree using real parent, spouse, child, and sibling IDs.
- Lets the player arrange marriages between unmarried adults from their household and NPC houses using the game's marriage API.
- Includes the current player character as a marriage candidate when they are unmarried, so starts without a spouse and sudden succession cases can still use Society marriages.
- Shows short parenthesized reasons when marriage is unavailable, such as no adult, too high, too low, or required relation.
- Adds native button tooltips to Society menus and event popups so long-pressing/holding an option shows the expected consequences before confirming it.
- Restricts marriages by order: one order down, same order, one order up, or two orders up with very high relations.
- Applies real game effects through cash, prestige, influence, revenue modifiers, and monthly events.
- Lets houses play their own monthly social game through wealth, power, stability, agendas, family events, inter-house marriages, pregnancies, and inter-house relationships.
- Gives each house a separate virtual-player state: AI cash, AI influence, AI prestige, property, focus, and controller marker.
- Lets large vanilla changes to the player's cash, influence, or prestige shift Society relations, so base-game events can affect the social map too.
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

Generated people are created with the game's own `daapi.generateCharacter` flow. Society gives them real character IDs, vanilla Roman looks, vanilla traits, `flagDoNotCull`, and family links such as `spouseId`, `fatherId`, `motherId`, and `childrenIds` where appropriate. Society menus first try to display vanilla character portraits from the game; if that fails on a platform or character, the mod generates a stable Roman-style portrait from the character's name, age, gender, look data, job, and social order.

Generated characters are given a real game character ID and a vanilla Roman `look` (`group: roman`, type, gender), so the game can recognize them as normal characters. The SVG portrait is only a Society fallback when the platform does not return a usable game portrait image.

Generated traits use vanilla trait keys from the official example mod documentation, such as `senator`, `educated`, `literate`, `honorable`, `ambitious`, `gregarious`, `strong`, and `sly`.

Arranged marriages and AI house marriages call `daapi.performMarriage`, so the resulting spouse relationship should appear in the vanilla family UI after the game refreshes. If the vanilla marriage API rejects a wedding, Society does not fake the spouse link by writing `spouseId` manually; it shows an error and applies no Society effects. Marrying upward improves prestige and influence but costs more; marrying downward can improve practical support and local ties while costing some elite standing.

AI houses can also attempt pregnancies through `daapi.impregnate`. The base game remains responsible for resolving the birth; Society records the pregnancy and later detects new child IDs when the dynasty updates.

House shields are generated locally as SVG images and saved in the mod state. NPC house shields appear beside family portraits in Society lists. The player shield is configured from the `House Shield` global action and is shown as a small portrait badge when the mod can identify the current player portrait in the UI.

Each month, houses pursue their own agenda. Some affairs only change the social map and appear in `Past Affairs`; others become decisions for the player and can affect influence, prestige, cash, relationships, favors, rivalries, or revenue.

Roman Society does not use `setCurrentCharacter` and does not take control away from the human player. Vanilla family screens are opened by setting the game's `selectedCharacterId`, which selects the tree being viewed without changing the current playable character. NPC houses are simulated by the mod as separate virtual players, marked internally as `cor_society_ai`.
