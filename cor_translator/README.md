# CoR Translator

Offline-cache translator mod for Citizen of Rome.

## What it can do

- Adds a global `CoR Translator` button.
- Lets you choose the target language from the mod settings.
- Translates visible game text with Google Translate while online.
- Saves each `English text -> translated text` pair in the browser/game local cache.
- Reuses the saved cache offline after the text has been learned once.
- Hooks interaction modal payloads before they are shown, so titles, messages, dropdown labels, option text, and long-press tooltips can be learned and replaced more uniformly.
- Reuses cached fragments inside multiline and dynamic mod menus, including label/value lines, numbered consequence lists, and short parenthesized reasons.
- Includes 5 minute and 20 minute intensive scan buttons.
- Can export/import a language cache as JSON.

## Important limit

The mod can only translate text that the game has loaded into the page. It cannot guarantee every possible event, future popup, or hidden route is translated unless those texts appear while the mod is in online learning mode, or unless you import a cache that already contains them.

## Recommended use

1. Start the game online.
2. Open `CoR Translator`.
3. Choose your target language.
4. Keep mode as `Online learn + offline cache`.
5. Use `Intensive scan 20 min` and visit the main screens/menus.
6. Keep playing online for a while so event popups are discovered.
7. Switch to `Offline cache only` when you want to play without Internet.

If the cache is good, the game will keep replacing known English text offline.
