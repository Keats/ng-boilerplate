var chai, chaiAsPromised, expect;

chai = require("chai");

chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

expect = chai.expect;

describe("protractor library", function() {

  it("should expose the correct global variables", function() {
    expect(protractor).to.exist;
    expect(browser).to.exist;
    expect(element).to.exist;
    expect($).to.exist;
  });

});
