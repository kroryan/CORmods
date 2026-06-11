{
  canTriggerIfUnavailable: true,
  checkType: 'general',
  checkAndAct() {
    daapi.invokeMethod({
      event: '/cor_translator/main',
      method: 'boot'
    })
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
  },
  methods: {
    boot() {
      if (window.corTranslator && window.corTranslator.version === '1.0.3') {
        window.corTranslator.ensureRunning()
        window.corTranslator.showInstallNoticeOnce()
        return
      }

      window.corTranslator = {
        version: '1.0.3',
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
        modalHooked: false,
        originalPushInteractionModalQueue: false,
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
          pretranslateModals: true,
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
          this.hookModalQueue()
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
              message: 'The translator mod is active. Use the CoR Translator global action to open the settings.',
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
        hookModalQueue() {
          if (!window.daapi) {
            return
          }
          this.hookModalFunction('pushInteractionModalQueue')
          this.hookModalFunction('pushInteractionModalButtonQueue')
        },
        hookModalFunction(name) {
          if (!daapi[name]) {
            return
          }
          if (daapi[name].__corTranslatorVersion === this.version) {
            return
          }
          let translator = this
          let original = daapi[name].__corTranslatorOriginal || daapi[name]
          daapi[name] = function(payload) {
            try {
              let active = window.corTranslator || translator
              return active.handleModalPush(original, this, payload)
            } catch (err) {
              translator.noteError('Modal translation hook failed: ' + err.message)
              return original.call(this, payload)
            }
          }
          daapi[name].__corTranslatorOriginal = original
          daapi[name].__corTranslatorVersion = this.version
        },
        handleModalPush(original, thisArg, payload) {
          if (!payload || this.config.mode === 'paused') {
            return original.call(thisArg, payload)
          }
          if (this.shouldPretranslateModalPayload(payload)) {
            this.prepareModalPayloadAsync(payload)
              .catch((err) => {
                this.noteError('Modal pretranslation failed: ' + err.message)
                try {
                  this.prepareModalPayload(payload)
                } catch (fallbackErr) {
                  this.noteError('Modal fallback translation failed: ' + fallbackErr.message)
                }
              })
              .then(() => {
                original.call(thisArg, payload)
                this.scheduleScan(40)
              })
            return undefined
          }
          this.prepareModalPayload(payload)
          let result = original.call(thisArg, payload)
          this.scheduleScan(40)
          return result
        },
        prepareModalPayload(payload) {
          if (!payload || this.config.mode === 'paused') {
            return payload
          }
          ;['title', 'message', 'tooltip'].forEach((field) => {
            if (typeof payload[field] === 'string') {
              payload[field] = this.preparePayloadText(payload[field])
            }
          })
          ;(payload.inputs || []).forEach((input) => {
            if (!input) return
            ;['title', 'description', 'placeholder'].forEach((field) => {
              if (typeof input[field] === 'string') {
                input[field] = this.preparePayloadText(input[field])
              }
            })
          })
          ;(payload.dropdowns || []).forEach((dropdown) => {
            if (!dropdown) return
            ;['title', 'description'].forEach((field) => {
              if (typeof dropdown[field] === 'string') {
                dropdown[field] = this.preparePayloadText(dropdown[field])
              }
            })
            ;(dropdown.options || []).forEach((option) => {
              if (option && typeof option.label === 'string') {
                option.label = this.preparePayloadText(option.label)
              }
              if (option && typeof option.description === 'string') {
                option.description = this.preparePayloadText(option.description)
              }
            })
          })
          this.preparePayloadOptions(payload.options || [])
          return payload
        },
        prepareModalPayloadAsync(payload) {
          if (!payload || this.config.mode === 'paused') {
            return Promise.resolve(payload)
          }
          let jobs = []
          ;['title', 'message', 'tooltip'].forEach((field) => {
            if (typeof payload[field] === 'string') {
              jobs.push(this.pretranslateField(payload, field))
            }
          })
          ;(payload.inputs || []).forEach((input) => {
            if (!input) return
            ;['title', 'description', 'placeholder'].forEach((field) => {
              if (typeof input[field] === 'string') {
                jobs.push(this.pretranslateField(input, field))
              }
            })
          })
          ;(payload.dropdowns || []).forEach((dropdown) => {
            if (!dropdown) return
            ;['title', 'description'].forEach((field) => {
              if (typeof dropdown[field] === 'string') {
                jobs.push(this.pretranslateField(dropdown, field))
              }
            })
            ;(dropdown.options || []).forEach((option) => {
              if (!option) return
              ;['label', 'description'].forEach((field) => {
                if (typeof option[field] === 'string') {
                  jobs.push(this.pretranslateField(option, field))
                }
              })
            })
          })
          this.collectOptionPretranslations(payload.options || [], jobs)
          return jobs.reduce((chain, job) => {
            return chain.then(() => job())
          }, Promise.resolve()).then(() => {
            return payload
          })
        },
        collectOptionPretranslations(options, jobs) {
          ;(options || []).forEach((option) => {
            if (!option) return
            ;['text', 'tooltip', 'label', 'description'].forEach((field) => {
              if (typeof option[field] === 'string') {
                jobs.push(this.pretranslateField(option, field))
              }
            })
            if (option.options) {
              this.collectOptionPretranslations(option.options, jobs)
            }
          })
        },
        pretranslateField(target, field) {
          return () => {
            return this.pretranslateText(target[field]).then((translated) => {
              if (translated) {
                target[field] = translated
              }
            })
          }
        },
        preparePayloadOptions(options) {
          ;(options || []).forEach((option) => {
            if (!option) return
            ;['text', 'tooltip', 'label', 'description'].forEach((field) => {
              if (typeof option[field] === 'string') {
                option[field] = this.preparePayloadText(option[field])
              }
            })
            if (option.options) {
              this.preparePayloadOptions(option.options)
            }
          })
        },
        preparePayloadText(text) {
          if (!this.shouldTranslateRaw(text)) {
            return text
          }
          let translated = this.cachedTranslationForPreservedText(text)
          this.learnTextForTranslation(text)
          return translated || text
        },
        shouldPretranslateModalPayload(payload) {
          if (!payload || !this.config || this.config.pretranslateModals === false || !this.canFetchTranslations()) {
            return false
          }
          let texts = this.collectModalTexts(payload)
          return texts.some((text) => this.textNeedsImmediateTranslation(text))
        },
        collectModalTexts(payload) {
          let texts = []
          let add = (value) => {
            if (typeof value === 'string' && this.shouldTranslateRaw(value)) {
              texts.push(value)
            }
          }
          ;['title', 'message', 'tooltip'].forEach((field) => add(payload[field]))
          ;(payload.inputs || []).forEach((input) => {
            if (!input) return
            ;['title', 'description', 'placeholder'].forEach((field) => add(input[field]))
          })
          ;(payload.dropdowns || []).forEach((dropdown) => {
            if (!dropdown) return
            ;['title', 'description'].forEach((field) => add(dropdown[field]))
            ;(dropdown.options || []).forEach((option) => {
              if (!option) return
              add(option.label)
              add(option.description)
            })
          })
          let addOptions = (options) => {
            ;(options || []).forEach((option) => {
              if (!option) return
              ;['text', 'tooltip', 'label', 'description'].forEach((field) => add(option[field]))
              if (option.options) {
                addOptions(option.options)
              }
            })
          }
          addOptions(payload.options || [])
          return texts
        },
        textNeedsImmediateTranslation(text) {
          if (!this.shouldTranslateRaw(text)) {
            return false
          }
          if (this.cachedTranslationForPreservedText(text)) {
            return false
          }
          let pieces = this.translatablePieces(text)
          return pieces.some((piece) => this.shouldTranslateRaw(piece) && !this.dictionary[this.normalizeText(piece)])
        },
        pretranslateText(text) {
          if (!this.shouldTranslateRaw(text)) {
            return Promise.resolve(text)
          }
          let cached = this.cachedTranslationForPreservedText(text)
          if (cached) {
            return Promise.resolve(cached)
          }
          return this.translatePreservedTextNow(text).then((translated) => {
            if (translated) {
              this.saveDictionarySoon()
              return translated
            }
            this.learnTextForTranslation(text)
            return text
          })
        },
        translatePreservedTextNow(text) {
          let parts = this.splitPreservedTokens(text)
          if (parts.length < 2) {
            return this.translatePlainOrCompositeTextNow(text)
          }
          let changed = false
          return parts.reduce((chain, part) => {
            return chain.then((result) => {
              if (part.preserved) {
                return result + part.text
              }
              return this.translatePlainOrCompositeTextNow(part.text).then((translated) => {
                if (translated && translated !== part.text) {
                  changed = true
                  return result + translated
                }
                return result + part.text
              })
            })
          }, Promise.resolve('')).then((result) => changed ? result : '')
        },
        translatePlainOrCompositeTextNow(text) {
          let cached = this.cachedTranslationForPlainText(text)
          if (cached) {
            return Promise.resolve(cached)
          }
          let pieces = this.splitCompositeText(text)
          if (pieces.length >= 2) {
            let changed = false
            return pieces.reduce((chain, piece) => {
              return chain.then((result) => {
                if (!piece.text || !this.shouldTranslateRaw(piece.text)) {
                  return result + piece.raw
                }
                return this.translatePlainOrLongTextNow(piece.text).then((translated) => {
                  if (translated) {
                    changed = true
                    return result + (piece.leading || '') + translated + (piece.trailing || '')
                  }
                  return result + piece.raw
                })
              })
            }, Promise.resolve('')).then((result) => changed ? result : '')
          }
          return this.translatePlainOrLongTextNow(text)
        },
        translatePlainOrLongTextNow(text) {
          let key = this.normalizeText(text)
          if (!this.shouldTranslateRaw(key)) {
            return Promise.resolve('')
          }
          if (this.dictionary[key]) {
            return Promise.resolve(this.formatTranslation(key, this.dictionary[key]))
          }
          if (key.length <= 650) {
            return this.translateAndCacheNow(key)
          }
          let chunks = this.splitLongText(text)
          if (chunks.length < 2) {
            return this.translateAndCacheNow(key)
          }
          let changed = false
          return chunks.reduce((chain, chunk) => {
            return chain.then((result) => {
              let chunkKey = this.normalizeText(chunk)
              if (!this.shouldTranslateRaw(chunkKey)) {
                return result + chunk
              }
              let leading = (chunk.match(/^\s*/) || [''])[0]
              let trailing = (chunk.match(/\s*$/) || [''])[0]
              return this.translateAndCacheNow(chunkKey).then((translated) => {
                if (translated) {
                  changed = true
                  return result + leading + translated + trailing
                }
                return result + chunk
              })
            })
          }, Promise.resolve('')).then((result) => changed ? result : '')
        },
        translateAndCacheNow(key) {
          key = this.normalizeText(key)
          if (!this.shouldTranslateRaw(key)) {
            return Promise.resolve('')
          }
          if (this.dictionary[key]) {
            return Promise.resolve(this.formatTranslation(key, this.dictionary[key]))
          }
          if (!this.canFetchTranslations()) {
            return Promise.resolve('')
          }
          return this.withTimeout(this.translateText(key), 4500).then((translated) => {
            translated = this.normalizeText(translated)
            if (!translated) {
              return ''
            }
            this.dictionary[key] = translated
            this.stats.translated += 1
            return this.formatTranslation(key, translated)
          }).catch((err) => {
            this.failedAt[key] = Date.now()
            this.stats.failed += 1
            this.noteError(err.name + ': ' + err.message)
            return ''
          })
        },
        withTimeout(promise, ms) {
          return new Promise((resolve, reject) => {
            let done = false
            let timer = setTimeout(() => {
              if (done) {
                return
              }
              done = true
              reject(new Error('Translation timeout'))
            }, ms || 4500)
            promise.then((value) => {
              if (done) {
                return
              }
              done = true
              clearTimeout(timer)
              resolve(value)
            }).catch((err) => {
              if (done) {
                return
              }
              done = true
              clearTimeout(timer)
              reject(err)
            })
          })
        },
        learnTextForTranslation(text) {
          let parts = this.splitPreservedTokens(text)
          if (parts.length > 1) {
            parts.forEach((part) => {
              if (!part.preserved) {
                this.enqueueTextOrSegments(part.text)
              }
            })
          } else {
            this.enqueueTextOrSegments(text)
          }
        },
        enqueueTextOrSegments(text) {
          let clean = this.normalizeText(text)
          if (!this.shouldTranslateRaw(clean)) {
            return
          }
          if (!this.enqueueCompositeSegments(text)) {
            this.enqueue(clean)
          }
        },
        cachedTranslationForPreservedText(text) {
          let parts = this.splitPreservedTokens(text)
          if (parts.length < 2) {
            return this.cachedTranslationForPlainText(text)
          }
          let changed = false
          let value = parts.map((part) => {
            if (part.preserved) {
              return part.text
            }
            let translated = this.cachedTranslationForPlainText(part.text)
            if (translated) {
              changed = true
              return translated
            }
            return part.text
          }).join('')
          return changed ? value : ''
        },
        cachedTranslationForPlainText(text) {
          let key = this.normalizeText(text)
          if (!this.shouldTranslateRaw(key)) {
            return ''
          }
          if (this.dictionary[key]) {
            return this.formatTranslation(key, this.dictionary[key])
          }
          return this.getCachedCompositeTranslation(text)
        },
        splitPreservedTokens(text) {
          let raw = String(text || '')
          let tokenPattern = /(\[[a-z]\|[^\]\r\n]+\])/gi
          let parts = []
          let last = 0
          let match
          while ((match = tokenPattern.exec(raw))) {
            if (match.index > last) {
              parts.push({ text: raw.slice(last, match.index), preserved: false })
            }
            parts.push({ text: match[0], preserved: true })
            last = match.index + match[0].length
          }
          if (last < raw.length) {
            parts.push({ text: raw.slice(last), preserved: false })
          }
          return parts.length ? parts : [{ text: raw, preserved: false }]
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
          this.scanElementAttributes(document.body)
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
        scanElementAttributes(root) {
          if (!root || !root.querySelectorAll) {
            return
          }
          let elements = root.querySelectorAll('[title], [aria-label], [data-original-title], [data-tooltip], [placeholder]')
          elements.forEach((element) => {
            if (this.isIgnoredElement(element)) {
              return
            }
            ;['title', 'aria-label', 'data-original-title', 'data-tooltip', 'placeholder'].forEach((attribute) => {
              let value = element.getAttribute(attribute)
              if (!this.shouldTranslateRaw(value || '')) {
                return
              }
              let originalKey = '__corTranslatorOriginalAttr_' + attribute
              let translatedKey = '__corTranslatorTranslatedAttr_' + attribute
              let original = element[originalKey]
              if (!original || value !== element[translatedKey]) {
                original = value
                element[originalKey] = original
              }
              let translated = this.cachedTranslationForPreservedText(original)
              this.learnTextForTranslation(original)
              if (translated && value !== translated) {
                element.setAttribute(attribute, translated)
                element[translatedKey] = translated
              }
            })
          })
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
          if (!clean || clean.length < 2 || clean.length > 5000) {
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
            return
          }
          let composite = this.getCachedCompositeTranslation(originalRaw)
          if (composite) {
            this.applyTranslation(node, originalRaw, composite, true)
            return
          }
          if (this.canFetchTranslations()) {
            if (!this.enqueueCompositeSegments(originalRaw)) {
              this.enqueue(key)
            }
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
        applyTranslation(node, originalRaw, translation, preserveFormatting) {
          let formatted = preserveFormatting ? translation : this.formatTranslation(this.normalizeText(originalRaw), translation)
          let leading = (originalRaw.match(/^\s*/) || [''])[0]
          let trailing = (originalRaw.match(/\s*$/) || [''])[0]
          let translatedRaw = preserveFormatting ? formatted : leading + formatted + trailing
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
        getCachedCompositeTranslation(rawText) {
          let pieces = this.splitCompositeText(rawText)
          if (pieces.length < 2) {
            return this.getCachedLongTextTranslation(rawText)
          }
          let changed = false
          let translated = pieces.map((piece) => {
            if (!piece.text) {
              return piece.raw
            }
            let key = this.normalizeText(piece.text)
            if (!this.shouldTranslateRaw(key)) {
              return piece.raw
            }
            let cached = this.dictionary[key]
            if (!cached) {
              return piece.raw
            }
            changed = true
            return piece.leading + this.formatTranslation(key, cached) + piece.trailing
          }).join('')
          return changed ? translated : ''
        },
        getCachedLongTextTranslation(rawText) {
          let key = this.normalizeText(rawText)
          if (!this.shouldTranslateRaw(key) || key.length <= 650) {
            return ''
          }
          let chunks = this.splitLongText(rawText)
          if (chunks.length < 2) {
            return ''
          }
          let changed = false
          let translated = chunks.map((chunk) => {
            let chunkKey = this.normalizeText(chunk)
            if (!this.shouldTranslateRaw(chunkKey)) {
              return chunk
            }
            let cached = this.dictionary[chunkKey]
            if (!cached) {
              return chunk
            }
            changed = true
            let leading = (chunk.match(/^\s*/) || [''])[0]
            let trailing = (chunk.match(/\s*$/) || [''])[0]
            return leading + this.formatTranslation(chunkKey, cached) + trailing
          }).join('')
          return changed ? translated : ''
        },
        enqueueCompositeSegments(rawText) {
          let pieces = this.splitCompositeText(rawText)
          if (pieces.length < 2) {
            return this.enqueueLongTextSegments(rawText)
          }
          let queuedAny = false
          pieces.forEach((piece) => {
            if (!piece.text) {
              return
            }
            let key = this.normalizeText(piece.text)
            if (key.length > 650) {
              if (this.enqueueLongTextSegments(piece.text)) {
                queuedAny = true
              }
            } else if (this.shouldTranslateRaw(key) && !this.dictionary[key]) {
              this.enqueue(key)
              queuedAny = true
            }
          })
          return queuedAny
        },
        enqueueLongTextSegments(rawText) {
          let key = this.normalizeText(rawText)
          if (!this.shouldTranslateRaw(key) || key.length <= 650) {
            return false
          }
          let queuedAny = false
          this.splitLongText(rawText).forEach((chunk) => {
            let chunkKey = this.normalizeText(chunk)
            if (this.shouldTranslateRaw(chunkKey) && !this.dictionary[chunkKey]) {
              this.enqueue(chunkKey)
              queuedAny = true
            }
          })
          return queuedAny
        },
        translatablePieces(text) {
          let pieces = []
          this.splitPreservedTokens(text).forEach((part) => {
            if (part.preserved || !part.text) {
              return
            }
            let composite = this.splitCompositeText(part.text)
            if (composite.length >= 2) {
              composite.forEach((piece) => {
                if (piece.text) {
                  if (this.normalizeText(piece.text).length > 650) {
                    pieces = pieces.concat(this.splitLongText(piece.text))
                  } else {
                    pieces.push(piece.text)
                  }
                }
              })
              return
            }
            if (this.normalizeText(part.text).length > 650) {
              pieces = pieces.concat(this.splitLongText(part.text))
            } else {
              pieces.push(part.text)
            }
          })
          return pieces
        },
        splitLongText(rawText) {
          let raw = String(rawText || '')
          if (this.normalizeText(raw).length <= 650) {
            return [raw]
          }
          let tokens = raw.match(/[^.!?;:\n]+[.!?;:]?\s*|\n+/g) || [raw]
          let chunks = []
          let current = ''
          tokens.forEach((token) => {
            if (this.normalizeText(current + token).length > 560 && this.normalizeText(current).length > 0) {
              chunks.push(current)
              current = token
            } else {
              current += token
            }
          })
          if (current) {
            chunks.push(current)
          }
          if (chunks.length < 2 || chunks.some((chunk) => this.normalizeText(chunk).length > 700)) {
            chunks = []
            current = ''
            raw.split(/(\s+)/).forEach((token) => {
              if (this.normalizeText(current + token).length > 560 && this.normalizeText(current).length > 0) {
                chunks.push(current)
                current = token
              } else {
                current += token
              }
            })
            if (current) {
              chunks.push(current)
            }
          }
          return chunks.filter((chunk) => chunk)
        },
        splitCompositeText(rawText) {
          let raw = String(rawText || '')
          let parts = raw.split(/(\r?\n)/)
          let result = []
          parts.forEach((part) => {
            if (/^\r?\n$/.test(part)) {
              result.push({ raw: part, text: '' })
              return
            }
            let leading = (part.match(/^\s*/) || [''])[0]
            let trailing = (part.match(/\s*$/) || [''])[0]
            let text = part.slice(leading.length, part.length - trailing.length)
            let labelMatch = text.match(/^([A-Za-z][A-Za-z ]{1,36})(:)(\s*)(.*)$/)
            if (labelMatch) {
              result.push({ raw: leading, text: '' })
              result.push({ raw: labelMatch[1], leading: '', trailing: '', text: labelMatch[1] })
              result.push({ raw: labelMatch[2] + labelMatch[3], text: '' })
              if (labelMatch[4]) {
                this.appendCompositeTextPieces(result, labelMatch[4], '', trailing)
              } else {
                result.push({ raw: trailing, text: '' })
              }
              return
            }
            let reasonMatch = text.match(/^(.+?)\s+\(([^()]+)\)$/)
            if (reasonMatch) {
              result.push({ raw: leading, text: '' })
              result.push({ raw: reasonMatch[1], leading: '', trailing: '', text: reasonMatch[1] })
              result.push({ raw: ' (', text: '' })
              result.push({ raw: reasonMatch[2], leading: '', trailing: '', text: reasonMatch[2] })
              result.push({ raw: ')' + trailing, text: '' })
              return
            }
            result.push({ raw: part, leading, trailing, text })
          })
          return result.length > 1 ? result : []
        },
        appendCompositeTextPieces(result, rawText, leading, trailing) {
          let raw = String(rawText || '')
          if (!raw) {
            result.push({ raw: (leading || '') + (trailing || ''), text: '' })
            return
          }
          let parts = raw.split(/(,\s*|;\s*)/)
          parts.forEach((part, index) => {
            if (!part) {
              return
            }
            if (/^(,\s*|;\s*)$/.test(part)) {
              result.push({ raw: part, text: '' })
              return
            }
            let outerLeading = index === 0 ? (leading || '') : ''
            let outerTrailing = index === parts.length - 1 ? (trailing || '') : ''
            let localLeading = (part.match(/^\s*/) || [''])[0]
            let localTrailing = (part.match(/\s*$/) || [''])[0]
            let text = part.slice(localLeading.length, part.length - localTrailing.length)
            let numericMatch = text.match(/^([+-]?\d+(?:\.\d+)?(?:\s*(?:to|-)\s*[+-]?\d+(?:\.\d+)?)?\s+)([A-Za-z].*)$/)
            if (numericMatch) {
              result.push({ raw: outerLeading + localLeading + numericMatch[1], text: '' })
              result.push({ raw: numericMatch[2] + localTrailing + outerTrailing, leading: '', trailing: localTrailing + outerTrailing, text: numericMatch[2] })
              return
            }
            result.push({
              raw: outerLeading + part + outerTrailing,
              leading: outerLeading + localLeading,
              trailing: localTrailing + outerTrailing,
              text
            })
          })
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
