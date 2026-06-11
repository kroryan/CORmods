# CoR Translator

Offline-cache translator mod for Citizen of Rome.

## What it can do

- Adds a global `CoR Translator` button.
- Lets you choose the target language from the mod settings.
- Translates visible game text with Google Translate while online.
- Saves each `English text -> translated text` pair in the browser/game local cache.
- Reuses the saved cache offline after the text has been learned once.
- Hooks both interaction modal queues used by the game, including normal modals and button-style event notifications.
- Pretranslates uncached modal text before display while online learning is available, so first-time event popups are more likely to appear translated instead of waiting for the next scan.
- Runs modal pretranslation with limited concurrency, reducing long waits when a popup has many fields or long tooltips.
- Splits long notification/event text into sentence-sized chunks before sending it to Google Translate, then caches those chunks for offline reuse.
- Hooks interaction modal payloads before they are shown, so titles, messages, dropdown labels, option text, and long-press tooltips can be learned and replaced more uniformly.
- Reuses cached fragments inside multiline and dynamic mod menus, including label/value lines, numbered consequence lists, and short parenthesized reasons.
- Avoids translating isolated proper names, which keeps repeated family events from relearning every house name as a new phrase.
- Includes 5 minute and 20 minute intensive scan buttons.
- Can export/import a language cache as JSON.

## Important limit

The mod can only translate text that the game has loaded or is about to show in a modal. It cannot guarantee every possible event, future popup, or hidden route is translated unless those texts appear while the mod is in online learning mode, or unless you import a cache that already contains them.

## Recommended use

1. Start the game online.
2. Open `CoR Translator`.
3. Choose your target language.
4. Keep mode as `Online learn + offline cache`.
5. Use `Intensive scan 20 min` and visit the main screens/menus.
6. Keep playing online for a while so event popups are discovered.
7. Switch to `Offline cache only` when you want to play without Internet.

If the cache is good, the game will keep replacing known English text offline.
