const stationMail = {
    state () {
      return {
        haveMail: false
      }
    },
    mutations: {
        STATION_MAIL_CLEAR(state) {
        state.haveMail = false
      },
      STATION_MAIL_FULL(state){
        state.haveMail = true
      }
    },
  }
  export default stationMail