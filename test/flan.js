var fork = require('child_process').fork
  , expect = require('chai').expect
  , CHILD = require.resolve('./fixtures/child')
  , PARENT = require.resolve('./fixtures/parent')
  , CLUSTER = require.resolve('./fixtures/cluster')

describe('Flan', function () {
  describe('child', function () {
    it('should start (and forcefully close)', function (done) {
      var child = fork(CHILD)
        .on('message', function (message) {
          var split = message.split(':')

          expect(split).to.have.length(2)
          expect('start').to.equal(split[0])
          expect(String(child.pid)).to.equal(split[1])

          child.kill()
        })
        .on('exit', function () {
          done()
        })
    })

    it('should gracefully collapse', function (done) {
      var child = fork(CHILD)
        .on('message', function (message) {
          var split = message.split(':')

          expect(split).to.have.length(2)
          expect('start').to.equal(split[0])
          expect(String(child.pid)).to.equal(split[1])

          child.disconnect()
        })
        .on('exit', function () {
          done()
        })
    })
  })

  describe('parent', function () {
    it('should start (and forcefully close)', function (done) {
      var parent = fork(PARENT)
        .on('message', function (message) {
          var split = message.split(':')

          expect(split).to.have.length(2)
          expect('start').to.equal(split[0])
          expect(String(parent.pid)).to.equal(split[1])

          parent.kill()
        })
        .on('exit', function () {
          done()
        })
    })

    it('should start (and forcefully close) a child', function (done) {
      var count = 0

      var parent = fork(PARENT)
        .on('message', function (message) {
          var split = message.split(':')

          expect(split).to.have.length(2)
          expect('start').to.equal(split[0])
          count++

          if (count === 3) {
            parent.kill()
          }
        })
        .on('exit', function () {
          done()
        })
    })

    it('should gracefully collapse', function (done) {
      var count = 0

      var parent = fork(PARENT)
        .on('message', function (message) {
          var split = message.split(':')

          expect(split).to.have.length(2)
          expect('start').to.equal(split[0])
          count++

          if (count === 3) {
            parent.disconnect()
          }
        })
        .on('exit', function () {
          done()
        })
    })
  })

  describe('cluster', function () {
    it('should start (and forcefully close)', function (done) {
      var cluster = fork(PARENT)
        .on('message', function (message) {
          var split = message.split(':')

          expect(split).to.have.length(2)
          expect('start').to.equal(split[0])
          expect(String(cluster.pid)).to.equal(split[1])

          cluster.kill()
        })
        .on('exit', function () {
          done()
        })
    })

    it('should start (and forcefully close) a child', function (done) {
      var count = 0

      var cluster = fork(PARENT)
        .on('message', function (message) {
          var split = message.split(':')

          expect(split).to.have.length(2)
          expect('start').to.equal(split[0])
          count++

          if (count === 3) {
            cluster.kill()
          }
        })
        .on('exit', function () {
          done()
        })
    })

    it('should gracefully collapse', function (done) {
      var count = 0

      var cluster = fork(PARENT)
        .on('message', function (message) {
          var split = message.split(':')

          expect(split).to.have.length(2)
          expect('start').to.equal(split[0])
          count++

          if (count === 3) {
            cluster.disconnect()
          }
        })
        .on('exit', function () {
          done()
        })
    })
  })
})
