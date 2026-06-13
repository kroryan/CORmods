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
- Uses limited concurrent pretranslation for event popups so first-time translations do not wait on one request at a time
- Splits long notification text into smaller cached chunks for first-time translation and offline reuse
- Translates interaction modal payloads before display, including option text and long-press tooltips
- Reuses cached fragments for dynamic labels and consequence lines so repeated mod menus do not need to relearn every numeric variant
- Skips isolated proper names so repeated family events can reuse cached text instead of treating every house name as a new sentence
- Respects a mod opt-out flag for immediate pretranslation so responsive mod menus can still be translated from cache without waiting on network calls
- Allows exporting and importing translation cache JSON

**Important Limitation:**
The mod can only translate text that the game has loaded into the page. Hidden events, future popups, and screens you have not visited yet cannot be guaranteed until they appear while the mod is in online learning mode, or until you import a cache that already contains those translations.
