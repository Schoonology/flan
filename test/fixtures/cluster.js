var cluster = require('cluster')
  , flan = require('../../')
  , timer = null
  , noop = function () {}

function spawn() {
  return cluster.fork().on('message', function (message) {
    process.send && process.send(message)
  })
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

cluster.setupMaster({
  exec: require.resolve('./child')
})

flan
  .cascade()
  .cluster()

flan.on('soft', stop)
start()
