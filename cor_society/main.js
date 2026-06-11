{
  canTriggerIfUnavailable: true,
  checkType: 'general',
  checkAndAct: function() {
    daapi.addGlobalAction({
      key: 'cor_society',
      action: {
        title: 'Roman Society',
        icon: daapi.requireImage('/cor_society/icon.svg'),
        isAvailable: true,
        process: {
          event: '/cor_society/main',
          method: 'openHub'
        }
      }
    })
    try {
      daapi.addCharacterAction({
        characterId: daapi.getState().current.id,
        key: 'cor_society_debug',
        action: {
          title: 'Roman Society',
          icon: daapi.requireImage('/cor_society/icon.svg'),
          isAvailable: true,
          hideWhenBusy: false,
          process: {
            event: '/cor_society/main',
            method: 'openHub'
          }
        }
      })
    } catch (actionErr) {
      console.warn(actionErr)
    }
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
      daapi.setGlobalFlag({
        flag: 'corSocietyLastError',
        data: err.name + ': ' + err.message
      })
      daapi.pushInteractionModalQueue({
        title: 'Roman Society loader active',
        message: 'The loader is active, but the society engine failed: ' + err.name + ': ' + err.message,
        image: daapi.requireImage('/cor_society/icon.svg')
      })
    }
  },
  methods: {
    openHub: function() {
      try {
        daapi.invokeMethod({
          event: '/cor_society/engine',
          method: 'boot'
        })
        daapi.invokeMethod({
          event: '/cor_society/engine',
          method: 'openHub'
        })
      } catch (err) {
        daapi.pushInteractionModalQueue({
          title: 'Roman Society engine error',
          message: err.name + ': ' + err.message,
          image: daapi.requireImage('/cor_society/icon.svg')
        })
      }
    }
  }
}
