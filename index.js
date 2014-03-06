var levelup = require('levelup')
  , db = levelup('./inbox-db')

module.exports = inbox

function inbox(ziggy) {
  ziggy.on('message', parse_message)
  ziggy.on('pm', parse_pm)
  ziggy.on('join', check_inbox)

  function parse_message(user, channel, message) {
  }

  function parse_pm(user, message) {
    parse_message(user, user.nick, message)
  }

  function check_inbox(user, channel) {
  }
}
