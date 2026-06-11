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
      if (window.corSociety && window.corSociety.version === '1.0.1') {
        window.corSociety.ensure()
        return
      }

      window.corSociety = {
        version: '1.0.1',
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
        ensure() {
          let state = daapi.getState()
          if (!state || !state.current) {
            return this.createState()
          }
          let society = this.load()
          this.syncWithGame(society, state)
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
          this.save(society)
          if (event === 'officeCampaign') {
            daapi.pushInteractionModalQueue({
              title: house.name + ' seeks office',
              message: house.name + ' is gathering support for a magistracy. They ask whether your household will be seen beside them.',
              image: daapi.requireImage('/cor_society/icon.svg'),
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
              image: daapi.requireImage('/cor_society/icon.svg'),
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
              image: daapi.requireImage('/cor_society/icon.svg'),
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
              image: daapi.requireImage('/cor_society/icon.svg'),
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
              image: daapi.requireImage('/cor_society/icon.svg'),
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
          this.save(society)
          daapi.pushInteractionModalQueue({
            title: house.name + ' spreads a rumor',
            message: 'Your rivals in ' + house.name + ' are whispering that your household has overreached its station. The rumor is small now, but it has teeth.',
            image: daapi.requireImage('/cor_society/icon.svg'),
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
          this.save(society)
          daapi.pushInteractionModalQueue({
            title: house.name + ' offers an opening',
            message: 'A friendly contact from ' + house.name + ' suggests a public exchange of support. It would strengthen your network, though it may bind you to their interests.',
            image: daapi.requireImage('/cor_society/icon.svg'),
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
          this.save(society)
          daapi.pushInteractionModalQueue({
            title: 'Petition from ' + house.name,
            message: 'A lesser family connected to ' + house.name + ' asks for your help in a local dispute. It is not glamorous politics, but gratitude from the lower orders can travel far.',
            image: daapi.requireImage('/cor_society/icon.svg'),
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
          page = parseInt(page || 0, 10)
          let houses = this.sortedHouses(society).filter((house) => house.stratum === stratum)
          let pageSize = 8
          let start = page * pageSize
          let shown = houses.slice(start, start + pageSize)
          let options = shown.map((house) => {
            return {
              text: this.houseOptionText(house),
              tooltip: this.houseTooltip(house),
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
          let houses = this.sortedHouses(society).filter((house) => house.relation >= 45 || house.relation <= -35 || house.favor > 0 || house.rivalry)
          let options = houses.slice(0, 10).map((house) => {
            return {
              text: this.houseOptionText(house),
              tooltip: this.houseTooltip(house),
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
            image: daapi.requireImage('/cor_society/icon.svg'),
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
          let options = (house.notableIds || []).slice(0, 8).map((characterId) => {
            let character = state.characters[characterId]
            return {
              text: character ? this.characterName(character, state) : characterId,
              tooltip: character ? this.characterTooltip(character, state) : '',
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
            message: 'Interact with notable members of this house.',
            image: daapi.requireImage('/cor_society/icon.svg'),
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
            image: daapi.requireImage('/cor_society/icon.svg'),
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
