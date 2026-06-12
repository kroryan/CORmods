{
  canTriggerIfUnavailable: true,
  checkType: 'general',
  checkAndAct() {
    daapi.addGlobalAction({
      key: 'cor_society',
      action: {
        title: 'Roman Society',
        tooltip: 'Opens the Society overview. Consequences: no stats change until you choose an action inside.',
        icon: daapi.requireImage('/cor_society/icon.svg'),
        isAvailable: true,
        process: {
          event: '/cor_society/engine',
          method: 'openHub'
        }
      }
    })
    daapi.addGlobalAction({
      key: 'cor_society_player_crest',
      action: {
        title: 'House Shield',
        tooltip: 'Opens player house shield settings. Consequences: visual shield changes only; no stats change.',
        icon: daapi.requireImage('/cor_society/shield.svg'),
        isAvailable: true,
        process: {
          event: '/cor_society/engine',
          method: 'openPlayerCrest'
        }
      }
    })
    daapi.addGlobalAction({
      key: 'cor_society_wardrobe',
      action: {
        title: 'Family Wardrobe',
        tooltip: 'Change Society portrait clothing for members of your household. Consequences: visual clothing changes only; no stats change.',
        icon: daapi.requireImage('/cor_society/assets/wardrobe.svg'),
        isAvailable: true,
        process: {
          event: '/cor_society/engine',
          method: 'openWardrobe'
        }
      }
    })
    try {
      daapi.invokeMethod({
        event: '/cor_society/engine',
        method: 'boot'
      })
      daapi.invokeMethod({
        event: '/cor_society/engine',
        method: 'showInstallNoticeOnce'
      })
      daapi.invokeMethod({
        event: '/cor_society/engine',
        method: 'monthlyTick'
      })
    } catch (err) {
      console.warn(err)
      try {
        daapi.setGlobalFlag({
          flag: 'corSocietyLastError',
          data: err.name + ': ' + err.message
        })
        if (!daapi.getGlobalFlag({ flag: 'corSocietyStartupErrorShown' })) {
          daapi.setGlobalFlag({ flag: 'corSocietyStartupErrorShown', data: true })
          daapi.pushInteractionModalQueue({
            title: 'Roman Society startup error',
            message: 'The mod button was registered, but startup failed: ' + err.name + ': ' + err.message,
            image: daapi.requireImage('/cor_society/icon.svg')
          })
        }
      } catch (noticeErr) {
        console.warn(noticeErr)
      }
    }
  },
  methods: {
    boot() {
      if (window.corSociety && window.corSociety.version === '1.1.18') {
        window.corSociety.ensure()
        window.corSociety.startPlayerCrestOverlay()
        window.corSociety.startPlayerStatusOverlay()
        return
      }

      window.corSociety = {
        version: '1.1.20',
        event: '/cor_society/engine',
        flag: 'corSocietyState',
        noticeFlag: 'corSocietyInstallNoticeSeen',
        logLimit: 240,
        historyPageSize: 8,
        wardrobeLookGroup: 'cor_society_wardrobe',
        vanillaPortraitAssets: {
          'icons/characters/female.svg': 'img/female.f707fe58.svg',
          'icons/characters/female_baby.svg': 'img/female_baby.80ac0b1b.svg',
          'icons/characters/female_old.svg': 'img/female_old.aeab9bd9.svg',
          'icons/characters/female_teen.svg': 'img/female_teen.94f13bb5.svg',
          'icons/characters/male.svg': 'img/male.9a3a017c.svg',
          'icons/characters/male_baby.svg': 'img/male_baby.32e231b9.svg',
          'icons/characters/male_old.svg': 'img/male_old.c89a5bac.svg',
          'icons/characters/male_teen.svg': 'img/male_teen.7ca5358d.svg',
          'icons/characters/roman/auburn/female/adult.svg': 'img/adult.eaeb7ef5.svg',
          'icons/characters/roman/auburn/female/baby.svg': 'img/baby.3774c082.svg',
          'icons/characters/roman/auburn/female/old.svg': 'img/old.f1172f25.svg',
          'icons/characters/roman/auburn/female/teen.svg': 'img/teen.ace18308.svg',
          'icons/characters/roman/auburn/male/adult.svg': 'img/adult.186b1435.svg',
          'icons/characters/roman/auburn/male/baby.svg': 'img/baby.dca7baee.svg',
          'icons/characters/roman/auburn/male/old.svg': 'img/old.98233ad6.svg',
          'icons/characters/roman/auburn/male/teen.svg': 'img/teen.2c3d4382.svg',
          'icons/characters/roman/black/female/adult.svg': 'img/adult.8bed277b.svg',
          'icons/characters/roman/black/female/baby.svg': 'img/baby.a0131621.svg',
          'icons/characters/roman/black/female/old.svg': 'img/old.5646bd45.svg',
          'icons/characters/roman/black/female/teen.svg': 'img/teen.bb5d18a0.svg',
          'icons/characters/roman/black/male/adult.svg': 'img/adult.a82907d8.svg',
          'icons/characters/roman/black/male/baby.svg': 'img/baby.b5d50f2b.svg',
          'icons/characters/roman/black/male/old.svg': 'img/old.192ba1c1.svg',
          'icons/characters/roman/black/male/teen.svg': 'img/teen.cc5a3167.svg',
          'icons/characters/roman/blonde/female/adult.svg': 'img/adult.f3b985c6.svg',
          'icons/characters/roman/blonde/female/baby.svg': 'img/baby.64dcb1f6.svg',
          'icons/characters/roman/blonde/female/old.svg': 'img/old.85bf0ff5.svg',
          'icons/characters/roman/blonde/female/teen.svg': 'img/teen.f8472117.svg',
          'icons/characters/roman/blonde/male/adult.svg': 'img/adult.8005b37d.svg',
          'icons/characters/roman/blonde/male/baby.svg': 'img/baby.6a7f3799.svg',
          'icons/characters/roman/blonde/male/old.svg': 'img/old.87edf76a.svg',
          'icons/characters/roman/blonde/male/teen.svg': 'img/teen.ee0167f6.svg',
          'icons/characters/roman/brown/female/adult.svg': 'img/adult.59b000f2.svg',
          'icons/characters/roman/brown/female/baby.svg': 'img/baby.9fbb91ff.svg',
          'icons/characters/roman/brown/female/old.svg': 'img/old.1c61dc78.svg',
          'icons/characters/roman/brown/female/teen.svg': 'img/teen.2e7738dc.svg',
          'icons/characters/roman/brown/male/adult.svg': 'img/adult.8a6ed9f9.svg',
          'icons/characters/roman/brown/male/baby.svg': 'img/baby.1d8786e8.svg',
          'icons/characters/roman/brown/male/old.svg': 'img/old.adb54f1d.svg',
          'icons/characters/roman/brown/male/teen.svg': 'img/teen.71ef4800.svg',
          'icons/characters/roman/brown_curly/female/adult.svg': 'img/adult.3b93dc6a.svg',
          'icons/characters/roman/brown_curly/female/baby.svg': 'img/baby.cc70ced5.svg',
          'icons/characters/roman/brown_curly/female/old.svg': 'img/old.9bcd6b91.svg',
          'icons/characters/roman/brown_curly/female/teen.svg': 'img/teen.cf57a6f7.svg',
          'icons/characters/roman/brown_curly/male/adult.svg': 'img/adult.87b4f6e9.svg',
          'icons/characters/roman/brown_curly/male/baby.svg': 'img/baby.fc4eb68f.svg',
          'icons/characters/roman/brown_curly/male/old.svg': 'img/old.46b580d0.svg',
          'icons/characters/roman/brown_curly/male/teen.svg': 'img/teen.ed01254f.svg',
          'icons/characters/roman/dusky/female/adult.svg': 'img/adult.126d7721.svg',
          'icons/characters/roman/dusky/female/baby.svg': 'img/baby.0a48ceaa.svg',
          'icons/characters/roman/dusky/female/old.svg': 'img/old.79d0435f.svg',
          'icons/characters/roman/dusky/female/teen.svg': 'img/teen.e082b316.svg',
          'icons/characters/roman/dusky/male/adult.svg': 'img/adult.f27497db.svg',
          'icons/characters/roman/dusky/male/baby.svg': 'img/baby.c7e78900.svg',
          'icons/characters/roman/dusky/male/old.svg': 'img/old.fb022009.svg',
          'icons/characters/roman/dusky/male/teen.svg': 'img/teen.21c5438d.svg',
          'icons/characters/roman/hazel/female/adult.svg': 'img/adult.bd668851.svg',
          'icons/characters/roman/hazel/female/baby.svg': 'img/baby.1a9b89b4.svg',
          'icons/characters/roman/hazel/female/old.svg': 'img/old.73d0e21f.svg',
          'icons/characters/roman/hazel/female/teen.svg': 'img/teen.69563d5c.svg',
          'icons/characters/roman/hazel/male/adult.svg': 'img/adult.a832d2ed.svg',
          'icons/characters/roman/hazel/male/baby.svg': 'img/baby.491b5337.svg',
          'icons/characters/roman/hazel/male/old.svg': 'img/old.2d782b29.svg',
          'icons/characters/roman/hazel/male/teen.svg': 'img/teen.fcd006f8.svg',
          'icons/characters/roman/olive/female/adult.svg': 'img/adult.3ed0c1b2.svg',
          'icons/characters/roman/olive/female/baby.svg': 'img/baby.429f032d.svg',
          'icons/characters/roman/olive/female/old.svg': 'img/old.408fef7d.svg',
          'icons/characters/roman/olive/female/teen.svg': 'img/teen.01310b64.svg',
          'icons/characters/roman/olive/male/adult.svg': 'img/adult.da4471a2.svg',
          'icons/characters/roman/olive/male/baby.svg': 'img/baby.b825b044.svg',
          'icons/characters/roman/olive/male/old.svg': 'img/old.89dedfc1.svg',
          'icons/characters/roman/olive/male/teen.svg': 'img/teen.e75b34c1.svg',
          'icons/characters/roman/red/female/adult.svg': 'img/adult.c3dbcbe6.svg',
          'icons/characters/roman/red/female/baby.svg': 'img/baby.100e8154.svg',
          'icons/characters/roman/red/female/old.svg': 'img/old.2d4a6287.svg',
          'icons/characters/roman/red/female/teen.svg': 'img/teen.79bc1ad5.svg',
          'icons/characters/roman/red/male/adult.svg': 'img/adult.e50e6182.svg',
          'icons/characters/roman/red/male/baby.svg': 'img/baby.3ce59ad9.svg',
          'icons/characters/roman/red/male/old.svg': 'img/old.eaebff03.svg',
          'icons/characters/roman/red/male/teen.svg': 'img/teen.ddc1b1e8.svg',
          'icons/characters/roman/tan/female/adult.svg': 'img/adult.3d0c21d8.svg',
          'icons/characters/roman/tan/female/baby.svg': 'img/baby.5a264e0c.svg',
          'icons/characters/roman/tan/female/old.svg': 'img/old.439bc75d.svg',
          'icons/characters/roman/tan/female/teen.svg': 'img/teen.c726315b.svg',
          'icons/characters/roman/tan/male/adult.svg': 'img/adult.87a69f29.svg',
          'icons/characters/roman/tan/male/baby.svg': 'img/baby.2bfbf42d.svg',
          'icons/characters/roman/tan/male/old.svg': 'img/old.aee50a51.svg',
          'icons/characters/roman/tan/male/teen.svg': 'img/teen.93a4a950.svg'
        },
        stratumOrder: ['senatorial', 'equestrian', 'civic', 'plebeian', 'freedmen', 'poor'],
        strata: {
          senatorial: {
            title: 'Senatorial Houses',
            singular: 'senatorial house',
            min: 4,
            basePrestige: [80000, 180000],
            heritage: ['roman_patrician', 'roman_novus_homo'],
            jobs: ['senator', 'lawyer', 'rhetor'],
            traits: ['senator', 'ambitious', 'oratorDeliberative'],
            cost: 2500,
            support: 400,
            revenue: 120
          },
          equestrian: {
            title: 'Equestrian Houses',
            singular: 'equestrian house',
            min: 5,
            basePrestige: [25000, 80000],
            heritage: ['roman_novus_homo', 'roman_plebian'],
            jobs: ['trader', 'lawyer', 'physician'],
            traits: ['educated', 'competitive', 'gregarious'],
            cost: 1400,
            support: 260,
            revenue: 90
          },
          civic: {
            title: 'Civic Citizens',
            singular: 'civic family',
            min: 5,
            basePrestige: [8000, 25000],
            heritage: ['roman_plebian', 'roman_novus_homo'],
            jobs: ['lawyer', 'physician', 'rhetor', 'painter'],
            traits: ['literate', 'content', 'trusting'],
            cost: 700,
            support: 150,
            revenue: 55
          },
          plebeian: {
            title: 'Plebeian Citizens',
            singular: 'plebeian family',
            min: 5,
            basePrestige: [1500, 8000],
            heritage: ['roman_plebian'],
            jobs: ['trader', 'painter', 'labourer'],
            traits: ['content', 'gregarious', 'charitable'],
            cost: 350,
            support: 85,
            revenue: 35
          },
          freedmen: {
            title: 'Freedmen',
            singular: 'freedman house',
            min: 4,
            basePrestige: [500, 5000],
            heritage: ['roman_freedman'],
            jobs: ['trader', 'painter', 'labourer'],
            traits: ['literate', 'greedy', 'trusting'],
            cost: 220,
            support: 55,
            revenue: 25
          },
          poor: {
            title: 'Urban Poor',
            singular: 'poor household',
            min: 4,
            basePrestige: [0, 1200],
            heritage: ['roman_plebian', 'roman_freedman'],
            jobs: ['labourer', null],
            traits: ['content', 'charitable', 'stubborn'],
            cost: 120,
            support: 30,
            revenue: 12
          }
        },
        nomina: ['Aelius', 'Aemilius', 'Antonius', 'Appius', 'Atilius', 'Calpurnius', 'Cassius', 'Claudius', 'Cornelius', 'Fabius', 'Flavius', 'Fulvius', 'Julius', 'Licinius', 'Livius', 'Marcius', 'Marius', 'Minucius', 'Octavius', 'Pompeius', 'Porcius', 'Quinctius', 'Sergius', 'Sulpicius', 'Valerius'],
        cognomina: ['Afer', 'Agricola', 'Balbus', 'Caldus', 'Cato', 'Corvus', 'Crispus', 'Felix', 'Flaccus', 'Longus', 'Magnus', 'Naso', 'Niger', 'Paullus', 'Rufus', 'Severus', 'Varro', 'Vetus'],
        maleNames: ['Aulus', 'Caeso', 'Decimus', 'Gaius', 'Gnaeus', 'Lucius', 'Manius', 'Marcus', 'Numerius', 'Publius', 'Quintus', 'Servius', 'Sextus', 'Spurius', 'Titus', 'Tiberius'],
        femaleNames: ['Aelia', 'Aemilia', 'Antonia', 'Appia', 'Atilia', 'Calpurnia', 'Cassia', 'Claudia', 'Cornelia', 'Fabia', 'Flavia', 'Fulvia', 'Julia', 'Licinia', 'Livia', 'Marcia', 'Octavia', 'Pompeia', 'Porcia', 'Valeria'],
        crestFields: ['crimson', 'vermilion', 'madder', 'purple', 'indigo', 'sea', 'cypress', 'black', 'umber', 'ochre', 'marble'],
        crestMetals: ['gold', 'bronze', 'silver', 'bone', 'copper'],
        crestAccents: ['gold', 'bronze', 'silver', 'bone', 'crimson', 'purple', 'indigo', 'cypress', 'black', 'ochre'],
        crestShapes: ['scutum', 'oval', 'round', 'vexillum', 'kite', 'hex'],
        crestDivisions: ['plain', 'pale', 'fess', 'bend', 'bendSinister', 'quartered', 'chief', 'chevron', 'saltire', 'orle'],
        crestPatterns: ['none', 'dots', 'bars', 'waves', 'rays', 'tiles'],
        crestCharges: ['spqr', 'aquila', 'laurel', 'thunderbolt', 'standard', 'column', 'sun', 'crescent', 'star', 'scales', 'ship', 'spear', 'tower', 'hand'],
        crestBorders: ['simple', 'double', 'bossed', 'laurel', 'rivets'],
        crestMarks: ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'X', 'XII', 'SPQR'],
        crestPalette: {
          crimson: '#8f1f22',
          vermilion: '#b93a28',
          madder: '#6f1628',
          purple: '#5c2d63',
          indigo: '#263f73',
          sea: '#1f6771',
          cypress: '#2f5f45',
          black: '#202026',
          umber: '#6b3f24',
          ochre: '#b67b2d',
          marble: '#ded8c8',
          gold: '#d6aa3c',
          bronze: '#a56635',
          silver: '#d8dde1',
          bone: '#eee0c4',
          copper: '#c87545'
        },
        ensure(options) {
          let state = daapi.getState()
          if (!state || !state.current) {
            return this.createState()
          }
          this.repairUnsafeWardrobeLooks(state)
          let society = this.load()
          let ensureKey = this.ensureKey(society, state)
          if (!options || !options.force) {
            if (society.lastEnsureKey === ensureKey) {
              return society
            }
          }
          this.syncWithGame(society, state)
          this.ensureVisibleHouseMembers(society, state)
          state = daapi.getState()
          this.normalizeGeneratedPeople(society, state)
          state = daapi.getState()
          this.ensureGeneratedParents(society, state)
          state = daapi.getState()
          this.ensureGeneratedLooks(society, state)
          this.ensureCrests(society, state)
          this.syncPlayerSocietyStatus(society, state)
          this.restoreSocietyPortraitLooks(state)
          this.allowAchievementsWithSociety(state)
          society.lastEnsureKey = this.ensureKey(society, state)
          this.save(society)
          return society
        },
        ensureKey(society, state) {
          let characterCount = state && state.characters ? Object.keys(state.characters).length : 0
          let dynastyCount = state && state.dynasties ? Object.keys(state.dynasties).length : 0
          let houseCount = society && society.houses ? Object.keys(society.houses).length : 0
          return [
            this.monthKey(state || {}),
            characterCount,
            dynastyCount,
            houseCount,
            this.version
          ].join(':')
        },
        showInstallNoticeOnce() {
          let seen = false
          try {
            seen = !!daapi.getGlobalFlag({ flag: this.noticeFlag })
          } catch (err) {
            seen = false
          }
          if (seen) {
            return
          }
          daapi.setGlobalFlag({ flag: this.noticeFlag, data: true })
          this.pushModal({
            title: 'Roman Society loaded',
            message: 'Roman Society is active. It adds social orders, houses, virtual-player families, monthly family affairs, alliances, rivalries, patronage, trade, scandals, petitions, and political support.',
            image: daapi.requireImage('/cor_society/icon.svg'),
            options: [
              {
                variant: 'info',
                text: 'Open Roman Society',
                action: {
                  event: this.event,
                  method: 'openHub'
                }
              },
              {
                text: 'Later'
              }
            ]
          })
        },
        createState() {
          return {
            version: this.version,
            settings: {
              enabled: true,
              monthlyEvents: true,
              autoGenerate: true
            },
            houses: {},
            generatedHouseIds: [],
            generatedCharacterIds: [],
            pendingVentures: [],
            crests: {},
            crestSettings: {
              playerOverlay: true
            },
            houseRelations: {},
            lastProcessedMonth: '',
            log: []
          }
        },
        load() {
          let society = false
          try {
            society = daapi.getGlobalFlag({ flag: this.flag })
          } catch (err) {
            society = false
          }
          if (!society || typeof society !== 'object') {
            society = this.createState()
          }
          society.version = this.version
          society.settings = { enabled: true, monthlyEvents: true, autoGenerate: true, ...(society.settings || {}) }
          society.houses = society.houses || {}
          society.generatedHouseIds = society.generatedHouseIds || []
          society.generatedCharacterIds = society.generatedCharacterIds || []
          society.pendingVentures = society.pendingVentures || []
          society.crests = society.crests || {}
          society.crestSettings = { playerOverlay: true, ...(society.crestSettings || {}) }
          society.houseRelations = society.houseRelations || {}
          society.log = society.log || []
          return society
        },
        save(society) {
          daapi.setGlobalFlag({ flag: this.flag, data: society })
        },
        assetIcon(name) {
          try {
            return daapi.requireImage('/cor_society/assets/' + name + '.svg')
          } catch (err) {
            console.warn(err)
            return daapi.requireImage('/cor_society/icon.svg')
          }
        },
        stratumIcon(stratum) {
          let icons = {
            senatorial: 'senate',
            equestrian: 'eques',
            civic: 'senator',
            plebeian: 'plebeian',
            freedmen: 'freedmen',
            poor: 'poor'
          }
          return this.assetIcon(icons[stratum] || 'familyTree')
        },
        affairIcon(kind) {
          let icons = {
            officeCampaign: 'senator',
            tradeVenture: 'trade',
            marriageAlliance: 'wedding',
            inheritanceDispute: 'familyTree',
            feud: 'influence',
            scandal: 'prestige',
            slander: 'influence',
            petition: 'plebeian',
            invitation: 'familyTree',
            support: 'senate',
            marriage: 'marriage',
            birth: 'familyTree',
            gift: 'coins',
            coins: 'coins',
            prestige: 'prestige',
            trade: 'trade',
            patronage: 'prestige',
            rivalry: 'influence',
            log: 'familyTree'
          }
          return this.assetIcon(icons[kind] || 'familyTree')
        },
        pushModal(payload) {
          payload = payload || {}
          if (!payload.corTranslatorPretranslateNow) {
            payload.corTranslatorSkipPretranslate = true
            payload.skipTranslatorPretranslate = true
          }
          payload.options = this.decorateModalOptions(this.addSocietyCloseOption(payload.options || [], payload), payload)
          daapi.pushInteractionModalQueue(payload)
        },
        addSocietyCloseOption(options, payload) {
          options = (options || []).slice()
          if (payload && payload.disableSocietyClose) {
            return options
          }
          let hasClose = options.some((option) => option && typeof option === 'object' && /^close( society)?$/i.test(String(option.text || '').trim()) && !option.action)
          if (!hasClose) {
            options.push({
              text: 'Close Society',
              tooltip: 'Consequences: closes this Society window; no stats change.'
            })
          }
          return options
        },
        decorateModalOptions(options, payload) {
          return (options || []).map((option) => this.decorateModalOption(option, payload)).filter(Boolean)
        },
        decorateModalOption(option, payload) {
          if (!option || typeof option !== 'object') {
            return option
          }
          if (option.options) {
            option.options = this.decorateModalOptions(option.options, payload)
          }
          let consequence = this.optionConsequence(option, payload)
          if (consequence) {
            option.tooltip = option.tooltip ? option.tooltip + '\n' + consequence : consequence
          } else if (!option.tooltip) {
            option.tooltip = this.defaultOptionTooltip(option)
          }
          if (option.disabled && option.tooltip) {
            option.showDisabledWithTooltip = true
          }
          return option
        },
        defaultOptionTooltip(option) {
          let text = String((option && option.text) || '')
          if (/close/i.test(text)) return 'Consequences: closes this Society window; no stats change.'
          if (/back|cancel|later|previous/i.test(text)) return 'Consequences: returns without changing stats.'
          if (/next page/i.test(text)) return 'Consequences: opens the next page; no stats change.'
          let method = option && option.action && option.action.method
          if (method && /^open/.test(method)) return 'Consequences: opens another Society view; no stats change.'
          return ''
        },
        optionConsequence(option, payload) {
          let action = option && option.action
          let method = action && action.method
          if (!method) {
            return ''
          }
          let context = action.context || {}
          let house = this.houseFromContext(context)
          let state = daapi.getState()
          let profile = house ? (this.strata[house.stratum] || this.strata.plebeian) : this.strata.plebeian
          if (method === 'openEstate') return 'Consequences: opens that social order; no stats change.'
          if (method === 'openRelations') return 'Consequences: opens allies and patrons; no stats change.'
          if (method === 'openAllies') return 'Consequences: opens allies and patrons; no stats change.'
          if (method === 'openRivals') return 'Consequences: opens rival houses; no stats change.'
          if (method === 'openWardrobe') return 'Consequences: opens the household wardrobe; no stats change.'
          if (method === 'openWardrobeCharacter') return 'Consequences: opens clothing choices for this family member; no stats change.'
          if (method === 'applyWardrobeOutfit') return 'Consequences: changes Society portrait clothing only; no stats change.'
          if (method === 'openLog') return 'Consequences: opens past affairs; no stats change.'
          if (method === 'openLogEntry') return 'Consequences: opens this affair notice; no stats change.'
          if (method === 'openHub') return 'Consequences: returns to the Society overview; no stats change.'
          if (method === 'openHouse') return 'Consequences: opens the selected house; no stats change.'
          if (method === 'openPeople') return 'Consequences: opens member groups; no stats change.'
          if (method === 'openMemberGroups') return 'Consequences: opens member groups; no stats change.'
          if (method === 'openMemberGroup') return 'Consequences: opens one member category; no stats change.'
          if (method === 'openPerson') return 'Consequences: opens this character; no stats change.'
          if (method === 'openVanillaActions') return 'Consequences: opens this character\'s vanilla / other mods actions; no stats change yet.'
          if (method === 'openVanillaKnownFamily') return 'Consequences: opens the vanilla known-family screen if the game route is available; no stats change.'
          if (method === 'openVanillaFullFamilyTree') return 'Consequences: opens the vanilla full-family-tree screen if the game route is available; no stats change.'
          if (method === 'openFamilyTree') return 'Consequences: opens Society\'s graphical family-tree view; no stats change.'
          if (method === 'openMarriageHousehold') return 'Consequences: chooses one of your unmarried adult family members; no stats change yet.'
          if (method === 'openMarriageCandidates') return 'Consequences: chooses possible spouses from this house; no stats change yet.'
          if (method === 'confirmSocietyMarriage') return 'Consequences: opens the final wedding confirmation; no stats change yet.'
          if (method === 'randomizePlayerCrest') return 'Consequences: creates a new player shield; no stats change.'
          if (method === 'cyclePlayerCrest') return 'Consequences: changes this shield part only; no stats change.'
          if (method === 'togglePlayerCrestOverlay') return 'Consequences: toggles the floating player shield badge; no stats change.'
          if (method === 'sendGift') return this.effectLine([this.changeText('cash', -this.actionCost(house || {}, 'gift')), '+8 to +16 house relation', 'possible +1 favor'])
          if (method === 'hostDinner') return this.effectLine([this.changeText('cash', -this.actionCost(house || {}, 'dinner')), '+12 prestige', '+10 to +20 house relation', 'lowers house heat'])
          if (method === 'askSupport') {
            let support = Math.max(20, Math.round((profile.support || 50) + ((house && house.strength) || 0) * 2))
            return this.effectLine(['+' + support + ' influence', (house && house.favor > 0) ? '-1 favor, -4 house relation' : '-16 house relation', '+1 house heat'])
          }
          if (method === 'tradeDeal') {
            let amount = Math.max(8, Math.round((profile.revenue || 20) + ((house && house.strength) || 0) / 3))
            return this.effectLine(['+' + amount + ' monthly revenue for 12 months', '+5 house relation'])
          }
          if (method === 'offerPatronage') {
            let stipend = Math.max(8, Math.round((profile.revenue || 20) / 2))
            return this.effectLine(['-' + stipend + ' monthly revenue for 12 months', '+8 prestige', '+22 house relation', '+1 favor'])
          }
          if (method === 'seekPatronage') {
            let amount = Math.max(60, Math.round(((house && house.strength) || 20) * 3))
            return this.effectLine(['+' + amount + ' influence', '-5 prestige', '-8 house relation', 'may spend 1 favor'])
          }
          if (method === 'startRivalry') return this.effectLine(['+10 prestige', '+25 influence', 'sets relation to -65 or worse', 'starts rivalry'])
          if (method === 'reconcile') return this.effectLine([this.changeText('cash', -this.actionCost(house || {}, 'reconcile')), '-20 influence', '+38 house relation', 'may end rivalry'])
          if (method === 'praisePerson') return this.effectLine(['+3 prestige', '+6 house relation'])
          if (method === 'requestIntroduction') return this.effectLine(['+35 influence', '-3 house relation', 'possible +1 favor'])
          if (method === 'spreadRumor') return this.effectLine(['usually +35 influence, +5 prestige, -22 house relation', 'if exposed: -15 prestige, -35 relation, rivalry'])
          if (method === 'answerSlander') return this.effectLine(['-35 influence', '+4 prestige', '-8 house relation', '+2 house heat'])
          if (method === 'ignoreSlander') return this.effectLine(['-10 prestige', 'lowers house heat'])
          if (method === 'acceptOpening') return this.effectLine(['+60 influence', '+8 house relation', '+1 favor'])
          if (method === 'declineOpening') return this.effectLine(['+3 prestige', '-4 house relation'])
          if (method === 'supportPetition') return this.effectLine([this.changeText('cash', -this.petitionCost(house || {})), '+7 prestige', '+18 house relation', 'possible +1 favor'])
          if (method === 'refusePetition') return this.effectLine(['-12 house relation'])
          if (method === 'attendFamilyInvitation') {
            let cost = this.invitationCost(house || {})
            return this.effectLine(['-' + cost + ' cash', '+10 prestige', '+14 house relation', 'possible +1 favor'])
          }
          if (method === 'declineFamilyInvitation') return this.effectLine(['-7 house relation', '+1 house heat'])
          if (method === 'endorseOffice') return this.effectLine(['-45 influence', '+10 prestige', '+14 house relation', '+10 house power', '+1 favor'])
          if (method === 'honorWedding') {
            let cost = this.actionCost(house || {}, 'wedding')
            return this.effectLine(['-' + cost + ' cash', '+5 prestige', '+16 house relation', '+5 house stability'])
          }
          if (method === 'judgeInheritance') return this.effectLine(['-30 influence', '70%: +12 prestige, +18 relation, +12 stability, +1 favor', 'failure: -8 prestige, -16 relation, -8 stability'])
          if (method === 'investVenture') {
            let offer = this.ventureOffer(house || {})
            let offerCost = context.cost || offer.cost
            let offerMonths = context.months || offer.months
            let offerExpected = context.expected || offer.expected
            return this.effectLine(['-' + offerCost + ' cash', 'result in ' + offerMonths + ' months', 'expected share about +' + offerExpected + ' cash', '+10 house relation'])
          }
          if (method === 'shieldScandal') return this.effectLine(['-35 influence', '-4 prestige', '+20 house relation', '+8 stability', '+1 favor'])
          if (method === 'exploitScandal') return this.effectLine(['+50 influence', '+6 prestige', '-35 house relation', '-8 house power', 'may start rivalry'])
          if (method === 'declineFamilyAffair') return this.effectLine(['-3 house relation'])
          if (method === 'performSocietyMarriage') {
            let effects = house ? this.marriageEffects(state, house) : false
            if (!effects) return 'Consequences: performs the vanilla marriage and refreshes Society.'
            let parts = [
              this.changeText('cash', effects.stats && effects.stats.cash),
              this.changeText('prestige', effects.stats && effects.stats.prestige),
              this.changeText('influence', effects.stats && effects.stats.influence),
              effects.revenue ? '+' + effects.revenue + ' monthly revenue for 24 months' : '',
              '+' + effects.relation + ' house relation',
              '+1 favor',
              'spouse link in vanilla family UI'
            ]
            return this.effectLine(parts)
          }
          return ''
        },
        houseFromContext(context) {
          context = context || {}
          if (context.houseId === undefined || context.houseId === null || context.houseId === '') {
            return false
          }
          let society = this.load()
          return society && society.houses ? society.houses[context.houseId] : false
        },
        effectLine(parts) {
          return 'Consequences: ' + (parts || []).filter(Boolean).join(', ') + '.'
        },
        changeText(label, value) {
          value = Math.round(parseFloat(value || 0))
          if (!value) {
            return ''
          }
          return (value > 0 ? '+' : '') + value + ' ' + label
        },
        syncWithGame(society, state) {
          let members = this.collectHouseMembers(state)
          for (let dynastyId in members) {
            if (!members.hasOwnProperty(dynastyId)) {
              continue
            }
            let house = society.houses[dynastyId] || this.createHouseRecord(dynastyId)
            let summary = this.summarizeHouse(dynastyId, members[dynastyId], state)
            let previousMembers = {}
            ;(house.memberIds || []).forEach((characterId) => {
              previousMembers[characterId] = true
            })
            house.name = summary.name
            house.stratum = summary.stratum
            house.strength = summary.strength
            house.memberIds = summary.memberIds
            house.notableIds = summary.notableIds
            house.prestige = summary.prestige
            house.heritage = summary.heritage
            house.citizenRank = summary.citizenRank
            if (!house.wealth) {
              house.wealth = Math.max(20, Math.round(summary.strength * 18 + summary.prestige / 80))
            }
            if (!house.power) {
              house.power = Math.max(5, Math.round(summary.strength / 2))
            }
            if (!house.stability) {
              house.stability = this.randomInt(35, 75)
            }
            summary.memberIds.forEach((characterId) => {
              let character = state.characters[characterId]
              if (!previousMembers[characterId] && character && (character.fatherId || character.motherId) && this.age(character, state) <= 1) {
                this.log(society, 'A child is born into ' + summary.name + ': ' + this.characterName(character, state) + '.', 'birth', dynastyId)
              }
            })
            house.lastSeen = this.monthKey(state)
            society.houses[dynastyId] = house
          }
          if (society.settings.autoGenerate) {
            this.ensureMinimumHouses(society, state)
          }
        },
        collectHouseMembers(state) {
          let result = {}
          let current = state.current || {}
          let player = state.characters[this.currentCharacterId(state)] || {}
          let playerDynastyId = player.dynastyId
          let household = {}
          ;(current.householdCharacterIds || []).forEach((characterId) => {
            household[characterId] = true
          })
          for (let characterId in state.characters) {
            if (!state.characters.hasOwnProperty(characterId)) {
              continue
            }
            let character = state.characters[characterId]
            if (!character || character.isDead || !character.dynastyId || character.dynastyId === playerDynastyId) {
              continue
            }
            if (household[characterId] && character.dynastyId === playerDynastyId) {
              continue
            }
            character.id = character.id || characterId
            result[character.dynastyId] = result[character.dynastyId] || []
            result[character.dynastyId].push(character)
          }
          return result
        },
        createHouseRecord(dynastyId) {
          return {
            id: dynastyId,
            relation: this.randomInt(-12, 16),
            favor: 0,
            heat: 0,
            rivalry: false,
            patronageUntil: '',
            tradeUntil: '',
            wealth: 0,
            power: 0,
            stability: this.randomInt(35, 75),
            ai: false,
            agenda: this.pick(['office', 'wealth', 'honor', 'marriage', 'security', 'revenge']),
            lastFamilyEvent: '',
            pendingPlayerEvent: false,
            lastInteraction: '',
            notes: []
          }
        },
        summarizeHouse(dynastyId, members, state) {
          let dynasty = state.dynasties[dynastyId] || {}
          let prestige = parseFloat(dynasty.prestige || 0)
          let inheritance = 0
          let maxJob = 0
          let hasSenate = false
          let memberIds = []
          members.forEach((character) => {
            memberIds.push(character.id)
            inheritance += parseFloat(character.inheritance || 0)
            maxJob = Math.max(maxJob, parseFloat(character.jobLevel || 0))
            if (this.isSenatorialCharacter(character, state)) {
              hasSenate = true
            }
          })
          let strength = Math.round(prestige / 1000 + inheritance / 100 + maxJob * 8 + members.length * 4 + (hasSenate ? 60 : 0))
          let notableIds = members
            .slice()
            .sort((a, b) => this.characterScore(b, state) - this.characterScore(a, state))
            .slice(0, 8)
            .map((character) => character.id)
          return {
            name: this.houseName(dynasty, dynastyId),
            stratum: this.classifyHouse(dynasty, members, strength, hasSenate),
            strength,
            memberIds,
            notableIds,
            prestige,
            heritage: dynasty.heritage || 'unknown',
            citizenRank: this.rankFromStrength(strength)
          }
        },
        ensureMinimumHouses(society, state) {
          let counts = this.countByStratum(society)
          this.stratumOrder.forEach((stratum) => {
            let needed = (this.strata[stratum].min || 0) - (counts[stratum] || 0)
            for (let i = 0; i < needed; i++) {
              this.generateHouse(society, state, stratum)
            }
          })
        },
        generateHouse(society, state, stratum) {
          let profile = this.strata[stratum]
          let isMale = Math.random() > 0.25
          let nomen = this.pick(this.nomina)
          let cognomen = this.pick(this.cognomina)
          let prestige = this.randomInt(profile.basePrestige[0], profile.basePrestige[1])
          let job = this.pick(profile.jobs)
          let traits = this.generatedTraitsForStratum(stratum, job)
          let headId = daapi.generateCharacter({
            characterFeatures: {
              gender: isMale ? 'male' : 'female',
              isMale,
              praenomen: isMale ? this.pick(this.maleNames) : this.pick(this.femaleNames),
              birthMonth: this.randomInt(0, 11),
              birthYear: state.year - this.randomInt(20, 30),
              look: this.generatedVanillaLook(isMale, stratum + '-' + nomen + '-' + cognomen),
              job,
              jobLevel: this.randomInt(0, stratum === 'senatorial' ? 12 : stratum === 'equestrian' ? 9 : 6),
              traits,
              skills: this.skillsForStratum(stratum),
              corSocietyGenerated: true,
              flagDoNotCull: true,
              flagCanHoldImperium: stratum === 'senatorial' || stratum === 'equestrian' || Math.random() > 0.55
            },
            dynastyFeatures: {
              nomen,
              cognomen,
              prestige,
              heritage: this.pick(profile.heritage)
            }
          })
          let head = daapi.getCharacter({ characterId: headId })
          if (!head || !head.dynastyId) {
            return false
          }
          this.applyGeneratedTraits(headId, traits)
          let house = society.houses[head.dynastyId] || this.createHouseRecord(head.dynastyId)
          house.name = this.houseName(daapi.getState().dynasties[head.dynastyId] || {}, head.dynastyId)
          house.stratum = stratum
          house.generated = true
          house.relation = this.randomInt(-8, 12)
          house.memberIds = [headId]
          house.notableIds = [headId]
          house.strength = Math.round(prestige / 1000 + 25)
          house.prestige = prestige
          house.heritage = (daapi.getState().dynasties[head.dynastyId] || {}).heritage || this.pick(profile.heritage)
          house.citizenRank = this.rankFromStrength(house.strength)
          society.houses[head.dynastyId] = house
          society.generatedHouseIds.push(head.dynastyId)
          society.generatedCharacterIds.push(headId)
          this.seedGeneratedHouseFamily(society, daapi.getState(), house, stratum, headId)
          this.log(society, 'New ' + profile.singular + ' enters public life: ' + house.name + '.')
          return house
        },
        seedGeneratedHouseFamily(society, state, house, stratum, headId) {
          let head = (state.characters && state.characters[headId]) || daapi.getCharacter({ characterId: headId })
          if (!head) {
            return
          }
          head.id = head.id || headId
          let headAge = this.age(head, state)
          let spouse = false
          if (!head.spouseId && headAge >= 20) {
            spouse = this.generateHouseSpouse(society, state, house, stratum, head)
            state = daapi.getState()
            head = state.characters[headId] || head
          }
          if (headAge >= 34) {
            let spouseId = (head.spouseId && state.characters[head.spouseId]) ? head.spouseId : (spouse && spouse.id)
            let spouseCharacter = spouseId ? state.characters[spouseId] || spouse : false
            if (spouseCharacter) {
              let mother = this.characterIsMale(head) ? spouseCharacter : head
              let father = this.characterIsMale(head) ? head : spouseCharacter
              let childCount = this.randomInt(1, headAge >= 45 ? 3 : 2)
              for (let i = 0; i < childCount; i++) {
                this.generateHouseChild(society, state, house, stratum, mother, father, this.randomInt(0, Math.min(18, headAge - 18)))
                state = daapi.getState()
              }
            }
          }
          while (this.visibleHousePeople(house, state).length < this.minimumVisibleMembers(house) && (society.generatedCharacterIds || []).length < 260) {
            this.generateRelative(society, state, house, stratum, head)
            state = daapi.getState()
            head = state.characters[headId] || head
          }
          this.refreshHouseMemberLists(society, state, house)
        },
        generateHouseSpouse(society, state, house, stratum, head) {
          let profile = this.strata[stratum] || this.strata.plebeian
          let isMale = !this.characterIsMale(head)
          let headAge = this.age(head, state)
          let minAge = Math.max(18, Math.min(30, headAge - 4))
          let maxAge = Math.max(minAge, Math.min(34, headAge + 6))
          let age = this.randomInt(minAge, maxAge)
          let job = this.pick(profile.jobs)
          let traits = this.generatedTraitsForStratum(stratum, job)
          let spouseId = daapi.generateCharacter({
            characterFeatures: {
              gender: isMale ? 'male' : 'female',
              isMale,
              praenomen: isMale ? this.pick(this.maleNames) : this.pick(this.femaleNames),
              birthMonth: this.randomInt(0, 11),
              birthYear: state.year - age,
              look: this.generatedVanillaLook(isMale, stratum + '-' + house.id + '-spouse-' + head.id),
              job,
              jobLevel: this.randomInt(0, stratum === 'senatorial' ? 8 : stratum === 'equestrian' ? 6 : 4),
              traits,
              skills: this.skillsForStratum(stratum),
              corSocietyGenerated: true,
              flagDoNotCull: true,
              flagCanHoldImperium: stratum === 'senatorial' || stratum === 'equestrian' || Math.random() > 0.7
            },
            dynastyFeatures: {}
          })
          this.applyGeneratedTraits(spouseId, traits)
          society.generatedCharacterIds = society.generatedCharacterIds || []
          if (society.generatedCharacterIds.indexOf(spouseId) < 0) {
            society.generatedCharacterIds.push(spouseId)
          }
          try {
            daapi.performMarriage({
              characterId: head.id,
              spouseId,
              isMatrilineal: !this.characterIsMale(head)
            })
            daapi.forceUpdateCharacterDisplay({ characterId: head.id })
            daapi.forceUpdateCharacterDisplay({ characterId: spouseId })
          } catch (err) {
            console.warn(err)
          }
          let spouse = daapi.getCharacter({ characterId: spouseId }) || {}
          spouse.id = spouse.id || spouseId
          return spouse
        },
        generateHouseChild(society, state, house, stratum, mother, father, childAge) {
          mother = mother || {}
          father = father || {}
          let isMale = Math.random() > 0.5
          childAge = Math.max(0, Math.min(18, parseInt(childAge || 0, 10)))
          let traits = childAge >= 12 ? this.generatedTraitsForStratum(stratum, '') : []
          let childId = daapi.generateCharacter({
            characterFeatures: {
              gender: isMale ? 'male' : 'female',
              isMale,
              praenomen: isMale ? this.pick(this.maleNames) : this.pick(this.femaleNames),
              birthMonth: this.randomInt(0, 11),
              birthYear: state.year - childAge,
              look: this.inheritedVanillaLook(isMale, mother, father, stratum + '-' + house.id + '-child-' + mother.id + '-' + father.id + '-' + childAge),
              traits,
              skills: this.skillsForStratum(stratum),
              corSocietyGenerated: true,
              flagDoNotCull: true,
              fatherId: father.id || null,
              motherId: mother.id || null,
              childrenIds: []
            },
            dynastyFeatures: {}
          })
          daapi.updateCharacter({
            characterId: childId,
            character: {
              dynastyId: house.id,
              fatherId: father.id || null,
              motherId: mother.id || null,
              childrenIds: []
            }
          })
          ;[mother, father].forEach((parent) => {
            if (!parent || !parent.id) {
              return
            }
            let children = (parent.childrenIds || []).slice()
            if (children.indexOf(childId) < 0) {
              children.push(childId)
              daapi.updateCharacter({
                characterId: parent.id,
                character: {
                  childrenIds: children
                }
              })
            }
          })
          house.memberIds = house.memberIds || []
          house.notableIds = house.notableIds || []
          if (house.memberIds.indexOf(childId) < 0) {
            house.memberIds.push(childId)
          }
          if (childAge >= 16 && house.notableIds.indexOf(childId) < 0) {
            house.notableIds.push(childId)
          }
          society.generatedCharacterIds = society.generatedCharacterIds || []
          if (society.generatedCharacterIds.indexOf(childId) < 0) {
            society.generatedCharacterIds.push(childId)
          }
          this.applyGeneratedTraits(childId, traits)
          return childId
        },
        generateRelative(society, state, house, stratum, head) {
          let profile = this.strata[stratum]
          let isMale = Math.random() > 0.5
          let headAge = this.age(head, state)
          let canBeChild = headAge >= 34
          let relativeAge = canBeChild ? this.randomInt(0, Math.min(30, headAge - 18)) : this.randomInt(16, 30)
          let job = relativeAge >= 16 ? this.pick(profile.jobs) : ''
          let traits = relativeAge >= 12 ? this.generatedTraitsForStratum(stratum, job) : []
          let relativeId = daapi.generateCharacter({
            characterFeatures: {
              gender: isMale ? 'male' : 'female',
              isMale,
              praenomen: isMale ? this.pick(this.maleNames) : this.pick(this.femaleNames),
              birthMonth: this.randomInt(0, 11),
              birthYear: state.year - relativeAge,
              look: canBeChild ? this.inheritedVanillaLook(isMale, head.isMale ? null : head, head.isMale ? head : null, stratum + '-' + house.id + '-' + head.id + '-' + relativeAge) : this.generatedVanillaLook(isMale, stratum + '-' + house.id + '-' + head.id + '-' + relativeAge),
              job,
              jobLevel: job ? this.randomInt(0, 5) : 0,
              traits,
              skills: this.skillsForStratum(stratum),
              corSocietyGenerated: true,
              flagDoNotCull: true,
              fatherId: canBeChild && head.isMale ? head.id : null,
              motherId: canBeChild && !head.isMale ? head.id : null,
              childrenIds: []
            },
            dynastyFeatures: {}
          })
          daapi.updateCharacter({
            characterId: relativeId,
            character: {
              dynastyId: house.id,
              fatherId: canBeChild && head.isMale ? head.id : null,
              motherId: canBeChild && !head.isMale ? head.id : null
            }
          })
          if (canBeChild) {
            let headChildren = (head.childrenIds || []).slice()
            if (headChildren.indexOf(relativeId) < 0) {
              headChildren.push(relativeId)
            }
            daapi.updateCharacter({
              characterId: head.id,
              character: {
                childrenIds: headChildren
              }
            })
          }
          house.memberIds = house.memberIds || []
          house.notableIds = house.notableIds || []
          if (house.memberIds.indexOf(relativeId) < 0) {
            house.memberIds.push(relativeId)
          }
          if (house.notableIds.indexOf(relativeId) < 0) {
            house.notableIds.push(relativeId)
          }
          if (society.generatedCharacterIds.indexOf(relativeId) < 0) {
            society.generatedCharacterIds.push(relativeId)
          }
          this.applyGeneratedTraits(relativeId, traits)
        },
        skillsForStratum(stratum) {
          let high = stratum === 'senatorial' ? 28 : stratum === 'equestrian' ? 22 : stratum === 'civic' ? 18 : stratum === 'plebeian' ? 14 : 11
          let low = stratum === 'poor' ? 1 : 4
          return {
            intelligence: this.randomInt(low, high),
            stewardship: this.randomInt(low, high),
            eloquence: this.randomInt(low, high),
            combat: this.randomInt(low, high)
          }
        },
        generatedTraitsForStratum(stratum, job) {
          let pools = {
            senatorial: ['senator', 'ambitious', 'authoritative', 'honorable', 'oratorDeliberative', 'erudite', 'competitive'],
            equestrian: ['educated', 'competitive', 'gregarious', 'ambitious', 'horseRider', 'fashionable', 'greedy'],
            civic: ['literate', 'educated', 'content', 'trusting', 'honorable', 'erudite', 'oratorJudicial'],
            plebeian: ['content', 'gregarious', 'charitable', 'stubborn', 'strong', 'trusting'],
            freedmen: ['literate', 'greedy', 'trusting', 'sly', 'ambitious', 'fashionable'],
            poor: ['content', 'charitable', 'stubborn', 'strong', 'shy']
          }
          let pool = (pools[stratum] || pools.plebeian).slice()
          if (job === 'lawyer') {
            pool.push('oratorJudicial', 'authoritative')
          } else if (job === 'rhetor') {
            pool.push('oratorDeliberative', 'erudite')
          } else if (job === 'physician' || job === 'philosophyTutor' || job === 'litterator' || job === 'grammaticus') {
            pool.push('educated', 'erudite')
          } else if (job === 'trader') {
            pool.push('greedy', 'gregarious', 'sly')
          } else if (job === 'labourer' || job === 'farmer' || job === 'blacksmith') {
            pool.push('strong', 'stubborn')
          }
          return this.pickUnique(pool, this.randomInt(1, stratum === 'senatorial' || stratum === 'equestrian' ? 3 : 2))
        },
        applyGeneratedTraits(characterId, traits) {
          ;(traits || []).forEach((trait) => {
            if (!trait) {
              return
            }
            try {
              daapi.addTrait({ characterId, trait })
            } catch (err) {
              console.warn(err)
            }
          })
        },
        generatedVanillaLook(isMale, seedText) {
          let types = ['black', 'brown', 'brown_curly', 'dusky', 'olive', 'tan', 'hazel', 'auburn', 'blonde']
          let random = this.seededRandom(seedText || Math.random())
          return {
            group: 'roman',
            type: this.pickByRandom(types, random),
            gender: isMale ? 'male' : 'female'
          }
        },
        inheritedVanillaLook(isMale, mother, father, seedText) {
          let inheritedTypes = []
          ;[mother, father].forEach((parent) => {
            if (parent && parent.look && parent.look.type) {
              inheritedTypes.push(parent.look.type)
            }
          })
          if (!inheritedTypes.length) {
            return this.generatedVanillaLook(isMale, seedText)
          }
          let random = this.seededRandom(seedText || inheritedTypes.join('-'))
          let type = this.pickByRandom(inheritedTypes, random)
          if (random() < 0.16) {
            type = this.nearbyLookType(type, random)
          }
          return {
            group: 'roman',
            type,
            gender: isMale ? 'male' : 'female'
          }
        },
        nearbyLookType(type, random) {
          let variants = {
            black: ['black', 'dusky', 'brown'],
            brown: ['brown', 'brown_curly', 'tan', 'hazel'],
            brown_curly: ['brown_curly', 'brown', 'hazel'],
            dusky: ['dusky', 'black', 'olive'],
            olive: ['olive', 'tan', 'brown'],
            tan: ['tan', 'olive', 'hazel'],
            hazel: ['hazel', 'brown', 'auburn', 'tan'],
            auburn: ['auburn', 'hazel', 'brown'],
            blonde: ['blonde', 'hazel', 'tan']
          }
          return this.pickByRandom(variants[type] || [type || 'brown'], random || Math.random)
        },
        ensureGeneratedParents(society, state) {
          let ids = (society.generatedCharacterIds || []).slice()
          ids.forEach((characterId) => {
            let character = state.characters[characterId]
            if (!character || character.isDead || character.corSocietyGhostParent) {
              return
            }
            character.id = character.id || characterId
            let patch = {}
            if (!character.fatherId) {
              patch.fatherId = this.generateGhostParent(society, state, character, true)
            }
            if (!character.motherId) {
              patch.motherId = this.generateGhostParent(society, state, character, false)
            }
            if (patch.fatherId || patch.motherId) {
              try {
                daapi.updateCharacter({
                  characterId,
                  character: patch
                })
              } catch (err) {
                console.warn(err)
              }
            }
          })
        },
        normalizeGeneratedPeople(society, state) {
          if (society.generatedNormalizationVersion === this.version) {
            return
          }
          let ids = (society.generatedCharacterIds || []).slice()
          ids.forEach((characterId) => {
            let character = state.characters[characterId]
            if (!character || character.isDead || character.corSocietyGhostParent) {
              return
            }
            let patch = {
              corSocietyGenerated: true,
              flagDoNotCull: true
            }
            let age = this.age(character, state)
            let hasFamily = !!character.spouseId || ((character.childrenIds || []).length > 0)
            if (age > 38 && !hasFamily) {
              patch.birthYear = (state.year || character.birthYear || 0) - this.randomInt(20, 30)
            }
            try {
              daapi.updateCharacter({
                characterId,
                character: patch
              })
            } catch (err) {
              console.warn(err)
            }
          })
          society.generatedNormalizationVersion = this.version
        },
        generateGhostParent(society, state, child, isMale) {
          let childBirthYear = parseInt(child.birthYear || state.year || 0, 10)
          let parentAgeAtBirth = this.randomInt(19, 34)
          let birthYear = childBirthYear - parentAgeAtBirth
          let minDeathYear = birthYear + this.randomInt(42, 68)
          let currentYear = state.year || minDeathYear
          let deathYear = Math.max(childBirthYear, Math.min(currentYear, Math.max(minDeathYear, childBirthYear + this.randomInt(8, 30))))
          let parentId = daapi.generateCharacter({
            characterFeatures: {
              gender: isMale ? 'male' : 'female',
              isMale,
              praenomen: isMale ? this.pick(this.maleNames) : this.pick(this.femaleNames),
              birthMonth: this.randomInt(0, 11),
              birthYear,
              deathMonth: this.randomInt(0, 11),
              deathYear,
              isDead: true,
              deathCause: 'old age',
              look: this.inheritedVanillaLook(isMale, child, child, 'ghost-parent-' + child.id + '-' + (isMale ? 'father' : 'mother')),
              corSocietyGenerated: true,
              corSocietyGhostParent: true,
              flagDoNotCull: true,
              childrenIds: [child.id]
            },
            dynastyFeatures: {}
          })
          try {
            daapi.updateCharacter({
              characterId: parentId,
              character: {
                dynastyId: child.dynastyId,
                isDead: true,
                deathCause: 'old age',
                corSocietyGenerated: true,
                corSocietyGhostParent: true,
                childrenIds: [child.id]
              }
            })
          } catch (err) {
            console.warn(err)
          }
          society.generatedCharacterIds = society.generatedCharacterIds || []
          if (society.generatedCharacterIds.indexOf(parentId) < 0) {
            society.generatedCharacterIds.push(parentId)
          }
          return parentId
        },
        ensureGeneratedLooks(society, state) {
          let generatedIds = society.generatedCharacterIds || []
          generatedIds.forEach((characterId) => {
            let character = state.characters[characterId]
            if (!character || character.isDead) {
              return
            }
            let look = character.look || {}
            if (look.group && look.type) {
              return
            }
            let newLook = this.generatedVanillaLook(this.characterIsMale(character), characterId + '-' + (character.dynastyId || ''))
            try {
              daapi.updateCharacter({
                characterId,
                character: {
                  look: newLook,
                  flagDoNotCull: true
                }
              })
              character.look = newLook
              character.flagDoNotCull = true
              try {
                daapi.forceUpdateCharacterDisplay({ characterId })
              } catch (displayErr) {
                console.warn(displayErr)
              }
            } catch (err) {
              console.warn(err)
            }
          })
        },
        restoreSocietyPortraitLooks(state) {
          this.repairUnsafeWardrobeLooks(state)
        },
        repairUnsafeWardrobeLooks(state) {
          if (!state || !state.characters) {
            return
          }
          for (let characterId in state.characters) {
            if (!state.characters.hasOwnProperty(characterId)) {
              continue
            }
            let character = state.characters[characterId]
            if (!character || !character.look) {
              continue
            }
            let lookGroup = character.look.group || ''
            if (lookGroup !== 'cor_society' && lookGroup !== this.wardrobeLookGroup) {
              continue
            }
            character.id = character.id || characterId
            this.restoreOriginalLookIfNeeded(character, true, true)
          }
        },
        originalLookForWardrobe(character) {
          if (!character) {
            return {}
          }
          if (character.corSocietyOriginalLook && character.corSocietyOriginalLook.group && character.corSocietyOriginalLook.type) {
            return { ...character.corSocietyOriginalLook }
          }
          let look = character.look || {}
          if (look.group === this.wardrobeLookGroup || look.group === 'cor_society') {
            return {
              group: 'roman',
              type: 'brown'
            }
          }
          return { ...look }
        },
        applyWardrobeLookToCharacter(character, outfit, state, silent) {
          if (!character || !character.id || !outfit || outfit === 'auto') {
            return false
          }
          state = state || daapi.getState()
          if (character.look && (character.look.group === this.wardrobeLookGroup || character.look.group === 'cor_society')) {
            this.restoreOriginalLookIfNeeded(character, true, true)
          }
          character.corSocietyOutfit = outfit
          character.corSocietyOriginalLook = null
          if (silent) {
            return true
          }
          try {
            daapi.updateCharacter({
              characterId: character.id,
              character: {
                corSocietyOriginalLook: null,
                corSocietyOutfit: outfit
              }
            })
          } catch (err) {
            console.warn(err)
          }
          return true
        },
        wardrobePortraitDataUri(character, state, outfit, originalLook, gender, ageStage) {
          let baseCharacter = {
            ...character,
            gender,
            isMale: gender === 'male',
            corSocietyOutfit: '',
            look: {
              ...(originalLook || {}),
              gender,
              ageStage
            }
          }
          let basePortrait = this.vanillaCharacterPortrait(baseCharacter, state) || this.defaultDetailedRomanPortrait(gender, ageStage) || this.genericVanillaCharacterPortrait(baseCharacter, state)
          let inlinePortrait = this.inlineImageHref(basePortrait)
          let baseSvg = this.svgTextFromDataUri(inlinePortrait)
          if (!baseSvg) {
            if (basePortrait) {
              return basePortrait
            }
            return this.genericVanillaCharacterPortrait(baseCharacter, state) || this.defaultDetailedRomanPortrait(gender, ageStage)
          }
          let role = this.characterPortraitRole(character, ageStage, this.playerStratum(state))
          return this.svgDataUri(this.recolorWardrobeSvgText(baseSvg, outfit, gender, ageStage, role))
        },
        defaultDetailedRomanPortrait(gender, ageStage) {
          gender = gender === 'female' ? 'female' : 'male'
          ageStage = ageStage || 'adult'
          return this.vanillaPortraitAsset('icons/characters/roman/brown/' + gender + '/' + ageStage + '.svg')
        },
        restoreOriginalLookIfNeeded(character, includeGenerated, keepOutfit) {
          if (!character || (!includeGenerated && character.corSocietyGenerated)) {
            return
          }
          let update = {
            corSocietyOriginalLook: null,
            corSocietyOutfit: keepOutfit ? (character.corSocietyOutfit || '') : ''
          }
          let originalLook = character.corSocietyOriginalLook
          let hasUnsafeLook = !!(character.look && (character.look.group === this.wardrobeLookGroup || character.look.group === 'cor_society'))
          if (hasUnsafeLook && (!originalLook || !originalLook.group || !originalLook.type)) {
            originalLook = {
              group: 'roman',
              type: 'brown'
            }
          }
          if (hasUnsafeLook && originalLook && originalLook.group && originalLook.type) {
            character.look = originalLook
            update.look = originalLook
          }
          character.corSocietyOriginalLook = null
          if (!keepOutfit) {
            delete character.corSocietyOutfit
          }
          try {
            daapi.updateCharacter({
              characterId: character.id,
              character: update
            })
          } catch (err) {
            console.warn(err)
          }
        },
        societyLookType(character) {
          return 'c_' + this.safeId(character.id || character.charHash || character.praenomen || 'unknown')
        },
        houseForPortraitCharacter(character, society) {
          if (!character || !society || !society.houses) {
            return false
          }
          if (character.dynastyId && society.houses[character.dynastyId]) {
            return society.houses[character.dynastyId]
          }
          return false
        },
        allowAchievementsWithSociety(state) {
          try {
            if (!state || !state.current) {
              return
            }
            if (state.current.flagUsedMods) {
              state.current.flagUsedMods = false
              state.current.flagSocietyAllowedAchievementsWithMods = true
            }
            if (state.settings) {
              state.settings.enableAPIAchievements = true
            }
          } catch (err) {
            console.warn(err)
          }
        },
        classifyHouse(dynasty, members, strength, hasSenate) {
          let heritage = dynasty.heritage || ''
          let prestige = parseFloat(dynasty.prestige || 0)
          let hasEliteJob = members.some((character) => ['lawyer', 'rhetor', 'physician', 'trader'].indexOf(character.job) >= 0 && parseFloat(character.jobLevel || 0) >= 5)
          let hasLabor = members.some((character) => character.job === 'labourer')
          if (hasSenate || heritage === 'roman_patrician' || prestige >= 75000 || strength >= 95) {
            return 'senatorial'
          }
          if (prestige >= 25000 || strength >= 55 || hasEliteJob) {
            return 'equestrian'
          }
          if (prestige >= 8000 || strength >= 30) {
            return 'civic'
          }
          if (heritage === 'roman_freedman') {
            return prestige < 500 || (prestige < 1200 && hasLabor) ? 'poor' : 'freedmen'
          }
          if ((heritage === 'roman_plebian' || heritage === 'roman_plebeian') && prestige >= 1200) {
            return 'plebeian'
          }
          if (prestige < 1200 || strength < 12 || (hasLabor && prestige < 1800)) {
            return 'poor'
          }
          return 'plebeian'
        },
        isSenatorialCharacter(character, state) {
          if (!character) {
            return false
          }
          let job = character.job || ''
          let traits = character.traits || []
          if (['senator', 'consul', 'praetor', 'pretor', 'quaestor', 'aedile'].indexOf(job) >= 0) {
            return true
          }
          if (traits.indexOf('senator') >= 0 || traits.indexOf('formerQuaestor') >= 0 || traits.indexOf('formerPraetor') >= 0) {
            return true
          }
          let senate = (state.current && state.current.senate) || {}
          for (let office in senate) {
            if (senate.hasOwnProperty(office) && (senate[office] || []).indexOf(character.id) >= 0) {
              return true
            }
          }
          return false
        },
        rankFromStrength(strength) {
          if (strength >= 95) return 'Class I'
          if (strength >= 65) return 'Class II'
          if (strength >= 40) return 'Class III'
          if (strength >= 22) return 'Class IV'
          if (strength >= 10) return 'Class V'
          return 'Capite censi'
        },
        characterScore(character, state) {
          let age = this.age(character, state)
          return (parseFloat(character.inheritance || 0) / 100) +
            (parseFloat(character.jobLevel || 0) * 8) +
            (((character.traits || []).length || 0) * 3) +
            (age >= 16 ? 10 : 0) +
            ((character.job || '') ? 12 : 0)
        },
        houseName(dynasty, dynastyId) {
          let nomen = dynasty.nomen || ''
          let cognomen = dynasty.cognomen || ''
          let name = (nomen + ' ' + cognomen).replace(/\s+/g, ' ').trim()
          return name || String(dynastyId || 'Unknown House')
        },
        age(character, state) {
          try {
            return daapi.calculateAge({ month: character.birthMonth, year: character.birthYear })
          } catch (err) {
            return (state.year || 0) - (character.birthYear || state.year || 0)
          }
        },
        countByStratum(society) {
          let counts = {}
          for (let houseId in society.houses) {
            if (!society.houses.hasOwnProperty(houseId)) {
              continue
            }
            let stratum = society.houses[houseId].stratum || 'plebeian'
            counts[stratum] = (counts[stratum] || 0) + 1
          }
          return counts
        },
        monthlyTick() {
          let state = daapi.getState()
          let society = this.ensure()
          if (!society || !society.settings.enabled) {
            return
          }
          let monthKey = this.monthKey(state)
          if (society.lastProcessedMonth === monthKey) {
            return
          }
          society.lastProcessedMonth = monthKey
          this.syncPlayerWorldEffects(society, state)
          this.simulateHouseTurns(society, state)
          this.simulateInterHouseAffairs(society, state)
          this.resolvePendingVentures(society, state)
          this.driftRelations(society)
          this.applyNetworkModifiers(society)
          if (society.settings.monthlyEvents && Math.random() < 0.64) {
            this.queueMonthlyEvent(society, state)
          }
          this.save(society)
        },
        syncPlayerWorldEffects(society, state) {
          let current = (state && state.current) || {}
          let snapshot = {
            cash: parseFloat(current.cash || 0),
            influence: parseFloat(current.influence || 0),
            prestige: parseFloat(current.prestige || 0)
          }
          if (!society.playerSnapshot) {
            society.playerSnapshot = snapshot
            return
          }
          let previous = society.playerSnapshot || snapshot
          let prestigeDelta = snapshot.prestige - parseFloat(previous.prestige || 0)
          let influenceDelta = snapshot.influence - parseFloat(previous.influence || 0)
          let cashDelta = snapshot.cash - parseFloat(previous.cash || 0)
          society.playerSnapshot = snapshot
          let statusShift = this.clamp(Math.round(prestigeDelta / 250 + influenceDelta / 1200), -4, 4)
          let wealthShift = this.clamp(Math.round(cashDelta / 2500), -3, 3)
          if (!statusShift && !wealthShift) {
            return
          }
          let changed = 0
          this.sortedHouses(society).forEach((house) => {
            let elite = this.socialLevel(house.stratum) >= 4
            let lower = this.socialLevel(house.stratum) <= 2
            let delta = 0
            if (elite) {
              delta += statusShift
            } else if (lower) {
              delta += Math.round(statusShift / 2) + wealthShift
            } else {
              delta += Math.round((statusShift + wealthShift) / 2)
            }
            if (house.rivalry && statusShift > 0) {
              delta -= 1
              house.heat = (house.heat || 0) + 1
            }
            if (delta) {
              house.relation = this.clamp((house.relation || 0) + delta, -100, 100)
              changed += 1
            }
          })
          if (changed && (Math.abs(statusShift) >= 2 || Math.abs(wealthShift) >= 2)) {
            this.log(society, 'Your changing public fortune shifts the mood of ' + changed + ' houses.', statusShift >= 0 || wealthShift >= 0 ? 'support' : 'rivalry')
          }
        },
        simulateHouseTurns(society, state) {
          let houses = this.sortedHouses(society)
          houses.forEach((house) => {
            this.initHouseAI(house)
            this.runHouseEconomy(house)
            let profile = this.strata[house.stratum] || this.strata.plebeian
            let event = ''
            if (house.agenda === 'office') {
              house.ai.influence = Math.max(0, house.ai.influence - this.randomInt(2, 10))
              house.ai.cash = Math.max(0, house.ai.cash - this.randomInt(0, Math.round((profile.cost || 100) / 10)))
              house.power += this.randomInt(1, 6)
              house.wealth -= this.randomInt(0, Math.round((profile.cost || 100) / 8))
              if (Math.random() < 0.14) {
                event = 'officeCampaign'
                house.power += 8
                house.ai.prestige += 12
                house.stability -= 2
              }
            } else if (house.agenda === 'wealth') {
              if (house.ai.cash > (profile.cost || 200) && Math.random() < 0.35) {
                this.aiBuyProperty(house)
              }
              house.wealth += this.randomInt(10, profile.revenue || 40)
              if (Math.random() < 0.12) {
                event = 'tradeVenture'
                house.wealth += profile.revenue || 20
                house.ai.property.trade += 1
              }
            } else if (house.agenda === 'marriage') {
              house.stability += this.randomInt(0, 4)
              if (Math.random() < 0.10) {
                event = 'marriageAlliance'
                house.power += 3
                if ((house.memberIds || []).length < 8 && society.generatedCharacterIds.length < 140) {
                  this.generateHouseMember(society, state, house)
                }
              }
            } else if (house.agenda === 'security') {
              house.ai.cash += this.randomInt(0, profile.revenue || 20)
              house.stability += this.randomInt(1, 5)
              house.wealth += this.randomInt(0, Math.round((profile.revenue || 20) / 2))
              if (Math.random() < 0.08) {
                event = 'inheritanceDispute'
                house.stability -= 8
              }
            } else if (house.agenda === 'revenge') {
              house.power += this.randomInt(0, 4)
              house.stability -= this.randomInt(0, 3)
              if (Math.random() < 0.13) {
                event = 'feud'
                house.heat = (house.heat || 0) + 1
              }
            } else {
              house.wealth += this.randomInt(0, profile.revenue || 20)
              house.stability += this.randomInt(-1, 2)
            }
            if (house.wealth < 0) {
              house.wealth = 0
              house.stability -= 4
            }
            house.stability = this.clamp(house.stability, 0, 100)
            if (house.stability < 18 && Math.random() < 0.25) {
              event = 'scandal'
              house.power = Math.max(0, house.power - 8)
            }
            if (event) {
              this.recordFamilyEvent(society, house, event)
            }
            this.simulateHouseFamilyLife(society, state, house, houses)
            house.ai.cash = Math.max(0, Math.round(house.ai.cash))
            house.ai.influence = Math.max(0, Math.round(house.ai.influence))
            house.ai.prestige = Math.max(0, Math.round(house.ai.prestige))
            house.wealth = Math.max(house.wealth || 0, Math.round(house.ai.cash + house.ai.property.land * 60 + house.ai.property.animals * 20 + house.ai.property.trade * 140))
            house.power = Math.max(house.power || 0, Math.round(house.ai.influence / 18 + house.ai.prestige / 2500))
            house.strength = Math.max(1, Math.round((house.strength || 0) * 0.85 + (house.power || 0) * 0.25 + (house.wealth || 0) / 160 + (house.stability || 0) / 8))
            this.updateHouseStratumFromAI(society, house)
          })
        },
        updateHouseStratumFromAI(society, house) {
          let previous = house.stratum || 'plebeian'
          let strength = house.strength || 0
          let next = previous
          if (strength >= 120 && previous !== 'senatorial') {
            next = 'senatorial'
          } else if (strength >= 72 && this.socialLevel(previous) < 4) {
            next = 'equestrian'
          } else if (strength >= 38 && this.socialLevel(previous) < 3) {
            next = 'civic'
          } else if (strength >= 18 && this.socialLevel(previous) < 2) {
            next = 'plebeian'
          } else if (strength < 8 && previous !== 'poor') {
            next = 'poor'
          } else if (strength < 15 && this.socialLevel(previous) > 1) {
            next = 'freedmen'
          }
          if (next !== previous) {
            house.stratum = next
            this.log(society, house.name + ' moves from ' + this.stratumTitle(previous) + ' to ' + this.stratumTitle(next) + '.', strength >= 18 ? 'support' : 'scandal', house.id)
          }
        },
        initHouseAI(house) {
          if (!house.agenda) {
            house.agenda = this.pick(['office', 'wealth', 'honor', 'marriage', 'security', 'revenge'])
          }
          if (house.wealth === undefined || house.wealth === null) {
            house.wealth = Math.max(20, Math.round((house.strength || 10) * 18))
          }
          if (house.power === undefined || house.power === null) {
            house.power = Math.max(5, Math.round((house.strength || 10) / 2))
          }
          if (house.stability === undefined || house.stability === null) {
            house.stability = this.randomInt(35, 75)
          }
          if (!house.ai) {
            house.ai = {
              cash: Math.max(50, Math.round((house.wealth || 100) * 0.8)),
              influence: Math.max(10, Math.round((house.power || 10) * 18)),
              prestige: Math.max(0, Math.round(house.prestige || 0)),
              property: {
                land: Math.max(0, Math.round((house.strength || 10) / 18)),
                animals: Math.max(0, Math.round((house.strength || 10) / 22)),
                trade: house.stratum === 'equestrian' || house.agenda === 'wealth' ? 1 : 0
              },
              focus: house.agenda,
              controlledBy: 'cor_society_ai'
            }
          }
          house.ai.property = house.ai.property || {
            land: Math.max(0, Math.round((house.strength || 10) / 18)),
            animals: Math.max(0, Math.round((house.strength || 10) / 22)),
            trade: house.stratum === 'equestrian' || house.agenda === 'wealth' ? 1 : 0
          }
          house.ai.focus = house.ai.focus || house.agenda
          house.ai.controlledBy = 'cor_society_ai'
        },
        simulateHouseFamilyLife(society, state, house, houses) {
          if (!house || !house.memberIds || !house.memberIds.length) {
            return
          }
          let marriageChance = house.agenda === 'marriage' ? 0.08 : 0.025
          if (Math.random() < marriageChance) {
            let candidates = (houses || []).filter((other) => {
              if (!other || other.id === house.id || !other.memberIds || !other.memberIds.length) {
                return false
              }
              let relation = this.getHouseRelation(society, house.id, other.id)
              return relation > -35 && Math.abs(this.socialLevel(house.stratum) - this.socialLevel(other.stratum)) <= 2
            })
            let other = candidates.length ? this.pick(candidates) : false
            if (other && this.tryInterHouseMarriage(society, state, house, other)) {
              return
            }
          }
          let pregnancyChance = house.agenda === 'marriage' ? 0.09 : 0.035
          if (Math.random() < pregnancyChance) {
            this.tryHousePregnancy(society, state, house)
          }
        },
        tryInterHouseMarriage(society, state, firstHouse, secondHouse) {
          let firstCandidates = this.eligibleHouseMarriageAdults(firstHouse, state)
          let secondCandidates = this.eligibleHouseMarriageAdults(secondHouse, state)
          if (!firstCandidates.length || !secondCandidates.length) {
            return false
          }
          let pairs = []
          firstCandidates.forEach((first) => {
            secondCandidates.forEach((second) => {
              if (this.isMarriageCompatible(first, second)) {
                pairs.push({ first, second })
              }
            })
          })
          if (!pairs.length) {
            return false
          }
          let pair = this.pick(pairs)
          let first = pair.first
          let second = pair.second
          let mother = this.characterIsMale(first) ? second : first
          let father = this.characterIsMale(first) ? first : second
          let motherHouse = mother.dynastyId === firstHouse.id ? firstHouse : secondHouse
          let fatherHouse = father.dynastyId === firstHouse.id ? firstHouse : secondHouse
          let isMatrilineal = this.socialLevel(motherHouse.stratum) >= this.socialLevel(fatherHouse.stratum)
          try {
            daapi.performMarriage({
              characterId: first.id,
              spouseId: second.id,
              isMatrilineal
            })
            daapi.forceUpdateCharacterDisplay({ characterId: first.id })
            daapi.forceUpdateCharacterDisplay({ characterId: second.id })
          } catch (err) {
            console.warn(err)
            return false
          }
          firstHouse.stability = this.clamp((firstHouse.stability || 50) + 3, 0, 100)
          secondHouse.stability = this.clamp((secondHouse.stability || 50) + 3, 0, 100)
          this.changeHouseRelation(society, firstHouse.id, secondHouse.id, this.randomInt(8, 18))
          firstHouse.lastFamilyEvent = 'Marriage alliance with ' + secondHouse.name + '.'
          secondHouse.lastFamilyEvent = 'Marriage alliance with ' + firstHouse.name + '.'
          let newState = daapi.getState()
          this.refreshHouseMemberLists(society, newState, firstHouse)
          this.refreshHouseMemberLists(society, newState, secondHouse)
          this.log(
            society,
            firstHouse.name + ' and ' + secondHouse.name + ' join houses through the marriage of ' + this.characterName(first, state) + ' and ' + this.characterName(second, state) + '.',
            'marriage',
            firstHouse.id
          )
          return true
        },
        eligibleHouseMarriageAdults(house, state) {
          return this.visibleHousePeople(house, state)
            .map((characterId) => {
              let character = state.characters[characterId]
              if (character) {
                character.id = character.id || characterId
              }
              return character
            })
            .filter((character) => {
              if (!this.isMarriageEligible(character, state)) {
                return false
              }
              let age = this.age(character, state)
              return age >= 16 && age <= 48
            })
            .sort((a, b) => this.characterScore(b, state) - this.characterScore(a, state))
        },
        tryHousePregnancy(society, state, house) {
          let couples = []
          this.visibleHousePeople(house, state).forEach((characterId) => {
            let character = state.characters[characterId]
            if (!character || character.isDead || !character.spouseId || character.startedPregnancyTime) {
              return
            }
            character.id = character.id || characterId
            let spouse = state.characters[character.spouseId]
            if (!spouse || spouse.isDead || spouse.startedPregnancyTime) {
              return
            }
            spouse.id = spouse.id || character.spouseId
            let mother = this.characterIsMale(character) ? spouse : character
            let father = this.characterIsMale(character) ? character : spouse
            if (!mother || !father || mother.startedPregnancyTime) {
              return
            }
            let age = this.age(mother, state)
            if (age < 16 || age > 42 || mother.flagCannotGetPregnant || father.flagCannotImpregnate === false) {
              return
            }
            let children = this.childrenCountForCouple(state, mother.id, father.id)
            if (children >= 6) {
              return
            }
            couples.push({ mother, father, children })
          })
          if (!couples.length) {
            return false
          }
          let couple = this.pick(couples)
          let chance = 1 / Math.max(1, couple.children + 1)
          if (Math.random() > chance) {
            return false
          }
          try {
            daapi.impregnate({
              characterId: couple.mother.id,
              fatherId: couple.father.id
            })
            daapi.forceUpdateCharacterDisplay({ characterId: couple.mother.id })
          } catch (err) {
            console.warn(err)
            return false
          }
          house.lastFamilyEvent = this.characterName(couple.mother, state) + ' is expecting a child.'
          this.log(
            society,
            this.characterName(couple.mother, state) + ' of ' + house.name + ' is expecting a child with ' + this.characterName(couple.father, state) + '.',
            'birth',
            house.id
          )
          return true
        },
        childrenCountForCouple(state, firstId, secondId) {
          let count = 0
          for (let characterId in state.characters) {
            if (!state.characters.hasOwnProperty(characterId)) {
              continue
            }
            let child = state.characters[characterId]
            if (!child || child.isDead) {
              continue
            }
            let parents = [child.fatherId, child.motherId]
            if (parents.indexOf(firstId) >= 0 && parents.indexOf(secondId) >= 0) {
              count += 1
            }
          }
          return count
        },
        runHouseEconomy(house) {
          let profile = this.strata[house.stratum] || this.strata.plebeian
          let property = house.ai.property || { land: 0, animals: 0, trade: 0 }
          let members = (house.memberIds || []).length || 1
          let income = property.land * 5 + property.animals * 2 + property.trade * 12 + Math.round((profile.revenue || 20) / 4)
          let expenses = members * (house.stratum === 'senatorial' ? 10 : house.stratum === 'equestrian' ? 7 : 4)
          house.ai.cash += income - expenses
          if (house.ai.cash < 0) {
            house.ai.influence = Math.max(0, house.ai.influence - 8)
            house.stability -= 3
          }
          if (house.ai.cash > (profile.cost || 200) * 3 && Math.random() < 0.08) {
            house.agenda = this.pick(['office', 'wealth', 'marriage', 'security'])
            house.ai.focus = house.agenda
          }
        },
        aiBuyProperty(house) {
          let profile = this.strata[house.stratum] || this.strata.plebeian
          let cost = Math.max(100, Math.round((profile.cost || 200) * 0.7))
          if (house.ai.cash < cost) {
            return false
          }
          house.ai.cash -= cost
          let roll = Math.random()
          if (roll < 0.45) {
            house.ai.property.land += 1
          } else if (roll < 0.75) {
            house.ai.property.animals += 2
          } else {
            house.ai.property.trade += 1
          }
          house.stability = this.clamp((house.stability || 50) + 1, 0, 100)
          return true
        },
        generateHouseMember(society, state, house) {
          let headId = (house.notableIds || house.memberIds || [])[0]
          let head = state.characters[headId]
          if (!head) {
            return false
          }
          head.id = head.id || headId
          this.generateRelative(society, state, house, house.stratum || 'plebeian', head)
          house.lastFamilyEvent = house.name + ' expands its household through marriage and dependants.'
          return true
        },
        ensureVisibleHouseMembers(society, state) {
          for (let houseId in society.houses) {
            if (!society.houses.hasOwnProperty(houseId)) {
              continue
            }
            let house = society.houses[houseId]
            this.refreshHouseMemberLists(society, state, house)
            let visible = this.visibleHousePeople(house, state)
            if (!visible.length) {
              this.generateHouseSeedMember(society, state, house)
              state = daapi.getState()
              this.refreshHouseMemberLists(society, state, house)
              visible = this.visibleHousePeople(house, state)
            }
            while (visible.length < this.minimumVisibleMembers(house) && (society.generatedCharacterIds || []).length < 260) {
              let head = state.characters[visible[0]]
              if (!head) {
                break
              }
              head.id = head.id || visible[0]
              if (!head.spouseId && this.age(head, state) >= 20 && Math.random() < 0.35) {
                this.generateHouseSpouse(society, state, house, house.stratum || 'plebeian', head)
              } else {
                this.generateRelative(society, state, house, house.stratum || 'plebeian', head)
              }
              state = daapi.getState()
              this.refreshHouseMemberLists(society, state, house)
              visible = this.visibleHousePeople(house, state)
            }
          }
        },
        minimumVisibleMembers(house) {
          let stratum = (house && house.stratum) || 'plebeian'
          if (stratum === 'senatorial' || stratum === 'equestrian') return 5
          if (stratum === 'civic' || stratum === 'plebeian') return 4
          return 3
        },
        refreshHouseMemberLists(society, state, house) {
          if (!house || !house.id || !state || !state.characters) {
            return
          }
          let seen = {}
          let ids = []
          let add = (characterId) => {
            if (!characterId || seen[characterId]) {
              return
            }
            let character = state.characters[characterId]
            if (!character || character.isDead || character.dynastyId !== house.id) {
              return
            }
            character.id = character.id || characterId
            seen[characterId] = true
            ids.push(characterId)
          }
          ;(house.memberIds || []).forEach(add)
          ;(house.notableIds || []).forEach(add)
          for (let characterId in state.characters) {
            if (state.characters.hasOwnProperty(characterId)) {
              add(characterId)
            }
          }
          house.memberIds = ids
          house.notableIds = ids
            .slice()
            .sort((a, b) => this.characterScore(state.characters[b], state) - this.characterScore(state.characters[a], state))
            .slice(0, 8)
        },
        generateHouseSeedMember(society, state, house) {
          let stratum = house.stratum || 'plebeian'
          let profile = this.strata[stratum] || this.strata.plebeian
          let isMale = Math.random() > 0.45
          let job = this.pick(profile.jobs)
          let traits = this.generatedTraitsForStratum(stratum, job)
          let age = this.randomInt(19, 30)
          let characterId = daapi.generateCharacter({
            characterFeatures: {
              gender: isMale ? 'male' : 'female',
              isMale,
              praenomen: isMale ? this.pick(this.maleNames) : this.pick(this.femaleNames),
              birthMonth: this.randomInt(0, 11),
              birthYear: state.year - age,
              look: this.generatedVanillaLook(isMale, stratum + '-' + house.id + '-seed-' + Date.now()),
              job,
              jobLevel: this.randomInt(0, stratum === 'senatorial' ? 10 : stratum === 'equestrian' ? 7 : 4),
              traits,
              skills: this.skillsForStratum(stratum),
              corSocietyGenerated: true,
              flagDoNotCull: true,
              flagCanHoldImperium: stratum === 'senatorial' || stratum === 'equestrian' || Math.random() > 0.7,
              childrenIds: []
            },
            dynastyFeatures: {}
          })
          daapi.updateCharacter({
            characterId,
            character: {
              dynastyId: house.id,
              spouseId: null,
              childrenIds: []
            }
          })
          house.memberIds = house.memberIds || []
          house.notableIds = house.notableIds || []
          if (house.memberIds.indexOf(characterId) < 0) {
            house.memberIds.push(characterId)
          }
          if (house.notableIds.indexOf(characterId) < 0) {
            house.notableIds.push(characterId)
          }
          society.generatedCharacterIds = society.generatedCharacterIds || []
          if (society.generatedCharacterIds.indexOf(characterId) < 0) {
            society.generatedCharacterIds.push(characterId)
          }
          this.applyGeneratedTraits(characterId, traits)
          house.lastFamilyEvent = house.name + ' restores a visible family representative.'
          this.log(society, house.name + ' restores a visible family representative.', 'log', house.id)
          return characterId
        },
        generateMarriageProspect(society, state, house, matchCharacter) {
          let profile = this.strata[house.stratum || 'plebeian'] || this.strata.plebeian
          let isMale = !this.characterIsMale(matchCharacter)
          let age = this.randomInt(18, 34)
          let job = this.pick(profile.jobs)
          let traits = this.generatedTraitsForStratum(house.stratum || 'plebeian', job)
          let prospectId = daapi.generateCharacter({
            characterFeatures: {
              gender: isMale ? 'male' : 'female',
              isMale,
              praenomen: isMale ? this.pick(this.maleNames) : this.pick(this.femaleNames),
              birthMonth: this.randomInt(0, 11),
              birthYear: state.year - age,
              look: this.generatedVanillaLook(isMale, (house.stratum || 'plebeian') + '-' + house.id + '-marriage-' + matchCharacter.id),
              job,
              jobLevel: this.randomInt(0, house.stratum === 'senatorial' ? 8 : house.stratum === 'equestrian' ? 6 : 4),
              traits,
              skills: this.skillsForStratum(house.stratum || 'plebeian'),
              corSocietyGenerated: true,
              flagDoNotCull: true,
              flagCanHoldImperium: house.stratum === 'senatorial' || house.stratum === 'equestrian' || Math.random() > 0.65
            },
            dynastyFeatures: {}
          })
          daapi.updateCharacter({
            characterId: prospectId,
            character: {
              dynastyId: house.id,
              spouseId: null,
              corSocietyGenerated: true
            }
          })
          house.memberIds = house.memberIds || []
          house.notableIds = house.notableIds || []
          if (house.memberIds.indexOf(prospectId) < 0) {
            house.memberIds.push(prospectId)
          }
          if (house.notableIds.indexOf(prospectId) < 0) {
            house.notableIds.unshift(prospectId)
          }
          society.generatedCharacterIds = society.generatedCharacterIds || []
          society.generatedCharacterIds.push(prospectId)
          this.applyGeneratedTraits(prospectId, traits)
          house.lastFamilyEvent = house.name + ' introduces a marriage prospect.'
          this.log(society, house.name + ' introduces a marriage prospect for your household.')
          return prospectId
        },
        recordFamilyEvent(society, house, event) {
          let labels = {
            officeCampaign: 'This house begins maneuvering for public office.',
            tradeVenture: 'This house expands a commercial venture.',
            marriageAlliance: 'This house negotiates a marriage alliance.',
            inheritanceDispute: 'This house is pulled into an inheritance dispute.',
            feud: 'This house sharpens an old feud.',
            scandal: 'A scandal weakens this house.'
          }
          house.lastFamilyEvent = labels[event] || event
          if (!house.pendingPlayerEvent && Math.random() < this.playerEventChance(house, event)) {
            house.pendingPlayerEvent = event
          }
          this.log(society, 'House: ' + house.name + '. ' + house.lastFamilyEvent, event, house.id)
        },
        playerEventChance(house, event) {
          let relation = house.relation || 0
          if (event === 'feud' || event === 'scandal') {
            return house.rivalry || relation < -35 ? 0.45 : 0.15
          }
          if (relation > 40 || (house.favor || 0) > 0) {
            return 0.42
          }
          if (relation > 5) {
            return 0.24
          }
          return 0.08
        },
        simulateInterHouseAffairs(society, state) {
          if (Math.random() > 0.32) {
            return
          }
          let houses = this.sortedHouses(society).filter((house) => house.memberIds && house.memberIds.length)
          if (houses.length < 2) {
            return
          }
          let first = this.pick(houses)
          let second = this.pick(houses.filter((house) => house.id !== first.id))
          if (!first || !second) {
            return
          }
          let relation = this.getHouseRelation(society, first.id, second.id)
          let roll = Math.random()
          if (roll < 0.28) {
            relation = this.changeHouseRelation(society, first.id, second.id, this.randomInt(8, 18))
            first.stability += 2
            second.stability += 2
            this.log(society, first.name + ' and ' + second.name + ' arrange a useful family connection.')
          } else if (roll < 0.56) {
            relation = this.changeHouseRelation(society, first.id, second.id, this.randomInt(4, 12))
            first.wealth += 20
            second.wealth += 20
            this.log(society, first.name + ' and ' + second.name + ' share a profitable compact.')
          } else if (roll < 0.82 || relation < -20) {
            relation = this.changeHouseRelation(society, first.id, second.id, -this.randomInt(8, 20))
            first.stability -= 2
            second.stability -= 2
            this.log(society, first.name + ' clashes with ' + second.name + ' in public.')
          } else {
            first.agenda = 'revenge'
            second.agenda = 'security'
            this.changeHouseRelation(society, first.id, second.id, -25)
            this.log(society, 'A private insult starts a feud between ' + first.name + ' and ' + second.name + '.')
          }
        },
        relationKey(firstId, secondId) {
          return [String(firstId), String(secondId)].sort().join('::')
        },
        getHouseRelation(society, firstId, secondId) {
          let key = this.relationKey(firstId, secondId)
          if (society.houseRelations[key] === undefined) {
            society.houseRelations[key] = this.randomInt(-8, 8)
          }
          return society.houseRelations[key]
        },
        changeHouseRelation(society, firstId, secondId, delta) {
          let key = this.relationKey(firstId, secondId)
          let value = this.getHouseRelation(society, firstId, secondId)
          value = this.clamp(value + delta, -100, 100)
          society.houseRelations[key] = value
          return value
        },
        driftRelations(society) {
          for (let houseId in society.houses) {
            if (!society.houses.hasOwnProperty(houseId)) {
              continue
            }
            let house = society.houses[houseId]
            if (house.relation > 4) {
              house.relation -= 1
            } else if (house.relation < -4) {
              house.relation += 1
            }
            house.heat = Math.max(0, (house.heat || 0) - 1)
            if (house.favor > 0 && Math.random() < 0.06) {
              house.favor -= 1
            }
          }
        },
        applyNetworkModifiers(society) {
          let allyIncome = 0
          for (let houseId in society.houses) {
            if (!society.houses.hasOwnProperty(houseId)) {
              continue
            }
            let house = society.houses[houseId]
            let profile = this.strata[house.stratum] || this.strata.plebeian
            if ((house.relation || 0) >= 55 || (house.favor || 0) >= 2) {
              allyIncome += Math.max(1, Math.round((profile.revenue || 20) * ((house.relation || 50) / 100)))
            }
          }
          try {
            daapi.removeAdditiveModifier({ key: 'revenue', id: 'cor_society_network_income' })
            daapi.removeAdditiveModifier({ key: 'revenue', id: 'cor_society_rival_pressure' })
          } catch (err) {
            console.warn(err)
          }
          if (allyIncome > 0) {
            daapi.addAdditiveModifier({
              key: 'revenue',
              id: 'cor_society_network_income',
              durationInMonths: 2,
              amount: allyIncome
            })
          }
        },
        resolvePendingVentures(society, state) {
          society.pendingVentures = society.pendingVentures || []
          let due = society.pendingVentures.find((venture) => {
            return venture && !venture.notified && this.monthKeyReached(venture.due, state)
          })
          if (!due) {
            return
          }
          due.notified = true
          let house = society.houses[due.houseId] || {}
          let success = due.roll >= 0.28
          let payout = success ? Math.max(1, Math.round(due.expected * (0.75 + due.roll))) : 0
          due.payout = payout
          due.success = success
          this.save(society)
          this.pushModal({
            corTranslatorPretranslateNow: true,
            title: success ? 'Venture returns' : 'Venture fails',
            message: 'House: ' + (house.name || 'Unknown house') + '\nThe trade venture has reached its settlement month.\nResult: ' + (success ? 'your share is ready to collect.' : 'the opening failed and produced no profit.'),
            image: this.affairIcon('tradeVenture'),
            options: [
              {
                variant: success ? 'info' : 'warning',
                text: success ? 'Collect your share' : 'Accept the loss',
                statChanges: success ? { cash: payout } : {},
                action: {
                  event: this.event,
                  method: 'collectVentureResult',
                  context: { ventureId: due.id }
                }
              }
            ]
          })
        },
        queueMonthlyEvent(society, state) {
          let houses = this.sortedHouses(society).filter((house) => house.memberIds && house.memberIds.length)
          if (!houses.length) {
            return
          }
          let pending = houses.filter((house) => house.pendingPlayerEvent)
          if (pending.length) {
            this.eventFamilyAffair(society, this.pick(pending))
            return
          }
          let hostile = houses.filter((house) => house.rivalry || house.relation <= -45)
          let friendly = houses.filter((house) => house.relation >= 35)
          let lower = houses.filter((house) => ['plebeian', 'freedmen', 'poor'].indexOf(house.stratum) >= 0)
          let roll = Math.random()
          if (hostile.length && roll < 0.35) {
            this.eventRivalSlander(society, this.pick(hostile))
          } else if (friendly.length && roll < 0.68) {
            this.eventFriendlyOpening(society, this.pick(friendly))
          } else if (lower.length) {
            this.eventPetition(society, this.pick(lower))
          } else {
            this.eventFamilyInvitation(society, this.pick(houses))
          }
        },
        eventFamilyAffair(society, house) {
          let event = house.pendingPlayerEvent
          let state = daapi.getState()
          let image = this.affairIcon(event)
          this.save(society)
          if (event === 'officeCampaign') {
            this.pushModal({
              corTranslatorPretranslateNow: true,
              title: 'House seeks office',
              message: 'House: ' + house.name + '\nThis house is gathering support for a magistracy. They ask whether your household will be seen beside them.',
              image: image,
              options: [
                {
                  variant: 'info',
                  text: 'Endorse them',
                  statChanges: { influence: -45, prestige: 10 },
                  action: {
                    event: this.event,
                    method: 'endorseOffice',
                    context: { houseId: house.id }
                  }
                },
                {
                  text: 'Stay out of it',
                  action: {
                    event: this.event,
                    method: 'declineFamilyAffair',
                    context: { houseId: house.id }
                  }
                }
              ]
            })
          } else if (event === 'marriageAlliance') {
            let weddingCost = this.actionCost(house, 'wedding')
            this.pushModal({
              corTranslatorPretranslateNow: true,
              title: 'Wedding politics',
              message: 'House: ' + house.name + '\nThis house invites your household to honor a marriage alliance. A gift would be noticed; absence would be noticed too.',
              image: image,
              options: [
                {
                  text: 'Send a wedding gift',
                  statChanges: { cash: -weddingCost, prestige: 5 },
                  action: {
                    event: this.event,
                    method: 'honorWedding',
                    context: { houseId: house.id }
                  }
                },
                {
                  text: 'Offer only words',
                  action: {
                    event: this.event,
                    method: 'declineFamilyAffair',
                    context: { houseId: house.id }
                  }
                }
              ]
            })
          } else if (event === 'inheritanceDispute') {
            this.pushModal({
              corTranslatorPretranslateNow: true,
              title: 'Inheritance dispute',
              message: 'House: ' + house.name + '\nA dispute inside this house has become public. They ask you to lend judgment and pressure.',
              image: image,
              options: [
                {
                  variant: 'warning',
                  text: 'Intervene',
                  statChanges: { influence: -30 },
                  action: {
                    event: this.event,
                    method: 'judgeInheritance',
                    context: { houseId: house.id }
                  }
                },
                {
                  text: 'Let them quarrel',
                  action: {
                    event: this.event,
                    method: 'declineFamilyAffair',
                    context: { houseId: house.id }
                  }
                }
              ]
            })
          } else if (event === 'tradeVenture') {
            let offer = this.ventureOffer(house)
            this.pushModal({
              corTranslatorPretranslateNow: true,
              title: 'Trade venture',
              message: 'House: ' + house.name + '\nThis house has found a profitable opening and offers you a place in the venture.\nCost: ' + offer.cost + ' cash.\nExpected result: about ' + offer.expected + ' cash in ' + offer.months + ' months if the venture succeeds.',
              image: image,
              options: [
                {
                  variant: 'info',
                  text: 'Invest with them',
                  statChanges: { cash: -offer.cost },
                  action: {
                    event: this.event,
                    method: 'investVenture',
                    context: { houseId: house.id, cost: offer.cost, expected: offer.expected, months: offer.months }
                  }
                },
                {
                  text: 'Decline',
                  action: {
                    event: this.event,
                    method: 'declineFamilyAffair',
                    context: { houseId: house.id, kind: 'tradeVenture' }
                  }
                }
              ]
            })
          } else if (event === 'scandal') {
            this.pushModal({
              corTranslatorPretranslateNow: true,
              title: 'House scandal',
              message: 'House: ' + house.name + '\nThis house has been embarrassed by a scandal. You can shield them, exploit it, or let the city talk.',
              image: image,
              options: [
                {
                  text: 'Shield them',
                  statChanges: { influence: -35, prestige: -4 },
                  action: {
                    event: this.event,
                    method: 'shieldScandal',
                    context: { houseId: house.id }
                  }
                },
                {
                  variant: 'danger',
                  text: 'Exploit it',
                  statChanges: { influence: 50, prestige: 6 },
                  action: {
                    event: this.event,
                    method: 'exploitScandal',
                    context: { houseId: house.id }
                  }
                },
                {
                  text: 'Do nothing',
                  action: {
                    event: this.event,
                    method: 'declineFamilyAffair',
                    context: { houseId: house.id }
                  }
                }
              ]
            })
          } else {
            this.eventRivalSlander(society, house)
          }
        },
        eventRivalSlander(society, house) {
          let state = daapi.getState()
          this.save(society)
          this.pushModal({
            corTranslatorPretranslateNow: true,
            title: 'Rival rumor',
            message: 'House: ' + house.name + '\nYour rivals are whispering that your household has overreached its station. The rumor is small now, but it has teeth.',
            image: this.affairIcon('slander'),
            options: [
              {
                variant: 'warning',
                text: 'Answer publicly',
                tooltip: 'Spend influence to blunt the attack and make the rivalry hotter.',
                statChanges: { influence: -35, prestige: 4 },
                action: {
                  event: this.event,
                  method: 'answerSlander',
                  context: { houseId: house.id }
                }
              },
              {
                text: 'Ignore it',
                tooltip: 'Lose some prestige, but avoid making the quarrel worse.',
                statChanges: { prestige: -10 },
                action: {
                  event: this.event,
                  method: 'ignoreSlander',
                  context: { houseId: house.id }
                }
              }
            ]
          })
        },
        eventFriendlyOpening(society, house) {
          let state = daapi.getState()
          this.save(society)
          this.pushModal({
            corTranslatorPretranslateNow: true,
            title: 'Political opening',
            message: 'House: ' + house.name + '\nA friendly contact suggests a public exchange of support. It would strengthen your network, though it may bind you to their interests.',
            image: this.affairIcon('support'),
            options: [
              {
                variant: 'info',
                text: 'Accept their support',
                statChanges: { influence: 60 },
                action: {
                  event: this.event,
                  method: 'acceptOpening',
                  context: { houseId: house.id }
                }
              },
              {
                text: 'Stay independent',
                statChanges: { prestige: 3 },
                action: {
                  event: this.event,
                  method: 'declineOpening',
                  context: { houseId: house.id }
                }
              }
            ]
          })
        },
        eventPetition(society, house) {
          let state = daapi.getState()
          this.save(society)
          let petitionCost = this.petitionCost(house)
          this.pushModal({
            corTranslatorPretranslateNow: true,
            title: 'Local petition',
            message: 'House: ' + house.name + '\nA lesser family connected to this house asks for your help in a local dispute. It is not glamorous politics, but gratitude from the lower orders can travel far.',
            image: this.affairIcon('petition'),
            options: [
              {
                variant: 'info',
                text: 'Hear their petition',
                statChanges: { cash: -petitionCost, prestige: 7 },
                action: {
                  event: this.event,
                  method: 'supportPetition',
                  context: { houseId: house.id }
                }
              },
              {
                text: 'Send them away',
                action: {
                  event: this.event,
                  method: 'refusePetition',
                  context: { houseId: house.id }
                }
              }
            ]
          })
        },
        eventFamilyInvitation(society, house) {
          let state = daapi.getState()
          this.save(society)
          let invitationCost = this.invitationCost(house)
          this.pushModal({
            corTranslatorPretranslateNow: true,
            title: 'Family invitation',
            message: 'House: ' + house.name + '\nThis house invites your household to a public family occasion. Attending would cost time and gifts, but the city notices who stands beside whom.',
            image: this.affairIcon('invitation'),
            options: [
              {
                variant: 'info',
                text: 'Attend',
                tooltip: 'Spend a little cash for prestige and better relations.',
                statChanges: { cash: -invitationCost, prestige: 10 },
                action: {
                  event: this.event,
                  method: 'attendFamilyInvitation',
                  context: { houseId: house.id }
                }
              },
              {
                text: 'Decline',
                tooltip: 'Avoid the cost, but the house may feel slighted.',
                action: {
                  event: this.event,
                  method: 'declineFamilyInvitation',
                  context: { houseId: house.id }
                }
              }
            ]
          })
        },
        openHub() {
          let state = daapi.getState()
          let society = this.ensure()
          let counts = this.countByStratum(society)
          let rivals = this.rivalHouses(society).length
          let allies = this.alliedHouses(society).length
          let playerStatus = this.playerSocietyStatus(state)
          let message = [
            'Date: Year ' + state.year + ', month ' + ((state.month || 0) + 1),
            'Your standing: ' + playerStatus.title + (playerStatus.className ? ' (' + playerStatus.className + ')' : '') + '.',
            'Society: ' + Object.keys(society.houses).length + ' known houses across ' + this.stratumOrder.length + ' social orders.',
            'Relations: ' + allies + ' allies/patrons, ' + rivals + ' open rivalries.',
            'House turns: families pursue wealth, office, marriage, security, honor, or revenge each month.',
            'Effects: gifts, alliances, rivalries, ventures, scandals, and petitions can change cash, prestige, influence, relations, favors, and revenue.'
          ].join('\n')
          this.pushModal({
            title: 'Roman Society',
            message,
            image: daapi.requireImage('/cor_society/icon.svg'),
            options: [
              ...this.stratumOrder.map((stratum) => {
                return {
                  text: this.strata[stratum].title + ' (' + (counts[stratum] || 0) + ')',
                  icons: [this.stratumIcon(stratum)],
                  action: {
                    event: this.event,
                    method: 'openEstate',
                    context: { stratum, page: 0 }
                  }
                }
              }),
              {
                text: 'Allies and patrons (' + allies + ')',
                icons: [this.affairIcon('support')],
                action: {
                  event: this.event,
                  method: 'openAllies'
                }
              },
              {
                text: 'Rivals (' + rivals + ')',
                icons: [this.affairIcon('rivalry')],
                action: {
                  event: this.event,
                  method: 'openRivals'
                }
              },
              {
                text: 'Past affairs',
                icons: [this.affairIcon('log')],
                action: {
                  event: this.event,
                  method: 'openLog'
                }
              },
              {
                text: 'Close'
              }
            ]
          })
        },
        openEstate({ stratum, page }) {
          let society = this.ensure()
          let state = daapi.getState()
          page = parseInt(page || 0, 10)
          let houses = this.sortedHouses(society).filter((house) => house.stratum === stratum)
          let pageSize = 8
          let start = page * pageSize
          let shown = houses.slice(start, start + pageSize)
          let options = shown.map((house) => {
            return {
              text: this.houseOptionText(house),
              tooltip: this.houseTooltip(house),
              icons: [this.houseCrestIcon(society, house), this.housePortrait(house, state)],
              action: {
                event: this.event,
                method: 'openHouse',
                context: { houseId: house.id }
              }
            }
          })
          if (start + pageSize < houses.length) {
            options.push({
              text: 'Next page',
              action: {
                event: this.event,
                method: 'openEstate',
                context: { stratum, page: page + 1 }
              }
            })
          }
          if (page > 0) {
            options.push({
              text: 'Previous page',
              action: {
                event: this.event,
                method: 'openEstate',
                context: { stratum, page: page - 1 }
              }
            })
          }
          options.push({
            text: 'Back',
            action: {
              event: this.event,
              method: 'openHub'
            }
          })
          this.pushModal({
            title: this.strata[stratum].title,
            message: shown.length ? 'Choose a house to inspect.' : 'No houses are known in this order yet.',
            image: this.stratumIcon(stratum),
            options
          })
        },
        openRelations() {
          this.openAllies()
        },
        openAllies({ page } = {}) {
          let society = this.ensure()
          let state = daapi.getState()
          let houses = this.alliedHouses(society)
          page = parseInt(page || 0, 10)
          let pageSize = 10
          let start = page * pageSize
          let shown = houses.slice(start, start + pageSize)
          let options = shown.map((house) => {
            return {
              text: this.houseOptionText(house),
              tooltip: this.houseTooltip(house),
              icons: [this.houseCrestIcon(society, house), this.housePortrait(house, state)],
              action: {
                event: this.event,
                method: 'openHouse',
                context: { houseId: house.id, returnTo: 'allies', returnPage: page }
              }
            }
          })
          if (start + pageSize < houses.length) {
            options.push({
              text: 'Next page',
              action: {
                event: this.event,
                method: 'openAllies',
                context: { page: page + 1 }
              }
            })
          }
          if (page > 0) {
            options.push({
              text: 'Previous page',
              action: {
                event: this.event,
                method: 'openAllies',
                context: { page: page - 1 }
              }
            })
          }
          options.push({
            text: 'Back',
            action: {
              event: this.event,
              method: 'openHub'
            }
          })
          this.pushModal({
            title: 'Allies and Patrons',
            message: houses.length ? 'These houses currently support, favor, or owe your household.\nPage ' + (page + 1) + ' of ' + Math.max(1, Math.ceil(houses.length / pageSize)) + '.' : 'No allies, patrons, or favors yet.',
            image: this.affairIcon('support'),
            options
          })
        },
        openRivals({ page } = {}) {
          let society = this.ensure()
          let state = daapi.getState()
          let houses = this.rivalHouses(society)
          page = parseInt(page || 0, 10)
          let pageSize = 10
          let start = page * pageSize
          let shown = houses.slice(start, start + pageSize)
          let options = shown.map((house) => {
            return {
              text: this.houseOptionText(house),
              tooltip: this.houseTooltip(house),
              icons: [this.houseCrestIcon(society, house), this.housePortrait(house, state)],
              action: {
                event: this.event,
                method: 'openHouse',
                context: { houseId: house.id, returnTo: 'rivals', returnPage: page }
              }
            }
          })
          if (start + pageSize < houses.length) {
            options.push({
              text: 'Next page',
              action: {
                event: this.event,
                method: 'openRivals',
                context: { page: page + 1 }
              }
            })
          }
          if (page > 0) {
            options.push({
              text: 'Previous page',
              action: {
                event: this.event,
                method: 'openRivals',
                context: { page: page - 1 }
              }
            })
          }
          options.push({
            text: 'Back',
            action: {
              event: this.event,
              method: 'openHub'
            }
          })
          this.pushModal({
            title: 'Rival Houses',
            message: houses.length ? 'These houses oppose, resent, or openly rival your household.\nPage ' + (page + 1) + ' of ' + Math.max(1, Math.ceil(houses.length / pageSize)) + '.' : 'No serious rivalries yet.',
            image: this.affairIcon('rivalry'),
            options
          })
        },
        openLog({ page } = {}) {
          let society = this.ensure()
          page = parseInt(page || 0, 10)
          let entries = (society.log || []).map((entry, index) => this.normalizeLogEntry(entry, index))
          let pageSize = this.historyPageSize || 8
          let start = page * pageSize
          let shown = entries.slice(start, start + pageSize)
          let options = shown.map((entry) => {
            return {
              text: this.shortText(entry.text, 68),
              tooltip: entry.text,
              icons: [this.affairIcon(entry.kind)],
              action: {
                event: this.event,
                method: 'openLogEntry',
                context: { index: entry.index, page }
              }
            }
          })
          if (start + pageSize < entries.length) {
            options.push({
              text: 'Next page',
              action: {
                event: this.event,
                method: 'openLog',
                context: { page: page + 1 }
              }
            })
          }
          if (page > 0) {
            options.push({
              text: 'Previous page',
              action: {
                event: this.event,
                method: 'openLog',
                context: { page: page - 1 }
              }
            })
          }
          options.push({
            text: 'Back',
            action: {
              event: this.event,
              method: 'openHub'
            }
          })
          this.pushModal({
            title: 'Past Affairs',
            message: entries.length ? 'Choose an affair to inspect. Page ' + (page + 1) + ' of ' + Math.max(1, Math.ceil(entries.length / pageSize)) + '.' : 'No public affairs recorded yet.',
            image: this.affairIcon('log'),
            options
          })
        },
        openLogEntry({ index, page }) {
          let society = this.ensure()
          let entry = this.normalizeLogEntry((society.log || [])[index], index)
          this.pushModal({
            title: 'Past Affair',
            message: entry.text || 'No details.',
            image: this.affairIcon(entry.kind),
            options: [
              {
                text: 'Back',
                action: {
                  event: this.event,
                  method: 'openLog',
                  context: { page: page || 0 }
                }
              }
            ]
          })
        },
        openPlayerCrest() {
          let society = this.ensure()
          let state = daapi.getState()
          let character = state.characters[this.currentCharacterId(state)] || {}
          let dynasty = state.dynasties[character.dynastyId] || {}
          let crest = this.ensurePlayerCrest(society, state)
          this.save(society)
          this.applyPlayerCrestOverlay()
          let houseName = this.houseName(dynasty, character.dynastyId || 'player')
          let overlayText = society.crestSettings.playerOverlay ? 'On' : 'Off'
          let message = [
            'Player house: ' + houseName,
            'Current character: ' + (character.praenomen || 'Unknown'),
            'Portrait badge: ' + overlayText,
            'This menu only edits the player house shield.'
          ].join('\n')
          let image = this.crestIcon(crest, 132)
          this.pushModal({
            title: 'House Shield',
            message,
            image,
            options: [
              {
                variant: 'info',
                text: 'Randomize',
                tooltip: 'Generate a fresh Roman-style shield for the player house.',
                icons: [image],
                action: {
                  event: this.event,
                  method: 'randomizePlayerCrest'
                }
              },
              this.crestCycleOption('Field', 'field', crest),
              this.crestCycleOption('Metal', 'metal', crest),
              this.crestCycleOption('Accent', 'accent', crest),
              this.crestCycleOption('Shape', 'shape', crest),
              this.crestCycleOption('Division', 'division', crest),
              this.crestCycleOption('Pattern', 'pattern', crest),
              this.crestCycleOption('Charge', 'charge', crest),
              this.crestCycleOption('Border', 'border', crest),
              {
                text: 'Portrait badge: ' + overlayText,
                tooltip: 'Show the player house shield above the current player portrait when the mod can find it in the UI.',
                action: {
                  event: this.event,
                  method: 'togglePlayerCrestOverlay'
                }
              },
              {
                text: 'Close'
              }
            ].filter(Boolean)
          })
        },
        randomizePlayerCrest() {
          let society = this.ensure()
          let state = daapi.getState()
          let crestId = this.playerCrestId(state)
          society.crests[crestId] = this.generateCrest(crestId + '-player-' + Date.now() + '-' + Math.random())
          society.crests[crestId].custom = true
          this.save(society)
          this.applyPlayerCrestOverlay()
          this.openPlayerCrest()
        },
        cyclePlayerCrest({ part }) {
          let society = this.ensure()
          let state = daapi.getState()
          let crest = this.ensurePlayerCrest(society, state)
          let list = this.crestList(part)
          if (list.length) {
            let index = list.indexOf(crest[part])
            crest[part] = list[(index + 1 + list.length) % list.length]
            crest.custom = true
            crest.seed = String(crest.seed || '') + '-' + part + '-' + crest[part]
          }
          this.save(society)
          this.applyPlayerCrestOverlay()
          this.openPlayerCrest()
        },
        togglePlayerCrestOverlay() {
          let society = this.ensure()
          society.crestSettings.playerOverlay = !society.crestSettings.playerOverlay
          this.save(society)
          if (society.crestSettings.playerOverlay) {
            this.applyPlayerCrestOverlay()
          } else {
            this.clearPlayerCrestOverlay()
          }
          this.openPlayerCrest()
        },
        openWardrobe() {
          let state = daapi.getState()
          let members = this.playerFamilyMembers(state).filter((character) => !character.isDead)
          let options = members.slice(0, 14).map((character) => {
            return {
              text: this.characterName(character, state),
              tooltip: this.characterTooltip(character, state) + '\nCurrent outfit: ' + this.outfitLabel(character.corSocietyOutfit || 'auto'),
              icons: [this.characterPortrait(character, state)],
              action: {
                event: this.event,
                method: 'openWardrobeCharacter',
                context: { characterId: character.id }
              }
            }
          })
          options.push({ text: 'Close' })
          this.pushModal({
            title: 'Family Wardrobe',
            message: 'Choose a household member. Available clothing follows your current Society order and the character age.',
            image: daapi.requireImage('/cor_society/assets/wardrobe.svg'),
            options
          })
        },
        openWardrobeCharacter({ characterId } = {}) {
          let state = daapi.getState()
          let character = (state.characters || {})[characterId]
          if (!character || this.playerFamilyMemberIds(state).indexOf(characterId) < 0) {
            this.openWardrobe()
            return
          }
          character.id = character.id || characterId
          let outfits = this.wardrobeOptionsForCharacter(character, state)
          let options = outfits.map((outfit) => {
            return {
              text: this.outfitLabel(outfit) + (character.corSocietyOutfit === outfit || (!character.corSocietyOutfit && outfit === 'auto') ? ' (current)' : ''),
              tooltip: 'Visual clothing only. Does not change stats, class, genetics, or vanilla look data.',
              icons: [this.characterPortraitWithOutfit(character, state, outfit)],
              action: {
                event: this.event,
                method: 'applyWardrobeOutfit',
                context: { characterId, outfit }
              }
            }
          })
          options.push({
            text: 'Back',
            action: {
              event: this.event,
              method: 'openWardrobe'
            }
          })
          this.pushModal({
            title: 'Wardrobe: ' + this.characterName(character, state),
            message: 'Society order: ' + this.stratumTitle(this.playerStratum(state)) + '\nCurrent outfit: ' + this.outfitLabel(character.corSocietyOutfit || 'auto'),
            image: this.characterPortrait(character, state),
            options
          })
        },
        applyWardrobeOutfit({ characterId, outfit } = {}) {
          let state = daapi.getState()
          let character = (state.characters || {})[characterId]
          if (!character || this.playerFamilyMemberIds(state).indexOf(characterId) < 0) {
            this.openWardrobe()
            return
          }
          character.id = character.id || characterId
          if (outfit && outfit !== 'auto') {
            this.applyWardrobeLookToCharacter(character, outfit, state)
          } else {
            delete character.corSocietyOutfit
            this.restoreOriginalLookIfNeeded(character, true)
            try {
              daapi.updateCharacter({ characterId, character: { corSocietyOutfit: '' } })
            } catch (err) {
              console.warn(err)
            }
          }
          try {
            this.applyPortraitOverlays()
          } catch (err) {
            console.warn(err)
          }
          this.openWardrobeCharacter({ characterId })
        },
        wardrobeOptionsForCharacter(character, state) {
          let ageStage = this.characterAgeStage(this.age(character, state))
          let gender = character.gender || ((character.look || {}).gender) || (character.isMale ? 'male' : 'female')
          let stratum = this.playerStratum(state)
          let role = this.characterPortraitRole(character, ageStage, stratum)
          let options = ['auto'].concat(this.clothingOptions(gender, ageStage, role, stratum))
          if (stratum === 'senatorial') {
            options = options.concat(gender === 'female' ? ['palla', 'purplePalla', 'whiteStola'] : ['senatorToga', 'togaPraetexta', 'togaCandida'])
          } else if (stratum === 'equestrian') {
            options = options.concat(['equestrianTunic', 'citizenToga', 'mantle'])
          } else if (stratum === 'poor' || stratum === 'freedmen') {
            options = options.concat(['simpleTunic', 'workerTunic', 'brownMantle'])
          } else {
            options = options.concat(gender === 'female' ? ['stola', 'palla', 'whiteStola'] : ['citizenToga', 'whiteToga', 'mantle', 'simpleTunic'])
          }
          return options.filter((item, index, list) => item && list.indexOf(item) === index)
        },
        outfitLabel(outfit) {
          let labels = {
            auto: 'Automatic',
            senatorToga: 'Senatorial toga',
            togaPraetexta: 'Toga praetexta',
            togaCandida: 'Toga candida',
            citizenToga: 'Citizen toga',
            whiteToga: 'Plain white toga',
            equestrianTunic: 'Equestrian tunic',
            mantle: 'Mantle',
            simpleTunic: 'Simple tunic',
            workerTunic: 'Worker tunic',
            brownMantle: 'Brown mantle',
            militaryCloak: 'Military cloak',
            armoredTunic: 'Armored tunic',
            redMantle: 'Red mantle',
            stola: 'Stola',
            whiteStola: 'White stola',
            palla: 'Palla',
            purplePalla: 'Purple palla',
            childStola: 'Child stola',
            childTunic: 'Child tunic'
          }
          return labels[outfit] || String(outfit || 'Automatic')
        },
        characterPortraitWithOutfit(character, state, outfit) {
          if (!outfit || outfit === 'auto') {
            let originalLook = this.originalLookForWardrobe(character)
            let clone = {
              ...character,
              corSocietyOutfit: '',
              look: originalLook && originalLook.group ? originalLook : (character.look || {})
            }
            return this.vanillaCharacterPortrait(clone, state) || this.genericVanillaCharacterPortrait(clone, state)
          }
          let clone = { ...character, corSocietyOutfit: outfit }
          return this.nativeCharacterPortraitWithOutfit(clone, state, false, outfit)
        },
        openHouse({ houseId, returnTo, returnPage } = {}) {
          let society = this.ensure()
          let state = daapi.getState()
          let house = society.houses[houseId]
          if (!house) {
            this.openHub()
            return
          }
          let profile = this.strata[house.stratum] || this.strata.plebeian
          let cash = parseFloat((state.current || {}).cash || 0)
          let giftCost = this.actionCost(house, 'gift')
          let dinnerCost = this.actionCost(house, 'dinner')
          let canAsk = (house.favor || 0) > 0 || (house.relation || 0) >= 28
          let marriageInfo = this.marriageOptionInfo(society, state, house)
          let nav = this.navContext(returnTo, returnPage)
          let message = [
            'Order: ' + profile.title,
            'Citizen rank: ' + (house.citizenRank || 'Unknown'),
            'Prestige: ' + Math.round(house.prestige || 0),
            'Strength: ' + Math.round(house.strength || 0),
            'House wealth: ' + Math.round(house.wealth || 0),
            'House power: ' + Math.round(house.power || 0),
            'Stability: ' + Math.round(house.stability || 0),
            'AI cash: ' + Math.round((house.ai && house.ai.cash) || 0),
            'AI influence: ' + Math.round((house.ai && house.ai.influence) || 0),
            'AI property: L' + Math.round((house.ai && house.ai.property && house.ai.property.land) || 0) + ' A' + Math.round((house.ai && house.ai.property && house.ai.property.animals) || 0) + ' T' + Math.round((house.ai && house.ai.property && house.ai.property.trade) || 0),
            'Relation: ' + this.signed(house.relation || 0),
            'Favors owed to you: ' + (house.favor || 0),
            'Agenda: ' + (house.agenda || 'unknown'),
            'Latest: ' + (house.lastFamilyEvent || 'none'),
            'Status: ' + (house.rivalry ? 'Rivalry' : (house.relation >= 55 ? 'Ally' : 'Neutral'))
          ].join('\n')
          this.pushModal({
            title: house.name,
            message,
            image: this.houseCrestIcon(society, house),
            options: [
              {
                variant: 'info',
                text: 'Members',
                icons: [this.affairIcon('familyTree')],
                action: {
                  event: this.event,
                  method: 'openMemberGroups',
                  context: { houseId, ...nav }
                }
              },
              {
                variant: 'info',
                text: 'Arrange marriage' + (marriageInfo.note ? ' (' + marriageInfo.note + ')' : ''),
                disabled: !marriageInfo.available,
                showDisabledWithTooltip: true,
                tooltip: marriageInfo.tooltip,
                icons: [this.affairIcon('marriage')],
                action: {
                  event: this.event,
                  method: 'openMarriageHousehold',
                  context: { houseId, ...nav }
                }
              },
              {
                text: 'Send gift (' + giftCost + ')',
                disabled: cash < giftCost,
                showDisabledWithTooltip: true,
                tooltip: 'Spend cash to improve relations and possibly earn a favor.',
                icons: [this.affairIcon('gift')],
                action: {
                  event: this.event,
                  method: 'sendGift',
                  context: { houseId, ...nav }
                }
              },
              {
                text: 'Host dinner (' + dinnerCost + ')',
                disabled: cash < dinnerCost,
                showDisabledWithTooltip: true,
                tooltip: 'A wider social gesture. Improves relations and prestige.',
                icons: [this.affairIcon('prestige')],
                action: {
                  event: this.event,
                  method: 'hostDinner',
                  context: { houseId, ...nav }
                }
              },
              {
                variant: 'info',
                text: 'Ask for support',
                disabled: !canAsk,
                showDisabledWithTooltip: true,
                tooltip: 'Requires a favor or a warm relationship. Grants influence.',
                icons: [this.affairIcon('support')],
                action: {
                  event: this.event,
                  method: 'askSupport',
                  context: { houseId, ...nav }
                }
              },
              {
                text: 'Negotiate trade',
                disabled: (house.relation || 0) < 5,
                showDisabledWithTooltip: true,
                tooltip: 'Build a temporary revenue tie with this house.',
                icons: [this.affairIcon('tradeVenture')],
                action: {
                  event: this.event,
                  method: 'tradeDeal',
                  context: { houseId, ...nav }
                }
              },
              this.patronageOption(house),
              {
                variant: house.rivalry ? 'info' : 'danger',
                text: house.rivalry ? 'Seek reconciliation' : 'Declare rivalry',
                icons: [this.affairIcon(house.rivalry ? 'support' : 'rivalry')],
                action: {
                  event: this.event,
                  method: house.rivalry ? 'reconcile' : 'startRivalry',
                  context: { houseId, ...nav }
                }
              },
              {
                text: 'Back',
                action: this.houseBackAction(house, returnTo, returnPage)
              }
            ].filter(Boolean)
          })
        },
        navContext(returnTo, returnPage) {
          let nav = {}
          if (returnTo) nav.returnTo = returnTo
          if (returnPage !== undefined && returnPage !== null) nav.returnPage = returnPage
          return nav
        },
        houseBackAction(house, returnTo, returnPage) {
          if (returnTo === 'allies') {
            return { event: this.event, method: 'openAllies', context: { page: returnPage || 0 } }
          }
          if (returnTo === 'rivals') {
            return { event: this.event, method: 'openRivals', context: { page: returnPage || 0 } }
          }
          if (returnTo === 'hub') {
            return { event: this.event, method: 'openHub' }
          }
          return { event: this.event, method: 'openEstate', context: { stratum: house.stratum, page: 0 } }
        },
        openPeople({ houseId, returnTo, returnPage } = {}) {
          this.openMemberGroups({ houseId, returnTo, returnPage })
        },
        openMemberGroups({ houseId, returnTo, returnPage } = {}) {
          let society = this.ensure()
          let state = daapi.getState()
          let house = society.houses[houseId]
          if (!house) {
            this.openHub()
            return
          }
          this.refreshHouseMemberLists(society, state, house)
          let groups = this.houseMemberGroups(house, state)
          let order = ['notable', 'established', 'common']
          let nav = this.navContext(returnTo, returnPage)
          let options = order.map((group) => {
            let count = (groups[group] || []).length
            return {
              variant: 'info',
              text: this.memberGroupLabel(group) + ' (' + count + ')',
              tooltip: count ? this.memberGroupDescription(group) : 'No living members are currently known in this category.',
              disabled: !count,
              showDisabledWithTooltip: true,
              icons: [this.memberGroupIcon(group)],
              action: {
                event: this.event,
                method: 'openMemberGroup',
                context: { houseId, group, page: 0, ...nav }
              }
            }
          })
          options.push({
            text: 'Back',
            action: {
              event: this.event,
              method: 'openHouse',
              context: { houseId, ...nav }
            }
          })
          this.pushModal({
            title: 'Members of ' + house.name,
            message: 'Every known living member of this dynasty is grouped by public standing, household role, and career.',
            image: this.houseCrestIcon(society, house),
            options
          })
        },
        openMemberGroup({ houseId, group, page, returnTo, returnPage } = {}) {
          let society = this.ensure()
          let state = daapi.getState()
          let house = society.houses[houseId]
          if (!house) {
            this.openHub()
            return
          }
          this.refreshHouseMemberLists(society, state, house)
          group = group || 'notable'
          page = parseInt(page || 0, 10)
          let groups = this.houseMemberGroups(house, state)
          let peopleIds = groups[group] || []
          let pageSize = 8
          let start = page * pageSize
          let shown = peopleIds.slice(start, start + pageSize)
          let nav = this.navContext(returnTo, returnPage)
          let options = shown.map((characterId) => {
            let character = state.characters[characterId]
            return {
              text: character ? this.characterName(character, state) : characterId,
              tooltip: character ? this.characterTooltip(character, state) + '\nCategory: ' + this.memberGroupLabel(group) : '',
              icons: character ? [this.characterPortrait(character, state, house), this.houseCrestIcon(society, house)] : [this.houseCrestIcon(society, house)],
              action: {
                event: this.event,
                method: 'openPerson',
                context: { houseId, characterId, group, page, ...nav }
              }
            }
          })
          if (start + pageSize < peopleIds.length) {
            options.push({
              text: 'Next page',
              action: {
                event: this.event,
                method: 'openMemberGroup',
                context: { houseId, group, page: page + 1, ...nav }
              }
            })
          }
          if (page > 0) {
            options.push({
              text: 'Previous page',
              action: {
                event: this.event,
                method: 'openMemberGroup',
                context: { houseId, group, page: page - 1, ...nav }
              }
            })
          }
          options.push({
            text: 'Back',
            action: {
              event: this.event,
              method: 'openMemberGroups',
              context: { houseId, ...nav }
            }
          })
          this.pushModal({
            title: this.memberGroupLabel(group) + ' of ' + house.name,
            message: peopleIds.length ? this.memberGroupDescription(group) + '\nPage ' + (page + 1) + ' of ' + Math.max(1, Math.ceil(peopleIds.length / pageSize)) + '.' : 'No living members are currently known in this category.',
            image: this.memberGroupIcon(group),
            options
          })
        },
        openPerson({ houseId, characterId, group, page, returnTo, returnPage } = {}) {
          let society = this.ensure()
          let state = daapi.getState()
          let house = society.houses[houseId]
          let character = state.characters[characterId]
          if (!house || !character) {
            this.openHouse({ houseId, returnTo, returnPage })
            return
          }
          character.id = character.id || characterId
          let nav = this.navContext(returnTo, returnPage)
          let vanillaActions = this.vanillaCharacterActions(character)
          let relatives = this.familyTreeRelatives(character, state)
          let message = [
            this.characterTooltip(character, state),
            'Spouse: ' + (character.spouseId && state.characters[character.spouseId] ? this.characterName(state.characters[character.spouseId], state) : 'none'),
            'Children: ' + relatives.children.length,
            'House relation: ' + this.signed(house.relation || 0),
            'House favors: ' + (house.favor || 0)
          ].join('\n')
          let backAction = group ? {
            event: this.event,
            method: 'openMemberGroup',
            context: { houseId, group, page: page || 0, ...nav }
          } : {
            event: this.event,
            method: 'openMemberGroups',
            context: { houseId, ...nav }
          }
          this.pushModal({
            title: this.characterName(character, state),
            message,
            image: this.characterPortrait(character, state, house),
            options: [
              {
                variant: 'info',
                text: 'Vanilla / other mods actions (' + vanillaActions.length + ')',
                disabled: !vanillaActions.length,
                showDisabledWithTooltip: true,
                tooltip: vanillaActions.length ? 'Open actions currently exposed by the base game or other mods for this character.' : 'No vanilla or other mod character action is currently exposed for this character.',
                icons: vanillaActions.length && vanillaActions[0].icon ? [vanillaActions[0].icon] : [this.affairIcon('support')],
                action: {
                  event: this.event,
                  method: 'openVanillaActions',
                  context: { houseId, characterId, group, page: page || 0, ...nav }
                }
              },
              {
                variant: 'info',
                text: 'Full family tree',
                tooltip: 'Open the full Society family tree using real spouse, parent, and child IDs.',
                icons: [this.affairIcon('familyTree')],
                action: {
                  event: this.event,
                  method: 'openFamilyTree',
                  context: { houseId, characterId, group, page: page || 0, mode: 'full', ...nav }
                }
              },
              {
                text: 'Praise in public',
                icons: [this.affairIcon('prestige')],
                action: {
                  event: this.event,
                  method: 'praisePerson',
                  context: { houseId, characterId }
                }
              },
              {
                variant: 'info',
                text: 'Request introduction',
                disabled: (house.relation || 0) < 10,
                showDisabledWithTooltip: true,
                tooltip: 'Warm relations let this person introduce you to useful contacts.',
                icons: [this.affairIcon('support')],
                action: {
                  event: this.event,
                  method: 'requestIntroduction',
                  context: { houseId, characterId }
                }
              },
              {
                variant: 'danger',
                text: 'Spread rumor',
                icons: [this.affairIcon('rivalry')],
                action: {
                  event: this.event,
                  method: 'spreadRumor',
                  context: { houseId, characterId }
                }
              },
              {
                text: 'Back',
                action: backAction
              }
            ]
          })
        },
        openVanillaActions({ houseId, characterId, group, page, returnTo, returnPage } = {}) {
          let society = this.ensure()
          let state = daapi.getState()
          let house = society.houses[houseId]
          let character = state.characters[characterId]
          if (!house || !character) {
            this.openHouse({ houseId, returnTo, returnPage })
            return
          }
          character.id = character.id || characterId
          let nav = this.navContext(returnTo, returnPage)
          let actions = this.vanillaCharacterActions(character)
          let options = actions.map((item) => {
            let action = item.action || {}
            let process = action.process || action.action || false
            let disabled = action.isAvailable === false || !process
            return {
              text: action.title || item.key,
              tooltip: action.tooltip || (disabled ? 'This vanilla / other mod action is not currently available.' : 'Runs this vanilla / other mod character action.'),
              disabled,
              showDisabledWithTooltip: true,
              icons: action.icon ? [action.icon] : [this.characterPortrait(character, state, house)],
              action: process || {
                event: this.event,
                method: 'openPerson',
                context: { houseId, characterId, group, page: page || 0, ...nav }
              }
            }
          })
          options.push({
            text: 'Back',
            action: {
              event: this.event,
              method: 'openPerson',
              context: { houseId, characterId, group, page: page || 0, ...nav }
            }
          })
          this.pushModal({
            title: 'Vanilla / other mods actions',
            message: actions.length ? 'Actions currently exposed by the base game or other mods for ' + this.characterName(character, state) + '.' : 'No vanilla or other mod action is currently exposed for this character.',
            image: this.characterPortrait(character, state, house),
            options
          })
        },
        openVanillaKnownFamily({ houseId, characterId, group, page, returnTo, returnPage } = {}) {
          let society = this.ensure()
          let state = daapi.getState()
          let house = society.houses[houseId]
          if (this.preferSocietyTree(characterId, society, house, state)) {
            this.openFamilyTree({ houseId, characterId, group, page, mode: 'known', returnTo, returnPage })
            return
          }
          if (!this.openVanillaFamilyRoute(characterId, '#/knownFamily')) {
            this.openFamilyTree({ houseId, characterId, group, page, mode: 'known', returnTo, returnPage })
          }
        },
        openVanillaFullFamilyTree({ houseId, characterId, group, page, returnTo, returnPage } = {}) {
          let society = this.ensure()
          let state = daapi.getState()
          let house = society.houses[houseId]
          if (this.preferSocietyTree(characterId, society, house, state)) {
            this.openFamilyTree({ houseId, characterId, group, page, mode: 'full', returnTo, returnPage })
            return
          }
          if (!this.openVanillaFamilyRoute(characterId, '#/fullFamilyTree')) {
            this.openFamilyTree({ houseId, characterId, group, page, mode: 'full', returnTo, returnPage })
          }
        },
        preferSocietyTree(characterId, society, house, state) {
          let character = state && state.characters ? state.characters[characterId] : false
          return !!(
            character &&
            (
              character.corSocietyGenerated ||
              (house && house.generated) ||
              (society.generatedCharacterIds || []).some((id) => this.sameCharacterId(id, characterId))
            )
          )
        },
        openVanillaFamilyRoute(characterId, route) {
          let state = daapi.getState()
          if (!state || !state.characters || !state.characters[characterId]) {
            return false
          }
          let path = route === '#/fullFamilyTree' || route === '/fullFamilyTree' ? '/fullFamilyTree' : '/knownFamily'
          try {
            let vueRoot = this.findGameVueRoot()
            if (vueRoot && vueRoot.$store) {
              let store = vueRoot.$store
              if (typeof store.commit === 'function') {
                store.commit('setSelectedCharacterId', characterId)
              } else if (store.state && store.state.current) {
                store.state.current.selectedCharacterId = characterId
              }
              if (typeof store.dispatch === 'function') {
                store.dispatch('forceUpdateStore')
              }
              if (vueRoot.$router && typeof vueRoot.$router.push === 'function') {
                let result = vueRoot.$router.push({ path })
                if (result && typeof result.catch === 'function') {
                  result.catch(() => {})
                }
                return true
              }
              if (typeof window !== 'undefined' && window.location) {
                window.location.hash = '#' + path
                return true
              }
            }
          } catch (err) {
            console.warn(err)
          }
          return false
        },
        findGameVueRoot() {
          if (this.cachedGameVueRoot && this.isGameVueRoot(this.cachedGameVueRoot)) {
            return this.cachedGameVueRoot
          }
          if (typeof document === 'undefined') {
            return false
          }
          let nodes = []
          let app = document.getElementById('app')
          if (app) {
            nodes.push(app)
          }
          if (document.body) {
            nodes.push(document.body)
          }
          try {
            let allNodes = document.querySelectorAll('*')
            for (let i = 0; i < allNodes.length; i++) {
              nodes.push(allNodes[i])
            }
          } catch (err) {
            console.warn(err)
          }
          for (let i = 0; i < nodes.length; i++) {
            let vm = nodes[i] && nodes[i].__vue__
            if (!vm) {
              continue
            }
            let root = this.vueRootFromComponent(vm)
            if (this.isGameVueRoot(root)) {
              this.cachedGameVueRoot = root
              return root
            }
          }
          return false
        },
        vueRootFromComponent(vm) {
          let root = vm && (vm.$root || vm)
          let guard = 0
          while (root && root.$parent && guard < 50) {
            root = root.$parent
            guard += 1
          }
          return root || vm
        },
        isGameVueRoot(root) {
          return !!(
            root &&
            root.$store &&
            root.$router &&
            root.$store.state &&
            root.$store.state.current &&
            root.$store.state.characters
          )
        },
        openFamilyTree({ houseId, characterId, group, page, mode, returnTo, returnPage } = {}) {
          let society = this.ensure()
          let state = daapi.getState()
          let house = society.houses[houseId]
          let character = state.characters[characterId]
          if (!character) {
            this.openHouse({ houseId, returnTo, returnPage })
            return
          }
          character.id = character.id || characterId
          if (!house) {
            houseId = this.houseIdForCharacter(character, state, society) || houseId
            house = society.houses[houseId]
          }
          if (house) {
            this.refreshHouseMemberLists(society, state, house)
          }
          this.openGraphicalFamilyTree({ society, state, house, houseId, characterId, group, page, mode, returnTo, returnPage })
        },
        openGraphicalFamilyTree({ society, state, house, houseId, characterId, group, page, mode, returnTo, returnPage }) {
          if (typeof document === 'undefined' || !document.body) {
            this.openTextFamilyTreeFallback({ society, state, house, houseId, characterId, group, page, mode, returnTo, returnPage })
            return
          }
          let character = state.characters[characterId]
          if (!character) {
            this.openHouse({ houseId, returnTo, returnPage })
            return
          }
          character.id = character.id || characterId
          this.closeFamilyTreeOverlay()
          let overlay = document.createElement('div')
          overlay.id = 'corSocietyFamilyTreeOverlay'
          overlay.className = 'cor-society-family-tree-overlay'
          overlay.setAttribute('data-cor-society-ui', 'family-tree')
          this.applyFamilyTreeTheme(overlay, state)

          let panel = document.createElement('div')
          panel.className = 'cor-society-family-tree-panel container-main break-word'
          overlay.appendChild(panel)

          let header = document.createElement('div')
          header.className = 'cor-society-family-tree-header'
          panel.appendChild(header)

          let backButton = document.createElement('button')
          backButton.type = 'button'
          backButton.className = 'btn btn-sm btn-dark cor-society-tree-toolbar-button'
          backButton.textContent = 'Back'
          backButton.title = 'Return to the selected Society character.'
          backButton.addEventListener('click', () => {
            this.closeFamilyTreeOverlay()
            this.openPerson({ houseId, characterId, group, page: page || 0, returnTo, returnPage })
          })
          header.appendChild(backButton)

          let heading = document.createElement('div')
          heading.className = 'cor-society-family-tree-heading'
          let title = document.createElement('h3')
          title.textContent = this.familyTreeTitle(mode)
          heading.appendChild(title)
          let subtitle = document.createElement('div')
          subtitle.className = 'cor-society-family-tree-subtitle'
          subtitle.textContent = this.characterName(character, state)
          heading.appendChild(subtitle)
          header.appendChild(heading)

          let closeButton = document.createElement('button')
          closeButton.type = 'button'
          closeButton.className = 'btn btn-sm btn-dark cor-society-tree-toolbar-button'
          closeButton.textContent = 'Close'
          closeButton.title = 'Close the family tree.'
          closeButton.addEventListener('click', () => this.closeFamilyTreeOverlay())
          header.appendChild(closeButton)

          let toolbar = document.createElement('div')
          toolbar.className = 'cor-society-family-tree-toolbar'
          panel.appendChild(toolbar)

          let zoomLabel = document.createElement('label')
          zoomLabel.className = 'cor-society-tree-zoom-label'
          zoomLabel.textContent = 'Zoom'
          toolbar.appendChild(zoomLabel)

          let zoomInput = document.createElement('input')
          zoomInput.type = 'range'
          zoomInput.min = '0.45'
          zoomInput.max = '1.25'
          zoomInput.step = '0.05'
          zoomInput.value = '0.9'
          zoomInput.setAttribute('aria-label', 'Zoom level')
          toolbar.appendChild(zoomInput)

          let focusButton = document.createElement('button')
          focusButton.type = 'button'
          focusButton.className = 'btn btn-sm btn-light cor-society-tree-toolbar-button'
          focusButton.textContent = 'Center'
          focusButton.title = 'Pan back to the selected character.'
          toolbar.appendChild(focusButton)

          let canvas = document.createElement('div')
          canvas.className = 'cor-society-family-tree-canvas'
          panel.appendChild(canvas)

          let tree = document.createElement('div')
          tree.id = 'fullFamilyTree'
          tree.className = 'cor-society-family-tree vue-family-tree'
          canvas.appendChild(tree)

          let zoomTarget = document.createElement('div')
          zoomTarget.className = 'cor-society-family-tree-zoom-target'
          zoomTarget.style.transform = 'scale(' + parseFloat(zoomInput.value) + ')'
          tree.appendChild(zoomTarget)

          let startId = this.familyTreeStartId(character.id, state, mode)
          let depthLimit = mode === 'known' ? 2 : 7
          let branch = this.createFamilyTreeBranch({
            rootId: startId,
            focusId: character.id,
            state,
            society,
            fallbackHouse: house,
            depth: 0,
            depthLimit,
            visited: {},
            returnTo,
            returnPage
          })
          zoomTarget.appendChild(branch)

          let note = document.createElement('div')
          note.className = 'cor-society-family-tree-note'
          note.textContent = mode === 'known'
            ? 'Known family view: parents, siblings, spouse, and near descendants.'
            : 'Full tree view: the branch starts from the oldest known ancestor Society can resolve.'
          zoomTarget.appendChild(note)

          let setZoom = () => {
            zoomTarget.style.transform = 'scale(' + parseFloat(zoomInput.value || 1) + ')'
          }
          zoomInput.addEventListener('input', setZoom)
          zoomInput.addEventListener('change', setZoom)

          let panToFocus = () => {
            let selected = document.getElementById('familyTreeCharacterBox_' + character.id)
            if (selected && typeof selected.scrollIntoView === 'function') {
              selected.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' })
            }
          }
          focusButton.addEventListener('click', panToFocus)

          document.body.appendChild(overlay)
          setTimeout(panToFocus, 120)
        },
        closeFamilyTreeOverlay() {
          if (typeof document === 'undefined') {
            return
          }
          let overlay = document.getElementById('corSocietyFamilyTreeOverlay')
          if (overlay && overlay.parentNode) {
            overlay.parentNode.removeChild(overlay)
          }
        },
        applyFamilyTreeTheme(overlay, state) {
          let dark = this.isGameDarkTheme(state)
          overlay.classList.toggle('cor-society-theme-dark', dark)
          overlay.classList.toggle('cor-society-theme-light', !dark)
          overlay.setAttribute('data-cor-society-theme', dark ? 'dark' : 'light')
        },
        isGameDarkTheme(state) {
          state = state || daapi.getState()
          if (state && state.settings && typeof state.settings.darkMode === 'boolean') {
            return state.settings.darkMode
          }
          if (typeof document !== 'undefined') {
            let probes = [document.documentElement, document.body, document.getElementById('app')].filter(Boolean)
            for (let i = 0; i < probes.length; i += 1) {
              let probe = probes[i]
              let marker = ((probe.getAttribute('data-bs-theme') || '') + ' ' + (probe.className || '')).toLowerCase()
              if (marker.indexOf('dark') >= 0 || marker.indexOf('night') >= 0) return true
              if (marker.indexOf('light') >= 0) return false
            }
            let bg = this.firstOpaqueBackground(probes)
            if (bg) {
              return this.colorLuminance(bg) < 115
            }
          }
          if (typeof window !== 'undefined' && window.matchMedia) {
            try {
              return !!window.matchMedia('(prefers-color-scheme: dark)').matches
            } catch (err) {
              return false
            }
          }
          return false
        },
        firstOpaqueBackground(elements) {
          for (let i = 0; i < elements.length; i += 1) {
            let style = window.getComputedStyle(elements[i])
            let bg = style && style.backgroundColor
            if (bg && bg !== 'transparent' && bg !== 'rgba(0, 0, 0, 0)') {
              return bg
            }
          }
          return ''
        },
        colorLuminance(color) {
          let match = String(color || '').match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i)
          if (!match) {
            return 255
          }
          let r = parseInt(match[1], 10)
          let g = parseInt(match[2], 10)
          let b = parseInt(match[3], 10)
          return (0.2126 * r) + (0.7152 * g) + (0.0722 * b)
        },
        familyTreeTitle(mode) {
          if (mode === 'known') return 'Known Family Tree'
          if (mode === 'full') return 'Full Family Tree'
          return 'Society Family Tree'
        },
        familyTreeStartId(characterId, state, mode) {
          let character = state.characters[characterId]
          if (!character) {
            return characterId
          }
          character.id = character.id || characterId
          if (mode === 'known') {
            if (character.fatherId && state.characters[character.fatherId]) return character.fatherId
            if (character.motherId && state.characters[character.motherId]) return character.motherId
            return character.id
          }
          return this.familyTreeRootId(character.id, state)
        },
        familyTreeRootId(characterId, state) {
          let current = state.characters[characterId]
          let guard = 0
          while (current && guard < 24) {
            current.id = current.id || characterId
            let parents = [current.fatherId, current.motherId].filter((id) => id && state.characters[id])
            if (!parents.length) {
              break
            }
            let sameDynastyParent = parents.find((id) => state.characters[id].dynastyId && state.characters[id].dynastyId === current.dynastyId)
            let nextId = sameDynastyParent || parents[0]
            if (!nextId || this.sameCharacterId(nextId, current.id)) {
              break
            }
            current = state.characters[nextId]
            characterId = nextId
            guard += 1
          }
          return current && current.id ? current.id : characterId
        },
        createFamilyTreeBranch({ rootId, focusId, state, society, fallbackHouse, depth, depthLimit, visited, returnTo, returnPage }) {
          let character = state.characters[rootId]
          let branch = document.createElement('div')
          branch.className = 'cor-society-tree-family'
          if (!character) {
            branch.appendChild(this.createFamilyTreeEmptyCard('Unknown'))
            return branch
          }
          character.id = character.id || rootId
          let key = String(character.id)
          let alreadyVisited = visited[key]
          visited = { ...visited, [key]: true }

          let spouseId = this.treeSpouseId(character, state)
          let spouse = spouseId && state.characters[spouseId] ? state.characters[spouseId] : false
          if (spouse) {
            spouse.id = spouse.id || spouseId
          }
          let children = alreadyVisited ? [] : this.treeChildrenIds(character, state)
          if (depth >= depthLimit) {
            children = []
          }

          let couple = document.createElement('div')
          couple.className = 'cor-society-tree-couple' + (children.length ? ' has-children' : '')
          couple.appendChild(this.createFamilyTreeCharacterCard(character, state, society, fallbackHouse, this.treeRoleLabel(character, focusId, depth, false), focusId, returnTo, returnPage))
          if (spouse && !this.sameCharacterId(spouse.id, character.id)) {
            couple.appendChild(this.createFamilyTreeCharacterCard(spouse, state, society, fallbackHouse, this.treeRoleLabel(spouse, focusId, depth, true), focusId, returnTo, returnPage))
          }
          branch.appendChild(couple)

          if (children.length) {
            let childrenWrap = document.createElement('div')
            childrenWrap.className = 'cor-society-tree-children'
            children.forEach((childId) => {
              childrenWrap.appendChild(this.createFamilyTreeBranch({
                rootId: childId,
                focusId,
                state,
                society,
                fallbackHouse,
                depth: depth + 1,
                depthLimit,
                visited,
                returnTo,
                returnPage
              }))
            })
            branch.appendChild(childrenWrap)
          }
          return branch
        },
        createFamilyTreeCharacterCard(character, state, society, fallbackHouse, role, focusId, returnTo, returnPage) {
          let house = this.treeHouseForCharacter(character, society, fallbackHouse)
          let card = document.createElement('button')
          card.type = 'button'
          card.id = 'familyTreeCharacterBox_' + character.id
          card.className = 'btn btn-sm btn-outline-secondary btn-family-tree-card cor-society-tree-card'
          if (this.sameCharacterId(character.id, focusId)) {
            card.className += ' active'
          }
          if (character.isDead) {
            card.className += ' is-dead'
          }
          card.title = this.characterTooltip(character, state)
          card.addEventListener('click', () => {
            let nextHouseId = character.dynastyId && society.houses[character.dynastyId] ? character.dynastyId : (house && house.id) || ''
            this.openGraphicalFamilyTree({
              society,
              state: daapi.getState(),
              house: society.houses[nextHouseId] || house || fallbackHouse,
              houseId: nextHouseId,
              characterId: character.id,
              group: '',
              page: 0,
              mode: 'full',
              returnTo,
              returnPage
            })
          })

          let portrait = document.createElement('img')
          portrait.className = 'img-fluid icon-character-small cor-society-tree-card-portrait'
          portrait.src = this.characterPortrait(character, state, house)
          portrait.alt = ''
          card.appendChild(portrait)

          let text = document.createElement('span')
          text.className = 'cor-society-tree-card-text'
          card.appendChild(text)

          let roleEl = document.createElement('span')
          roleEl.className = 'cor-society-tree-card-role'
          roleEl.textContent = role
          text.appendChild(roleEl)

          let nameEl = document.createElement('span')
          nameEl.className = 'cor-society-tree-card-name'
          nameEl.textContent = this.characterName(character, state)
          text.appendChild(nameEl)

          let metaEl = document.createElement('span')
          metaEl.className = 'cor-society-tree-card-meta'
          metaEl.textContent = this.treeCharacterMeta(character, state)
          text.appendChild(metaEl)
          return card
        },
        createFamilyTreeEmptyCard(label) {
          let card = document.createElement('div')
          card.className = 'cor-society-tree-card cor-society-tree-empty-card'
          card.textContent = label
          return card
        },
        treeHouseForCharacter(character, society, fallbackHouse) {
          if (character && character.dynastyId && society.houses[character.dynastyId]) {
            return society.houses[character.dynastyId]
          }
          return fallbackHouse || false
        },
        treeRoleLabel(character, focusId, depth, isSpouse) {
          if (this.sameCharacterId(character.id, focusId)) return 'Selected'
          if (isSpouse) return 'Spouse'
          if (depth === 0) return character.isDead ? 'Ancestor' : 'Root'
          return character.isDead ? 'Ancestor' : 'Kin'
        },
        treeCharacterMeta(character, state) {
          if (character.isDead) {
            return 'Died ' + (character.deathYear || 'unknown')
          }
          return 'Age ' + this.age(character, state)
        },
        treeSpouseId(character, state) {
          if (character.spouseId && state.characters[character.spouseId]) {
            return character.spouseId
          }
          let children = this.treeChildrenIds(character, state)
          for (let i = 0; i < children.length; i++) {
            let child = state.characters[children[i]]
            if (!child) {
              continue
            }
            if (this.sameCharacterId(child.fatherId, character.id) && child.motherId && state.characters[child.motherId]) {
              return child.motherId
            }
            if (this.sameCharacterId(child.motherId, character.id) && child.fatherId && state.characters[child.fatherId]) {
              return child.fatherId
            }
          }
          return ''
        },
        treeChildrenIds(character, state) {
          let ids = []
          let seen = {}
          let add = (id) => {
            if (!id || seen[id] || !state.characters[id] || this.sameCharacterId(id, character.id)) {
              return
            }
            seen[id] = true
            ids.push(id)
          }
          ;(character.childrenIds || []).forEach(add)
          for (let id in state.characters) {
            if (!state.characters.hasOwnProperty(id)) {
              continue
            }
            let other = state.characters[id]
            if (!other) {
              continue
            }
            other.id = other.id || id
            if (this.sameCharacterId(other.fatherId, character.id) || this.sameCharacterId(other.motherId, character.id)) {
              add(other.id)
            }
          }
          return ids.sort((a, b) => {
            let first = state.characters[a] || {}
            let second = state.characters[b] || {}
            return (first.birthYear || 0) - (second.birthYear || 0)
          })
        },
        openTextFamilyTreeFallback({ society, state, house, houseId, characterId, group, page, mode, returnTo, returnPage }) {
          let character = state.characters[characterId]
          if (!character) {
            this.openHouse({ houseId, returnTo, returnPage })
            return
          }
          character.id = character.id || characterId
          let relatives = this.familyTreeRelatives(character, state)
          let message = [
            this.characterLink(character.id, state),
            'Father: ' + this.characterLink(character.fatherId, state),
            'Mother: ' + this.characterLink(character.motherId, state),
            'Spouse: ' + this.characterLink(character.spouseId, state),
            'Children: ' + (relatives.children.length ? relatives.children.map((id) => this.characterLink(id, state)).join(', ') : 'none'),
            'Siblings: ' + (relatives.siblings.length ? relatives.siblings.map((id) => this.characterLink(id, state)).join(', ') : 'none')
          ].join('\n')
          let relativeOptions = []
          ;[
            { label: 'Father', id: character.fatherId },
            { label: 'Mother', id: character.motherId },
            { label: 'Spouse', id: character.spouseId }
          ].forEach((relative) => {
            if (relative.id && state.characters[relative.id]) {
              relativeOptions.push(this.familyRelativeOption(relative.label, relative.id, state, society, houseId, returnTo, returnPage))
            }
          })
          relatives.children.slice(0, 8).forEach((relativeId) => {
            relativeOptions.push(this.familyRelativeOption('Child', relativeId, state, society, houseId, returnTo, returnPage))
          })
          relatives.siblings.slice(0, 4).forEach((relativeId) => {
            relativeOptions.push(this.familyRelativeOption('Sibling', relativeId, state, society, houseId, returnTo, returnPage))
          })
          let nav = this.navContext(returnTo, returnPage)
          let backAction = group ? {
            event: this.event,
            method: 'openPerson',
            context: { houseId, characterId, group, page: page || 0, ...nav }
          } : {
            event: this.event,
            method: 'openPerson',
            context: { houseId, characterId, ...nav }
          }
          relativeOptions.push({
            text: 'Back',
            action: backAction
          })
          this.pushModal({
            title: mode === 'known' ? 'Known Family' : mode === 'full' ? 'Full Family Tree' : 'Family Tree',
            message,
            image: this.characterPortrait(character, state, house),
            options: relativeOptions
          })
        },
        openMarriageHousehold({ houseId }) {
          let society = this.ensure()
          let state = daapi.getState()
          let house = society.houses[houseId]
          if (!house) {
            this.openHub()
            return
          }
          let access = this.marriageOptionInfo(society, state, house)
          if (!access.available) {
            this.pushModal({
              title: 'Marriage unavailable',
              message: access.tooltip,
              image: this.houseCrestIcon(society, house),
              options: [
                {
                  text: 'Back',
                  action: {
                    event: this.event,
                    method: 'openHouse',
                    context: { houseId }
                  }
                }
              ]
            })
            return
          }
          let candidates = this.playerMarriageCandidates(state)
          let options = candidates.slice(0, 12).map((character) => {
            return {
              text: this.characterName(character, state),
              tooltip: this.characterTooltip(character, state),
              icons: [this.characterPortrait(character, state)],
              action: {
                event: this.event,
                method: 'openMarriageCandidates',
                context: { houseId, playerCharacterId: character.id }
              }
            }
          })
          options.push({
            text: 'Back',
            action: {
              event: this.event,
              method: 'openHouse',
              context: { houseId }
            }
          })
          this.pushModal({
            title: 'Arrange marriage',
            message: candidates.length ? 'Choose one of your unmarried adult family members.' : 'No unmarried adult in your family is available.',
            image: this.houseCrestIcon(society, house),
            options
          })
        },
        openMarriageCandidates({ houseId, playerCharacterId }) {
          let society = this.ensure()
          let state = daapi.getState()
          let house = society.houses[houseId]
          let playerCharacter = state.characters[playerCharacterId]
          if (!house || !playerCharacter) {
            this.openHouse({ houseId })
            return
          }
          let access = this.marriageOptionInfo(society, state, house)
          if (!access.available) {
            this.pushModal({
              title: 'Marriage unavailable',
              message: access.tooltip,
              image: this.houseCrestIcon(society, house),
              options: [
                {
                  text: 'Back',
                  action: {
                    event: this.event,
                    method: 'openHouse',
                    context: { houseId }
                  }
                }
              ]
            })
            return
          }
          let candidates = this.houseMarriageCandidates(house, state, playerCharacter)
          if (!candidates.length && (society.generatedCharacterIds || []).length < 180) {
            let prospectId = this.generateMarriageProspect(society, state, house, playerCharacter)
            this.save(society)
            state = daapi.getState()
            try {
              let prospect = daapi.getCharacter({ characterId: prospectId })
              if (prospect && state.characters) {
                state.characters[prospectId] = prospect
              }
            } catch (err) {
              console.warn(err)
            }
            house = society.houses[houseId]
            playerCharacter = state.characters[playerCharacterId]
            candidates = this.houseMarriageCandidates(house, state, playerCharacter)
          }
          let options = candidates.slice(0, 12).map((character) => {
            return {
              text: this.characterName(character, state),
              tooltip: this.characterTooltip(character, state),
              icons: [this.characterPortrait(character, state, house), this.houseCrestIcon(society, house)],
              action: {
                event: this.event,
                method: 'confirmSocietyMarriage',
                context: { houseId, playerCharacterId, spouseId: character.id }
              }
            }
          })
          options.push({
            text: 'Back',
            action: {
              event: this.event,
              method: 'openMarriageHousehold',
              context: { houseId }
            }
          })
          this.pushModal({
            title: 'Marriage with ' + house.name,
            message: candidates.length ? 'Choose a spouse for ' + this.characterName(playerCharacter, state) + '.' : 'No compatible unmarried adult is available in this house.',
            image: this.characterPortrait(playerCharacter, state),
            options
          })
        },
        confirmSocietyMarriage({ houseId, playerCharacterId, spouseId }) {
          let society = this.ensure()
          let state = daapi.getState()
          let house = society.houses[houseId]
          let playerCharacter = state.characters[playerCharacterId]
          let spouse = state.characters[spouseId]
          if (!house || !playerCharacter || !spouse) {
            this.openHouse({ houseId })
            return
          }
          let matrilineal = !this.characterIsMale(playerCharacter)
          let message = [
            this.characterName(playerCharacter, state),
            'and',
            this.characterName(spouse, state),
            '',
            matrilineal ? 'The marriage will be matrilineal, keeping your household line central.' : 'The marriage will follow the usual household line.'
          ].join('\n')
          this.pushModal({
            title: 'Confirm marriage?',
            message,
            image: this.characterPortrait(spouse, state, house),
            options: [
              {
                variant: 'info',
                text: 'Arrange wedding',
                icons: [this.characterPortrait(playerCharacter, state), this.characterPortrait(spouse, state, house)],
                action: {
                  event: this.event,
                  method: 'performSocietyMarriage',
                  context: { houseId, playerCharacterId, spouseId, isMatrilineal: matrilineal }
                }
              },
              {
                text: 'Cancel',
                action: {
                  event: this.event,
                  method: 'openMarriageCandidates',
                  context: { houseId, playerCharacterId }
                }
              }
            ]
          })
        },
        performSocietyMarriage({ houseId, playerCharacterId, spouseId, isMatrilineal }) {
          let society = this.ensure()
          let state = daapi.getState()
          let house = society.houses[houseId]
          let playerCharacter = state.characters[playerCharacterId]
          let spouse = state.characters[spouseId]
          if (!house || !playerCharacter || !spouse) {
            this.openHouse({ houseId })
            return
          }
          playerCharacter.id = playerCharacter.id || playerCharacterId
          spouse.id = spouse.id || spouseId
          if (!this.isMarriageEligible(playerCharacter, state) || !this.isMarriageEligible(spouse, state) || !this.isMarriageCompatible(playerCharacter, spouse)) {
            this.pushModal({
              title: 'Marriage no longer valid',
              message: 'The selected marriage is no longer available. One character may already be married, too young, too old, dead, blocked from marriage, from the same dynasty, or incompatible.',
              image: this.affairIcon('marriage'),
              options: [
                {
                  text: 'Choose again',
                  action: {
                    event: this.event,
                    method: 'openMarriageHousehold',
                    context: { houseId }
                  }
                },
                {
                  text: 'Back to house',
                  action: {
                    event: this.event,
                    method: 'openHouse',
                    context: { houseId }
                  }
                }
              ]
            })
            return
          }
          try {
            daapi.performMarriage({ characterId: playerCharacterId, spouseId, isMatrilineal: !!isMatrilineal })
          } catch (err) {
            console.warn(err)
            this.pushModal({
              title: 'Marriage failed',
              message: 'The vanilla marriage API rejected this wedding: ' + err.name + ': ' + err.message + '\nNo Society marriage effects were applied.',
              image: this.affairIcon('marriage'),
              options: [
                {
                  text: 'Choose again',
                  action: {
                    event: this.event,
                    method: 'openMarriageHousehold',
                    context: { houseId }
                  }
                },
                {
                  text: 'Back to house',
                  action: {
                    event: this.event,
                    method: 'openHouse',
                    context: { houseId }
                  }
                }
              ]
            })
            return
          }
          try {
            daapi.forceUpdateCharacterDisplay({ characterId: playerCharacterId })
            daapi.forceUpdateCharacterDisplay({ characterId: spouseId })
          } catch (err) {
            console.warn(err)
          }
          state = daapi.getState()
          playerCharacter = (state.characters && state.characters[playerCharacterId]) || playerCharacter
          spouse = (state.characters && state.characters[spouseId]) || spouse
          let effects = this.marriageEffects(state, house)
          this.applyStats(effects.stats)
          if (effects.revenue) {
            try {
              daapi.addAdditiveModifier({
                key: 'revenue',
                id: 'cor_society_marriage_' + this.safeId(house.id),
                durationInMonths: 24,
                amount: effects.revenue
              })
            } catch (err) {
              console.warn(err)
            }
          }
          house.relation = this.clamp((house.relation || 0) + effects.relation, -100, 100)
          house.favor = (house.favor || 0) + 1
          house.lastFamilyEvent = 'Marriage alliance with your household.'
          this.log(society, 'A marriage joins your household with ' + house.name + ': ' + this.characterName(playerCharacter, state) + ' and ' + this.characterName(spouse, state) + '.', 'marriage', house.id)
          this.save(society)
          this.pushModal({
            title: 'Marriage arranged',
            message: [
              this.characterName(spouse, state) + ' is now married to ' + this.characterName(playerCharacter, state) + '.',
              effects.summary,
              'The vanilla family screen should show the spouse link after the game refreshes.'
            ].join('\n'),
            image: this.characterPortrait(spouse, state, house),
            options: [
              {
                text: 'Back to house',
                action: {
                  event: this.event,
                  method: 'openHouse',
                  context: { houseId }
                }
              }
            ]
          })
        },
        patronageOption(house) {
          if (['plebeian', 'freedmen', 'poor'].indexOf(house.stratum) >= 0) {
            return {
              text: 'Offer patronage',
              tooltip: 'Costs monthly revenue for a year, but builds loyalty and favor among lower orders.',
              icons: [this.affairIcon('patronage')],
              action: {
                event: this.event,
                method: 'offerPatronage',
                context: { houseId: house.id }
              }
            }
          }
          return {
            text: 'Seek patronage',
            disabled: (house.relation || 0) < 20,
            showDisabledWithTooltip: true,
            tooltip: 'Powerful houses may lend standing when relations are good.',
            icons: [this.affairIcon('patronage')],
            action: {
              event: this.event,
              method: 'seekPatronage',
              context: { houseId: house.id }
            }
          }
        },
        sendGift({ houseId }) {
          this.withHouse(houseId, (society, house) => {
            let cost = this.actionCost(house, 'gift')
            this.applyStats({ cash: -cost })
            house.relation = this.clamp((house.relation || 0) + this.randomInt(8, 16), -100, 100)
            if (Math.random() < 0.25) {
              house.favor = (house.favor || 0) + 1
            }
            house.lastInteraction = this.monthKey(daapi.getState())
            this.log(society, 'Gift sent to ' + house.name + ': relation ' + this.signed(house.relation) + '.')
          })
          this.openHouse({ houseId })
        },
        hostDinner({ houseId }) {
          this.withHouse(houseId, (society, house) => {
            let cost = this.actionCost(house, 'dinner')
            this.applyStats({ cash: -cost, prestige: 12 })
            house.relation = this.clamp((house.relation || 0) + this.randomInt(10, 20), -100, 100)
            house.heat = Math.max(0, (house.heat || 0) - 1)
            this.log(society, 'Dinner hosted for ' + house.name + ': prestige rises, relation ' + this.signed(house.relation) + '.')
          })
          this.openHouse({ houseId })
        },
        askSupport({ houseId }) {
          this.withHouse(houseId, (society, house) => {
            let profile = this.strata[house.stratum] || this.strata.plebeian
            let amount = Math.max(20, Math.round((profile.support || 50) + (house.strength || 0) * 2))
            this.applyStats({ influence: amount })
            if ((house.favor || 0) > 0) {
              house.favor -= 1
              house.relation = this.clamp((house.relation || 0) - 4, -100, 100)
            } else {
              house.relation = this.clamp((house.relation || 0) - 16, -100, 100)
            }
            house.heat = (house.heat || 0) + 1
            this.log(society, house.name + ' backs you publicly: +' + amount + ' influence.')
          })
          this.openHouse({ houseId })
        },
        tradeDeal({ houseId }) {
          this.withHouse(houseId, (society, house) => {
            let profile = this.strata[house.stratum] || this.strata.plebeian
            let amount = Math.max(8, Math.round((profile.revenue || 20) + (house.strength || 0) / 3))
            daapi.addAdditiveModifier({
              key: 'revenue',
              id: 'cor_society_trade_' + this.safeId(house.id),
              durationInMonths: 12,
              amount
            })
            house.tradeUntil = this.futureMonthKey(12)
            house.relation = this.clamp((house.relation || 0) + 5, -100, 100)
            this.log(society, 'Trade deal with ' + house.name + ': +' + amount + ' monthly revenue for one year.')
          })
          this.openHouse({ houseId })
        },
        offerPatronage({ houseId }) {
          this.withHouse(houseId, (society, house) => {
            let stipend = Math.max(8, Math.round((this.strata[house.stratum].revenue || 20) / 2))
            daapi.addAdditiveModifier({
              key: 'revenue',
              id: 'cor_society_patronage_' + this.safeId(house.id),
              durationInMonths: 12,
              amount: -stipend
            })
            house.patronageUntil = this.futureMonthKey(12)
            house.relation = this.clamp((house.relation || 0) + 22, -100, 100)
            house.favor = (house.favor || 0) + 1
            this.applyStats({ prestige: 8 })
            this.log(society, 'You take ' + house.name + ' under patronage. They owe you a favor.')
          })
          this.openHouse({ houseId })
        },
        seekPatronage({ houseId }) {
          this.withHouse(houseId, (society, house) => {
            let amount = Math.max(60, Math.round((house.strength || 20) * 3))
            this.applyStats({ influence: amount, prestige: -5 })
            house.favor = Math.max(0, (house.favor || 0) - 1)
            house.relation = this.clamp((house.relation || 0) - 8, -100, 100)
            this.log(society, house.name + ' lends you standing: +' + amount + ' influence.')
          })
          this.openHouse({ houseId })
        },
        startRivalry({ houseId }) {
          this.withHouse(houseId, (society, house) => {
            house.rivalry = true
            house.relation = Math.min(house.relation || 0, -65)
            house.heat = 3
            this.applyStats({ prestige: 10, influence: 25 })
            this.log(society, 'Open rivalry declared against ' + house.name + '.')
          })
          this.openHouse({ houseId })
        },
        reconcile({ houseId }) {
          this.withHouse(houseId, (society, house) => {
            let cost = this.actionCost(house, 'reconcile')
            this.applyStats({ cash: -cost, influence: -20 })
            house.relation = this.clamp((house.relation || 0) + 38, -100, 100)
            if (house.relation > -25) {
              house.rivalry = false
            }
            house.heat = 0
            this.log(society, 'Reconciliation attempted with ' + house.name + ': relation ' + this.signed(house.relation) + '.')
          })
          this.openHouse({ houseId })
        },
        praisePerson({ houseId, characterId }) {
          this.withHouse(houseId, (society, house) => {
            let character = daapi.getState().characters[characterId]
            house.relation = this.clamp((house.relation || 0) + 6, -100, 100)
            this.applyStats({ prestige: 3 })
            this.log(society, 'You praise ' + (character ? character.praenomen : 'a notable') + ' of ' + house.name + ' in public.')
          })
          this.openPerson({ houseId, characterId })
        },
        requestIntroduction({ houseId, characterId }) {
          this.withHouse(houseId, (society, house) => {
            house.relation = this.clamp((house.relation || 0) - 3, -100, 100)
            house.favor = (house.favor || 0) + (Math.random() < 0.45 ? 1 : 0)
            this.applyStats({ influence: 35 })
            this.log(society, house.name + ' introduces you to useful contacts.')
          })
          this.openPerson({ houseId, characterId })
        },
        spreadRumor({ houseId, characterId }) {
          this.withHouse(houseId, (society, house) => {
            let success = Math.random() > 0.28
            if (success) {
              house.relation = this.clamp((house.relation || 0) - 22, -100, 100)
              this.applyStats({ influence: 35, prestige: 5 })
              this.log(society, 'A rumor harms ' + house.name + ', and your faction enjoys the advantage.')
            } else {
              house.relation = this.clamp((house.relation || 0) - 35, -100, 100)
              house.rivalry = true
              this.applyStats({ prestige: -15 })
              this.log(society, 'A rumor against ' + house.name + ' is traced back to your circle.')
            }
          })
          this.openPerson({ houseId, characterId })
        },
        answerSlander({ houseId }) {
          this.withHouse(houseId, (society, house) => {
            this.applyStats({ influence: -35, prestige: 4 })
            house.pendingPlayerEvent = false
            house.heat = (house.heat || 0) + 2
            house.relation = this.clamp((house.relation || 0) - 8, -100, 100)
            this.log(society, 'You answer ' + house.name + '\'s slander in public.')
          })
        },
        ignoreSlander({ houseId }) {
          this.withHouse(houseId, (society, house) => {
            this.applyStats({ prestige: -10 })
            house.pendingPlayerEvent = false
            house.heat = Math.max(0, (house.heat || 0) - 1)
            this.log(society, 'You ignore slander from ' + house.name + '.')
          })
        },
        acceptOpening({ houseId }) {
          this.withHouse(houseId, (society, house) => {
            house.favor = (house.favor || 0) + 1
            house.relation = this.clamp((house.relation || 0) + 8, -100, 100)
            this.applyStats({ influence: 60 })
            this.log(society, house.name + ' exchanges public support with your household.')
          })
        },
        declineOpening({ houseId }) {
          this.withHouse(houseId, (society, house) => {
            house.relation = this.clamp((house.relation || 0) - 4, -100, 100)
            this.applyStats({ prestige: 3 })
            this.log(society, 'You decline a political opening from ' + house.name + '.')
          })
        },
        supportPetition({ houseId }) {
          this.withHouse(houseId, (society, house) => {
            let cost = this.petitionCost(house)
            this.applyStats({ cash: -cost, prestige: 7 })
            house.relation = this.clamp((house.relation || 0) + 18, -100, 100)
            if (Math.random() < 0.35) {
              house.favor = (house.favor || 0) + 1
            }
            this.log(society, 'You hear a petition from ' + house.name + '.')
          })
        },
        refusePetition({ houseId }) {
          this.withHouse(houseId, (society, house) => {
            house.relation = this.clamp((house.relation || 0) - 12, -100, 100)
            this.log(society, 'You refuse a petition from ' + house.name + '.')
          })
        },
        attendFamilyInvitation({ houseId }) {
          this.withHouse(houseId, (society, house) => {
            let cost = this.invitationCost(house)
            this.applyStats({ cash: -cost, prestige: 10 })
            house.relation = this.clamp((house.relation || 0) + 14, -100, 100)
            if (Math.random() < 0.18) {
              house.favor = (house.favor || 0) + 1
            }
            house.lastFamilyEvent = 'Your household attends a public occasion with ' + house.name + '.'
            this.log(society, 'You attend a family occasion with ' + house.name + ': relation ' + this.signed(house.relation) + '.')
          })
        },
        declineFamilyInvitation({ houseId }) {
          this.withHouse(houseId, (society, house) => {
            house.relation = this.clamp((house.relation || 0) - 7, -100, 100)
            house.heat = (house.heat || 0) + 1
            house.lastFamilyEvent = 'Your household declines an invitation from ' + house.name + '.'
            this.log(society, 'You decline an invitation from ' + house.name + ': relation ' + this.signed(house.relation) + '.')
          })
        },
        endorseOffice({ houseId }) {
          this.withHouse(houseId, (society, house) => {
            this.applyStats({ influence: -45, prestige: 10 })
            house.pendingPlayerEvent = false
            house.relation = this.clamp((house.relation || 0) + 14, -100, 100)
            house.power = (house.power || 0) + 10
            house.favor = (house.favor || 0) + 1
            this.log(society, 'You endorse ' + house.name + ' in their campaign for office.')
          })
        },
        honorWedding({ houseId }) {
          this.withHouse(houseId, (society, house) => {
            let cost = this.actionCost(house, 'wedding')
            this.applyStats({ cash: -cost, prestige: 5 })
            house.pendingPlayerEvent = false
            house.relation = this.clamp((house.relation || 0) + 16, -100, 100)
            house.stability = this.clamp((house.stability || 50) + 5, 0, 100)
            this.log(society, 'Your gift honors a wedding alliance in ' + house.name + '.')
          })
        },
        judgeInheritance({ houseId }) {
          this.withHouse(houseId, (society, house) => {
            let success = Math.random() < 0.7
            this.applyStats({ influence: -30, prestige: success ? 12 : -8 })
            house.pendingPlayerEvent = false
            if (success) {
              house.relation = this.clamp((house.relation || 0) + 18, -100, 100)
              house.stability = this.clamp((house.stability || 50) + 12, 0, 100)
              house.favor = (house.favor || 0) + 1
              this.log(society, 'You settle an inheritance dispute inside ' + house.name + '.')
            } else {
              house.relation = this.clamp((house.relation || 0) - 16, -100, 100)
              house.stability = this.clamp((house.stability || 50) - 8, 0, 100)
              this.log(society, 'Your intervention in ' + house.name + '\'s inheritance dispute backfires.')
            }
          })
        },
        investVenture({ houseId, cost, expected, months }) {
          this.withHouse(houseId, (society, house) => {
            let offer = this.ventureOffer(house)
            cost = parseInt(cost || offer.cost, 10)
            expected = parseInt(expected || offer.expected, 10)
            months = parseInt(months || offer.months, 10)
            this.applyStats({ cash: -cost })
            society.pendingVentures = society.pendingVentures || []
            society.pendingVentures.push({
              id: 'venture_' + this.safeId(house.id) + '_' + Date.now() + '_' + this.randomInt(1000, 9999),
              houseId: house.id,
              invested: cost,
              expected,
              due: this.futureMonthKey(months),
              roll: Math.random(),
              notified: false
            })
            house.pendingPlayerEvent = false
            house.relation = this.clamp((house.relation || 0) + 10, -100, 100)
            house.wealth = (house.wealth || 0) + cost
            this.log(society, 'You invest with ' + house.name + ': expected settlement in ' + months + ' months.')
          })
        },
        collectVentureResult({ ventureId }) {
          let society = this.ensure()
          society.pendingVentures = society.pendingVentures || []
          let index = society.pendingVentures.findIndex((venture) => venture && venture.id === ventureId)
          if (index < 0) {
            this.openHub()
            return
          }
          let venture = society.pendingVentures[index]
          let house = society.houses[venture.houseId]
          if (venture.success && venture.payout) {
            this.applyStats({ cash: venture.payout })
            if (house) {
              house.relation = this.clamp((house.relation || 0) + 4, -100, 100)
              house.wealth = (house.wealth || 0) + Math.round(venture.payout / 2)
            }
            this.log(society, 'A trade venture pays your household ' + venture.payout + ' cash.', 'tradeVenture', venture.houseId)
          } else {
            if (house) {
              house.stability = this.clamp((house.stability || 50) - 2, 0, 100)
            }
            this.log(society, 'A trade venture closes without profit.', 'tradeVenture', venture.houseId)
          }
          society.pendingVentures.splice(index, 1)
          this.save(society)
          if (house) {
            this.openHouse({ houseId: house.id })
          } else {
            this.openHub()
          }
        },
        shieldScandal({ houseId }) {
          this.withHouse(houseId, (society, house) => {
            this.applyStats({ influence: -35, prestige: -4 })
            house.pendingPlayerEvent = false
            house.relation = this.clamp((house.relation || 0) + 20, -100, 100)
            house.stability = this.clamp((house.stability || 50) + 8, 0, 100)
            house.favor = (house.favor || 0) + 1
            this.log(society, 'You shield ' + house.name + ' from scandal.')
          })
        },
        exploitScandal({ houseId }) {
          this.withHouse(houseId, (society, house) => {
            this.applyStats({ influence: 50, prestige: 6 })
            house.pendingPlayerEvent = false
            house.relation = this.clamp((house.relation || 0) - 35, -100, 100)
            house.rivalry = house.relation < -45 || house.rivalry
            house.power = Math.max(0, (house.power || 0) - 8)
            this.log(society, 'You exploit scandal in ' + house.name + ' for political advantage.')
          })
        },
        declineFamilyAffair({ houseId, kind }) {
          this.withHouse(houseId, (society, house) => {
            house.pendingPlayerEvent = false
            if (kind === 'tradeVenture') {
              this.log(society, 'You decline a trade venture from ' + house.name + ' without offense.', 'tradeVenture', house.id)
              return
            }
            house.relation = this.clamp((house.relation || 0) - 3, -100, 100)
            this.log(society, 'You avoid becoming involved in ' + house.name + '\'s family affairs.')
          })
        },
        withHouse(houseId, fn) {
          let society = this.ensure()
          let house = society.houses[houseId]
          if (!house) {
            return
          }
          fn(society, house)
          this.save(society)
        },
        actionCost(house, type) {
          let profile = this.strata[house.stratum] || this.strata.plebeian
          let state = daapi.getState()
          let cash = Math.max(0, parseFloat((state.current && state.current.cash) || 0))
          let level = this.socialLevel(house.stratum)
          let floors = [8, 12, 18, 32, 55, 90]
          let baseFloor = floors[level] || 18
          let floor = cash > 0 ? Math.max(1, Math.min(baseFloor, Math.round(cash * 0.25))) : 1
          let base = profile.cost || 200
          let typeFactor = 0.16
          let cashFactor = 0.08
          if (type === 'dinner') {
            typeFactor = 0.34
            cashFactor = 0.16
          }
          if (type === 'reconcile') {
            typeFactor = 0.24
            cashFactor = 0.14
          }
          if (type === 'wedding') {
            typeFactor = 0.12
            cashFactor = 0.10
          }
          if (type === 'venture') {
            typeFactor = 0.22
            cashFactor = 0.18
          }
          let scaled = Math.max(floor, Math.round(base * typeFactor))
          let affordable = cash > 0 ? Math.max(1, Math.round(cash * cashFactor)) : 1
          return Math.max(1, Math.round(Math.min(scaled, affordable, cash > 0 ? Math.max(1, Math.floor(cash)) : 1)))
        },
        petitionCost(house) {
          return Math.max(4, Math.round(this.actionCost(house || {}, 'gift') * 0.45))
        },
        invitationCost(house) {
          return Math.max(5, Math.round(this.actionCost(house || {}, 'gift') * 0.55))
        },
        ventureOffer(house) {
          let profile = this.strata[house.stratum] || this.strata.plebeian
          let cost = this.actionCost(house, 'venture')
          let expected = Math.max(8, Math.round(cost * (0.35 + Math.min(0.65, (profile.revenue || 20) / 120))))
          return {
            cost,
            expected,
            months: this.randomInt(1, 2)
          }
        },
        applyStats(stats) {
          stats = stats || {}
          try {
            if (stats.cash) daapi.addCash({ cash: stats.cash })
            if (stats.influence) daapi.addInfluence({ influence: stats.influence })
            if (stats.prestige) daapi.addPrestige({ prestige: stats.prestige })
          } catch (err) {
            console.warn(err)
            daapi.applyStatChanges({
              cash: stats.cash || 0,
              influence: stats.influence || 0,
              prestige: stats.prestige || 0
            })
          }
        },
        sortedHouses(society) {
          let houses = []
          for (let houseId in society.houses) {
            if (society.houses.hasOwnProperty(houseId)) {
              houses.push(society.houses[houseId])
            }
          }
          return houses.sort((a, b) => {
            if ((b.strength || 0) !== (a.strength || 0)) {
              return (b.strength || 0) - (a.strength || 0)
            }
            return String(a.name || '').localeCompare(String(b.name || ''))
          })
        },
        alliedHouses(society) {
          return this.sortedHouses(society).filter((house) => this.isAlliedHouse(house))
        },
        rivalHouses(society) {
          return this.sortedHouses(society).filter((house) => this.isRivalHouse(house))
        },
        isAlliedHouse(house) {
          return !!(house && ((house.relation || 0) >= 45 || (house.favor || 0) > 0))
        },
        isRivalHouse(house) {
          return !!(house && ((house.relation || 0) <= -35 || house.rivalry))
        },
        houseOptionText(house) {
          let marker = house.rivalry ? 'Rival ' : (house.relation >= 55 ? 'Ally ' : '')
          return marker + house.name + ' (' + this.signed(house.relation || 0) + ')'
        },
        houseTooltip(house) {
          return [
            'Rank: ' + (house.citizenRank || 'Unknown'),
            'Strength: ' + Math.round(house.strength || 0),
            'Wealth: ' + Math.round(house.wealth || 0),
            'Power: ' + Math.round(house.power || 0),
            'Stability: ' + Math.round(house.stability || 0),
            'Favors: ' + (house.favor || 0),
            'Agenda: ' + (house.agenda || 'unknown')
          ].join('\n')
        },
        currentCharacterId(state) {
          let current = (state && state.current) || {}
          if (current.id !== undefined && current.id !== null) return current.id
          if (current.characterId !== undefined && current.characterId !== null) return current.characterId
          if (current.currentCharacterId !== undefined && current.currentCharacterId !== null) return current.currentCharacterId
          if (current.playerCharacterId !== undefined && current.playerCharacterId !== null) return current.playerCharacterId
          return null
        },
        playerFamilyMemberIds(state) {
          state = state || daapi.getState()
          let characters = state.characters || {}
          let current = state.current || {}
          let currentId = this.currentCharacterId(state)
          let player = characters[currentId] || {}
          let dynastyId = player.dynastyId
          let seen = {}
          let ids = []
          let add = (characterId) => {
            if (characterId === undefined || characterId === null || characterId === '' || seen[characterId]) {
              return
            }
            seen[characterId] = true
            ids.push(characterId)
          }
          add(currentId)
          ;[
            current.householdCharacterIds,
            current.formerHouseholdCharacterIds,
            current.familyCharacterIds,
            current.dependantCharacterIds,
            current.dependentCharacterIds
          ].forEach((list) => {
            ;(list || []).forEach(add)
          })
          let addRelations = (character) => {
            if (!character) {
              return
            }
            add(character.fatherId)
            add(character.motherId)
            add(character.spouseId)
            ;(character.childrenIds || []).forEach(add)
            ;(character.siblingIds || []).forEach(add)
            ;(character.dependantIds || []).forEach(add)
            ;(character.dependentIds || []).forEach(add)
          }
          addRelations(player)
          for (let characterId in characters) {
            if (!characters.hasOwnProperty(characterId)) {
              continue
            }
            let character = characters[characterId]
            if (!character || character.isDead) {
              continue
            }
            if (dynastyId && character.dynastyId === dynastyId) {
              add(character.id || characterId)
              addRelations(character)
            } else if (
              character.fatherId === currentId ||
              character.motherId === currentId ||
              (player.childrenIds || []).indexOf(character.id || characterId) >= 0
            ) {
              add(character.id || characterId)
              addRelations(character)
            }
          }
          return ids.filter((characterId) => {
            let character = characters[characterId]
            return character && !character.isDead
          })
        },
        playerFamilyMembers(state) {
          state = state || daapi.getState()
          let characters = state.characters || {}
          return this.playerFamilyMemberIds(state)
            .map((characterId) => characters[characterId])
            .filter((character) => character && !character.isDead)
        },
        playerMarriageCandidates(state) {
          state = state || daapi.getState()
          let candidates = []
          this.playerFamilyMemberIds(state).forEach((characterId) => {
            let character = state.characters[characterId]
            if (this.isMarriageEligible(character, state)) {
              if (character.id === undefined || character.id === null) {
                character.id = characterId
              }
              candidates.push(character)
            }
          })
          return candidates.sort((a, b) => this.age(a, state) - this.age(b, state))
        },
        marriageOptionInfo(society, state, house) {
          let playerStratum = this.playerStratum(state)
          let diff = this.socialLevel(house.stratum) - this.socialLevel(playerStratum)
          let candidates = this.playerMarriageCandidates(state)
          let required = this.marriageRelationRequirement(diff)
          let relation = house.relation || 0
          let notes = []
          let tooltip = [
            'Player order: ' + this.stratumTitle(playerStratum),
            'Target order: ' + this.stratumTitle(house.stratum),
            'Relation: ' + this.signed(relation),
            'Unmarried adult family members: ' + candidates.length
          ]
          if (!candidates.length) {
            notes.push('no adult')
            tooltip.push('No unmarried adult in your family was found.')
          }
          if (diff < -1) {
            notes.push('too low')
            tooltip.push('This house is more than one order below you.')
          }
          if (diff > 2) {
            notes.push('too high')
            tooltip.push('This house is more than two orders above you.')
          }
          if (diff <= 2 && diff >= -1 && relation < required) {
            notes.push('need ' + required + ' rel')
            tooltip.push('This rank gap requires relation ' + required + ' or higher.')
          }
          if (!notes.length) {
            tooltip.push('If this house lacks a visible eligible spouse, Society can introduce one.')
          }
          return {
            available: notes.length === 0,
            note: notes.slice(0, 2).join(', '),
            tooltip: tooltip.join('\n'),
            playerStratum,
            diff,
            required
          }
        },
        houseMarriageCandidates(house, state, matchCharacter) {
          let candidates = []
          this.visibleHousePeople(house, state).forEach((characterId) => {
            let character = state.characters[characterId]
            if (!this.isMarriageEligible(character, state)) {
              return
            }
            if (character.id === undefined || character.id === null) {
              character.id = characterId
            }
            if (matchCharacter && !this.isMarriageCompatible(matchCharacter, character)) {
              return
            }
            candidates.push(character)
          })
          return candidates.sort((a, b) => this.characterScore(b, state) - this.characterScore(a, state))
        },
        playerStratum(state) {
          return this.playerSocietyStatus(state).stratum
        },
        syncPlayerSocietyStatus(society, state) {
          society.playerStatus = this.playerSocietyStatus(state)
        },
        playerSocietyStatus(state) {
          state = state || daapi.getState()
          let currentId = this.currentCharacterId(state)
          let player = (state.characters && state.characters[currentId]) || {}
          let dynastyId = player.dynastyId || (state.current && state.current.dynastyId)
          let dynasty = (state.dynasties && state.dynasties[dynastyId]) || {}
          let members = this.playerFamilyMembers(state)
          let heritage = this.normalizedHeritage(dynasty.heritage || player.heritage || '')
          let currentClass = this.safeCurrentClass(state)
          let wealth = this.playerWealthValue(state)
          let hasSenate = members.some((character) => this.isSenatorialCharacter(character, state))
          let stratum = this.stratumFromPlayerClass(currentClass, heritage, hasSenate, state)
          return {
            stratum,
            title: this.playerStatusTitle(stratum, heritage),
            heritage,
            currentClass,
            className: this.currentClassName(currentClass),
            wealth
          }
        },
        stratumFromPlayerClass(currentClass, heritage, hasSenate, state) {
          let senatorialFlag = !!(state && state.current && state.current.flagIsSenetorialClass)
          if (senatorialFlag || hasSenate || currentClass >= 7) {
            return 'senatorial'
          }
          if (currentClass >= 6) {
            return 'equestrian'
          }
          if (currentClass >= 4) {
            return 'civic'
          }
          if (currentClass >= 1) {
            if (heritage === 'roman_freedman') {
              return 'freedmen'
            }
            if (heritage === 'roman_novus_homo' && currentClass >= 3) {
              return 'civic'
            }
            return 'plebeian'
          }
          if (heritage === 'roman_freedman') {
            return 'freedmen'
          }
          if (heritage === 'roman_novus_homo' && currentClass >= 3) {
            return 'civic'
          }
          return 'poor'
        },
        playerStatusTitle(stratum, heritage) {
          if (stratum === 'senatorial') return 'Senatorial Roman Citizen'
          if (stratum === 'equestrian') return 'Equestrian Roman Citizen'
          if (stratum === 'civic') return heritage === 'roman_novus_homo' ? 'Novus Homo Civic Roman Citizen' : 'Civic Roman Citizen'
          if (stratum === 'plebeian') return heritage === 'roman_novus_homo' ? 'Novus Homo Plebeian Roman Citizen' : 'Plebeian Roman Citizen'
          if (stratum === 'freedmen') return 'Freedman Roman Citizen'
          return 'Proletarii Roman Citizen'
        },
        playerStatusText(state) {
          let status = this.playerSocietyStatus(state)
          let classText = status.className ? ' (' + status.className + ')' : ''
          return status.title + classText
        },
        playerStatusKey(state) {
          let status = this.playerSocietyStatus(state)
          return [
            status.stratum,
            status.heritage,
            status.currentClass === null ? 'none' : status.currentClass,
            status.className || '',
            !!(state && state.current && state.current.flagIsSenetorialClass)
          ].join(':')
        },
        currentClassName(currentClass) {
          let names = ['Proletarii', 'Class V', 'Class IV', 'Class III', 'Class II', 'Class I', 'Equites', 'Senatores']
          return names[currentClass] || ''
        },
        normalizedHeritage(heritage) {
          return String(heritage || '').toLowerCase()
        },
        safeCurrentClass(state) {
          state = state || daapi.getState()
          if (state && state.current && state.current.flagIsSenetorialClass) {
            return 7
          }
          try {
            if (typeof daapi !== 'undefined' && daapi.calculateCurrentClass) {
              let currentClass = parseInt(daapi.calculateCurrentClass(), 10)
              return isNaN(currentClass) ? null : currentClass
            }
          } catch (err) {
            console.warn(err)
          }
          let wealth = this.playerWealthValue(state)
          if (wealth < 1100) return 0
          if (wealth < 2500) return 1
          if (wealth < 5000) return 2
          if (wealth < 7500) return 3
          if (wealth < 10000) return 4
          if (wealth < 25000) return 5
          return 6
        },
        playerWealthValue(state) {
          let current = (state && state.current) || {}
          let wealth = parseFloat(current.cash || 0)
          let details = current.propertyDetails || current.property || {}
          return wealth + this.propertyValue(details)
        },
        propertyValue(details) {
          let values = {
            farmland: 250,
            vinyard: 360,
            vineyard: 360,
            orchard: 420,
            primeFarmland: 2700,
            primeVinyard: 3300,
            primeVineyard: 3300,
            primeOrchard: 3900,
            latifundiumFood: 11000,
            latifundiumAnimal: 14000,
            latifundiumFish: 17000,
            latifundiumOil: 21000,
            insulae: 4500,
            fishingBoat: 41,
            tradeships: 630,
            seafaringTradeships: 7500,
            horse: 125,
            donkey: 28,
            pig: 26,
            goat: 32,
            sheep: 36,
            cattle: 40,
            duck: 15,
            chicken: 10
          }
          let total = 0
          Object.keys(values).forEach((key) => {
            total += parseFloat(details[key] || 0) * values[key]
          })
          return total
        },
        socialLevel(stratum) {
          let levels = {
            poor: 0,
            freedmen: 1,
            plebeian: 2,
            civic: 3,
            equestrian: 4,
            senatorial: 5
          }
          return levels[stratum] === undefined ? 2 : levels[stratum]
        },
        stratumTitle(stratum) {
          return (this.strata[stratum] && this.strata[stratum].title) || stratum || 'Unknown'
        },
        marriageRelationRequirement(diff) {
          if (diff >= 2) return 80
          if (diff === 1) return 35
          if (diff === 0) return 0
          return -10
        },
        marriageEffects(state, house) {
          let diff = this.socialLevel(house.stratum) - this.socialLevel(this.playerStratum(state))
          let profile = this.strata[house.stratum] || this.strata.plebeian
          let cost = this.actionCost(house, 'wedding')
          if (diff >= 2) {
            return {
              stats: { cash: -Math.round(cost * 2.2), prestige: 70, influence: 150 },
              revenue: Math.max(8, Math.round((profile.revenue || 30) * 0.35)),
              relation: 32,
              summary: 'Marriage far above your station: prestige and influence rise sharply, but the wedding is expensive.'
            }
          }
          if (diff === 1) {
            return {
              stats: { cash: -Math.round(cost * 1.45), prestige: 38, influence: 85 },
              revenue: Math.max(5, Math.round((profile.revenue || 30) * 0.25)),
              relation: 26,
              summary: 'Marriage upward: your standing improves and the alliance opens useful doors.'
            }
          }
          if (diff === 0) {
            return {
              stats: { cash: -cost, prestige: 16, influence: 35 },
              revenue: Math.max(3, Math.round((profile.revenue || 30) * 0.15)),
              relation: 22,
              summary: 'Marriage within your order: a stable alliance strengthens both households.'
            }
          }
          return {
            stats: { cash: -Math.round(cost * 0.55), prestige: -8, influence: 18 },
            revenue: Math.max(2, Math.round((profile.revenue || 20) * 0.18)),
            relation: 30,
            summary: 'Marriage downward: some elite standing is lost, but local loyalty and practical support improve.'
          }
        },
        isMarriageEligible(character, state) {
          if (!character || character.isDead || character.spouseId) {
            return false
          }
          let age = this.age(character, state)
          if (age < 16 || age > 60) {
            return false
          }
          if (character.flagCannotMarry) {
            return false
          }
          return true
        },
        isMarriageCompatible(first, second) {
          if (!first || !second || first.id === second.id || first.dynastyId === second.dynastyId) {
            return false
          }
          return this.characterIsMale(first) !== this.characterIsMale(second)
        },
        characterIsMale(character) {
          if (!character) {
            return false
          }
          if (character.gender) {
            return character.gender === 'male'
          }
          return !!character.isMale
        },
        ensureCrests(society, state) {
          society.crests = society.crests || {}
          society.crestSettings = { playerOverlay: true, ...(society.crestSettings || {}) }
          this.ensurePlayerCrest(society, state)
          for (let houseId in society.houses) {
            if (society.houses.hasOwnProperty(houseId)) {
              this.ensureHouseCrest(society, society.houses[houseId])
            }
          }
        },
        playerCrestId(state) {
          let currentId = this.currentCharacterId(state)
          let character = state.characters[currentId] || {}
          return 'player_' + this.safeId(character.dynastyId || currentId || 'house')
        },
        ensurePlayerCrest(society, state) {
          society.crests = society.crests || {}
          let crestId = this.playerCrestId(state)
          let character = state.characters[this.currentCharacterId(state)] || {}
          let dynasty = state.dynasties[character.dynastyId] || {}
          if (!society.crests[crestId]) {
            society.crests[crestId] = this.generateCrest('player-' + crestId + '-' + this.houseName(dynasty, character.dynastyId || crestId))
          }
          society.playerCrestId = crestId
          return society.crests[crestId]
        },
        ensureHouseCrest(society, house) {
          society.crests = society.crests || {}
          let crestId = 'house_' + this.safeId((house && house.id) || (house && house.name) || 'unknown')
          if (!society.crests[crestId]) {
            society.crests[crestId] = this.generateCrest(crestId + '-' + ((house && house.name) || '') + '-' + ((house && house.stratum) || ''))
          }
          if (house) {
            house.crestId = crestId
          }
          return society.crests[crestId]
        },
        houseCrestIcon(society, house) {
          let crest = this.ensureHouseCrest(society, house)
          return this.crestIcon(crest, 112)
        },
        crestCycleOption(label, part, crest) {
          return {
            text: label + ': ' + this.crestLabel(part, crest[part]),
            tooltip: 'Cycle ' + label.toLowerCase() + '.',
            action: {
              event: this.event,
              method: 'cyclePlayerCrest',
              context: { part }
            }
          }
        },
        crestLabel(part, value) {
          if (!value) {
            return 'none'
          }
          return String(value)
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, (letter) => letter.toUpperCase())
        },
        crestList(part) {
          if (part === 'field') return this.crestFields
          if (part === 'metal') return this.crestMetals
          if (part === 'accent') return this.crestAccents
          if (part === 'shape') return this.crestShapes
          if (part === 'division') return this.crestDivisions
          if (part === 'pattern') return this.crestPatterns
          if (part === 'charge') return this.crestCharges
          if (part === 'border') return this.crestBorders
          return []
        },
        generateCrest(seedText) {
          let random = this.seededRandom(seedText)
          let pickSeeded = (list) => {
            return list[Math.floor(random() * list.length) % list.length]
          }
          let field = pickSeeded(this.crestFields)
          let metal = pickSeeded(this.crestMetals)
          let accent = pickSeeded(this.crestAccents.filter((color) => color !== field))
          let charge = pickSeeded(this.crestCharges)
          return {
            version: 1,
            seed: String(seedText || ''),
            shape: pickSeeded(this.crestShapes),
            field,
            metal,
            accent,
            division: pickSeeded(this.crestDivisions),
            pattern: pickSeeded(this.crestPatterns),
            charge,
            border: pickSeeded(this.crestBorders),
            mark: pickSeeded(this.crestMarks)
          }
        },
        crestIcon(crest, size) {
          return this.svgDataUri(this.crestSvg(crest, size || 112))
        },
        crestColor(name) {
          return this.crestPalette[name] || this.crestPalette.crimson
        },
        crestSvg(crest, size) {
          crest = crest || this.generateCrest('fallback')
          let field = this.crestColor(crest.field)
          let metal = this.crestColor(crest.metal)
          let accent = this.crestColor(crest.accent)
          let edge = '#151316'
          let path = this.crestShapePath(crest.shape)
          let svg = ''
          svg += '<svg xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + Math.round(size * 1.15) + '" viewBox="0 0 96 112">'
          svg += '<defs><clipPath id="shieldClip"><path d="' + path + '"/></clipPath>'
          svg += '<filter id="shadow" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="3" stdDeviation="2" flood-color="#000" flood-opacity=".35"/></filter></defs>'
          svg += '<rect width="96" height="112" fill="none"/>'
          svg += '<g filter="url(#shadow)">'
          svg += '<path d="' + path + '" fill="' + field + '" stroke="' + edge + '" stroke-width="3"/>'
          svg += '<g clip-path="url(#shieldClip)">'
          svg += this.crestDivisionSvg(crest.division, field, metal, accent)
          svg += this.crestPatternSvg(crest.pattern, metal, accent)
          svg += '</g>'
          svg += this.crestChargeSvg(crest.charge, metal, accent, crest.mark)
          svg += this.crestBorderSvg(crest.border, path, metal, accent)
          svg += '</g></svg>'
          return svg
        },
        crestShapePath(shape) {
          if (shape === 'oval') return 'M48 8 C70 10 84 26 84 50 C84 80 66 101 48 106 C30 101 12 80 12 50 C12 26 26 10 48 8 Z'
          if (shape === 'round') return 'M48 10 C70 10 86 27 86 51 C86 77 69 96 48 104 C27 96 10 77 10 51 C10 27 26 10 48 10 Z'
          if (shape === 'vexillum') return 'M14 12 H82 V82 L66 74 L48 90 L30 74 L14 82 Z'
          if (shape === 'kite') return 'M48 6 L82 22 V58 C82 80 62 98 48 108 C34 98 14 80 14 58 V22 Z'
          if (shape === 'hex') return 'M30 10 H66 L86 30 V74 L48 106 L10 74 V30 Z'
          return 'M16 10 H80 C84 22 86 36 84 52 C82 78 66 98 48 106 C30 98 14 78 12 52 C10 36 12 22 16 10 Z'
        },
        crestDivisionSvg(division, field, metal, accent) {
          if (division === 'pale') return '<rect x="48" y="0" width="48" height="112" fill="' + metal + '"/>'
          if (division === 'fess') return '<rect x="0" y="50" width="96" height="62" fill="' + metal + '"/>'
          if (division === 'bend') return '<path d="M-8 88 L78 2 H106 L18 112 Z" fill="' + metal + '"/>'
          if (division === 'bendSinister') return '<path d="M-10 4 H20 L106 90 V116 Z" fill="' + metal + '"/>'
          if (division === 'quartered') return '<rect x="48" y="0" width="48" height="56" fill="' + metal + '"/><rect x="0" y="56" width="48" height="56" fill="' + metal + '"/>'
          if (division === 'chief') return '<rect x="0" y="0" width="96" height="30" fill="' + metal + '"/>'
          if (division === 'chevron') return '<path d="M0 76 L48 28 L96 76 L96 96 L48 48 L0 96 Z" fill="' + metal + '"/>'
          if (division === 'saltire') return '<path d="M-6 8 L8 -6 L102 98 L88 112 Z M88 -6 L102 8 L8 112 L-6 98 Z" fill="' + metal + '"/>'
          if (division === 'orle') return '<path d="M22 20 H74 C78 32 78 45 76 56 C73 78 60 91 48 97 C36 91 23 78 20 56 C18 45 18 32 22 20 Z" fill="none" stroke="' + metal + '" stroke-width="9"/>'
          return '<path d="M0 0 H96 V112 H0 Z" fill="' + field + '"/><path d="M12 20 H84" stroke="' + accent + '" stroke-opacity=".35" stroke-width="2"/>'
        },
        crestPatternSvg(pattern, metal, accent) {
          if (pattern === 'dots') {
            let dots = ''
            for (let y = 22; y < 92; y += 18) {
              for (let x = 24; x < 78; x += 18) {
                dots += '<circle cx="' + x + '" cy="' + y + '" r="2.6" fill="' + accent + '" opacity=".65"/>'
              }
            }
            return dots
          }
          if (pattern === 'bars') return '<path d="M10 28 H86 M8 48 H88 M8 68 H88 M12 88 H84" stroke="' + accent + '" stroke-width="4" opacity=".5"/>'
          if (pattern === 'waves') return '<path d="M4 36 C18 25 30 47 44 36 C58 25 70 47 92 34 M4 60 C18 49 30 71 44 60 C58 49 70 71 92 58 M4 84 C18 73 30 95 44 84 C58 73 70 95 92 82" fill="none" stroke="' + accent + '" stroke-width="3" opacity=".55"/>'
          if (pattern === 'rays') return '<path d="M48 56 L48 -10 M48 56 L104 10 M48 56 L108 56 M48 56 L102 104 M48 56 L48 122 M48 56 L-6 104 M48 56 L-12 56 M48 56 L-8 10" stroke="' + accent + '" stroke-width="4" opacity=".35"/>'
          if (pattern === 'tiles') return '<path d="M0 30 H96 M0 54 H96 M0 78 H96 M24 0 V112 M48 0 V112 M72 0 V112" stroke="' + accent + '" stroke-width="2" opacity=".35"/>'
          return ''
        },
        crestChargeSvg(charge, metal, accent, mark) {
          let stroke = ' stroke="' + accent + '" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"'
          if (charge === 'spqr') return '<text x="48" y="61" text-anchor="middle" font-family="serif" font-size="22" font-weight="700" fill="' + metal + '" stroke="' + accent + '" stroke-width="1">SPQR</text>'
          if (charge === 'aquila') return '<path d="M48 26 L56 44 L78 36 L62 55 L76 68 L55 65 L48 86 L41 65 L20 68 L34 55 L18 36 L40 44 Z" fill="' + metal + '" stroke="' + accent + '" stroke-width="3" stroke-linejoin="round"/><circle cx="48" cy="40" r="5" fill="' + accent + '"/>'
          if (charge === 'laurel') return '<path d="M35 78 C22 58 25 36 42 24 M61 78 C74 58 71 36 54 24" fill="none"' + stroke + '/><path d="M33 68 L23 65 M31 58 L21 54 M31 47 L22 42 M38 34 L30 28 M63 68 L73 65 M65 58 L75 54 M65 47 L74 42 M58 34 L66 28" fill="none"' + stroke + '/><text x="48" y="61" text-anchor="middle" font-family="serif" font-size="15" font-weight="700" fill="' + metal + '">' + this.escapeSvg(mark || 'I') + '</text>'
          if (charge === 'thunderbolt') return '<path d="M55 20 L30 58 H47 L39 92 L68 48 H50 Z" fill="' + metal + '" stroke="' + accent + '" stroke-width="3" stroke-linejoin="round"/>'
          if (charge === 'standard') return '<path d="M48 22 V88 M35 30 H68 V48 H35 Z M31 68 H65" fill="none"' + stroke + '/><circle cx="48" cy="20" r="6" fill="' + metal + '" stroke="' + accent + '" stroke-width="3"/>'
          if (charge === 'column') return '<path d="M35 34 H61 M32 78 H64 M38 34 V78 M48 34 V78 M58 34 V78 M30 28 H66 L60 20 H36 Z M28 86 H68 L62 78 H34 Z" fill="none"' + stroke + '/>'
          if (charge === 'sun') return '<circle cx="48" cy="56" r="16" fill="' + metal + '" stroke="' + accent + '" stroke-width="3"/><path d="M48 23 V33 M48 79 V91 M15 56 H28 M68 56 H81 M25 33 L34 42 M62 70 L71 79 M71 33 L62 42 M34 70 L25 79" fill="none"' + stroke + '/>'
          if (charge === 'crescent') return '<path d="M58 26 C40 35 34 58 46 78 C34 74 24 62 24 48 C24 32 39 20 58 26 Z" fill="' + metal + '" stroke="' + accent + '" stroke-width="3" stroke-linejoin="round"/>'
          if (charge === 'star') return '<path d="M48 22 L56 45 L80 45 L60 59 L68 84 L48 69 L28 84 L36 59 L16 45 L40 45 Z" fill="' + metal + '" stroke="' + accent + '" stroke-width="3" stroke-linejoin="round"/>'
          if (charge === 'scales') return '<path d="M48 28 V78 M30 40 H66 M36 40 L25 63 H47 Z M60 40 L49 63 H71 Z M36 82 H60" fill="none"' + stroke + '/>'
          if (charge === 'ship') return '<path d="M22 68 C32 82 64 82 76 68 Z M34 68 V30 L62 48 H34" fill="' + metal + '" stroke="' + accent + '" stroke-width="3" stroke-linejoin="round"/><path d="M31 74 H66" fill="none"' + stroke + '/>'
          if (charge === 'spear') return '<path d="M48 22 V88 M48 20 L39 38 H57 Z M34 62 H62" fill="none"' + stroke + '/>'
          if (charge === 'tower') return '<path d="M31 82 V41 H38 V31 H45 V41 H52 V31 H59 V41 H66 V82 Z M41 82 V65 C41 55 55 55 55 65 V82" fill="' + metal + '" stroke="' + accent + '" stroke-width="3" stroke-linejoin="round"/>'
          if (charge === 'hand') return '<path d="M37 76 V44 C37 39 44 39 44 44 V58 V36 C44 31 51 31 51 36 V58 V42 C51 37 58 37 58 42 V60 L63 52 C66 47 72 51 69 57 L58 81 C54 89 40 87 37 76 Z" fill="' + metal + '" stroke="' + accent + '" stroke-width="3" stroke-linejoin="round"/>'
          return '<circle cx="48" cy="56" r="20" fill="' + metal + '" stroke="' + accent + '" stroke-width="4"/>'
        },
        crestBorderSvg(border, path, metal, accent) {
          if (border === 'double') return '<path d="' + path + '" fill="none" stroke="' + metal + '" stroke-width="7"/><path d="' + path + '" fill="none" stroke="' + accent + '" stroke-width="3"/>'
          if (border === 'bossed') return '<path d="' + path + '" fill="none" stroke="' + metal + '" stroke-width="5"/><circle cx="24" cy="23" r="3" fill="' + accent + '"/><circle cx="72" cy="23" r="3" fill="' + accent + '"/><circle cx="18" cy="57" r="3" fill="' + accent + '"/><circle cx="78" cy="57" r="3" fill="' + accent + '"/><circle cx="48" cy="98" r="3" fill="' + accent + '"/>'
          if (border === 'laurel') return '<path d="' + path + '" fill="none" stroke="' + metal + '" stroke-width="4"/><path d="M20 30 C31 43 31 72 47 96 M76 30 C65 43 65 72 49 96" fill="none" stroke="' + accent + '" stroke-width="3" opacity=".8"/>'
          if (border === 'rivets') return '<path d="' + path + '" fill="none" stroke="' + metal + '" stroke-width="4"/><circle cx="28" cy="19" r="2.4" fill="' + metal + '"/><circle cx="48" cy="16" r="2.4" fill="' + metal + '"/><circle cx="68" cy="19" r="2.4" fill="' + metal + '"/><circle cx="22" cy="50" r="2.4" fill="' + metal + '"/><circle cx="74" cy="50" r="2.4" fill="' + metal + '"/><circle cx="48" cy="94" r="2.4" fill="' + metal + '"/>'
          return '<path d="' + path + '" fill="none" stroke="' + metal + '" stroke-width="5"/>'
        },
        svgDataUri(svg) {
          try {
            if (typeof window !== 'undefined' && window.btoa) {
              return 'data:image/svg+xml;base64,' + window.btoa(svg)
            }
          } catch (err) {
            console.warn(err)
          }
          return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg)
        },
        hashString(value) {
          let hash = 2166136261
          value = String(value || '')
          for (let i = 0; i < value.length; i++) {
            hash ^= value.charCodeAt(i)
            hash = Math.imul(hash, 16777619)
          }
          return hash >>> 0
        },
        seededRandom(seedText) {
          let seed = this.hashString(seedText) || 1
          return () => {
            seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0
            return seed / 4294967296
          }
        },
        escapeSvg(value) {
          return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
        },
        characterName(character, state) {
          let dynasty = state.dynasties[character.dynastyId] || {}
          return (character.praenomen || 'Unknown') + ', ' + this.houseName(dynasty, character.dynastyId)
        },
        characterTooltip(character, state) {
          let age = this.age(character, state)
          let skills = character.skills || {}
          return [
            'Age: ' + age,
            'Job: ' + (character.job || 'none') + ' ' + (character.jobLevel || 0),
            'Skills: I ' + Math.round(skills.intelligence || 0) + ', S ' + Math.round(skills.stewardship || 0) + ', E ' + Math.round(skills.eloquence || 0) + ', C ' + Math.round(skills.combat || 0)
          ].join('\n')
        },
        vanillaPortraitAsset(path) {
          path = String(path || '').replace(/^\.\//, '').replace(/^\/+/, '')
          return this.vanillaPortraitAssets[path] || ''
        },
        characterPortrait(character, state, house) {
          if (character && character.corSocietyOutfit) {
            return this.characterPortraitWithOutfit(character, state, character.corSocietyOutfit)
          }
          let portrait = this.vanillaCharacterPortrait(character, state)
          if (this.isImageData(portrait)) {
            return portrait
          }
          return this.genericVanillaCharacterPortrait(character, state)
        },
        isSocietyGeneratedCharacter(character, house) {
          return !!(
            character &&
            (character.corSocietyGenerated || (house && house.generated))
          )
        },
        vanillaCharacterPortrait(character, state) {
          try {
            character = character || {}
            let look = character.look || {}
            if ((look.group === 'cor_society' || look.group === this.wardrobeLookGroup) && character.corSocietyOriginalLook) {
              look = character.corSocietyOriginalLook
            }
            let age = this.age(character, state || daapi.getState())
            let gender = character.gender || look.gender || (character.isMale ? 'male' : 'female')
            let ageStage = look.ageStage || this.characterAgeStage(age)
            let group = look.group || 'roman'
            let type = look.type || 'brown'
            let portrait = false
            if (look.isDAAPI && daapi.getCharacterIcon) {
              portrait = daapi.getCharacterIcon({
                group,
                gender,
                type,
                ageStage
              })
            } else {
              portrait = this.vanillaPortraitAsset('icons/characters/' + group + '/' + type + '/' + gender + '/' + ageStage + '.svg')
            }
            if (this.isImageData(portrait)) {
              return portrait
            }
          } catch (err) {
            console.warn(err)
          }
          return false
        },
        genericVanillaCharacterPortrait(character, state) {
          try {
            character = character || {}
            let look = character.look || {}
            let age = this.age(character, state || daapi.getState())
            let gender = character.gender || look.gender || (character.isMale ? 'male' : 'female')
            gender = gender === 'female' ? 'female' : 'male'
            let ageStage = look.ageStage || this.characterAgeStage(age)
            let suffix = ageStage === 'adult' ? '' : '_' + ageStage
            return this.vanillaPortraitAsset('icons/characters/' + gender + suffix + '.svg')
          } catch (err) {
            console.warn(err)
          }
          return ''
        },
        nativeCharacterPortraitWithOutfit(character, state, house, outfit) {
          state = state || daapi.getState()
          character = character || {}
          let baseLook = character.corSocietyOriginalLook || character.look || {}
          if (baseLook.group === 'cor_society' || baseLook.group === this.wardrobeLookGroup) {
            baseLook = character.corSocietyOriginalLook || {}
          }
          if (!outfit || outfit === 'auto') {
            let baseCharacter = { ...character, corSocietyOutfit: '', look: baseLook }
            return this.vanillaCharacterPortrait(baseCharacter, state) || this.genericVanillaCharacterPortrait(baseCharacter, state)
          }
          let gender = (character.gender || baseLook.gender || (character.isMale ? 'male' : 'female')) === 'female' ? 'female' : 'male'
          let ageStage = baseLook.ageStage || this.characterAgeStage(this.age(character, state))
          return this.wardrobePortraitDataUri(character, state, outfit, baseLook, gender, ageStage)
        },
        inlineImageHref(value) {
          value = this.imageHref(value)
          if (!value) {
            return ''
          }
          if (value.indexOf('data:image/') === 0) {
            return value
          }
          this.inlineImageCache = this.inlineImageCache || {}
          if (this.inlineImageCache[value]) {
            return this.inlineImageCache[value]
          }
          this.preloadInlineImage(value)
          return ''
        },
        preloadInlineImage(value) {
          if (!value || typeof fetch === 'undefined') {
            return
          }
          let requestUrl = this.absoluteImageHref(value)
          if (!requestUrl) {
            return
          }
          this.inlineImagePending = this.inlineImagePending || {}
          if (this.inlineImagePending[value]) {
            return
          }
          this.inlineImagePending[value] = true
          fetch(requestUrl)
            .then((response) => response.text())
            .then((text) => {
              this.inlineImageCache = this.inlineImageCache || {}
              this.inlineImageCache[value] = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(text)
              delete this.inlineImagePending[value]
              if (typeof window !== 'undefined' && window.corSociety) {
                window.setTimeout(() => {
                  try {
                    window.corSociety.applyPortraitOverlays()
                  } catch (err) {
                    console.warn(err)
                  }
                }, 50)
              }
            })
            .catch((err) => {
              delete this.inlineImagePending[value]
              console.warn(err)
            })
        },
        imageHref(value) {
          value = String(value || '')
          if (/^[A-Za-z0-9+/=]+$/.test(value.slice(0, 160)) && value.length > 120) {
            return 'data:image/svg+xml;base64,' + value
          }
          return value
        },
        absoluteImageHref(value) {
          value = this.imageHref(value)
          if (!value || value.indexOf('data:image/') === 0 || value.indexOf('http') === 0 || value.indexOf('blob:') === 0) {
            return value
          }
          try {
            if (typeof document !== 'undefined' && document.baseURI) {
              return new URL(value, document.baseURI).href
            }
            if (typeof window !== 'undefined' && window.location && window.location.href) {
              return new URL(value, window.location.href).href
            }
          } catch (err) {
            return value
          }
          return value
        },
        svgTextFromDataUri(value) {
          value = String(value || '')
          if (value.indexOf('data:image/svg+xml') !== 0) {
            return ''
          }
          let commaIndex = value.indexOf(',')
          if (commaIndex < 0) {
            return ''
          }
          let meta = value.slice(0, commaIndex)
          let body = value.slice(commaIndex + 1)
          try {
            if (meta.indexOf(';base64') > -1 && typeof atob !== 'undefined') {
              return atob(body)
            }
            return decodeURIComponent(body)
          } catch (err) {
            console.warn(err)
            return ''
          }
        },
        wardrobePalette(outfit, gender, ageStage, role) {
          let palettes = {
            senatorToga: { base: '#f6efe3', shade: '#d7cab6', highlight: '#fffaf0', accent: '#8b1f35' },
            togaPraetexta: { base: '#f4ead9', shade: '#d2c1a8', highlight: '#fff8eb', accent: '#7b2140' },
            togaCandida: { base: '#fff9ee', shade: '#e4d7c2', highlight: '#ffffff', accent: '#c7b38e' },
            whiteToga: { base: '#f5eadb', shade: '#d8c9b2', highlight: '#fffaf2', accent: '#b99964' },
            citizenToga: { base: '#e7d8bf', shade: '#c3a879', highlight: '#f4ead8', accent: '#a57937' },
            equestrianTunic: { base: '#efe1cb', shade: '#c7a66f', highlight: '#f8eddb', accent: '#263f73' },
            mantle: { base: '#c3924a', shade: '#8b5d2f', highlight: '#d8af62', accent: '#6b3f24' },
            simpleTunic: { base: '#d0b17b', shade: '#9b7243', highlight: '#dfc58f', accent: '#6e4d30' },
            workerTunic: { base: '#a47a4b', shade: '#6e472c', highlight: '#bc9061', accent: '#4f2e1f' },
            brownMantle: { base: '#7e5736', shade: '#553420', highlight: '#9b7048', accent: '#3f2a1f' },
            militaryCloak: { base: '#9f2525', shade: '#68191b', highlight: '#bd4938', accent: '#d6aa3c' },
            armoredTunic: { base: '#9fa3a2', shade: '#6d7173', highlight: '#d2d0c9', accent: '#8f7c59' },
            redMantle: { base: '#a62624', shade: '#65161a', highlight: '#c74d3b', accent: '#cfa35b' },
            stola: { base: '#d9bf87', shade: '#aa7f4d', highlight: '#ead3a0', accent: '#8f5f35' },
            whiteStola: { base: '#f3ead8', shade: '#d4c3a7', highlight: '#fff8ec', accent: '#b99359' },
            palla: { base: '#bd8d4b', shade: '#86562f', highlight: '#d4aa67', accent: '#744d2b' },
            purplePalla: { base: '#6e345d', shade: '#3f1f3c', highlight: '#926f9f', accent: '#d6aa3c' },
            childStola: { base: '#dec58f', shade: '#b28a58', highlight: '#ead9ad', accent: '#9d7340' },
            childTunic: { base: '#d0b17b', shade: '#9b7243', highlight: '#dfc58f', accent: '#836038' }
          }
          if (ageStage === 'baby') {
            return { base: '#efe7d5', shade: '#d6c7aa', highlight: '#fff7e8', accent: '#b9945d' }
          }
          return palettes[outfit] || (role === 'senatorial' ? palettes.senatorToga : role === 'worker' ? palettes.workerTunic : palettes.citizenToga)
        },
        recolorWardrobeSvgText(svg, outfit, gender, ageStage, role) {
          let palette = this.wardrobePalette(outfit, gender, ageStage, role)
          let viewBox = this.svgViewBoxSize(svg)
          let protectedSkinColors = this.svgProtectedSkinColors(svg, viewBox)
          let colorMap = {}
          let elementIndex = 0
          return String(svg || '').replace(/<(path|rect|ellipse|circle|polygon|polyline|line)\b[^>]*(?:fill|stroke)="#[0-9a-fA-F]{3,6}"[^>]*>/g, (tag) => {
            let bounds = this.svgPaintElementBounds(tag)
            if (!this.isWardrobePaintRegion(bounds, viewBox)) {
              return tag
            }
            return this.recolorWardrobePaintTag(tag, bounds, viewBox, palette, colorMap, elementIndex++, protectedSkinColors)
          })
        },
        recolorWardrobePaintTag(tag, bounds, viewBox, palette, colorMap, elementIndex, protectedSkinColors) {
          return String(tag || '').replace(/\b(fill|stroke)="(#[0-9a-fA-F]{3,6})"/g, (match, attr, color) => {
            if (color.toLowerCase() === '#000' || color.toLowerCase() === '#000000') {
              return match
            }
            if (attr === 'fill' && this.isProtectedSkinPaintColor(color, protectedSkinColors)) {
              return match
            }
            let key = attr + ':' + color.toLowerCase()
            if (!colorMap[key]) {
              colorMap[key] = this.wardrobePaintReplacement(color, palette, attr === 'stroke', elementIndex)
            }
            return attr + '="' + colorMap[key] + '"'
          })
        },
        svgViewBoxSize(svg) {
          let match = String(svg || '').match(/viewBox="([^"]+)"/i)
          if (!match) {
            return { width: 512, height: 512 }
          }
          let nums = this.numberList(match[1])
          return {
            x: nums[0] || 0,
            y: nums[1] || 0,
            width: nums[2] || 512,
            height: nums[3] || 512
          }
        },
        svgPaintElementBounds(tag) {
          tag = String(tag || '')
          let values = []
          let element = (tag.match(/^<([a-zA-Z]+)/) || [])[1]
          if (element === 'rect') {
            let x = this.svgAttributeNumber(tag, 'x', 0)
            let y = this.svgAttributeNumber(tag, 'y', 0)
            let width = this.svgAttributeNumber(tag, 'width', 0)
            let height = this.svgAttributeNumber(tag, 'height', 0)
            return this.svgBoundsFromPoints([[x, y], [x + width, y + height]])
          }
          if (element === 'circle') {
            let cx = this.svgAttributeNumber(tag, 'cx', 0)
            let cy = this.svgAttributeNumber(tag, 'cy', 0)
            let r = this.svgAttributeNumber(tag, 'r', 0)
            return this.svgBoundsFromPoints([[cx - r, cy - r], [cx + r, cy + r], [cx, cy]])
          }
          if (element === 'ellipse') {
            let cx = this.svgAttributeNumber(tag, 'cx', 0)
            let cy = this.svgAttributeNumber(tag, 'cy', 0)
            let rx = this.svgAttributeNumber(tag, 'rx', 0)
            let ry = this.svgAttributeNumber(tag, 'ry', 0)
            return this.svgBoundsFromPoints([[cx - rx, cy - ry], [cx + rx, cy + ry], [cx, cy]])
          }
          if (element === 'line') {
            return this.svgBoundsFromPoints([
              [this.svgAttributeNumber(tag, 'x1', 0), this.svgAttributeNumber(tag, 'y1', 0)],
              [this.svgAttributeNumber(tag, 'x2', 0), this.svgAttributeNumber(tag, 'y2', 0)]
            ])
          }
          if (element === 'polygon' || element === 'polyline') {
            let points = (tag.match(/\spoints="([^"]+)"/i) || [])[1]
            let nums = this.numberList(points)
            let pairs = []
            for (let i = 0; i + 1 < nums.length; i += 2) {
              pairs.push([nums[i], nums[i + 1]])
            }
            return this.svgBoundsFromPoints(pairs)
          }
          let d = tag.match(/\sd="([^"]+)"/i)
          if (d) {
            let pathBounds = this.svgPathBounds(d[1])
            if (pathBounds) {
              return pathBounds
            }
            values = this.numberList(d[1])
          } else {
            values = this.numberList(tag)
          }
          let ys = []
          let xs = []
          for (let i = 0; i + 1 < values.length; i += 2) {
            if (isFinite(values[i]) && isFinite(values[i + 1])) {
              xs.push(values[i])
              ys.push(values[i + 1])
            }
          }
          return this.svgBoundsFromPoints(xs.map((x, index) => [x, ys[index]]))
        },
        svgPathBounds(pathData) {
          let tokens = String(pathData || '').match(/[a-zA-Z]|-?\d*\.?\d+(?:e[-+]?\d+)?/gi) || []
          let index = 0
          let command = ''
          let x = 0
          let y = 0
          let startX = 0
          let startY = 0
          let xs = []
          let ys = []
          let hasNumber = () => index < tokens.length && !/^[a-zA-Z]$/.test(tokens[index])
          let nextNumber = () => parseFloat(tokens[index++])
          let addPoint = (px, py) => {
            if (!isFinite(px) || !isFinite(py)) {
              return
            }
            x = px
            y = py
            xs.push(px)
            ys.push(py)
          }
          let safety = 0
          while (index < tokens.length && safety < 10000) {
            safety += 1
            let previousIndex = index
            if (/^[a-zA-Z]$/.test(tokens[index])) {
              command = tokens[index++]
            }
            if (!command) {
              break
            }
            let relative = command === command.toLowerCase()
            let cmd = command.toUpperCase()
            if (cmd === 'Z') {
              addPoint(startX, startY)
              command = ''
              continue
            }
            if (cmd === 'M' || cmd === 'L' || cmd === 'T') {
              while (hasNumber()) {
                let nx = nextNumber()
                if (!hasNumber()) break
                let ny = nextNumber()
                nx = relative ? x + nx : nx
                ny = relative ? y + ny : ny
                addPoint(nx, ny)
                if (cmd === 'M') {
                  startX = x
                  startY = y
                  cmd = 'L'
                  command = relative ? 'l' : 'L'
                }
              }
            } else if (cmd === 'H') {
              while (hasNumber()) {
                let nx = nextNumber()
                addPoint(relative ? x + nx : nx, y)
              }
            } else if (cmd === 'V') {
              while (hasNumber()) {
                let ny = nextNumber()
                addPoint(x, relative ? y + ny : ny)
              }
            } else if (cmd === 'C') {
              while (hasNumber()) {
                let baseX = x
                let baseY = y
                let lastX = x
                let lastY = y
                for (let pair = 0; pair < 3; pair += 1) {
                  if (!hasNumber()) break
                  let nx = nextNumber()
                  if (!hasNumber()) break
                  let ny = nextNumber()
                  nx = relative ? baseX + nx : nx
                  ny = relative ? baseY + ny : ny
                  if (isFinite(nx) && isFinite(ny)) {
                    xs.push(nx)
                    ys.push(ny)
                    lastX = nx
                    lastY = ny
                  }
                }
                x = lastX
                y = lastY
              }
            } else if (cmd === 'S' || cmd === 'Q') {
              while (hasNumber()) {
                let baseX = x
                let baseY = y
                let lastX = x
                let lastY = y
                for (let pair = 0; pair < 2; pair += 1) {
                  if (!hasNumber()) break
                  let nx = nextNumber()
                  if (!hasNumber()) break
                  let ny = nextNumber()
                  nx = relative ? baseX + nx : nx
                  ny = relative ? baseY + ny : ny
                  if (isFinite(nx) && isFinite(ny)) {
                    xs.push(nx)
                    ys.push(ny)
                    lastX = nx
                    lastY = ny
                  }
                }
                x = lastX
                y = lastY
              }
            } else if (cmd === 'A') {
              while (hasNumber()) {
                if (index + 6 >= tokens.length) {
                  break
                }
                index += 5
                let nx = nextNumber()
                let ny = nextNumber()
                nx = relative ? x + nx : nx
                ny = relative ? y + ny : ny
                addPoint(nx, ny)
              }
            } else {
              while (hasNumber()) {
                index += 1
              }
            }
            if (index === previousIndex) {
              index += 1
            }
          }
          if (!ys.length) {
            return false
          }
          return this.svgBoundsFromPoints(xs.map((px, pointIndex) => [px, ys[pointIndex]]))
        },
        isWardrobePaintRegion(bounds, viewBox) {
          if (!bounds) {
            return false
          }
          if (!this.isVisibleSvgPaintRegion(bounds, viewBox)) {
            return false
          }
          let top = (viewBox && viewBox.y) || 0
          let height = (viewBox && viewBox.height) || 512
          if (bounds.pointCount <= 1) {
            return bounds.maxY >= top + height * 0.62
          }
          return bounds.maxY >= top + height * 0.66 && (bounds.avgY >= top + height * 0.54 || bounds.firstY >= top + height * 0.54 || bounds.minY >= top + height * 0.50)
        },
        svgProtectedSkinColors(svg, viewBox) {
          let protectedColors = {}
          String(svg || '').replace(/<(path|rect|ellipse|circle|polygon|polyline|line)\b[^>]*\bfill="#[0-9a-fA-F]{3,6}"[^>]*>/g, (tag) => {
            let bounds = this.svgPaintElementBounds(tag)
            if (!this.isVisibleSvgPaintRegion(bounds, viewBox)) {
              return tag
            }
            let fill = (tag.match(/\bfill="(#[0-9a-fA-F]{3,6})"/i) || [])[1]
            if (fill && this.isSkinPaintSample(bounds, viewBox, fill)) {
              protectedColors[fill.toLowerCase()] = true
            }
            return tag
          })
          return protectedColors
        },
        isSkinPaintSample(bounds, viewBox, color) {
          if (!bounds || !this.isPossibleHumanSkinPaintColor(color)) {
            return false
          }
          let top = (viewBox && viewBox.y) || 0
          let height = (viewBox && viewBox.height) || 512
          return bounds.maxY >= top + height * 0.18 &&
            bounds.minY <= top + height * 0.76 &&
            bounds.avgY >= top + height * 0.14 &&
            bounds.avgY <= top + height * 0.74
        },
        isVisibleSvgPaintRegion(bounds, viewBox) {
          if (!bounds) {
            return false
          }
          let left = (viewBox && viewBox.x) || 0
          let top = (viewBox && viewBox.y) || 0
          let right = left + ((viewBox && viewBox.width) || 512)
          let bottom = top + ((viewBox && viewBox.height) || 512)
          return bounds.maxY >= top &&
            bounds.minY <= bottom &&
            (bounds.maxX === undefined || bounds.maxX >= left) &&
            (bounds.minX === undefined || bounds.minX <= right)
        },
        svgAttributeNumber(tag, name, fallback) {
          let match = String(tag || '').match(new RegExp('\\b' + name + '="([^"]+)"', 'i'))
          if (!match) {
            return fallback
          }
          let value = parseFloat(match[1])
          return isFinite(value) ? value : fallback
        },
        svgBoundsFromPoints(points) {
          points = (points || []).filter((point) => point && isFinite(point[0]) && isFinite(point[1]))
          if (!points.length) {
            return false
          }
          let xs = points.map((point) => point[0])
          let ys = points.map((point) => point[1])
          let sumX = xs.reduce((sum, value) => sum + value, 0)
          let sumY = ys.reduce((sum, value) => sum + value, 0)
          return {
            minX: Math.min.apply(Math, xs),
            maxX: Math.max.apply(Math, xs),
            avgX: sumX / xs.length,
            firstX: xs[0],
            minY: Math.min.apply(Math, ys),
            maxY: Math.max.apply(Math, ys),
            avgY: sumY / ys.length,
            firstY: ys[0],
            pointCount: ys.length
          }
        },
        wardrobePaintReplacement(color, palette, isStroke, elementIndex) {
          if (isStroke) {
            return palette.accent || palette.shade || palette.base
          }
          let luminance = this.colorLuminance(color)
          if (luminance >= 0.78) {
            return palette.highlight || palette.base
          }
          if (luminance >= 0.56) {
            return elementIndex % 3 === 0 ? (palette.highlight || palette.base) : palette.base
          }
          if (luminance <= 0.28) {
            return palette.shade || palette.base
          }
          return elementIndex % 2 === 0 ? palette.base : (palette.shade || palette.base)
        },
        isProtectedSkinPaintColor(color, protectedSkinColors) {
          color = String(color || '').toLowerCase()
          return !!(protectedSkinColors && protectedSkinColors[color]) || this.isKnownVanillaSkinPaintColor(color) || this.isLikelySkinPaintColor(color)
        },
        isKnownVanillaSkinPaintColor(color) {
          let known = {
            '#f0bca6': true,
            '#e6b09a': true,
            '#e2a58a': true,
            '#bc8e79': true,
            '#b38978': true,
            '#b28776': true,
            '#b18675': true,
            '#bc8169': true,
            '#c9a594': true,
            '#c6a89c': true,
            '#c1a194': true,
            '#c3a397': true,
            '#cbad9e': true,
            '#b38b7b': true,
            '#b09685': true,
            '#ae9484': true,
            '#675f5b': true,
            '#655f5b': true,
            '#897f79': true,
            '#867878': true,
            '#7c736e': true,
            '#756e6a': true,
            '#c2b4b4': true,
            '#b2a1a1': true
          }
          return !!known[String(color || '').toLowerCase()]
        },
        isLikelySkinPaintColor(color) {
          if (this.isKnownVanillaSkinPaintColor(color)) {
            return true
          }
          let rgb = this.hexToRgb(color)
          if (!rgb) {
            return false
          }
          let max = Math.max(rgb.r, rgb.g, rgb.b)
          let min = Math.min(rgb.r, rgb.g, rgb.b)
          let luminance = (max + min) / 510
          return rgb.r > rgb.g &&
            rgb.g >= rgb.b &&
            luminance > 0.40 &&
            luminance < 0.90 &&
            (rgb.r - rgb.b) > 18 &&
            (rgb.r - rgb.g) < 90 &&
            (rgb.g - rgb.b) < 72
        },
        isPossibleHumanSkinPaintColor(color) {
          if (this.isKnownVanillaSkinPaintColor(color)) {
            return true
          }
          let rgb = this.hexToRgb(color)
          if (!rgb) {
            return false
          }
          let max = Math.max(rgb.r, rgb.g, rgb.b)
          let min = Math.min(rgb.r, rgb.g, rgb.b)
          let chroma = max - min
          let luminance = this.colorLuminance(color)
          if (luminance < 0.30 || luminance > 0.92) {
            return false
          }
          if (rgb.r + 6 < rgb.g || rgb.g + 10 < rgb.b) {
            return false
          }
          if (rgb.r - rgb.b < 10) {
            return false
          }
          if (luminance < 0.45 && chroma > 60) {
            return false
          }
          if (chroma >= 90) {
            return false
          }
          if (rgb.r - rgb.g < 120 && rgb.g - rgb.b < 105) {
            return true
          }
          return luminance > 0.42 && chroma < 44 && rgb.r - rgb.b >= 10 && rgb.r >= rgb.g && rgb.g >= rgb.b
        },
        colorLuminance(color) {
          let rgb = this.hexToRgb(color)
          if (!rgb) {
            return 0.5
          }
          return (0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b) / 255
        },
        hexToRgb(color) {
          color = String(color || '').replace('#', '').trim()
          if (color.length === 3) {
            color = color.split('').map((part) => part + part).join('')
          }
          if (!/^[0-9a-fA-F]{6}$/.test(color)) {
            return false
          }
          return {
            r: parseInt(color.slice(0, 2), 16),
            g: parseInt(color.slice(2, 4), 16),
            b: parseInt(color.slice(4, 6), 16)
          }
        },
        numberList(text) {
          let matches = String(text || '').match(/-?\d*\.?\d+(?:e[-+]?\d+)?/gi) || []
          return matches.map((value) => parseFloat(value)).filter((value) => isFinite(value))
        },
        replaceSvgColor(svg, from, to) {
          let escaped = String(from || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
          return String(svg || '').replace(new RegExp(escaped, 'gi'), to)
        },
        isImageData(value) {
          if (!value || typeof value !== 'string') {
            return false
          }
          if (
            value.indexOf('data:image/') === 0 ||
            value.indexOf('http') === 0 ||
            value.indexOf('blob:') === 0 ||
            value.indexOf('img/') === 0 ||
            value.indexOf('/img/') === 0 ||
            /\.(svg|png|jpg|jpeg|webp)(\?|#|$)/i.test(value)
          ) {
            return true
          }
          return value.length > 120 && /^[A-Za-z0-9+/=]+$/.test(value.slice(0, 160))
        },
        characterAgeStage(age) {
          if (age < 4) return 'baby'
          if (age < 16) return 'teen'
          if (age >= 55) return 'old'
          return 'adult'
        },
        characterPortraitRole(character, ageStage, stratum) {
          if (ageStage === 'baby') return 'baby'
          if (stratum === 'senatorial') return 'senatorial'
          if (stratum === 'equestrian') return 'equestrian'
          if (stratum === 'poor') return 'worker'
          let job = character.job || ''
          let traits = character.traits || []
          if (job === 'senator' || traits.indexOf('senator') >= 0 || traits.indexOf('formerPraetor') >= 0 || traits.indexOf('formerQuaestor') >= 0) return 'senatorial'
          if (['lawyer', 'rhetor', 'physician'].indexOf(job) >= 0) return 'learned'
          if (['trader'].indexOf(job) >= 0) return 'merchant'
          if (['soldier', 'gladiator'].indexOf(job) >= 0 || traits.indexOf('veteran') >= 0 || traits.indexOf('gladiator') >= 0) return 'martial'
          if (job === 'labourer') return 'worker'
          return 'citizen'
        },
        clothingOptions(gender, ageStage, role, stratum) {
          if (ageStage === 'teen') return gender === 'female' ? ['childStola', 'palla', 'simpleTunic'] : ['childTunic', 'simpleTunic', 'mantle']
          if (stratum === 'senatorial') return gender === 'female' ? ['palla', 'purplePalla', 'whiteStola'] : ['senatorToga', 'togaPraetexta', 'togaCandida']
          if (stratum === 'equestrian') return ['equestrianTunic', 'mantle', 'citizenToga']
          if (stratum === 'poor') return ['workerTunic', 'brownMantle', 'simpleTunic']
          if (stratum === 'freedmen') return ['simpleTunic', 'brownMantle', 'mantle']
          if (role === 'senatorial') return ['senatorToga', 'togaPraetexta', 'togaCandida']
          if (role === 'equestrian') return ['equestrianTunic', 'mantle', 'citizenToga']
          if (role === 'martial') return ['militaryCloak', 'armoredTunic', 'redMantle']
          if (role === 'merchant') return ['mantle', 'equestrianTunic', 'simpleTunic']
          if (role === 'worker') return ['workerTunic', 'simpleTunic', 'brownMantle']
          if (gender === 'female') return ['stola', 'palla', 'whiteStola', 'purplePalla']
          return ['citizenToga', 'mantle', 'simpleTunic', 'whiteToga']
        },
        pickByRandom(list, random) {
          return list[Math.floor(random() * list.length) % list.length]
        },
        houseMemberGroups(house, state) {
          let groups = {
            notable: [],
            established: [],
            common: []
          }
          let ids = this.visibleHousePeople(house, state)
            .filter((characterId, index, list) => list.indexOf(characterId) === index && state.characters[characterId])
            .sort((a, b) => this.characterScore(state.characters[b], state) - this.characterScore(state.characters[a], state))
          ids.forEach((characterId, index) => {
            let character = state.characters[characterId]
            character.id = character.id || characterId
            groups[this.memberCategoryFor(character, state, house, index)].push(characterId)
          })
          if (!groups.notable.length && ids.length) {
            let source = groups.established.length ? groups.established : groups.common
            groups.notable.push(source.shift())
          }
          return groups
        },
        memberCategoryFor(character, state, house, index) {
          let age = this.age(character, state)
          let traits = character.traits || []
          let score = this.characterScore(character, state)
          let jobLevel = parseFloat(character.jobLevel || 0)
          let notableTraits = ['senator', 'formerQuaestor', 'formerPraetor', 'formerConsul', 'erudite', 'oratorDeliberative', 'oratorJudicial', 'authoritative', 'ambitious']
          if (
            index === 0 ||
            this.isSenatorialCharacter(character, state) ||
            score >= 65 ||
            jobLevel >= 6 ||
            notableTraits.some((trait) => traits.indexOf(trait) >= 0)
          ) {
            return 'notable'
          }
          if (
            age >= 16 &&
            (score >= 25 || character.job || jobLevel >= 2 || character.spouseId || (character.childrenIds || []).length)
          ) {
            return 'established'
          }
          return 'common'
        },
        memberGroupLabel(group) {
          if (group === 'notable') return 'Notables'
          if (group === 'established') return 'Established members'
          return 'Common kin'
        },
        memberGroupDescription(group) {
          if (group === 'notable') return 'Heads, senators, office-holders, patrons, and high-skill public figures.'
          if (group === 'established') return 'Adult relatives with work, marriage ties, property weight, or household standing.'
          return 'Children, young dependants, laboring relatives, and low-profile members of the dynasty.'
        },
        memberGroupIcon(group) {
          if (group === 'notable') return this.affairIcon('prestige')
          if (group === 'established') return this.affairIcon('support')
          return this.affairIcon('familyTree')
        },
        vanillaCharacterActions(character) {
          let actions = { ...((character && character.actions) || {}) }
          this.bundledCharacterActions(character).forEach((item) => {
            if (item && item.key && item.action && !actions[item.key]) {
              actions[item.key] = item.action
            }
          })
          return Object.keys(actions).map((key) => {
            return { key, action: actions[key] }
          }).filter((item) => item.action && typeof item.action === 'object' && !item.action.hideInCharacterActions)
        },
        bundledCharacterActions(character) {
          let state = daapi.getState()
          let currentId = state && state.current && state.current.id
          let characterId = character && character.id
          if (!character || !characterId) {
            return []
          }
          let items = []
          let isCurrent = characterId === currentId
          let age = this.age(character, state)
          if (!isCurrent && !character.isDead) {
            items.push({
              key: 'play_as',
              action: {
                title: 'Play As',
                icon: daapi.requireImage('/cor_society/bundled/play_as/switch.svg'),
                isAvailable: true,
                hideWhenBusy: false,
                process: {
                  event: '/cor_society/bundled/play_as/main',
                  method: 'process',
                  context: { characterId }
                }
              }
            })
          }
          let currentPlotTarget = currentId ? this.safeCharacterFlag(currentId, 'mod_murder_startedPlotOnTarget') : false
          if (!isCurrent && !character.isDead && age > 15 && !currentPlotTarget && !this.safeCharacterFlag(characterId, 'mod_murder_plotTarget')) {
            items.push({
              key: 'mod_murder_startPlot',
              action: {
                title: 'Attempt Murder',
                icon: daapi.requireImage('/cor_society/bundled/murder/plot.svg'),
                isAvailable: true,
                hideWhenBusy: false,
                process: {
                  event: '/cor_society/bundled/murder/main',
                  method: 'process',
                  context: { characterId }
                }
              }
            })
          }
          if (isCurrent && currentPlotTarget) {
            items.push({
              key: 'mod_murder_cancelPlot',
              action: {
                title: 'Stop Plotting Murder',
                icon: daapi.requireImage('/cor_society/bundled/murder/cancelPlot.svg'),
                isAvailable: true,
                hideWhenBusy: false,
                process: {
                  event: '/cor_society/bundled/murder/main',
                  method: 'cancelPlot'
                }
              }
            })
          }
          let householdIds = (state && state.current && state.current.householdCharacterIds) || []
          let isHousehold = householdIds.indexOf(characterId) >= 0
          if (isHousehold && !isCurrent && !character.isDead && !character.flagWasGivenInheritance) {
            items.push({
              key: 'Disinherit',
              action: {
                title: 'Disinherit',
                icon: daapi.requireImage('/cor_society/bundled/disinheritance/icon.svg'),
                isAvailable: true,
                hideWhenBusy: false,
                process: {
                  event: '/cor_society/bundled/disinheritance/main',
                  method: 'process',
                  context: { characterId }
                }
              }
            })
          }
          if (isHousehold && !isCurrent && !character.isDead && character.flagWasGivenInheritance) {
            items.push({
              key: 'RestoreInheritance',
              action: {
                title: 'Restore Inheritance',
                icon: daapi.requireImage('/cor_society/bundled/restoreInheritance/icon.svg'),
                isAvailable: true,
                hideWhenBusy: false,
                process: {
                  event: '/cor_society/bundled/restoreInheritance/main',
                  method: 'process',
                  context: { characterId }
                }
              }
            })
          }
          return items
        },
        safeCharacterFlag(characterId, flag) {
          try {
            return daapi.getCharacterFlag({ characterId, flag })
          } catch (err) {
            let state = daapi.getState()
            let character = state && state.characters && state.characters[characterId]
            return character && character.modFlags ? character.modFlags[flag] : false
          }
        },
        familyTreeRelatives(character, state) {
          let id = character && character.id
          let relatives = {
            children: [],
            siblings: []
          }
          let addUnique = (list, characterId) => {
            if (!characterId || list.indexOf(characterId) >= 0 || !state.characters[characterId]) {
              return
            }
            list.push(characterId)
          }
          ;(character.childrenIds || []).forEach((childId) => addUnique(relatives.children, childId))
          for (let characterId in state.characters) {
            if (!state.characters.hasOwnProperty(characterId)) {
              continue
            }
            let other = state.characters[characterId]
            if (!other || other.isDead) {
              continue
            }
            other.id = other.id || characterId
            if (this.sameCharacterId(other.fatherId, id) || this.sameCharacterId(other.motherId, id)) {
              addUnique(relatives.children, other.id)
            }
            if (!this.sameCharacterId(other.id, id) && (
              (character.fatherId && this.sameCharacterId(other.fatherId, character.fatherId)) ||
              (character.motherId && this.sameCharacterId(other.motherId, character.motherId))
            )) {
              addUnique(relatives.siblings, other.id)
            }
          }
          return relatives
        },
        sameCharacterId(first, second) {
          return first !== undefined && first !== null && second !== undefined && second !== null && String(first) === String(second)
        },
        characterLink(characterId, state) {
          if (!characterId || !state.characters[characterId]) {
            return 'none'
          }
          let character = state.characters[characterId]
          character.id = character.id || characterId
          return '[c|' + character.id + '|' + this.characterName(character, state) + ']'
        },
        houseIdForCharacter(character, state, society) {
          if (!character) {
            return ''
          }
          if (character.dynastyId && society.houses[character.dynastyId]) {
            return character.dynastyId
          }
          let dynastyId = character.dynastyId
          if (dynastyId) {
            let house = this.createHouseRecord(dynastyId)
            let dynasty = state.dynasties[dynastyId] || {}
            house.name = this.houseName(dynasty, dynastyId)
            house.stratum = this.classifyHouse(dynasty, [character], this.characterScore(character, state), this.isSenatorialCharacter(character, state))
            house.memberIds = [character.id]
            house.notableIds = [character.id]
            house.generated = false
            society.houses[dynastyId] = house
            this.refreshHouseMemberLists(society, state, house)
            this.save(society)
            return dynastyId
          }
          return ''
        },
        familyRelativeOption(label, characterId, state, society, fallbackHouseId, returnTo, returnPage) {
          let character = state.characters[characterId]
          character.id = character.id || characterId
          let houseId = this.houseIdForCharacter(character, state, society) || fallbackHouseId
          let house = society.houses[houseId] || society.houses[fallbackHouseId]
          return {
            text: label + ': ' + this.characterName(character, state),
            tooltip: this.characterTooltip(character, state),
            icons: [this.characterPortrait(character, state, house)],
            action: {
              event: this.event,
              method: 'openFamilyTree',
              context: { houseId, characterId: character.id, returnTo, returnPage, mode: 'full' }
            }
          }
        },
        visibleHousePeople(house, state) {
          let seen = {}
          let ids = []
          ;[(house && house.notableIds) || [], (house && house.memberIds) || []].forEach((list) => {
            list.forEach((characterId) => {
              if (seen[characterId]) {
                return
              }
              let character = state && state.characters ? state.characters[characterId] : false
              if (character && character.isDead) {
                return
              }
              seen[characterId] = true
              ids.push(characterId)
            })
          })
          return ids
        },
        housePortrait(house, state) {
          state = state || daapi.getState()
          let ids = this.visibleHousePeople(house, state)
          let character = ids.length ? (state.characters[ids[0]] || false) : false
          return character ? this.characterPortrait(character, state, house) : this.affairIcon('log')
        },
        startPlayerStatusOverlay() {
          if (this.playerStatusOverlayStarted) {
            this.applyPlayerStatusOverlay()
            this.applyPortraitOverlays()
            return
          }
          this.playerStatusOverlayStarted = true
          this.applyPlayerStatusOverlay()
          this.applyPortraitOverlays()
          if (typeof window !== 'undefined' && window.setInterval) {
            window.setInterval(() => {
              try {
                if (window.corSociety) {
                  window.corSociety.applyPlayerStatusOverlay()
                  window.corSociety.applyPortraitOverlays()
                }
              } catch (err) {
                console.warn(err)
              }
            }, 1400)
          }
        },
        applyPlayerStatusOverlay() {
          if (typeof document === 'undefined') {
            return
          }
          let state = daapi.getState()
          let target = this.findPlayerStatusElement()
          if (!target) {
            return
          }
          let key = this.playerStatusKey(state)
          if (target.getAttribute('data-cor-society-status-key') === key) {
            return
          }
          let status = this.playerSocietyStatus(state)
          let text = status.title + (status.className ? ' (' + status.className + ')' : '')
          if (!target.getAttribute('data-cor-society-original-status')) {
            target.setAttribute('data-cor-society-original-status', target.textContent || '')
          }
          target.setAttribute('data-cor-society-status-key', key)
          target.setAttribute('title', 'Society order: ' + this.stratumTitle(status.stratum) + (status.className ? '; vanilla property class: ' + status.className : ''))
          target.textContent = text
        },
        findPlayerStatusElement() {
          let socialSection = document.querySelector('[aria-label="Social status"]')
          if (socialSection) {
            let direct = socialSection.querySelector('.h5')
            if (direct) {
              return direct
            }
          }
          let dynastyTitle = document.querySelector('.dynasty-title')
          if (dynastyTitle && dynastyTitle.parentElement) {
            let candidates = dynastyTitle.parentElement.querySelectorAll('.h5')
            if (candidates.length) {
              return candidates[0]
            }
          }
          return false
        },
        applyPortraitOverlays() {
          if (typeof document === 'undefined') {
            return
          }
          let state = daapi.getState()
          if (!state || !state.characters) {
            return
          }
          if (!this.hasActiveWardrobeOutfits(state)) {
            this.restoreClearedPortraitOverlays(state)
            return
          }
          this.restoreClearedPortraitOverlays(state)
          this.applyCurrentCharacterPortraitOverlay(state)
          this.applyAttributedCharacterPortraitOverlays(state)
        },
        hasActiveWardrobeOutfits(state) {
          if (!state || !state.characters) {
            return false
          }
          for (let characterId in state.characters) {
            if (state.characters.hasOwnProperty(characterId) && state.characters[characterId] && state.characters[characterId].corSocietyOutfit) {
              return true
            }
          }
          return false
        },
        restoreClearedPortraitOverlays(state) {
          let images = Array.prototype.slice.call(document.querySelectorAll('img[data-cor-society-original-src]'))
          images.forEach((img) => {
            let id = img.getAttribute('data-cor-society-character-id') || this.characterIdFromElement(img)
            let character = id && state.characters[id]
            if (character && this.shouldUseSocietyPortrait(character)) {
              return
            }
            let original = img.getAttribute('data-cor-society-original-src')
            if (original) {
              img.src = original
            }
            img.removeAttribute('data-cor-society-original-src')
            img.removeAttribute('data-cor-society-portrait-src')
            img.removeAttribute('data-cor-society-character-id')
          })
        },
        applyCurrentCharacterPortraitOverlay(state) {
          let currentId = this.currentCharacterId(state)
          let character = state.characters[currentId]
          if (!this.shouldUseSocietyPortrait(character)) {
            return
          }
          let img = this.findCurrentPortraitImage(state)
          if (!img) {
            return
          }
          this.replacePortraitImage(img, character, state)
        },
        applyAttributedCharacterPortraitOverlays(state) {
          let images = Array.prototype.slice.call(document.querySelectorAll('img[data-character-id], img[data-characterid], img[data-character], img[data-id], [data-character-id] img, [data-characterid] img, [data-character] img, [data-id] img'))
          images.forEach((img) => {
            let id = this.characterIdFromElement(img)
            let character = id && state.characters[id]
            if (this.shouldUseSocietyPortrait(character)) {
              this.replacePortraitImage(img, character, state)
            }
          })
        },
        shouldUseSocietyPortrait(character) {
          return !!(character && character.corSocietyOutfit)
        },
        characterIdFromElement(element) {
          let node = element
          while (node && node !== document.body) {
            if (node.getAttribute) {
              let value = node.getAttribute('data-character-id') || node.getAttribute('data-characterid') || node.getAttribute('data-character') || node.getAttribute('data-id')
              if (value) {
                return value
              }
            }
            node = node.parentElement
          }
          return ''
        },
        replacePortraitImage(img, character, state) {
          let portrait = this.characterPortrait(character, state)
          if (!portrait || img.getAttribute('data-cor-society-portrait-src') === portrait) {
            return
          }
          if (!img.getAttribute('data-cor-society-original-src')) {
            img.setAttribute('data-cor-society-original-src', img.getAttribute('src') || img.src || '')
          }
          if (character && character.id) {
            img.setAttribute('data-cor-society-character-id', character.id)
          }
          img.setAttribute('data-cor-society-portrait-src', portrait)
          img.src = portrait
        },
        startPlayerCrestOverlay() {
          if (this.playerCrestOverlayStarted) {
            this.applyPlayerCrestOverlay()
            return
          }
          this.playerCrestOverlayStarted = true
          this.applyPlayerCrestOverlay()
          if (typeof window !== 'undefined' && window.setInterval) {
            window.setInterval(() => {
              try {
                if (window.corSociety) {
                  window.corSociety.applyPlayerCrestOverlay()
                }
              } catch (err) {
                console.warn(err)
              }
            }, 1600)
          }
        },
        applyPlayerCrestOverlay() {
          if (typeof document === 'undefined') {
            return
          }
          let state = daapi.getState()
          let society = this.load()
          society.crestSettings = { playerOverlay: true, ...(society.crestSettings || {}) }
          if (!society.crestSettings.playerOverlay) {
            this.clearPlayerCrestOverlay()
            return
          }
          let crestId = this.playerCrestId(state)
          let hadCrest = society.crests && society.crests[crestId]
          let crest = this.ensurePlayerCrest(society, state)
          if (!hadCrest) {
            this.save(society)
          }
          let badge = document.getElementById('corSocietyPlayerCrestBadge')
          if (!badge) {
            badge = document.createElement('img')
            badge.id = 'corSocietyPlayerCrestBadge'
            badge.className = 'cor-society-player-crest-badge'
            badge.setAttribute('aria-hidden', 'true')
            badge.alt = ''
            document.body.appendChild(badge)
          }
          let viewportWidth = (typeof window !== 'undefined' && window.innerWidth) ? window.innerWidth : 360
          let size = Math.max(26, Math.min(38, Math.round(viewportWidth * 0.09)))
          badge.src = this.crestIcon(crest, 96)
          badge.style.left = '6px'
          badge.style.top = '6px'
          badge.style.width = size + 'px'
          badge.style.height = Math.round(size * 1.15) + 'px'
          badge.style.display = 'block'
        },
        clearPlayerCrestOverlay() {
          if (typeof document === 'undefined') {
            return
          }
          let badge = document.getElementById('corSocietyPlayerCrestBadge')
          if (badge && badge.parentElement) {
            badge.parentElement.removeChild(badge)
          }
        },
        findCurrentPortraitImage(state) {
          if (typeof document === 'undefined') {
            return false
          }
          let currentId = (state.current || {}).id
          let escapedId = this.attrEscape(currentId)
          let selectors = [
            '[data-character-id="' + escapedId + '"] img',
            '[data-characterid="' + escapedId + '"] img',
            '[data-character="' + escapedId + '"] img',
            '[data-id="' + escapedId + '"] img',
            'img[data-character-id="' + escapedId + '"]',
            'img[data-characterid="' + escapedId + '"]',
            'img[data-character="' + escapedId + '"]',
            'img[data-id="' + escapedId + '"]'
          ]
          for (let i = 0; i < selectors.length; i++) {
            let found = this.bestVisibleImage(Array.prototype.slice.call(document.querySelectorAll(selectors[i])))
            if (found) {
              return found
            }
          }
          let character = state.characters[currentId]
          if (!character) {
            return false
          }
          let portrait = this.vanillaCharacterPortrait(character, state)
          let exact = []
          let images = Array.prototype.slice.call(document.querySelectorAll('img'))
          images.forEach((img) => {
            let src = img.getAttribute('src') || img.src || ''
            if (portrait && (src === portrait || img.src === portrait)) {
              exact.push(img)
            }
          })
          return this.bestVisibleImage(exact)
        },
        bestVisibleImage(images) {
          let best = false
          let bestScore = -1
          images.forEach((img) => {
            if (!img || !img.getBoundingClientRect) {
              return
            }
            let rect = img.getBoundingClientRect()
            if (rect.width < 28 || rect.height < 28 || rect.bottom < 0 || rect.right < 0 || rect.top > window.innerHeight || rect.left > window.innerWidth) {
              return
            }
            let style = window.getComputedStyle ? window.getComputedStyle(img) : {}
            if (style.display === 'none' || style.visibility === 'hidden' || parseFloat(style.opacity || 1) === 0) {
              return
            }
            let inModal = img.closest && img.closest('.modal, #interactionModal, .interaction-modal')
            let score = rect.width * rect.height - (inModal ? 100000 : 0)
            if (score > bestScore) {
              best = img
              bestScore = score
            }
          })
          return best
        },
        attrEscape(value) {
          return String(value || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"')
        },
        log(society, text, kind, houseId) {
          let state = daapi.getState()
          let entry = {
            text: 'Y' + state.year + ' M' + ((state.month || 0) + 1) + ': ' + text,
            kind: kind || this.inferAffairKind(text),
            houseId: houseId || '',
            year: state.year || 0,
            month: (state.month || 0) + 1
          }
          society.log = society.log || []
          society.log.unshift(entry)
        },
        normalizeLogEntry(entry, index) {
          if (entry && typeof entry === 'object') {
            return {
              index,
              text: entry.text || '',
              kind: entry.kind || this.inferAffairKind(entry.text || ''),
              houseId: entry.houseId || ''
            }
          }
          let text = String(entry || '')
          return {
            index,
            text,
            kind: this.inferAffairKind(text),
            houseId: ''
          }
        },
        inferAffairKind(text) {
          text = String(text || '').toLowerCase()
          if (text.indexOf('marriage') >= 0 || text.indexOf('wedding') >= 0) return 'marriage'
          if (text.indexOf('birth') >= 0 || text.indexOf('child') >= 0 || text.indexOf('expecting') >= 0 || text.indexOf('pregnan') >= 0) return 'birth'
          if (text.indexOf('trade') >= 0 || text.indexOf('venture') >= 0 || text.indexOf('compact') >= 0) return 'tradeVenture'
          if (text.indexOf('rival') >= 0 || text.indexOf('feud') >= 0 || text.indexOf('rumor') >= 0 || text.indexOf('slander') >= 0) return 'rivalry'
          if (text.indexOf('petition') >= 0) return 'petition'
          if (text.indexOf('office') >= 0 || text.indexOf('campaign') >= 0) return 'officeCampaign'
          if (text.indexOf('scandal') >= 0) return 'scandal'
          if (text.indexOf('inheritance') >= 0) return 'inheritanceDispute'
          if (text.indexOf('gift') >= 0) return 'gift'
          if (text.indexOf('patronage') >= 0 || text.indexOf('favor') >= 0) return 'patronage'
          return 'log'
        },
        shortText(text, maxLength) {
          text = String(text || '').replace(/\s+/g, ' ').trim()
          maxLength = maxLength || 64
          if (text.length <= maxLength) {
            return text
          }
          return text.slice(0, Math.max(8, maxLength - 3)).replace(/\s+\S*$/, '') + '...'
        },
        monthKey(state) {
          return String(state.year || 0) + '-' + String(state.month || 0)
        },
        futureMonthKey(months) {
          let state = daapi.getState()
          let total = (state.year || 0) * 13 + (state.month || 0) + months
          return Math.floor(total / 13) + '-' + (total % 13)
        },
        monthKeyReached(targetKey, state) {
          return this.monthIndex(this.monthKey(state || daapi.getState())) >= this.monthIndex(targetKey)
        },
        monthIndex(key) {
          let parts = String(key || '0-0').split('-')
          return (parseInt(parts[0] || 0, 10) * 13) + parseInt(parts[1] || 0, 10)
        },
        safeId(value) {
          return String(value || '').replace(/[^a-zA-Z0-9_]/g, '_')
        },
        signed(value) {
          value = Math.round(value || 0)
          return (value > 0 ? '+' : '') + value
        },
        clamp(value, min, max) {
          return Math.max(min, Math.min(max, value))
        },
        randomInt(min, max) {
          return Math.floor(min + Math.random() * (max - min + 1))
        },
        pick(list) {
          list = (list || []).filter((item) => item !== undefined)
          return list[Math.floor(Math.random() * list.length)]
        },
        pickUnique(list, count) {
          let pool = (list || []).filter((item, index, arr) => item && arr.indexOf(item) === index)
          let picked = []
          while (pool.length && picked.length < count) {
            let index = Math.floor(Math.random() * pool.length)
            picked.push(pool.splice(index, 1)[0])
          }
          return picked
        }
      }

      window.corSociety.ensure()
      window.corSociety.startPlayerCrestOverlay()
      window.corSociety.startPlayerStatusOverlay()
    },
    monthlyTick() {
      if (!window.corSociety) {
        daapi.invokeMethod({ event: '/cor_society/engine', method: 'boot' })
      }
      window.corSociety.monthlyTick()
    },
    showInstallNoticeOnce() {
      if (!window.corSociety) {
        daapi.invokeMethod({ event: '/cor_society/engine', method: 'boot' })
      }
      window.corSociety.showInstallNoticeOnce()
    },
    openHub() {
      if (!window.corSociety) {
        daapi.invokeMethod({ event: '/cor_society/engine', method: 'boot' })
      }
      window.corSociety.openHub()
    },
    openEstate(args) {
      window.corSociety.openEstate(args || {})
    },
    openRelations() {
      window.corSociety.openRelations()
    },
    openAllies(args) {
      window.corSociety.openAllies(args || {})
    },
    openRivals(args) {
      window.corSociety.openRivals(args || {})
    },
    openLog(args) {
      window.corSociety.openLog(args || {})
    },
    openLogEntry(args) {
      window.corSociety.openLogEntry(args || {})
    },
    openPlayerCrest() {
      window.corSociety.openPlayerCrest()
    },
    randomizePlayerCrest() {
      window.corSociety.randomizePlayerCrest()
    },
    cyclePlayerCrest(args) {
      window.corSociety.cyclePlayerCrest(args || {})
    },
    togglePlayerCrestOverlay() {
      window.corSociety.togglePlayerCrestOverlay()
    },
    openWardrobe() {
      window.corSociety.openWardrobe()
    },
    openWardrobeCharacter(args) {
      window.corSociety.openWardrobeCharacter(args || {})
    },
    applyWardrobeOutfit(args) {
      window.corSociety.applyWardrobeOutfit(args || {})
    },
    openHouse(args) {
      window.corSociety.openHouse(args || {})
    },
    openPeople(args) {
      window.corSociety.openPeople(args || {})
    },
    openMemberGroups(args) {
      window.corSociety.openMemberGroups(args || {})
    },
    openMemberGroup(args) {
      window.corSociety.openMemberGroup(args || {})
    },
    openPerson(args) {
      window.corSociety.openPerson(args || {})
    },
    openVanillaActions(args) {
      window.corSociety.openVanillaActions(args || {})
    },
    openVanillaKnownFamily(args) {
      window.corSociety.openVanillaKnownFamily(args || {})
    },
    openVanillaFullFamilyTree(args) {
      window.corSociety.openVanillaFullFamilyTree(args || {})
    },
    openFamilyTree(args) {
      window.corSociety.openFamilyTree(args || {})
    },
    closeFamilyTreeOverlay() {
      window.corSociety.closeFamilyTreeOverlay()
    },
    openMarriageHousehold(args) {
      window.corSociety.openMarriageHousehold(args || {})
    },
    openMarriageCandidates(args) {
      window.corSociety.openMarriageCandidates(args || {})
    },
    confirmSocietyMarriage(args) {
      window.corSociety.confirmSocietyMarriage(args || {})
    },
    performSocietyMarriage(args) {
      window.corSociety.performSocietyMarriage(args || {})
    },
    sendGift(args) {
      window.corSociety.sendGift(args || {})
    },
    hostDinner(args) {
      window.corSociety.hostDinner(args || {})
    },
    askSupport(args) {
      window.corSociety.askSupport(args || {})
    },
    tradeDeal(args) {
      window.corSociety.tradeDeal(args || {})
    },
    offerPatronage(args) {
      window.corSociety.offerPatronage(args || {})
    },
    seekPatronage(args) {
      window.corSociety.seekPatronage(args || {})
    },
    startRivalry(args) {
      window.corSociety.startRivalry(args || {})
    },
    reconcile(args) {
      window.corSociety.reconcile(args || {})
    },
    praisePerson(args) {
      window.corSociety.praisePerson(args || {})
    },
    requestIntroduction(args) {
      window.corSociety.requestIntroduction(args || {})
    },
    spreadRumor(args) {
      window.corSociety.spreadRumor(args || {})
    },
    answerSlander(args) {
      window.corSociety.answerSlander(args || {})
    },
    ignoreSlander(args) {
      window.corSociety.ignoreSlander(args || {})
    },
    acceptOpening(args) {
      window.corSociety.acceptOpening(args || {})
    },
    declineOpening(args) {
      window.corSociety.declineOpening(args || {})
    },
    supportPetition(args) {
      window.corSociety.supportPetition(args || {})
    },
    refusePetition(args) {
      window.corSociety.refusePetition(args || {})
    },
    attendFamilyInvitation(args) {
      window.corSociety.attendFamilyInvitation(args || {})
    },
    declineFamilyInvitation(args) {
      window.corSociety.declineFamilyInvitation(args || {})
    },
    endorseOffice(args) {
      window.corSociety.endorseOffice(args || {})
    },
    honorWedding(args) {
      window.corSociety.honorWedding(args || {})
    },
    judgeInheritance(args) {
      window.corSociety.judgeInheritance(args || {})
    },
    investVenture(args) {
      window.corSociety.investVenture(args || {})
    },
    collectVentureResult(args) {
      window.corSociety.collectVentureResult(args || {})
    },
    shieldScandal(args) {
      window.corSociety.shieldScandal(args || {})
    },
    exploitScandal(args) {
      window.corSociety.exploitScandal(args || {})
    },
    declineFamilyAffair(args) {
      window.corSociety.declineFamilyAffair(args || {})
    }
  }
}
