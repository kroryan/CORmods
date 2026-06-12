# Roman Society

Roman Society adds a living social layer to Citizen of Rome.

## Features

- Adds a global `Roman Society` action and does not add a character action, keeping entry points predictable on Android.
- Groups houses into social orders using existing game data: dynasty prestige, heritage, jobs, inheritance, Senate links, and living members.
- Generates missing houses so every social level has families to interact with.
- Seeds generated houses with real game characters at startup, preferring young adult founders so they have time to marry, have children, rise, or fall.
- Uses vanilla Citizen of Rome portrait assets through a local `icons/characters/...` to `img/*.svg` resolver, and keeps vanilla look data as the base identity.
- Uses stable vanilla-based looks for Society-generated characters, with age progression and inherited look colors.
- Gives generated characters vanilla Citizen of Rome traits through `daapi.addTrait`.
- Generates persistent Roman-style house shields for the player and every known NPC house.
- Adds a separate global `House Shield` action for editing the player's shield without cluttering the Society menus.
- Adds a global `Family Wardrobe` action with its own wardrobe icon for changing household clothing, with outfit availability tied to the player's Society order.
- Bundles compatible standalone actions inside Society so they do not need separate installation: Play As, Attempt Murder, animal stealing events, Disinherit, Restore Inheritance, and optional desktop DevTools access.
- Tracks persistent relationships, favors, rivalries, patronage, trade ties, allies, rivals, and past affairs.
- Splits allies/patrons and rivals into separate paged menus with matching overview counts and contextual Back navigation.
- Shows past affairs as paged notification-style entries with their own event icons.
- Uses copied vanilla interface icons for social orders and Society actions where the mod API allows local assets.
- Lets the player inspect every known living dynasty member through Notables, Established members, and Common kin.
- Lets the player interact with houses and characters, including Society actions plus vanilla / other mod character actions when the game exposes them.
- Adds character family navigation through one `Full family tree` button, using a graphical Society family tree with portrait cards, spouse links, children branches, zoom, centering, stable Back navigation, and dark/light theme detection.
- Lets the player arrange marriages between unmarried adults from their household and NPC houses using the game's marriage API.
- Includes the current player character as a marriage candidate when they are unmarried, so starts without a spouse and sudden succession cases can still use Society marriages.
- Shows short parenthesized reasons when marriage is unavailable, such as no adult, too high, too low, or required relation.
- Adds native button tooltips to Society menus and event popups so long-pressing/holding an option shows the expected consequences before confirming it.
- Restricts marriages by order: one order down, same order, one order up, or two orders up with very high relations.
- Derives the player's Society order from the base game's property class, senatorial flag, and vanilla heritage, then updates the visible main-screen citizen title without overwriting vanilla `heritage`.
- Applies real game effects through cash, prestige, influence, revenue modifiers, and monthly events.
- Lets houses play their own monthly social game through wealth, power, stability, agendas, family events, inter-house marriages, pregnancies, inter-house relationships, and rank movement.
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

Generated people are created with the game's own `daapi.generateCharacter` flow. Society gives them real character IDs, vanilla Roman looks, vanilla traits, `flagDoNotCull`, and family links such as `spouseId`, `fatherId`, `motherId`, and `childrenIds` where appropriate. Every Society-generated living person is marked internally and receives dead generated parents if the game did not already give them parents, so trees have a basic root without adding dead people to living member lists.

Generated characters are given a real game character ID and a vanilla Roman base `look`, so the game can recognize them as normal characters. Children inherit the base look type from parents with small variation, and portraits age by stage without losing that inherited visual base.

The wardrobe stores a manual `corSocietyOutfit` on the selected household member and preserves the original vanilla `look` in `corSocietyOriginalLook`. While a manual outfit is active, Society registers a complete DAAPI portrait look in `cor_society_wardrobe` so vanilla character screens can render the changed portrait. Choosing `Automatic` restores the preserved vanilla look. Older saves that still have a previous `cor_society` DAAPI portrait look are migrated back to their stored vanilla `corSocietyOriginalLook`.

Generated traits use vanilla trait keys from the official example mod documentation, such as `senator`, `educated`, `literate`, `honorable`, `ambitious`, `gregarious`, `strong`, and `sly`.

Arranged marriages and AI house marriages call `daapi.performMarriage`, so the resulting spouse relationship should appear in the vanilla family UI after the game refreshes. If the vanilla marriage API rejects a wedding, Society does not fake the spouse link by writing `spouseId` manually; it shows an error and applies no Society effects. Marrying upward improves prestige and influence but costs more; marrying downward can improve practical support and local ties while costing some elite standing.

The player's Society order is calculated from the same economic ladder used by the base game: Proletarii, Class V, Class IV, Class III, Class II, Class I, Equites, and Senatores. Novus Homo remains a vanilla heritage value, but Society treats it as a civic-status marker once the household has enough property class to support that rank. The main-screen citizen title is patched visually so it can evolve with Society status while leaving the vanilla data intact for elections and other base-game systems.

AI houses can also attempt pregnancies through `daapi.impregnate`. The base game remains responsible for resolving the birth; Society records the pregnancy and later detects new child IDs when the dynasty updates.

House shields are generated locally as SVG images and saved in the mod state. NPC house shields appear beside family portraits in Society lists. The player shield is configured from the `House Shield` global action and is shown as a small portrait badge when the mod can identify the current player portrait in the UI.

Each month, houses pursue their own agenda. Some affairs only change the social map and appear in `Past Affairs`; others become decisions for the player and can affect influence, prestige, cash, relationships, favors, rivalries, or revenue. Trade ventures are now investments with a one or two month settlement notice instead of instant monthly income.

Roman Society does not use `setCurrentCharacter` and does not take control away from the human player. Vanilla family screens are opened by setting the game's `selectedCharacterId`, which selects the tree being viewed without changing the current playable character. NPC houses are simulated by the mod as separate virtual players, marked internally as `cor_society_ai`; they can rise or fall between social orders as their simulated wealth, power, and stability change.

The base game blocks external platform achievements when `current.flagUsedMods` is true. Society clears that mod-used flag during its own tick so achievements can remain available while using this mod, but vanilla easy mode and sandbox mode still block achievements.

## Bundled Mod Credits

The bundled Play As, Murder, Stealing From, and Open DevTools snippets in `bundled/` are from `CitizenOfRomeDynastyAscendant` / the Citizen of Rome example mod ecosystem and are included here with route and asset paths adapted so Roman Society can ship as one installable package.

The Disinheritance and Restore Inheritance actions are bundled from the local `CORmods` versions and adapted to run from inside Roman Society.
