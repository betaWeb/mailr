const expect = require('chai').expect
const sinon = require('sinon')
const Mailr = require('../src/Mailer')

describe('Message', () => {

  let message = null

  beforeEach(() => message = (new Mailr).createMessage())
  afterEach(() => message = null)

  describe('#email', () => {

    it('should throw Error on email empty suject', () => {
      sinon.spy(message, 'send')
      expect(() => message.send()).to.throw('Message::send - Missing email subject')
      message.send.restore()
    })

  })

  describe('#recipients', () => {

    it('should have receivers', () => {
      message.receivers('to@local.dev', 'cc@local.dev', 'bcc@local.dev')
      expect(message.get('to')[0]).to.be.equal('to@local.dev')
      expect(message.get('cc')[0]).to.be.equal('cc@local.dev')
      expect(message.get('bcc')[0]).to.be.equal('bcc@local.dev')
    })
  
    it('should throw Error if empty receivers', () => {
      sinon.stub(message, 'send').returns(true)
      sinon.spy(message, 'receivers')
      expect(message.receivers).to.throw('Message.receivers - You must define a receiver at least')
      message.receivers.restore()
      message.send.restore()
    })

    it('should have valid emitter', () => {
      message.from('contact@local.dev').to('to@local.dev')
      expect(message.get('from')[0]).to.be.equal('contact@local.dev')
    })

  })

  describe('#template', () => {

    it('should have a template', () => {
      sinon.stub(message, 'send').returns(message)

      message
        .from('contact@local.dev')
        .to('to@local.dev')
        .template('simple.njk')
        .subject('test')
        .send()

      expect(message.get('template_name')).to.be.equal('simple.njk')

      message.send.restore()
    })

  })

  describe('#attachment', () => {
    
    it('should not have an attachment', () => {
      sinon.stub(message, 'send').returns(message)

      message
        .from('contact@local.dev')
        .to('to@local.dev')
        .send()

      expect(message.get('attachments').length).to.be.equal(0)

      message.send.restore()
    })
    
    it('should have one attachment', () => {
      sinon.stub(message, 'send').returns(true)

      message
        .from('contact@local.dev')
        .to('to@local.dev')
        .attachment('examples/assets/img_1.png', 'Rick_and_Morty.pdf')
        .send()

      expect(message.get('attachments').length).to.be.equal(1)

      message.send.restore()
    })

    it('should have valid attachment', () => {
      sinon.stub(message, 'send').returns(true)

      message
        .from('contact@local.dev')
        .to('to@local.dev')
        .attachment('examples/assets/img_1.png', 'Rick_and_Morty.pdf')
        .send()

      expect(message.get('attachments')[0].name).to.be.equal('Rick_and_Morty.pdf')
      expect(message.get('attachments')[0].path).to.be.equal('examples/assets/img_1.png')

      message.send.restore()
    })

  })

})