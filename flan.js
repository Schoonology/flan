var EventEmitter = require('events').EventEmitter
  , debug = require('debug')('flan')
  , emitter = new EventEmitter()
  , children = {}

/**
 * Adds **child** to the flan, involving it in any future `collapse`-s and `cascade`-s.
 *
 * @param  {ChildProcess|Worker} child The child process or cluster worker to be managed.
 * @return {Flan}
 */
emitter.add = add
function add(child) {
  var pid = child.pid || child.process.pid

  debug('[%s] Added: %s', process.pid, pid)

  children[pid] = child
  child.on('exit', function () {
    debug('[%s] Removed: %s', process.pid, pid)
    delete children[pid]
  })

  return emitter
}

/**
 * Installs event listeners on `process` to cascade soft and hard collapses to all `add`-ed processes.
 *
 * @return {Flan}
 */
emitter.cascade = cascade
function cascade() {
  if (process.listeners('disconnect').indexOf(collapse) !== -1) {
    return emitter
  }

  debug('[%s] Installed cascade handler.', process.pid)
  process.on('disconnect', collapse)
  process.on('exit', collapse.bind(null, true))

  return emitter
}

/**
 * Installs event listeners on `cluster` to automatically `add` all future `cluster.fork`-ed Workers.
 *
 * @return {Flan}
 */
emitter.cluster = cluster
function cluster() {
  if (require('cluster').listeners('fork').indexOf(add) !== -1) {
    return emitter
  }

  debug('[%s] Installed cluster handler.', process.pid)
  require('cluster').on('fork', add)

  return emitter
}

/**
 * Manually initiate a collapse of this process and all `add`-d processes. Defaults to a "soft" collapse.
 *
 * @param  {Boolean} hard If true, perform a "hard" collapse. Otherwise, perform a "soft" collapse.
 * @return {Flan}
 */
emitter.collapse = collapse
function collapse(hard) {
  debug('[%s] Starting %s collapse.', process.pid, hard ? 'hard' : 'soft')

  Object.keys(children).forEach(function (pid) {
    if (hard) {
      debug('[%s] Killing: %s', process.pid, pid)
      children[pid].kill()
    } else {
      debug('[%s] Disconnecting: %s', process.pid, pid)
      children[pid].disconnect()
    }
  })

  return emitter
}

/*!
 * Event aliases
 */
process.on('disconnect', function () {
  debug('[%s] Advising soft shutdown.', process.pid)
  emitter.emit('soft')
})
process.on('exit', function () {
  debug('[%s] Advising hard shutdown.', process.pid)
  emitter.emit('hard')
})

module.exports = emitter
