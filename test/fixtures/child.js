var flan = require('../../')
  , timer = null
  , noop = function () {}

function start() {
  if (timer) {
    return
  }

  timer = setInterval(noop, 100)
  process.send && process.send('start:' + process.pid)
}

function stop() {
  if (!timer) {
    return
  }

  clearInterval(timer)
  timer = null
}

flan.on('soft', stop)
start()
