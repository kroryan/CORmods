{
  canTriggerIfUnavailable: true,
  checkType: 'general',
  checkAndAct() {
    daapi.invokeMethod({
      event: '/cor_translator/main',
      method: 'boot'
    })
    let state = daapi.getState()
    let currentCharacterId = state && state.current && state.current.id
    daapi.addGlobalAction({
      key: 'cor_translator',
      action: {
        title: 'CoR Translator',
        icon: daapi.requireImage('/cor_translator/icon.svg'),
        isAvailable: true,
        process: {
          event: '/cor_translator/main',
          method: 'openSettings'
        }
      }
    })
    if (currentCharacterId) {
      daapi.addCharacterAction({
        characterId: currentCharacterId,
        key: 'cor_translator',
        action: {
          title: 'CoR Translator',
          icon: daapi.requireImage('/cor_translator/icon.svg'),
          isAvailable: true,
          hideWhenBusy: false,
          process: {
            event: '/cor_translator/main',
            method: 'openSettings'
          }
        }
      })
    }
  },
  methods: {
    boot() {
      if (window.corTranslator && window.corTranslator.version === '1.0.0') {
        window.corTranslator.ensureRunning()
        window.corTranslator.showInstallNoticeOnce()
        return
      }

      window.corTranslator = {
        version: '1.0.0',
        event: '/cor_translator/main',
        storagePrefix: 'corTranslator.v1.',
        configFlag: 'corTranslatorConfig',
        importFlag: 'corTranslatorImportText',
        noticeFlag: 'corTranslatorInstallNoticeSeen',
        dictionary: {},
        queue: [],
        queued: {},
        failedAt: {},
        translating: false,
        observer: false,
        scanTimer: false,
        saveTimer: false,
        scanRequested: false,
        loadedLanguage: false,
        stats: {
          discovered: 0,
          translated: 0,
          failed: 0,
          lastError: ''
        },
        defaultConfig: {
          sourceLang: 'en',
          targetLang: 'es',
          mode: 'learn',
          scanIntervalMs: 700,
          requestDelayMs: 350,
          intensiveUntil: 0,
          debug: false
        },
        languages: [
          { label: 'Spanish', value: 'es' },
          { label: 'French', value: 'fr' },
          { label: 'German', value: 'de' },
          { label: 'Italian', value: 'it' },
          { label: 'Portuguese', value: 'pt' },
          { label: 'Polish', value: 'pl' },
          { label: 'Russian', value: 'ru' },
          { label: 'Turkish', value: 'tr' },
          { label: 'Chinese Simplified', value: 'zh-CN' },
          { label: 'Japanese', value: 'ja' },
          { label: 'Korean', value: 'ko' },
          { label: 'Arabic', value: 'ar' }
        ],
        modes: [
          {
            label: 'Online learn + offline cache',
            value: 'learn'
          },
          {
            label: 'Offline cache only',
            value: 'offline'
          },
          {
            label: 'Paused / show original',
            value: 'paused'
          }
        ],
        ensureRunning() {
          this.config = this.loadConfig()
          this.loadDictionary()
          this.startObserver()
          this.startScanTimer()
          this.scheduleScan(30)
        },
        showInstallNoticeOnce() {
          let seen = false
          try {
            seen = !!(window.localStorage && window.localStorage.getItem(this.storagePrefix + 'noticeSeen'))
          } catch (err) {
            seen = false
          }
          try {
            seen = seen || !!daapi.getGlobalFlag({ flag: this.noticeFlag })
          } catch (err) {
            seen = seen || false
          }
          if (seen) {
            return
          }
          try {
            if (window.localStorage) {
              window.localStorage.setItem(this.storagePrefix + 'noticeSeen', '1')
            }
          } catch (err) {
            this.noteError('Notice flag local storage failed: ' + err.message)
          }
          try {
            daapi.setGlobalFlag({ flag: this.noticeFlag, data: true })
          } catch (err) {
            this.noteError('Notice flag write failed: ' + err.message)
          }
          setTimeout(() => {
            daapi.pushInteractionModalQueue({
              title: 'CoR Translator loaded',
              message: 'The translator mod is active. If the global button is hidden on Android, tap the current character and use the CoR Translator character action.',
              image: daapi.requireImage('/cor_translator/icon.svg'),
              options: [
                {
                  variant: 'info',
                  text: 'Open settings',
                  action: {
                    event: this.event,
                    method: 'openSettings'
                  }
                },
                {
                  text: 'Later'
                }
              ]
            })
          }, 800)
        },
        loadConfig() {
          let config = this.readJson(this.storagePrefix + 'config', this.configFlag) || {}
          config = { ...this.defaultConfig, ...config }
          if (!this.languages.find((language) => language.value === config.targetLang)) {
            config.targetLang = this.defaultConfig.targetLang
          }
          if (!this.modes.find((mode) => mode.value === config.mode)) {
            config.mode = this.defaultConfig.mode
          }
          return config
        },
        saveConfig() {
          this.writeJson(this.storagePrefix + 'config', this.config, this.configFlag, true)
        },
        getDictionaryKey() {
          return this.storagePrefix + 'dictionary.' + this.config.targetLang
        },
        getDictionaryFlag() {
          return 'corTranslatorDictionary_' + this.config.targetLang.replace(/[^a-zA-Z0-9]/g, '_')
        },
        loadDictionary() {
          if (this.loadedLanguage === this.config.targetLang && this.dictionary) {
            return
          }
          this.loadedLanguage = this.config.targetLang
          this.dictionary = this.readJson(this.getDictionaryKey(), this.getDictionaryFlag()) || {}
          this.queue = []
          this.queued = {}
          this.failedAt = {}
        },
        saveDictionarySoon() {
          if (this.saveTimer) {
            clearTimeout(this.saveTimer)
          }
          this.saveTimer = setTimeout(() => {
            this.writeJson(this.getDictionaryKey(), this.dictionary, this.getDictionaryFlag(), false)
            this.saveTimer = false
          }, 600)
        },
        readJson(key, flag) {
          try {
            let value = window.localStorage && window.localStorage.getItem(key)
            if (value) {
              return JSON.parse(value)
            }
          } catch (err) {
            this.noteError('Local storage read failed: ' + err.message)
          }
          try {
            if (flag && window.daapi && daapi.getGlobalFlag) {
              return daapi.getGlobalFlag({ flag })
            }
          } catch (err) {
            this.noteError('Flag read failed: ' + err.message)
          }
          return false
        },
        writeJson(key, data, flag, alwaysWriteFlag) {
          let wroteLocalStorage = false
          try {
            if (window.localStorage) {
              window.localStorage.setItem(key, JSON.stringify(data))
              wroteLocalStorage = true
            }
          } catch (err) {
            this.noteError('Local storage write failed: ' + err.message)
          }
          if (!wroteLocalStorage || alwaysWriteFlag) {
            try {
              if (flag && window.daapi && daapi.setGlobalFlag) {
                daapi.setGlobalFlag({ flag, data })
              }
            } catch (err) {
              this.noteError('Flag write failed: ' + err.message)
            }
          }
        },
        startObserver() {
          if (this.observer || !window.MutationObserver || !document.body) {
            return
          }
          this.observer = new MutationObserver(() => {
            this.scheduleScan(80)
          })
          this.observer.observe(document.body, {
            childList: true,
            characterData: true,
            subtree: true
          })
        },
        startScanTimer() {
          if (this.scanTimer) {
            return
          }
          this.scanTimer = setInterval(() => {
            this.scanDocument()
          }, Math.max(250, this.config.scanIntervalMs || 700))
        },
        scheduleScan(delay) {
          if (this.scanRequested) {
            return
          }
          this.scanRequested = true
          setTimeout(() => {
            this.scanRequested = false
            this.scanDocument()
          }, delay || 100)
        },
        canFetchTranslations() {
          return (
            this.config &&
            (this.config.mode === 'learn' || this.isIntensiveActive()) &&
            window.fetch &&
            this.config.targetLang &&
            this.config.targetLang !== this.config.sourceLang
          )
        },
        isIntensiveActive() {
          return this.config && this.config.intensiveUntil && Date.now() < this.config.intensiveUntil
        },
        scanDocument() {
          if (!document.body || !this.config || this.config.mode === 'paused') {
            return
          }
          if (this.config.intensiveUntil && Date.now() >= this.config.intensiveUntil) {
            this.config.intensiveUntil = 0
            this.saveConfig()
          }
          this.scanTextNodes(document.body)
          this.pumpQueue()
        },
        scanTextNodes(root) {
          let nodeFilter = window.NodeFilter
          let accept = nodeFilter ? nodeFilter.FILTER_ACCEPT : 1
          let reject = nodeFilter ? nodeFilter.FILTER_REJECT : 2
          let showText = nodeFilter ? nodeFilter.SHOW_TEXT : 4
          let walker = document.createTreeWalker(
            root,
            showText,
            {
              acceptNode: (node) => {
                if (!node || !node.parentElement || this.isIgnoredElement(node.parentElement)) {
                  return reject
                }
                return this.shouldTranslateRaw(node.nodeValue || '') ? accept : reject
              }
            },
            false
          )
          let node = walker.nextNode()
          while (node) {
            this.processTextNode(node)
            node = walker.nextNode()
          }
        },
        isIgnoredElement(element) {
          if (!element || !element.tagName) {
            return true
          }
          let tagName = element.tagName.toLowerCase()
          if (
            tagName === 'script' ||
            tagName === 'style' ||
            tagName === 'noscript' ||
            tagName === 'textarea' ||
            tagName === 'input' ||
            tagName === 'select' ||
            tagName === 'option' ||
            tagName === 'svg' ||
            tagName === 'canvas'
          ) {
            return true
          }
          if (element.isContentEditable) {
            return true
          }
          if (element.closest) {
            return !!element.closest('.skiptranslate, .goog-te-banner-frame, .goog-te-menu-frame, .cor-translator-ignore')
          }
          return false
        },
        shouldTranslateRaw(text) {
          let clean = this.normalizeText(text)
          if (!clean || clean.length < 2 || clean.length > 700) {
            return false
          }
          if (/^https?:\/\//i.test(clean)) {
            return false
          }
          if (!/[A-Za-z]/.test(clean)) {
            return false
          }
          if (/^[\d\s.,:;!?+\-*/()[\]{}%$#@'"_]+$/.test(clean)) {
            return false
          }
          return true
        },
        processTextNode(node) {
          let originalRaw = this.getOriginalRaw(node)
          let key = this.normalizeText(originalRaw)
          if (!this.shouldTranslateRaw(key)) {
            return
          }
          this.stats.discovered += 1
          let translation = this.dictionary[key]
          if (translation) {
            this.applyTranslation(node, originalRaw, translation)
          } else if (this.canFetchTranslations()) {
            this.enqueue(key)
          }
        },
        getOriginalRaw(node) {
          let current = node.nodeValue || ''
          if (
            node.__corTranslatorOriginalRaw &&
            node.__corTranslatorTranslatedRaw &&
            current === node.__corTranslatorTranslatedRaw &&
            node.__corTranslatorLang === this.config.targetLang
          ) {
            return node.__corTranslatorOriginalRaw
          }
          if (
            node.__corTranslatorOriginalRaw &&
            current === node.__corTranslatorOriginalRaw
          ) {
            return node.__corTranslatorOriginalRaw
          }
          node.__corTranslatorOriginalRaw = current
          node.__corTranslatorTranslatedRaw = ''
          node.__corTranslatorLang = ''
          return current
        },
        applyTranslation(node, originalRaw, translation) {
          let formatted = this.formatTranslation(this.normalizeText(originalRaw), translation)
          let leading = (originalRaw.match(/^\s*/) || [''])[0]
          let trailing = (originalRaw.match(/\s*$/) || [''])[0]
          let translatedRaw = leading + formatted + trailing
          if (node.nodeValue !== translatedRaw) {
            node.nodeValue = translatedRaw
          }
          node.__corTranslatorOriginalRaw = originalRaw
          node.__corTranslatorTranslatedRaw = translatedRaw
          node.__corTranslatorLang = this.config.targetLang
        },
        formatTranslation(original, translated) {
          if (
            translated &&
            /[A-Z]/.test(original) &&
            !/[a-z]/.test(original) &&
            original.replace(/[^A-Za-z]/g, '').length > 1
          ) {
            return translated.toUpperCase()
          }
          return translated
        },
        normalizeText(text) {
          return (text || '').replace(/\s+/g, ' ').trim()
        },
        enqueue(text) {
          if (this.dictionary[text] || this.queued[text]) {
            return
          }
          if (this.failedAt[text] && Date.now() - this.failedAt[text] < 300000) {
            return
          }
          this.queued[text] = true
          this.queue.push(text)
        },
        pumpQueue() {
          if (this.translating || !this.canFetchTranslations() || !this.queue.length) {
            return
          }
          let text = this.queue.shift()
          delete this.queued[text]
          if (!text || this.dictionary[text]) {
            this.pumpQueue()
            return
          }
          this.translating = true
          this.translateText(text)
            .then((translated) => {
              translated = this.normalizeText(translated)
              if (translated) {
                this.dictionary[text] = translated
                this.stats.translated += 1
                this.saveDictionarySoon()
                this.scheduleScan(20)
              }
            })
            .catch((err) => {
              this.failedAt[text] = Date.now()
              this.stats.failed += 1
              this.noteError(err.name + ': ' + err.message)
            })
            .then(() => {
              this.translating = false
              setTimeout(() => {
                this.pumpQueue()
              }, Math.max(100, this.config.requestDelayMs || 350))
            })
        },
        translateText(text) {
          let url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=' +
            encodeURIComponent(this.config.sourceLang || 'en') +
            '&tl=' +
            encodeURIComponent(this.config.targetLang) +
            '&dt=t&q=' +
            encodeURIComponent(text)
          return fetch(url)
            .then((response) => {
              if (!response.ok) {
                throw new Error('HTTP ' + response.status)
              }
              return response.json()
            })
            .then((data) => {
              let translated = ''
              if (data && data[0]) {
                data[0].forEach((part) => {
                  translated += part[0] || ''
                })
              }
              return translated
            })
        },
        restoreOriginals() {
          if (!document.body) {
            return
          }
          let nodeFilter = window.NodeFilter
          let showText = nodeFilter ? nodeFilter.SHOW_TEXT : 4
          let walker = document.createTreeWalker(
            document.body,
            showText,
            null,
            false
          )
          let node = walker.nextNode()
          while (node) {
            if (
              node.__corTranslatorOriginalRaw &&
              node.__corTranslatorTranslatedRaw &&
              node.nodeValue === node.__corTranslatorTranslatedRaw
            ) {
              node.nodeValue = node.__corTranslatorOriginalRaw
              node.__corTranslatorTranslatedRaw = ''
              node.__corTranslatorLang = ''
            }
            node = walker.nextNode()
          }
        },
        getLanguageLabel() {
          let language = this.languages.find((item) => item.value === this.config.targetLang)
          return language ? language.label : this.config.targetLang
        },
        getModeLabel() {
          let mode = this.modes.find((item) => item.value === this.config.mode)
          return mode ? mode.label : this.config.mode
        },
        getStatusText() {
          let cacheSize = Object.keys(this.dictionary || {}).length
          let intensive = this.isIntensiveActive()
            ? Math.ceil((this.config.intensiveUntil - Date.now()) / 60000) + ' min left'
            : 'off'
          return [
            'Language: ' + this.getLanguageLabel(),
            'Mode: ' + this.getModeLabel(),
            'Cached texts: ' + cacheSize,
            'Queue: ' + this.queue.length,
            'Intensive scan: ' + intensive,
            'Last error: ' + (this.stats.lastError || 'none')
          ].join('\n')
        },
        openSettings() {
          this.ensureRunning()
          let languageIndex = this.languages.findIndex((language) => language.value === this.config.targetLang)
          let modeIndex = this.modes.findIndex((mode) => mode.value === this.config.mode)
          daapi.pushInteractionModalQueue({
            title: 'CoR Translator',
            message: 'Translate online once, then keep using the saved cache offline. A full game translation grows as each screen and event appears.',
            image: daapi.requireImage('/cor_translator/icon.svg'),
            inputs: [
              {
                type: 'textarea',
                title: 'Status',
                value: this.getStatusText()
              }
            ],
            dropdowns: [
              {
                title: 'Target language',
                selected: languageIndex < 0 ? 0 : languageIndex,
                options: this.languages,
                onChange: {
                  event: this.event,
                  method: 'setLanguage'
                }
              },
              {
                title: 'Mode',
                selected: modeIndex < 0 ? 0 : modeIndex,
                options: this.modes,
                onChange: {
                  event: this.event,
                  method: 'setMode'
                }
              }
            ],
            options: [
              {
                variant: 'info',
                text: 'Learn visible now',
                action: {
                  event: this.event,
                  method: 'learnVisibleNow'
                }
              },
              {
                variant: 'info',
                text: 'Intensive scan 5 min',
                action: {
                  event: this.event,
                  method: 'startIntensiveFive'
                }
              },
              {
                variant: 'info',
                text: 'Intensive scan 20 min',
                action: {
                  event: this.event,
                  method: 'startIntensiveTwenty'
                }
              },
              {
                text: 'Stop intensive scan',
                action: {
                  event: this.event,
                  method: 'stopIntensive'
                }
              },
              {
                text: 'Export cache',
                action: {
                  event: this.event,
                  method: 'exportDictionary'
                }
              },
              {
                text: 'Import cache',
                action: {
                  event: this.event,
                  method: 'openImport'
                }
              },
              {
                variant: 'danger',
                text: 'Clear language cache',
                action: {
                  event: this.event,
                  method: 'confirmClearDictionary'
                }
              },
              {
                text: 'Close'
              }
            ]
          })
        },
        setLanguage({ option }) {
          if (!option || !option.value || option.value === this.config.targetLang) {
            return
          }
          this.restoreOriginals()
          this.config.targetLang = option.value
          this.loadedLanguage = false
          this.loadDictionary()
          this.saveConfig()
          this.scheduleScan(50)
        },
        setMode({ option }) {
          if (!option || !option.value) {
            return
          }
          this.config.mode = option.value
          if (this.config.mode === 'paused') {
            this.config.intensiveUntil = 0
            this.restoreOriginals()
          }
          this.saveConfig()
          this.scheduleScan(50)
        },
        learnVisibleNow() {
          this.config.mode = 'learn'
          this.saveConfig()
          this.scanDocument()
          this.openSettings()
        },
        startIntensive(minutes) {
          this.config.mode = 'learn'
          this.config.intensiveUntil = Date.now() + (minutes * 60000)
          this.saveConfig()
          this.scanDocument()
          this.openSettings()
        },
        stopIntensive() {
          this.config.intensiveUntil = 0
          this.saveConfig()
          this.openSettings()
        },
        exportDictionary() {
          this.ensureRunning()
          let payload = {
            mod: 'cor_translator',
            version: this.version,
            language: this.config.targetLang,
            dictionary: this.dictionary
          }
          daapi.pushInteractionModalQueue({
            title: 'Export Translation Cache',
            message: 'Copy this text if you want to back up or share the offline cache for this language.',
            image: daapi.requireImage('/cor_translator/icon.svg'),
            inputs: [
              {
                type: 'textarea',
                title: 'Cache JSON',
                value: JSON.stringify(payload)
              }
            ],
            options: [
              {
                text: 'Back',
                action: {
                  event: this.event,
                  method: 'openSettings'
                }
              }
            ]
          })
        },
        openImport() {
          daapi.setGlobalFlag({ flag: this.importFlag, data: '' })
          daapi.pushInteractionModalQueue({
            title: 'Import Translation Cache',
            message: 'Paste a cache JSON exported by this mod. It will merge into the selected language.',
            image: daapi.requireImage('/cor_translator/icon.svg'),
            inputs: [
              {
                type: 'textarea',
                title: 'Cache JSON',
                value: '',
                onChange: {
                  event: this.event,
                  method: 'noteImportText'
                }
              }
            ],
            options: [
              {
                variant: 'info',
                text: 'Import',
                action: {
                  event: this.event,
                  method: 'importDictionary'
                }
              },
              {
                text: 'Back',
                action: {
                  event: this.event,
                  method: 'openSettings'
                }
              }
            ]
          })
        },
        noteImportText({ input }) {
          daapi.setGlobalFlag({ flag: this.importFlag, data: input.value || '' })
        },
        importDictionary() {
          let raw = daapi.getGlobalFlag({ flag: this.importFlag }) || ''
          try {
            let parsed = JSON.parse(raw)
            let incoming = parsed.dictionary || parsed
            let count = 0
            for (let key in incoming) {
              if (incoming.hasOwnProperty(key) && incoming[key]) {
                this.dictionary[key] = incoming[key]
                count += 1
              }
            }
            this.writeJson(this.getDictionaryKey(), this.dictionary, this.getDictionaryFlag(), false)
            daapi.pushInteractionModalQueue({
              title: 'Import Complete',
              message: 'Imported or updated ' + count + ' cached texts.',
              image: daapi.requireImage('/cor_translator/icon.svg'),
              options: [
                {
                  text: 'Back',
                  action: {
                    event: this.event,
                    method: 'openSettings'
                  }
                }
              ]
            })
          } catch (err) {
            this.noteError('Import failed: ' + err.message)
            daapi.pushInteractionModalQueue({
              title: 'Import Failed',
              message: err.name + ': ' + err.message,
              image: daapi.requireImage('/cor_translator/icon.svg'),
              options: [
                {
                  text: 'Back',
                  action: {
                    event: this.event,
                    method: 'openImport'
                  }
                }
              ]
            })
          }
        },
        confirmClearDictionary() {
          daapi.pushInteractionModalQueue({
            title: 'Clear Translation Cache?',
            message: 'This only clears the cache for ' + this.getLanguageLabel() + '. Other languages stay saved.',
            image: daapi.requireImage('/cor_translator/icon.svg'),
            options: [
              {
                variant: 'danger',
                text: 'Clear it',
                action: {
                  event: this.event,
                  method: 'clearDictionary'
                }
              },
              {
                text: 'Keep it',
                action: {
                  event: this.event,
                  method: 'openSettings'
                }
              }
            ]
          })
        },
        clearDictionary() {
          this.restoreOriginals()
          this.dictionary = {}
          this.queue = []
          this.queued = {}
          try {
            window.localStorage.removeItem(this.getDictionaryKey())
          } catch (err) {
            this.noteError('Local storage clear failed: ' + err.message)
          }
          try {
            daapi.setGlobalFlag({ flag: this.getDictionaryFlag(), data: {} })
          } catch (err) {
            this.noteError('Flag clear failed: ' + err.message)
          }
          this.openSettings()
        },
        noteError(message) {
          this.stats.lastError = message || ''
          if (this.config && this.config.debug) {
            console.warn('[cor_translator]', message)
          }
        }
      }

      window.corTranslator.ensureRunning()
      window.corTranslator.showInstallNoticeOnce()
    },
    openSettings() {
      if (!window.corTranslator) {
        daapi.invokeMethod({ event: '/cor_translator/main', method: 'boot' })
      }
      window.corTranslator.openSettings()
    },
    setLanguage(args) {
      if (!window.corTranslator) {
        daapi.invokeMethod({ event: '/cor_translator/main', method: 'boot' })
      }
      window.corTranslator.setLanguage(args || {})
    },
    setMode(args) {
      if (!window.corTranslator) {
        daapi.invokeMethod({ event: '/cor_translator/main', method: 'boot' })
      }
      window.corTranslator.setMode(args || {})
    },
    learnVisibleNow() {
      window.corTranslator.learnVisibleNow()
    },
    startIntensiveFive() {
      window.corTranslator.startIntensive(5)
    },
    startIntensiveTwenty() {
      window.corTranslator.startIntensive(20)
    },
    stopIntensive() {
      window.corTranslator.stopIntensive()
    },
    exportDictionary() {
      window.corTranslator.exportDictionary()
    },
    openImport() {
      window.corTranslator.openImport()
    },
    noteImportText(args) {
      window.corTranslator.noteImportText(args || {})
    },
    importDictionary() {
      window.corTranslator.importDictionary()
    },
    confirmClearDictionary() {
      window.corTranslator.confirmClearDictionary()
    },
    clearDictionary() {
      window.corTranslator.clearDictionary()
    }
  }
}
