var levelup = require('levelup')
  , db = levelup('./inbox-db', {valueEncoding: 'json'})

module.exports = inbox_plugin

function inbox_plugin(ziggy) {
  ziggy.on('message', parse_message)
  ziggy.on('pm', parse_pm)
  ziggy.on('join', check_inbox)

  function parse_message(user, channel, message) {
    var bits = message.split(/\s+/)
      , routes

    var command = bits[0]
      , to_nick = bits[1]
      , rest = bits.slice(2).join(' ')

    if(command !== '!tell' && command !== '!inbox') return

    routes = {
        '!tell': do_tell
      , '!inbox': do_inbox
    }
    
    routes[command]()

    function do_inbox() {
      check_inbox(user, null)
    }

    function do_tell() {
      db.get(to_nick, append_message)

      function append_message(err, messages) {
        if(err) {
          if(err.type !== 'NotFoundError') return
          messages = []
        }

        messages.push('[' + timestamp() + '] <' + user.nick + '> ' + rest)

        db.put(to_nick, messages, noop)
      }
    }
  }

  function parse_pm(user, message) {
    parse_message(user, user.nick, message)
  }

  function check_inbox(user, channel) {
    db.get(user.nick, show_inbox)

    function show_inbox(err, messages) {
      if(err) {
        return say_nothing(user.nick)
      }

      for(var i = 0, l = messages.length; i < l; ++i) {
        ziggy.say(user.nick, messages[i])
      }

      db.del(user.nick, noop)
    }
  }

  function say_nothing(to) {
    ziggy.say(to, 'no messages')
  }
}

function noop() {}

function timestamp() {
  var now = new Date

  return [
      now.getFullYear()
    , pad(now.getMonth() + 1)
    , pad(now.getDate())
  ].join('-')
}

function pad(n) {
  return ('00' + n).slice(-2)
}
