{
  canTriggerIfUnavailable: true,
  checkType: 'general',
  checkAndAct() {
    daapi.addGlobalAction({
      key: 'cor_society',
      action: {
        title: 'Roman Society',
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
        icon: daapi.requireImage('/cor_society/shield.svg'),
        isAvailable: true,
        process: {
          event: '/cor_society/engine',
          method: 'openPlayerCrest'
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
      if (window.corSociety && window.corSociety.version === '1.1.0') {
        window.corSociety.ensure()
        window.corSociety.startPlayerCrestOverlay()
        return
      }

      window.corSociety = {
        version: '1.1.0',
        event: '/cor_society/engine',
        flag: 'corSocietyState',
        noticeFlag: 'corSocietyInstallNoticeSeen',
        logLimit: 18,
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
        ensure() {
          let state = daapi.getState()
          if (!state || !state.current) {
            return this.createState()
          }
          let society = this.load()
          this.syncWithGame(society, state)
          this.ensureCrests(society, state)
          this.save(society)
          return society
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
          daapi.pushInteractionModalQueue({
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
          society.crests = society.crests || {}
          society.crestSettings = { playerOverlay: true, ...(society.crestSettings || {}) }
          society.houseRelations = society.houseRelations || {}
          society.log = society.log || []
          return society
        },
        save(society) {
          daapi.setGlobalFlag({ flag: this.flag, data: society })
        },
        syncWithGame(society, state) {
          let members = this.collectHouseMembers(state)
          for (let dynastyId in members) {
            if (!members.hasOwnProperty(dynastyId)) {
              continue
            }
            let house = society.houses[dynastyId] || this.createHouseRecord(dynastyId)
            let summary = this.summarizeHouse(dynastyId, members[dynastyId], state)
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
          let player = state.characters[current.id] || {}
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
            let age = this.age(character, state)
            if (age < 14) {
              continue
            }
            if (household[characterId] && character.dynastyId === playerDynastyId) {
              continue
            }
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
          let headId = daapi.generateCharacter({
            characterFeatures: {
              gender: isMale ? 'male' : 'female',
              isMale,
              praenomen: isMale ? this.pick(this.maleNames) : this.pick(this.femaleNames),
              birthMonth: this.randomInt(0, 11),
              birthYear: state.year - this.randomInt(24, 62),
              job,
              jobLevel: this.randomInt(0, stratum === 'senatorial' ? 12 : stratum === 'equestrian' ? 9 : 6),
              traits: [this.pick(profile.traits || [])],
              skills: this.skillsForStratum(stratum),
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
          if (Math.random() > 0.35) {
            this.generateRelative(society, state, house, stratum, head)
          }
          this.log(society, 'New ' + profile.singular + ' enters public life: ' + house.name + '.')
          return house
        },
        generateRelative(society, state, house, stratum, head) {
          let profile = this.strata[stratum]
          let isMale = Math.random() > 0.5
          let relativeId = daapi.generateCharacter({
            characterFeatures: {
              gender: isMale ? 'male' : 'female',
              isMale,
              praenomen: isMale ? this.pick(this.maleNames) : this.pick(this.femaleNames),
              birthMonth: this.randomInt(0, 11),
              birthYear: state.year - this.randomInt(16, 36),
              job: this.pick(profile.jobs),
              jobLevel: this.randomInt(0, 5),
              traits: [this.pick(profile.traits || [])],
              skills: this.skillsForStratum(stratum),
              fatherId: head.isMale ? head.id : null,
              motherId: !head.isMale ? head.id : null,
              childrenIds: []
            },
            dynastyFeatures: {}
          })
          daapi.updateCharacter({
            characterId: relativeId,
            character: {
              dynastyId: house.id,
              fatherId: head.isMale ? head.id : null,
              motherId: !head.isMale ? head.id : null
            }
          })
          let headChildren = (head.childrenIds || []).slice()
          headChildren.push(relativeId)
          daapi.updateCharacter({
            characterId: head.id,
            character: {
              childrenIds: headChildren
            }
          })
          house.memberIds = house.memberIds || []
          house.notableIds = house.notableIds || []
          house.memberIds.push(relativeId)
          house.notableIds.push(relativeId)
          society.generatedCharacterIds.push(relativeId)
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
            return prestige < 1200 || hasLabor ? 'poor' : 'freedmen'
          }
          if (prestige < 1200 || strength < 12 || hasLabor) {
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
          this.simulateHouseTurns(society, state)
          this.simulateInterHouseAffairs(society, state)
          this.driftRelations(society)
          this.applyNetworkModifiers(society)
          if (society.settings.monthlyEvents && Math.random() < 0.42) {
            this.queueMonthlyEvent(society, state)
          }
          this.save(society)
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
            house.ai.cash = Math.max(0, Math.round(house.ai.cash))
            house.ai.influence = Math.max(0, Math.round(house.ai.influence))
            house.ai.prestige = Math.max(0, Math.round(house.ai.prestige))
            house.wealth = Math.max(house.wealth || 0, Math.round(house.ai.cash + house.ai.property.land * 60 + house.ai.property.animals * 20 + house.ai.property.trade * 140))
            house.power = Math.max(house.power || 0, Math.round(house.ai.influence / 18 + house.ai.prestige / 2500))
            house.strength = Math.max(1, Math.round((house.strength || 0) * 0.85 + (house.power || 0) * 0.25 + (house.wealth || 0) / 160 + (house.stability || 0) / 8))
          })
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
          this.generateRelative(society, state, house, house.stratum || 'plebeian', head)
          house.lastFamilyEvent = house.name + ' expands its household through marriage and dependants.'
          return true
        },
        recordFamilyEvent(society, house, event) {
          let labels = {
            officeCampaign: house.name + ' begins maneuvering for public office.',
            tradeVenture: house.name + ' expands a commercial venture.',
            marriageAlliance: house.name + ' negotiates a marriage alliance.',
            inheritanceDispute: house.name + ' is pulled into an inheritance dispute.',
            feud: house.name + ' sharpens an old feud.',
            scandal: 'A scandal weakens ' + house.name + '.'
          }
          house.lastFamilyEvent = labels[event] || event
          if (!house.pendingPlayerEvent && Math.random() < this.playerEventChance(house, event)) {
            house.pendingPlayerEvent = event
          }
          if (Math.random() < 0.55) {
            this.log(society, house.lastFamilyEvent)
          }
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
          let rivalPressure = 0
          for (let houseId in society.houses) {
            if (!society.houses.hasOwnProperty(houseId)) {
              continue
            }
            let house = society.houses[houseId]
            let profile = this.strata[house.stratum] || this.strata.plebeian
            if ((house.relation || 0) >= 55 || (house.favor || 0) >= 2) {
              allyIncome += Math.max(1, Math.round((profile.revenue || 20) * ((house.relation || 50) / 100)))
            }
            if (house.rivalry || (house.relation || 0) <= -55) {
              rivalPressure += Math.max(1, Math.round((profile.revenue || 20) / 3))
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
          if (rivalPressure > 0) {
            daapi.addAdditiveModifier({
              key: 'revenue',
              id: 'cor_society_rival_pressure',
              durationInMonths: 2,
              amount: -rivalPressure
            })
          }
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
          }
        },
        eventFamilyAffair(society, house) {
          let event = house.pendingPlayerEvent
          let state = daapi.getState()
          let image = this.houseCrestIcon(society, house)
          this.save(society)
          if (event === 'officeCampaign') {
            daapi.pushInteractionModalQueue({
              title: house.name + ' seeks office',
              message: house.name + ' is gathering support for a magistracy. They ask whether your household will be seen beside them.',
              image: image,
              options: [
                {
                  variant: 'info',
                  text: 'Endorse them',
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
            daapi.pushInteractionModalQueue({
              title: 'Wedding politics in ' + house.name,
              message: house.name + ' invites your household to honor a marriage alliance. A gift would be noticed; absence would be noticed too.',
              image: image,
              options: [
                {
                  text: 'Send a wedding gift',
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
            daapi.pushInteractionModalQueue({
              title: 'Inheritance dispute: ' + house.name,
              message: 'A dispute inside ' + house.name + ' has become public. They ask you to lend judgment and pressure.',
              image: image,
              options: [
                {
                  variant: 'warning',
                  text: 'Intervene',
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
            daapi.pushInteractionModalQueue({
              title: house.name + ' expands trade',
              message: house.name + ' has found a profitable opening and offers you a place in the venture.',
              image: image,
              options: [
                {
                  variant: 'info',
                  text: 'Invest with them',
                  action: {
                    event: this.event,
                    method: 'investVenture',
                    context: { houseId: house.id }
                  }
                },
                {
                  text: 'Decline',
                  action: {
                    event: this.event,
                    method: 'declineFamilyAffair',
                    context: { houseId: house.id }
                  }
                }
              ]
            })
          } else if (event === 'scandal') {
            daapi.pushInteractionModalQueue({
              title: 'Scandal in ' + house.name,
              message: house.name + ' has been embarrassed by a scandal. You can shield them, exploit it, or let the city talk.',
              image: image,
              options: [
                {
                  text: 'Shield them',
                  action: {
                    event: this.event,
                    method: 'shieldScandal',
                    context: { houseId: house.id }
                  }
                },
                {
                  variant: 'danger',
                  text: 'Exploit it',
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
          daapi.pushInteractionModalQueue({
            title: house.name + ' spreads a rumor',
            message: 'Your rivals in ' + house.name + ' are whispering that your household has overreached its station. The rumor is small now, but it has teeth.',
            image: this.houseCrestIcon(society, house),
            options: [
              {
                variant: 'warning',
                text: 'Answer publicly',
                tooltip: 'Spend influence to blunt the attack and make the rivalry hotter.',
                action: {
                  event: this.event,
                  method: 'answerSlander',
                  context: { houseId: house.id }
                }
              },
              {
                text: 'Ignore it',
                tooltip: 'Lose some prestige, but avoid making the quarrel worse.',
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
          daapi.pushInteractionModalQueue({
            title: house.name + ' offers an opening',
            message: 'A friendly contact from ' + house.name + ' suggests a public exchange of support. It would strengthen your network, though it may bind you to their interests.',
            image: this.houseCrestIcon(society, house),
            options: [
              {
                variant: 'info',
                text: 'Accept their support',
                action: {
                  event: this.event,
                  method: 'acceptOpening',
                  context: { houseId: house.id }
                }
              },
              {
                text: 'Stay independent',
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
          daapi.pushInteractionModalQueue({
            title: 'Petition from ' + house.name,
            message: 'A lesser family connected to ' + house.name + ' asks for your help in a local dispute. It is not glamorous politics, but gratitude from the lower orders can travel far.',
            image: this.houseCrestIcon(society, house),
            options: [
              {
                variant: 'info',
                text: 'Hear their petition',
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
        openHub() {
          let state = daapi.getState()
          let society = this.ensure()
          let counts = this.countByStratum(society)
          let rivals = this.sortedHouses(society).filter((house) => house.rivalry || house.relation <= -55).length
          let allies = this.sortedHouses(society).filter((house) => house.relation >= 55 || house.favor >= 2).length
          let message = [
            'Year ' + state.year + ', month ' + ((state.month || 0) + 1),
            'Known houses: ' + Object.keys(society.houses).length,
            'Allies and patrons: ' + allies,
            'Open rivalries: ' + rivals,
            'Network income and rival pressure update each month.'
          ].join('\n')
          daapi.pushInteractionModalQueue({
            title: 'Roman Society',
            message,
            image: daapi.requireImage('/cor_society/icon.svg'),
            options: [
              ...this.stratumOrder.map((stratum) => {
                return {
                  text: this.strata[stratum].title + ' (' + (counts[stratum] || 0) + ')',
                  action: {
                    event: this.event,
                    method: 'openEstate',
                    context: { stratum, page: 0 }
                  }
                }
              }),
              {
                text: 'Allies and rivals',
                action: {
                  event: this.event,
                  method: 'openRelations'
                }
              },
              {
                text: 'Recent affairs',
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
          daapi.pushInteractionModalQueue({
            title: this.strata[stratum].title,
            message: shown.length ? 'Choose a house to inspect.' : 'No houses are known in this order yet.',
            image: daapi.requireImage('/cor_society/icon.svg'),
            options
          })
        },
        openRelations() {
          let society = this.ensure()
          let state = daapi.getState()
          let houses = this.sortedHouses(society).filter((house) => house.relation >= 45 || house.relation <= -35 || house.favor > 0 || house.rivalry)
          let options = houses.slice(0, 10).map((house) => {
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
          options.push({
            text: 'Back',
            action: {
              event: this.event,
              method: 'openHub'
            }
          })
          daapi.pushInteractionModalQueue({
            title: 'Allies and Rivals',
            message: houses.length ? 'These houses matter most to your current political life.' : 'No strong relationships or rivalries yet.',
            image: daapi.requireImage('/cor_society/icon.svg'),
            options
          })
        },
        openLog() {
          let society = this.ensure()
          daapi.pushInteractionModalQueue({
            title: 'Recent Affairs',
            message: (society.log || []).length ? society.log.join('\n') : 'No public affairs recorded yet.',
            image: daapi.requireImage('/cor_society/icon.svg'),
            options: [
              {
                text: 'Back',
                action: {
                  event: this.event,
                  method: 'openHub'
                }
              }
            ]
          })
        },
        openPlayerCrest() {
          let society = this.ensure()
          let state = daapi.getState()
          let character = state.characters[(state.current || {}).id] || {}
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
          daapi.pushInteractionModalQueue({
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
        openHouse({ houseId }) {
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
          daapi.pushInteractionModalQueue({
            title: house.name,
            message,
            image: this.houseCrestIcon(society, house),
            options: [
              {
                variant: 'info',
                text: 'Notable people',
                action: {
                  event: this.event,
                  method: 'openPeople',
                  context: { houseId }
                }
              },
              {
                text: 'Send gift (' + giftCost + ')',
                disabled: cash < giftCost,
                showDisabledWithTooltip: true,
                tooltip: 'Spend cash to improve relations and possibly earn a favor.',
                action: {
                  event: this.event,
                  method: 'sendGift',
                  context: { houseId }
                }
              },
              {
                text: 'Host dinner (' + dinnerCost + ')',
                disabled: cash < dinnerCost,
                showDisabledWithTooltip: true,
                tooltip: 'A wider social gesture. Improves relations and prestige.',
                action: {
                  event: this.event,
                  method: 'hostDinner',
                  context: { houseId }
                }
              },
              {
                variant: 'info',
                text: 'Ask for support',
                disabled: !canAsk,
                showDisabledWithTooltip: true,
                tooltip: 'Requires a favor or a warm relationship. Grants influence.',
                action: {
                  event: this.event,
                  method: 'askSupport',
                  context: { houseId }
                }
              },
              {
                text: 'Negotiate trade',
                disabled: (house.relation || 0) < 5,
                showDisabledWithTooltip: true,
                tooltip: 'Build a temporary revenue tie with this house.',
                action: {
                  event: this.event,
                  method: 'tradeDeal',
                  context: { houseId }
                }
              },
              this.patronageOption(house),
              {
                variant: house.rivalry ? 'info' : 'danger',
                text: house.rivalry ? 'Seek reconciliation' : 'Declare rivalry',
                action: {
                  event: this.event,
                  method: house.rivalry ? 'reconcile' : 'startRivalry',
                  context: { houseId }
                }
              },
              {
                text: 'Back',
                action: {
                  event: this.event,
                  method: 'openEstate',
                  context: { stratum: house.stratum, page: 0 }
                }
              }
            ].filter(Boolean)
          })
        },
        openPeople({ houseId }) {
          let society = this.ensure()
          let state = daapi.getState()
          let house = society.houses[houseId]
          if (!house) {
            this.openHub()
            return
          }
          let peopleIds = this.visibleHousePeople(house, state)
          let options = peopleIds.slice(0, 12).map((characterId) => {
            let character = state.characters[characterId]
            return {
              text: character ? this.characterName(character, state) : characterId,
              tooltip: character ? this.characterTooltip(character, state) : '',
              icons: character ? [this.characterPortrait(character, state), this.houseCrestIcon(society, house)] : [this.houseCrestIcon(society, house)],
              action: {
                event: this.event,
                method: 'openPerson',
                context: { houseId, characterId }
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
          daapi.pushInteractionModalQueue({
            title: 'People of ' + house.name,
            message: peopleIds.length ? 'Notable and visible members of this house.' : 'No visible living members are known yet.',
            image: this.houseCrestIcon(society, house),
            options
          })
        },
        openPerson({ houseId, characterId }) {
          let society = this.ensure()
          let state = daapi.getState()
          let house = society.houses[houseId]
          let character = state.characters[characterId]
          if (!house || !character) {
            this.openHouse({ houseId })
            return
          }
          let message = [
            this.characterTooltip(character, state),
            'House relation: ' + this.signed(house.relation || 0),
            'House favors: ' + (house.favor || 0)
          ].join('\n')
          daapi.pushInteractionModalQueue({
            title: this.characterName(character, state),
            message,
            image: this.characterPortrait(character, state),
            options: [
              {
                text: 'Praise in public',
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
                action: {
                  event: this.event,
                  method: 'requestIntroduction',
                  context: { houseId, characterId }
                }
              },
              {
                variant: 'danger',
                text: 'Spread rumor',
                action: {
                  event: this.event,
                  method: 'spreadRumor',
                  context: { houseId, characterId }
                }
              },
              {
                text: 'Back',
                action: {
                  event: this.event,
                  method: 'openPeople',
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
            this.applyStats({ cash: -120, prestige: 7 })
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
            let cost = Math.max(80, Math.round(this.actionCost(house, 'gift') * 0.8))
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
        investVenture({ houseId }) {
          this.withHouse(houseId, (society, house) => {
            let cost = Math.max(120, Math.round(this.actionCost(house, 'gift') * 0.9))
            let income = Math.max(12, Math.round((this.strata[house.stratum].revenue || 25) * 0.9))
            this.applyStats({ cash: -cost })
            daapi.addAdditiveModifier({
              key: 'revenue',
              id: 'cor_society_venture_' + this.safeId(house.id),
              durationInMonths: 8,
              amount: income
            })
            house.pendingPlayerEvent = false
            house.relation = this.clamp((house.relation || 0) + 10, -100, 100)
            house.wealth = (house.wealth || 0) + cost
            this.log(society, 'You invest with ' + house.name + ': +' + income + ' monthly revenue for eight months.')
          })
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
        declineFamilyAffair({ houseId }) {
          this.withHouse(houseId, (society, house) => {
            house.pendingPlayerEvent = false
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
          let base = profile.cost || 200
          if (type === 'dinner') {
            return Math.round(base * 1.8)
          }
          if (type === 'reconcile') {
            return Math.round(base * 1.2)
          }
          return base
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
          let character = state.characters[(state.current || {}).id] || {}
          return 'player_' + this.safeId(character.dynastyId || (state.current || {}).id || 'house')
        },
        ensurePlayerCrest(society, state) {
          society.crests = society.crests || {}
          let crestId = this.playerCrestId(state)
          let character = state.characters[(state.current || {}).id] || {}
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
          let traits = (character.traits || []).slice(0, 4).join(', ') || 'none'
          let skills = character.skills || {}
          return [
            'Age: ' + age,
            'Job: ' + (character.job || 'none') + ' ' + (character.jobLevel || 0),
            'Traits: ' + traits,
            'Skills: I ' + Math.round(skills.intelligence || 0) + ', S ' + Math.round(skills.stewardship || 0) + ', E ' + Math.round(skills.eloquence || 0) + ', C ' + Math.round(skills.combat || 0)
          ].join('\n')
        },
        characterPortrait(character, state) {
          let portrait = this.vanillaCharacterPortrait(character, state)
          if (this.isImageData(portrait)) {
            return portrait
          }
          return this.generatedCharacterPortrait(character, state)
        },
        vanillaCharacterPortrait(character, state) {
          try {
            character = character || {}
            let look = character.look || {}
            let age = this.age(character, state || daapi.getState())
            let gender = character.gender || look.gender || (character.isMale ? 'male' : 'female')
            let ageStage = 'adult'
            if (age < 4) {
              ageStage = 'baby'
            } else if (age < 16) {
              ageStage = 'teen'
            } else if (age >= 55) {
              ageStage = 'old'
            }
            let portrait = daapi.getCharacterIcon({
              group: look.group || 'roman',
              gender,
              type: look.type || 'brown',
              ageStage
            })
            if (this.isImageData(portrait)) {
              return portrait
            }
          } catch (err) {
            console.warn(err)
          }
          return false
        },
        isImageData(value) {
          if (!value || typeof value !== 'string') {
            return false
          }
          return value.indexOf('data:image/') === 0 || value.indexOf('http') === 0 || value.indexOf('blob:') === 0
        },
        generatedCharacterPortrait(character, state) {
          state = state || daapi.getState()
          character = character || {}
          let look = character.look || {}
          let seed = String(character.id || character.praenomen || Math.random()) + '-' + String(character.charHash || '')
          let random = this.seededRandom(seed)
          let type = look.type || this.pickByRandom(['brown', 'brown_curly', 'dusky', 'olive', 'tan', 'hazel', 'auburn', 'blonde', 'black'], random)
          let gender = character.gender || look.gender || (character.isMale ? 'male' : 'female')
          let age = this.age(character, state)
          let palette = this.portraitPalette(type)
          let hair = this.pickByRandom(['short', 'curly', 'waves', 'bald', 'bun', 'veil'], random)
          if (gender === 'female' && hair === 'bald') {
            hair = 'bun'
          }
          if (age > 58 && random() > 0.45) {
            palette.hair = '#c7c0ad'
          }
          let name = this.escapeSvg(character.praenomen || '?').slice(0, 9)
          let svg = ''
          svg += '<svg xmlns="http://www.w3.org/2000/svg" width="144" height="168" viewBox="0 0 144 168">'
          svg += '<defs><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#efe3c7"/><stop offset="1" stop-color="#c7a76a"/></linearGradient><clipPath id="round"><rect x="8" y="8" width="128" height="152" rx="18"/></clipPath></defs>'
          svg += '<rect x="6" y="6" width="132" height="156" rx="20" fill="#231f25"/><rect x="10" y="10" width="124" height="148" rx="16" fill="url(#bg)"/>'
          svg += '<g clip-path="url(#round)">'
          svg += '<rect x="10" y="10" width="124" height="148" fill="#d9c18a"/>'
          svg += '<path d="M0 138 C24 112 44 105 72 105 C101 105 120 113 144 138 V170 H0 Z" fill="' + (gender === 'female' ? '#7c3040' : '#6f5130') + '"/>'
          svg += '<path d="M45 118 C51 104 93 104 99 118 L108 168 H36 Z" fill="' + palette.tunic + '"/>'
          svg += '<path d="M53 100 H91 V125 C82 133 62 133 53 125 Z" fill="' + palette.skin + '"/>'
          svg += '<ellipse cx="72" cy="67" rx="34" ry="43" fill="' + palette.skin + '" stroke="#7c5545" stroke-opacity=".28" stroke-width="2"/>'
          svg += this.generatedHairSvg(hair, palette.hair)
          svg += '<ellipse cx="58" cy="69" rx="4" ry="3" fill="#2b2523"/><ellipse cx="86" cy="69" rx="4" ry="3" fill="#2b2523"/>'
          svg += '<path d="M68 75 C66 83 66 88 73 88" fill="none" stroke="#7c5545" stroke-width="3" stroke-linecap="round"/>'
          svg += '<path d="M58 96 C66 103 80 103 88 96" fill="none" stroke="#7c3d34" stroke-width="3" stroke-linecap="round"/>'
          svg += '<path d="M47 61 C53 56 62 56 67 60 M77 60 C83 56 92 56 97 61" fill="none" stroke="' + palette.hair + '" stroke-width="4" stroke-linecap="round"/>'
          if (age >= 55) {
            svg += '<path d="M48 82 C55 86 61 86 66 82 M78 82 C84 86 91 86 96 82 M53 104 C65 110 79 110 91 104" fill="none" stroke="#8d7567" stroke-opacity=".45" stroke-width="2" stroke-linecap="round"/>'
          }
          svg += '</g>'
          svg += '<rect x="10" y="10" width="124" height="148" rx="16" fill="none" stroke="#d6aa3c" stroke-width="4"/>'
          svg += '<text x="72" y="150" text-anchor="middle" font-family="serif" font-size="13" font-weight="700" fill="#2d2522">' + name + '</text>'
          svg += '</svg>'
          return this.svgDataUri(svg)
        },
        portraitPalette(type) {
          let palettes = {
            black: { skin: '#6e4a36', hair: '#211716', tunic: '#42536b' },
            brown: { skin: '#b9825b', hair: '#3b2418', tunic: '#6f5130' },
            brown_curly: { skin: '#bd8a62', hair: '#322015', tunic: '#6b3f24' },
            dusky: { skin: '#8a5c43', hair: '#211615', tunic: '#355547' },
            olive: { skin: '#b69065', hair: '#2f251b', tunic: '#5c2d63' },
            tan: { skin: '#c99666', hair: '#4a2d1b', tunic: '#8f1f22' },
            hazel: { skin: '#c18a5f', hair: '#68401e', tunic: '#263f73' },
            auburn: { skin: '#c58d65', hair: '#7b3a1d', tunic: '#7c3040' },
            blonde: { skin: '#d0a274', hair: '#b7833b', tunic: '#2f5f45' }
          }
          return palettes[type] || palettes.brown
        },
        generatedHairSvg(style, color) {
          if (style === 'bald') {
            return '<path d="M45 54 C50 28 94 28 99 54 C88 43 56 43 45 54 Z" fill="' + color + '" opacity=".45"/>'
          }
          if (style === 'curly') {
            let curls = '<path d="M39 61 C39 30 57 20 72 20 C91 20 105 34 105 62 C95 48 49 48 39 61 Z" fill="' + color + '"/>'
            for (let i = 0; i < 7; i++) {
              curls += '<circle cx="' + (44 + i * 9) + '" cy="' + (42 + (i % 2) * 5) + '" r="8" fill="' + color + '"/>'
            }
            return curls
          }
          if (style === 'waves') {
            return '<path d="M38 64 C36 35 53 21 72 21 C94 21 108 38 105 65 C96 49 84 43 69 44 C55 44 45 51 38 64 Z" fill="' + color + '"/><path d="M43 43 C55 33 70 37 82 29 C89 37 97 42 102 55" fill="none" stroke="#f0d7a0" stroke-opacity=".18" stroke-width="4"/>'
          }
          if (style === 'bun') {
            return '<path d="M38 66 C36 35 54 22 72 22 C94 22 108 39 106 66 C95 49 49 49 38 66 Z" fill="' + color + '"/><circle cx="107" cy="66" r="12" fill="' + color + '"/>'
          }
          if (style === 'veil') {
            return '<path d="M36 65 C34 34 52 20 72 20 C95 20 110 37 108 66 L104 119 H40 Z" fill="#c9b183"/><path d="M44 62 C49 45 57 36 72 36 C88 36 97 45 101 62 C88 51 57 51 44 62 Z" fill="' + color + '"/>'
          }
          return '<path d="M39 62 C38 35 55 23 72 23 C93 23 105 37 105 63 C94 47 51 47 39 62 Z" fill="' + color + '"/>'
        },
        pickByRandom(list, random) {
          return list[Math.floor(random() * list.length) % list.length]
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
          return character ? this.characterPortrait(character, state) : daapi.requireImage('/cor_society/icon.svg')
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
          let target = this.findCurrentPortraitImage(state)
          if (!target) {
            this.clearPlayerCrestOverlay()
            return
          }
          let rect = target.getBoundingClientRect()
          if (!rect || rect.width < 28 || rect.height < 28) {
            this.clearPlayerCrestOverlay()
            return
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
          let size = Math.max(24, Math.min(42, Math.round(rect.width * 0.38)))
          badge.src = this.crestIcon(crest, 96)
          badge.style.left = Math.round(Math.max(2, rect.left - size * 0.28)) + 'px'
          badge.style.top = Math.round(Math.max(2, rect.top - size * 0.62)) + 'px'
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
          let portrait = this.characterPortrait(character, state)
          let exact = []
          let images = Array.prototype.slice.call(document.querySelectorAll('img'))
          images.forEach((img) => {
            let src = img.getAttribute('src') || img.src || ''
            if (src === portrait || img.src === portrait) {
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
        log(society, text) {
          let state = daapi.getState()
          let entry = 'Y' + state.year + ' M' + ((state.month || 0) + 1) + ': ' + text
          society.log = society.log || []
          society.log.unshift(entry)
          society.log = society.log.slice(0, this.logLimit)
        },
        monthKey(state) {
          return String(state.year || 0) + '-' + String(state.month || 0)
        },
        futureMonthKey(months) {
          let state = daapi.getState()
          let total = (state.year || 0) * 13 + (state.month || 0) + months
          return Math.floor(total / 13) + '-' + (total % 13)
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
        }
      }

      window.corSociety.ensure()
      window.corSociety.startPlayerCrestOverlay()
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
    openLog() {
      window.corSociety.openLog()
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
    openHouse(args) {
      window.corSociety.openHouse(args || {})
    },
    openPeople(args) {
      window.corSociety.openPeople(args || {})
    },
    openPerson(args) {
      window.corSociety.openPerson(args || {})
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
