var fork = require('child_process').fork
  , flan = require('../../')
  , timer = null
  , noop = function () {}

function spawn() {
  return flan.add(fork(require.resolve('./child')).on('message', function (message) {
    process.send && process.send(message)
  }))
}

function start() {
  if (timer) {
    return
  }

  process.send && process.send('start:' + process.pid)
  timer = setInterval(noop, 100)
  spawn()
  spawn()
}

function stop() {
  if (!timer) {
    return
  }

  clearInterval(timer)
  timer = null
}

flan.cascade()
flan.on('soft', stop)
start()
