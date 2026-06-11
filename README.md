# Citizen of Rome Mods

This repository contains custom mods for Citizen of Rome: Dynasty Ascendant.

## Disinheritance Mod
A mod that allows you to disinherit family members from your household. With this mod, you can remove the inheritance rights of any living character in your family. Using this action will result in a penalty to your prestige (-10) and influence (-20), reflecting the social impact of such a decision.

**Key Features:**
- Adds a "Disinherit" action for living family members
- Shows a confirmation dialogue before executing the action
- Cannot be used on already disinherited or dead characters
- Includes a custom icon showing a crossed-out inheritance document

## Restore Inheritance Mod
A complementary mod that allows you to restore previously disinherited family members to their inheritance rights. This mod provides a way to undo a disinheritance, granting a small boost to prestige (+5) and influence (+10) as a reward for the reconciliation.

**Key Features:**
- Adds a "Restore Inheritance" action for disinherited family members
- Shows a confirmation dialogue before restoring rights
- Only appears for previously disinherited living characters
- Includes a custom icon showing an approved inheritance document with a green checkmark

Both mods integrate seamlessly into the game's interface and provide appropriate visual feedback through their respective icons and confirmation dialogues.

## CoR Translator Mod
A translation helper mod that learns visible English text while online, saves translations in a local cache, and reuses that cache for offline play. It is designed for players who want to translate the game once over time, then keep playing with the saved translations.

**Key Features:**
- Adds a "CoR Translator" global action
- Shows a one-time "CoR Translator loaded" popup to confirm the mod is active
- Supports target language selection from the mod settings
- Includes online learning mode, offline-cache-only mode, and paused mode
- Provides "Learn visible now", "Intensive scan 5 min", and "Intensive scan 20 min" actions
- Stores translations by language for offline use after they have been learned
- Hooks both normal interaction modals and button-style event notifications
- Pretranslates uncached modal/event text before display while online learning is available
- Splits long notification text into smaller cached chunks for first-time translation and offline reuse
- Translates interaction modal payloads before display, including option text and long-press tooltips
- Reuses cached fragments for dynamic labels and consequence lines so repeated mod menus do not need to relearn every numeric variant
- Allows exporting and importing translation cache JSON

**Important Limitation:**
The mod can only translate text that the game has loaded into the page. Hidden events, future popups, and screens you have not visited yet cannot be guaranteed until they appear while the mod is in online learning mode, or until you import a cache that already contains those translations.

## Roman Society Mod
A social simulation layer inspired by court and dynasty politics. It uses existing Citizen of Rome characters and dynasties, generates missing houses across social orders, and gives those houses relationships, agendas, wealth, power, stability, favors, rivalries, and monthly affairs.

**Key Features:**
- Adds a "Roman Society" global action without adding a separate character action
- Adds a separate "House Shield" global action for configuring the player's house shield
- Groups houses into senatorial, equestrian, civic, plebeian, freedman, and poor orders
- Seeds generated houses with real game characters at startup, including visible family members, spouse links, and children where age makes sense
- Uses social-order icons, separate Allies/Patrons and Rivals menus, and paged Past Affairs displayed as individual notification-style entries
- Lets the player inspect houses and every known living dynasty member through Notables, Established members, and Common kin, with vanilla character portraits, generated fallback portraits, and generated Roman-style house shields
- Adds character family navigation through vanilla known-family/full-tree route attempts plus a Society fallback tree using real parent, spouse, child, and sibling IDs
- Exposes vanilla character actions from the base game when a character currently has them
- Generated Society characters receive vanilla Citizen of Rome traits through the game's trait API
- Lets the player arrange marriages between their family and NPC houses through the vanilla marriage API, including the current player character when unmarried, without faking spouse links if the vanilla API rejects a wedding
- Marriage actions show a short unavailable reason in parentheses and affect prestige, influence, revenue, cash, relations, and favors according to social rank
- All Society buttons, including event options and global actions, provide hold/long-press tooltips explaining the consequences before pressing
- Supports gifts, dinners, patronage, political support, trade deals, rivalries, reconciliation, praise, introductions, and rumors
- Gives houses their own monthly virtual-player simulation with AI cash, influence, prestige, property, agendas, family events, inter-house marriages, pregnancies, and inter-house affairs
- Lets large vanilla changes to the player's cash, influence, or prestige shift Society relations, so base-game events can affect the social map too
- Produces player-facing events such as office campaigns, marriage alliances, inheritance disputes, trade ventures, scandals, petitions, and slander
- Applies real effects through cash, prestige, influence, favors, relations, rival pressure, and revenue modifiers
