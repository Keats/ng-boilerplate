var chai, chaiAsPromised, expect;

chai = require("chai");
chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
expect = chai.expect;

describe("ng-boilerplate homepage", function() {
    it("should have a title", function() {
        browser.get('http://localhost:8001/');
        $('h1').getText().then(function(text) {
           expect(text).to.equal("Hello");
        });
    });
});
