{
  canTriggerIfUnavailable: true,
  checkType: 'general',
  checkAndAct() {},
  methods: {
    open() {
      if (typeof daapi !== 'undefined' && daapi.openDevTools) {
        daapi.openDevTools()
      } else if (typeof daapi !== 'undefined' && daapi.pushInteractionModalQueue) {
        daapi.pushInteractionModalQueue({
          title: 'Developer tools unavailable',
          message: 'This build does not expose daapi.openDevTools on this device.',
          image: daapi.requireImage('/cor_society/icon.svg'),
          options: [{ text: 'Understood' }]
        })
      }
    }
  }
}
