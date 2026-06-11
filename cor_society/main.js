{
  canTriggerIfUnavailable: true,
  checkType: 'general',
  checkAndAct: function() {
    daapi.addGlobalAction({
      key: 'cor_society',
      action: {
        title: 'Roman Society',
        tooltip: 'Opens the Society overview. Consequences: no stats change until you choose an action inside.',
        icon: daapi.requireImage('/cor_society/icon.svg'),
        isAvailable: true,
        process: {
          event: '/cor_society/main',
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
          event: '/cor_society/main',
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
    },
    openPlayerCrest: function() {
      try {
        daapi.invokeMethod({
          event: '/cor_society/engine',
          method: 'boot'
        })
        daapi.invokeMethod({
          event: '/cor_society/engine',
          method: 'openPlayerCrest'
        })
      } catch (err) {
        daapi.pushInteractionModalQueue({
          title: 'House Shield error',
          message: err.name + ': ' + err.message,
          image: daapi.requireImage('/cor_society/icon.svg')
        })
      }
    }
  }
}
