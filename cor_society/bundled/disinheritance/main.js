{
  canTriggerIfUnavailable: true,
  checkType: 'householdCharacters',
  checkAndAct(characterId) {
    let character = daapi.getCharacter({ characterId })
    let player = daapi.getCharacter({ characterId: daapi.getState().current.id }) // Obtiene el personaje jugador

    if (
      !character.isDead &&
      !character.flagWasGivenInheritance &&
      character.id !== player.id // Verifica que no sea el personaje jugador
    ) {
      daapi.addCharacterAction({
        characterId,
        key: 'Disinherit',
        action: {
          title: 'Disinherit',
          icon: daapi.requireImage('/cor_society/bundled/disinheritance/icon.svg'),
          isAvailable: true,
          hideWhenBusy: false,
          process: {
            event: '/cor_society/bundled/disinheritance/main',
            method: 'process',
            context: {
              characterId
            }
          }
        }
      })
    } else {
      daapi.deleteCharacterAction({
        characterId,
        key: 'Disinherit'
      })
    }
  },
  methods: {
    process({ characterId }) {
      let character = daapi.getCharacter({ characterId })
      daapi.pushInteractionModalQueue({
        title: 'Disinherit',
        message: `Do you wish to disinherit [c|${characterId}|${character.praenomen}]? This action will remove their inheritance rights.`,
        image: daapi.requireImage('/cor_society/bundled/disinheritance/icon.svg'),
        options: [
          {
            variant: 'warning',
            text: `Disinherit ${character.praenomen}`,
            tooltip: `[c|${characterId}|${character.praenomen}] will be disinherited. This action cannot be undone.`,
            statChanges: {
              prestige: -10,
              influence: -20
            },
            action: {
              event: '/cor_society/bundled/disinheritance/main',
              method: 'doDisinherit',
              context: { characterId }
            }
          },
          {
            text: 'No, let them keep their inheritance rights'
          }
        ]
      })
    },
    doDisinherit({ characterId }) {
      daapi.updateCharacter({
        characterId,
        character: {
          flagWasGivenInheritance: true
        }
      })
    }
  }
}
