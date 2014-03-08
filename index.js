var levelup = require('levelup')
  , db = levelup('./inbox-db')

module.exports = inbox

function inbox(ziggy) {
  ziggy.on('message', parse_message)
  ziggy.on('pm', parse_pm)
  ziggy.on('join', check_inbox)

  function parse_message(user, channel, message) {
    var bits = message.split(/\s+/)

    var command = bits[0]
      , rest = bits.slice(1).join(' ')

    if(command !== '!tell' && command !== '!inbox') return

  }

  function parse_pm(user, message) {
    parse_message(user, user.nick, message)
  }

  function check_inbox(user, channel) {
    db.get(user.nick, show_inbox)

    function show_inbox(err, _messages) {
      if(err) {
        return say_nothing(channel)
      }

      var message = JSON.parse(_messages)

      for(var i = 0, l = messages.length; i < l; ++i) {
        ziggy.say(channel, messages[i])
      }
    }
  }
}
