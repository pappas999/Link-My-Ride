const RentalAgreementFactory = artifacts.require("RentalAgreementFactory");

module.exports = function(deployer) {
  deployer.deploy(RentalAgreementFactory);
};	