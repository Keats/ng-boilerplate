describe 'AppCtrl', ->

  beforeEach module("ngBoilerplate")

  it "should have a dummy test", inject(->
    chai.expect(true).to.be.true
  )
