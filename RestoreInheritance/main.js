{
  canTriggerIfUnavailable: true,
  checkType: 'householdCharacters',
  checkAndAct(characterId) {
    let character = daapi.getCharacter({ characterId })
    let player = daapi.getCharacter({ characterId: daapi.getState().current.id }) // Obtiene el personaje jugador

    if (
      !character.isDead &&
      character.flagWasGivenInheritance && // Check if they were disinherited
      character.id !== player.id // Verifica que no sea el personaje jugador
    ) {
      daapi.addCharacterAction({
        characterId,
        key: 'RestoreInheritance',
        action: {
          title: 'Restore Inheritance',
          icon: daapi.requireImage('/RestoreInheritance/icon.svg'),
          isAvailable: true,
          hideWhenBusy: false,
          process: {
            event: '/RestoreInheritance/main',
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
        key: 'RestoreInheritance'
      })
    }
  },
  methods: {
    process({ characterId }) {
      let character = daapi.getCharacter({ characterId })
      daapi.pushInteractionModalQueue({
        title: 'Restore Inheritance',
        message: `Do you wish to restore the inheritance rights of [c|${characterId}|${character.praenomen}]? This action will revert their disinheritance.`,
        image: daapi.requireImage('/RestoreInheritance/icon.svg'),
        options: [
          {
            variant: 'success',
            text: `Restore ${character.praenomen}'s inheritance`,
            tooltip: `[c|${characterId}|${character.praenomen}] will regain their inheritance rights.`,
            statChanges: {
              prestige: 5,
              influence: 10
            },
            action: {
              event: '/RestoreInheritance/main',
              method: 'doRestoreInheritance',
              context: { characterId }
            }
          },
          {
            text: 'No, keep them disinherited'
          }
        ]
      })
    },
    doRestoreInheritance({ characterId }) {
      daapi.updateCharacter({
        characterId,
        character: {
          flagWasGivenInheritance: false // Revert the disinheritance flag
        }
      })
    }
  }
}
