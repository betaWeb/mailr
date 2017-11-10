const expect = require('chai').expect
const sinon = require('sinon')
const Mailr = require('../src/Mailer')

describe('Message', () => {

  let message = null

  beforeEach(() => message = (new Mailr).createMessage())
  afterEach(() => message = null)

  describe('#recipients', () => {

    it('should have receivers', () => {
      message.receivers('to@local.dev', 'cc@local.dev', 'bcc@local.dev')
      expect(message.get('to')[0]).to.be.equal('to@local.dev')
      expect(message.get('cc')[0]).to.be.equal('cc@local.dev')
      expect(message.get('bcc')[0]).to.be.equal('bcc@local.dev')
    })
  
    it.skip('should throw Error if empty receivers', () => {
      sinon.spy(message, 'receivers')
      message.receivers()
      expect(message.receivers).to.throw()
      message.receivers.restore()
    })

    it('should have valid emitter', () => {
      message.from('contact@local.dev').to('to@local.dev')
      expect(message.get('from')[0]).to.be.equal('contact@local.dev')
    })

  })

})