pragma solidity 0.4.24;
pragma experimental ABIEncoderV2;

//Truffle Imports
import "@chainlink/contracts/src/v0.4/ChainlinkClient.sol";
import "@chainlink/contracts/src/v0.4/vendor/Ownable.sol";
import "@chainlink/contracts/src/v0.4/interfaces/LinkTokenInterface.sol";
import "@chainlink/contracts/src/v0.4/interfaces/AggregatorV3Interface.sol";
import "./strings.sol";

//Remix Imports
//import "https://github.com/smartcontractkit/chainlink/blob/develop/evm-contracts/src/v0.4/ChainlinkClient.sol";
//import "https://github.com/smartcontractkit/chainlink/blob/develop/evm-contracts/src/v0.4/vendor/Ownable.sol";
//import "https://github.com/smartcontractkit/chainlink/blob/develop/evm-contracts/src/v0.4/interfaces/LinkTokenInterface.sol";
//import "https://github.com/smartcontractkit/chainlink/blob/master/evm-contracts/src/v0.4/interfaces/AggregatorV3Interface.sol";
//import "github.com/Arachnid/solidity-stringutils/strings.sol";


contract RentalAgreementFactory  {
    
    using SafeMath_Chainlink for uint;
    
    address private dappWallet = msg.sender;
    enum RentalAgreementStatus {PROPOSED, APPROVED, REJECTED, ACTIVE, COMPLETED, ENDED_ERROR}

    
    bytes32 JOB_ID = "534ea675a9524e8e834585b00368b178"; 
    
    address private constant LINK_KOVAN = 0xa36085F69e2889c224210F603D836748e7dC0088; 
    address private constant ORACLE_CONTRACT = 0x05c8fadf1798437c143683e665800d58a42b6e19;
    address private constant NODE_ADDRESS = 0xDC92b2B1C731d07dC9bd8D30D0B1A69F266f2A8A;
    uint256 constant private ORACLE_PAYMENT = 0.1 * 1 ether;
    
    
    address private constant ETH_USD_CONTRACT = 0x9326BFA02ADD2366b30bacB125260Af641031331;
    address private constant AUD_USD_CONTRACT = 0x5813A90f826e16dB392abd2aF7966313fc1fd5B8;
    address private constant GBP_USD_CONTRACT = 0x28b0061f44E6A9780224AA61BEc8C3Fcb0d37de9;
    
    enum  VehicleModels { Model_S, Model_3, Model_X, Model_Y, Cybertruck, Roadster}
    enum  VehicleStatus {PENDING, APPROVED}
    enum  Currency { ETH, USD, GBP, AUD }

    
    
    struct Vehicle {
        uint vehicleId;                
        address ownerAddress;         
        uint baseHireFee;              
        uint bondRequired;            
        Currency ownerCurrency;       
        VehicleModels vehicleModel;    
        string vehiclePlate;           
        int vehicleLongitude;          
        int vehicleLatitude;            
        VehicleStatus status;         
        
    }
    
    address[] internal keyList;

    AggregatorV3Interface internal ethUsdPriceFeed;
    AggregatorV3Interface internal audUsdPriceFeed;
    AggregatorV3Interface internal gbpUsdPriceFeed;
    

    mapping (address => Vehicle) vehicles; 
    
 
    RentalAgreement[] rentalAgreements;
    
    constructor() public payable {
       
        //newVehicle(0x54a47c5e6a6CEc35eEB23E24C6b3659eE205eE35,123, 0.001 ether,0.01 ether,Currency.ETH,VehicleModels.Model_S,'REVOLT',-35008518,138575206);
        //newVehicle(0x20442A67128F4a2d9eb123e353893c8f05429AcB,567, 0.01 * 0.01 ether,0.01 ether,Currency.ETH,VehicleModels.Model_X,'LINKCAR',-35028518,138525206);
        //approveVehicle(0x54a47c5e6a6CEc35eEB23E24C6b3659eE205eE35);


        ethUsdPriceFeed = AggregatorV3Interface(ETH_USD_CONTRACT);
        audUsdPriceFeed = AggregatorV3Interface(AUD_USD_CONTRACT);
        gbpUsdPriceFeed = AggregatorV3Interface(GBP_USD_CONTRACT);
    }
    

    modifier onlyOwner() {
        require(dappWallet == msg.sender,'Only Insurance provider can do this');
        _;
    }
    

    modifier onlyNode() {
        require(NODE_ADDRESS == msg.sender,'Only Node can call this function');
        _;
    }
    

    event rentalAgreementCreated(address _newAgreement, uint _totalFundsHeld);
    event vehicleAdded( uint _vehicleId, address _vehicleOwner, uint _baseHireFee, uint _bondRequired, Currency _ownerCurrency, VehicleModels _vehicleModel, string _vehiclePlate, int _vehicleLongitude, int _vehicleLatitude);
    
    function getLatestEthUsdPrice() public view returns (int) {
        (
            uint80 roundID, 
            int price,
            uint startedAt,
            uint timeStamp,
            uint80 answeredInRound
        ) = ethUsdPriceFeed.latestRoundData();
        // If the round is not complete yet, timestamp is 0
        require(timeStamp > 0, "Round not complete");
        return price;
    }


    function getLatestAudUsdPrice() public view returns (int) {
        (
            uint80 roundID, 
            int price,
            uint startedAt,
            uint timeStamp,
            uint80 answeredInRound
        ) = audUsdPriceFeed.latestRoundData();
        // If the round is not complete yet, timestamp is 0
        require(timeStamp > 0, "Round not complete");
        return price;
    }


    function getLatestGbpUsdPrice() public view returns (int) {
        (
            uint80 roundID, 
            int price,
            uint startedAt,
            uint timeStamp,
            uint80 answeredInRound
        ) = gbpUsdPriceFeed.latestRoundData();
        // If the round is not complete yet, timestamp is 0
        require(timeStamp > 0, "Round not complete");
        return price;
    }


    function convertEthToFiat(uint _value, Currency _toCurrency) public view returns (uint) {
       if (_toCurrency == Currency.ETH) {
           return _value;
       }

       int ethUsdPrice = getLatestEthUsdPrice();
       uint inUsd = (_value * uint(ethUsdPrice)) / 1 ether; 
       if (_toCurrency == Currency.USD) {
           return inUsd;
       }
       else if (_toCurrency == Currency.GBP) {
           int gbpUsdPrice = getLatestGbpUsdPrice();
           return inUsd * (10 ** 8) / uint(gbpUsdPrice);
       }
       else if (_toCurrency == Currency.AUD) {
           int audUsdPrice = getLatestAudUsdPrice();
           return inUsd * (10 ** 8) / uint(audUsdPrice);
       } 
       return _value;   
    } 

    function convertFiatToEth(uint _value, Currency _fromCurrency) public view returns (uint) {
        if (_fromCurrency == Currency.ETH) {
           return _value;
        }

        int ethUsdPrice = getLatestEthUsdPrice();
        uint fromUsd = (_value * 1 ether / uint(ethUsdPrice));
        if (_fromCurrency == Currency.USD) {
            return fromUsd;
        }

        else if (_fromCurrency == Currency.GBP) {
            int gbpUsdPrice = getLatestGbpUsdPrice();
            return fromUsd * uint(gbpUsdPrice) / (10 ** 8);
        }

        else if (_fromCurrency == Currency.AUD) {
            int audUsdPrice = getLatestAudUsdPrice();
            return fromUsd * uint(audUsdPrice) / (10 ** 8);
        }
        return _value;
    }

    /**
     * @dev Create a new Rental Agreement. Once it's created, all logic & flow is handled from within the RentalAgreement Contract
     */ 
    function newRentalAgreement(address _vehicleOwner, address _renter, uint _startDateTime, uint _endDateTime) public payable returns(address) {
       //vehicle owner must be different to renter
       require (_vehicleOwner != _renter,'Owner & Renter must be different');
       
       //start date must be < end date and must be at least 1 hour (3600 seconds)
       require (_endDateTime >= _startDateTime.add(3600),'Vehicle Agreement must be for a minimum of 1 hour');

       //specify agreement must be for a discrete number of hours to keep it simple
       require((_endDateTime - _startDateTime) % 3600 == 0,'Vehicle Agreement must be for a discrete number of hours');
       
       //vehicle to be rented must be in APPROVED status
       require (vehicles[_vehicleOwner].status == VehicleStatus.APPROVED,'Vehicle is not approved');
       
       //ensure start date is now or in the future
       //require (_startDateTime >= now,'Vehicle Agreement cannot be in the past');

       // Ensure correct amount of ETH has been sent for total rent cost & bond        
       uint convertedMsgValue = convertEthToFiat(msg.value, vehicles[_vehicleOwner].ownerCurrency);
       uint totalRentCost = vehicles[_vehicleOwner].baseHireFee * ((_endDateTime - _startDateTime) / 3600);
       uint bondRequired = vehicles[_vehicleOwner].bondRequired;
       
       //add 1% tolerance to account for rounding & fluctuations in case a round just ended in price feed
       require (convertedMsgValue.add(convertedMsgValue.div(100)) >= totalRentCost.add(bondRequired),'Insufficient rent & bond paid');

       // Now that we've determined the ETH passed in is correct, we need to calculate bond + fee values in ETH to send to contract
       uint bondRequiredETH = convertFiatToEth(bondRequired, vehicles[_vehicleOwner].ownerCurrency);
       
       // Fee value is total value minus bond. We've already validated enough ETH has been sent
       uint totalRentCostETH = msg.value - bondRequiredETH; 
      
       //create new Rental Agreement
       RentalAgreement a = (new RentalAgreement).value(totalRentCostETH.add(bondRequiredETH))(_vehicleOwner, _renter, _startDateTime, _endDateTime, totalRentCostETH, bondRequiredETH,LINK_KOVAN, ORACLE_CONTRACT, ORACLE_PAYMENT, JOB_ID);
       
       //store new agreement in array of agreements
       rentalAgreements.push(a);
        
       emit rentalAgreementCreated(address(a), msg.value);
        
       //now that contract has been created, we need to fund it with enough LINK tokens to fulfil 1 Oracle request per day
       LinkTokenInterface link = LinkTokenInterface(a.getChainlinkToken());
       link.transfer(address(a), 1 ether);       
        
       return address(a);

        
    }
    
      /**
     * @dev Create a new Vehicle. 
     */ 
    function newVehicle(address _vehicleOwner, uint _vehicleId, uint _baseHireFee, uint _bondRequired, Currency _ownerCurrency, VehicleModels _vehicleModel, 
                        string _vehiclePlate, int _vehicleLongitude, int _vehicleLatitude) public  {
           
      //adds a vehicle and stores it in the vehicles mapping. Each vehicle is represented by 1 Ethereum address
        
      var v = vehicles[_vehicleOwner];
      v.vehicleId = _vehicleId;
      v.ownerAddress = _vehicleOwner;
      v.baseHireFee = _baseHireFee;
      v.bondRequired = _bondRequired;
      v.ownerCurrency = _ownerCurrency;
      v.vehicleModel = _vehicleModel;
      v.vehiclePlate = _vehiclePlate;
      v.vehicleLongitude = _vehicleLongitude;
      v.vehicleLatitude = _vehicleLatitude;
      v.status = VehicleStatus.PENDING;
      
        
      emit vehicleAdded(_vehicleId, _vehicleOwner, _baseHireFee, _bondRequired, _ownerCurrency, _vehicleModel, _vehiclePlate, _vehicleLongitude, _vehicleLatitude);
      

        
    }
    
    
    /**
     * @dev Approves a vehicle for use in the app. Only a Chainlink node can call this, as it knows if the test to the tesla servers was 
     * successful or not
     */
    function approveVehicle(address _walletOwner) public  onlyNode() {
        vehicles[_walletOwner].status = VehicleStatus.APPROVED;
        //store the key in an array where we can loop through. At this point the vehicle will be returned in searched
        keyList.push(_walletOwner);
    }
    
    /**
     * @dev Return a particular Vehicle struct based on a wallet address
     */
    function getVehicle(address _walletOwner) external view returns (Vehicle) {
        return vehicles[_walletOwner];
    }

    /**
     * @dev Return all rental contract addresses
     */    
    function getRentalContracts() external view returns (RentalAgreement[] ) {
       return rentalAgreements;
    }
    
    /**
     * @dev Return a particular Rental Contract based on a rental contract address
     */
    function getRentalContract(address _rentalContract) external view returns (address,address,uint,uint,uint,uint,RentalAgreementStatus ) {
        //loop through list of contracts, and find any belonging to the address
        for (uint i = 0; i < rentalAgreements.length; i++) {
            if (address(rentalAgreements[i]) == _rentalContract) {
                return rentalAgreements[i].getAgreementDetails();
            }
        }

    }
    
    /**
     * @dev Return a list of rental contract addresses belonging to a particular vehicle owner or renter
     *      ownerRenter = 0 means vehicle owner, 1 = vehicle renter
     */
    function getRentalContracts(uint _owner, address _address) external view returns (address[] ) {
        //loop through list of contracts, and find any belonging to the address & type (renter or vehicle owner)
        //_owner variable determines if were searching for agreements for the owner or renter
        //0 = renter & 1 = owner
        uint finalResultCount = 0;
        
        //because we need to know exact size of final memory array, first we need to iterate and count how many will be in the final result
        for (uint i = 0; i < rentalAgreements.length; i++) {
           if (_owner == 1) { //owner scenario
              if (rentalAgreements[i].getVehicleOwner() == _address) {
                 finalResultCount = finalResultCount + 1;
              }
            } else {  //renter scenario
               if (rentalAgreements[i].getVehicleRenter() == _address) {
                 finalResultCount = finalResultCount + 1;
                }
            }
        }
        
        //now we have the total count, we can create a memory array with the right size and then populate it
        address[] memory addresses = new address[](finalResultCount);
        uint addrCountInserted = 0;
        
        for (uint j = 0; j < rentalAgreements.length; j++) {
           if (_owner == 1) { //owner scenario
              if (rentalAgreements[j].getVehicleOwner() == _address) {
                 addresses[addrCountInserted] = address(rentalAgreements[j]);
                 addrCountInserted = addrCountInserted + 1;
              }
            } else {  //renter scenario
               if (rentalAgreements[j].getVehicleRenter() == _address) {
                  addresses[addrCountInserted] = address(rentalAgreements[j]);
                  addrCountInserted = addrCountInserted + 1;
                }
            }
        }
        
        
        return addresses;
    }
    
    /**
     * @dev Function that takes a vehicle ID/address, start & end epochs and then searches through to see if
     *      vehicle is available during those dates or not
     */
    function checkVehicleAvailable(address _vehicleAddress, uint _start, uint _end) public view returns (uint) {

       //algorithm works as follows:
       //vehicle needs to be in approved status otherwise return false
       //loop through all rental agreemets
       //for each agreement, check if its our vehicle
       //if its our vehicle, check if agreement is approved or active (proposed & completed/error not included)
       //and if its approved or active, check if overlap:  overlap = param.start < contract.end && contract.start < param.end;
       //if overlap, return 0
       //else return 1
       
       if (vehicles[_vehicleAddress].status == VehicleStatus.APPROVED) {
       
          for (uint i = 0; i < rentalAgreements.length; i++) {
             if (rentalAgreements[i].getVehicleOwner() == _vehicleAddress){
               if (rentalAgreements[i].getAgreementStatus() == RentalAgreementFactory.RentalAgreementStatus.APPROVED || 
                   rentalAgreements[i].getAgreementStatus() == RentalAgreementFactory.RentalAgreementStatus.ACTIVE)
                  {
                     //check for overlap
                     if ( _start < rentalAgreements[i].getAgreementEndTime() && rentalAgreements[i].getAgreementStartTime() < _end) {
                         //overlap found, return 0
                         return 0;
                     }
                   }
               }
       
          }
       } else { //vehicle not approved, return false
          return 0;
       }
       
    
       //no clashes found, we can return  success   
       return 1;
       
    }    
    
   /**
     * @dev Function that takes a start & end epochs and then returns all vehicle addresses that are available
     */
    function returnAvailableVehicles(uint _start, uint _end) public view returns (address[]) {

       //algorithm works as follows: loop through all rental agreemets
       //for each agreement, check if its our vehicle
       //if its our vehicle, check if agreement is approved or active (proposed & completed/error not included)
       //and if its approved or active, check if overlap:  overlap = param.start < contract.end && contract.start < param.end;
       //if overlap, return 0
       //else return 1
       
       
       uint finalResultCount = 0;
       //because we need to know exact size of final memory array, first we need to iterate and count how many will be in the final result
       for (uint i = 0; i < keyList.length; i++) {
          //call function above for each key found
          if (checkVehicleAvailable(keyList[i], _start, _end) > 0){
             //vehicle is available, add to final result count
            finalResultCount = finalResultCount+ 1;
          }
        }
       
        //now we have the total count, we can create a memory array with the right size and then populate it
        address[] memory addresses = new address[](finalResultCount);
        uint addrCountInserted = 0;
       
       for (uint j = 0; j < keyList.length; j++) {
          //call function above for each key found
          if (checkVehicleAvailable(keyList[j], _start, _end) > 0){
             //vehicle is available, add to list
             addresses[addrCountInserted] = keyList[j];
          }
          addrCountInserted = addrCountInserted + 1;
       }
       
        return  addresses;
       
    }   
    
    /**
     * @dev Return a list of all vehicle addresses
     */  
    function getVehicleAddresses() public view returns (address[]) {
        return keyList;
    }
    
    /**
     * @dev Return a vehicle ID for a given vehicle address
     */  
    function getVehicleId(address _vehicleAddress) public view returns (uint) {
        return vehicles[_vehicleAddress].vehicleId;
    }
    
    
    /**
     * @dev Function to end provider contract, in case of bugs or needing to update logic etc, funds are returned to dapp owner, including any remaining LINK tokens
     */
    function endContractProvider() external payable onlyOwner() {
        LinkTokenInterface link = LinkTokenInterface(LINK_KOVAN);
        require(link.transfer(msg.sender, link.balanceOf(address(this))), "Unable to transfer");
        selfdestruct(dappWallet);
    }
    
    /**
     * @dev fallback function, to receive ether
     */
    function() external payable {  }
    
    
  
    
    
}

contract RentalAgreement is ChainlinkClient, Ownable  {
    
    using SafeMath_Chainlink for uint;
    using SafeMath_Chainlink for int;
    using strings for *;
    
    enum RentalAgreementStatus {PROPOSED, APPROVED, REJECTED, ACTIVE, COMPLETED, ENDED_ERROR}
    
    int constant private LOCATION_BUFFER = 10000; //Buffer for how far from start position end position can be without incurring fine. 10000 = 1m
    uint256 constant private ODOMETER_BUFFER = 5; //Buffer for how many miles past agreed total miles allowed without incurring fine
    uint256 constant private CHARGE_BUFFER = 0; //Buffer for how much % of TOTAL CHARGE allowed without incurring fine. 0 means vehicle must be fully charged
    uint256 constant private TIME_BUFFER = 10800; //Buffer for how many seconds past agreed end time can the renter end the contrat without incurring a penalty
    
    
    uint256 constant private LOCATION_FINE = 1; //What percentage of bond goes to vehicle owner if vehicle isn't returned at the correct location + buffer, per km
    uint256 constant private ODOMETER_FINE = 1; //What percentage of bond goes to vehicle owner  if vehicle incurs more than allowed miles + buffer, per mile
    uint256 constant private CHARGE_FINE = 1; //What percentage of bond goes to vehicle owner if vehicle isn't charged at the expected level + buffer
    uint256 constant private TIME_FINE = 1; //What percentage of bond goes to vehicle owner if contract ends past the agreed end date/time + buffer, per hour
    
    
    uint256 constant private PLATFORM_FEE = 1; //What percentage of the base fee goes to the Platform. To be used to fund data requests etc

    
    uint256 private oraclePaymentAmount;
    bytes32 private jobId;
    address private dappWallet = msg.sender;
    
    address private vehicleOwner;
    address private renter;
    uint private startDateTime; 
    uint private endDateTime;
    uint private totalRentCost; 
    uint private totalBond;
    RentalAgreementFactory.RentalAgreementStatus private agreementStatus;
    uint private startOdometer = 0; 
    uint private startChargeState = 0;
    int private startVehicleLongitude = 0; 
    int private startVehicleLatitude = 0; 
    uint private endOdometer = 0;
    int private endVehicleLongitude = 0; 
    int private endVehicleLatitude = 0;
    uint private rentalAgreementEndDateTime = 0;
    uint private endChargeState = 0;
    
    //variables for calulating final fee payable
    uint private totalMiles = 0;
    uint private secsPastEndDate = 0;
    int private longitudeDifference = 0;
    int private latitudeDifference = 0;
    uint private totalLocationPenalty = 0;
    uint private totalOdometerPenalty = 0;
    uint private totalChargePenalty = 0;
    uint private totalTimePenalty = 0;
    uint private totalPlatformFee = 0;
    uint private totalRentPayable = 0;
    uint private totalBondReturned = 0;
    uint private bondForfeited = 0;
    
    //List of events
    event rentalAgreementCreated(address vehicleOwner, address renter,uint startDateTime,uint endDateTime,uint totalRentCost, uint totalBond);
    event contractActive(uint _startOdometer, uint _startChargeState, int _startVehicleLongitude, int _startVehicleLatitude);
    event contractCompleted(uint _endOdometer,  uint _endChargeState, int _endVehicleLongitude, int _endVehicleLatitide);
    event contractCompletedError(uint _endOdometer,  uint _endChargeState, int _endVehicleLongitude, int _endVehicleLatitide);
    event agreementPayments(uint _platformFee, uint _totalRent, uint _totalBondKept, uint _totalBondForfeitted, uint _timePenality, uint _chargePenalty, uint _locationPenalty, uint _milesPenalty);
  
    
    
    
    /**
     * @dev Modifier to check if the dapp wallet is calling the transaction
     */
    modifier onlyDapp() {
		require(dappWallet == msg.sender,'Only Link-My-Ride Web App can perform this step');
        _;
    }
    
    /**
     * @dev Modifier to check if the vehicle owner is calling the transaction
     */
    modifier onlyVehicleOwner() {
		require(vehicleOwner == msg.sender,'Only Vehicle Owner can perform this step');
        _;
    }
    
    /**
     * @dev Modifier to check if the vehicle renter is calling the transaction
     */
    modifier onlyRenter() {
		require(renter == msg.sender,'Only Vehicle Renter can perform this step');
        _;
    }
    

    /**
     * @dev Prevents a function being run unless contract is still active
     */
    modifier onlyContractProposed() {
        require(agreementStatus == RentalAgreementFactory.RentalAgreementStatus.PROPOSED ,'Contract must be in PROPOSED status');
        _;
    }
    
    /**
     * @dev Prevents a function being run unless contract is still active
     */
    modifier onlyContractApproved() {
        require(agreementStatus == RentalAgreementFactory.RentalAgreementStatus.APPROVED ,'Contract must be in APPROVED status');
        _;
    }
    
    /**
     * @dev Prevents a function being run unless contract is still active
     */
    modifier onlyContractActive() {
        require(agreementStatus == RentalAgreementFactory.RentalAgreementStatus.ACTIVE ,'Contract must be in ACTIVE status');
        _;
    }
    
   /**
     * @dev Step 01: Generate a contract in PROPOSED status
     */ 
     constructor(address _vehicleOwner, address _renter, uint _startDateTime, uint _endDateTime, uint _totalRentCost, uint _totalBond, 
                 address _link, address _oracle, uint256 _oraclePaymentAmount, bytes32 _jobId)  payable Ownable() public {
        
       //initialize variables required for Chainlink Node interaction
       setChainlinkToken(_link);
       setChainlinkOracle(_oracle);
       jobId =  _jobId;
       oraclePaymentAmount = _oraclePaymentAmount;
        
       //first ensure insurer has fully funded the contract - check here. money should be transferred on creation of agreement.
       //require(msg.value > _totalCover, "Not enough funds sent to contract");
        
       //now initialize values for the contract
        
       vehicleOwner = _vehicleOwner;
       renter = _renter;
       startDateTime = _startDateTime;
       endDateTime = _endDateTime;
       totalRentCost = _totalRentCost;
       totalBond = _totalBond;
       agreementStatus = RentalAgreementFactory.RentalAgreementStatus.PROPOSED;
       
       emit rentalAgreementCreated(vehicleOwner,renter,startDateTime,endDateTime,totalRentCost,totalBond);
    }
    
   /**
     * @dev Step 02a: Owner ACCEPTS proposal, contract becomes APPROVED
     */ 
     function approveContract() external onlyVehicleOwner() onlyContractProposed()  {
         //Vehicle Owner simply looks at proposed agreement & either approves or denies it.
         //Only vehicle owner can run this, contract must be in PROPOSED status
         //In this case, we approve. Contract becomes Approved and sits waiting until start time reaches
         agreementStatus = RentalAgreementFactory.RentalAgreementStatus.APPROVED;
     }
     
   /**
     * @dev Step 02b: Owner REJECTS proposal, contract becomes REJECTED. This is the end of the line for the Contract
     */ 
     function rejectContract() external onlyVehicleOwner() onlyContractProposed() {
         //Vehicle Owner simply looks at proposed agreement & either approves or denies it.
         //Only vehicle owner can call this function
         //In this case, we approve. Contract becomes Rejected. No more actions should be possible on the contract in this status
         //return money to renter
         renter.transfer(address(this).balance);
         
         //return any LINK tokens in here back to the DAPP wallet
         LinkTokenInterface link = LinkTokenInterface(chainlinkTokenAddress());
         require(link.transfer(dappWallet, link.balanceOf(address(this))), "Unable to transfer");
         
         //Set status to rejected. This is the end of the line for this agreement
         agreementStatus = RentalAgreementFactory.RentalAgreementStatus.REJECTED;
         
     }
     
   /**
     * @dev Step 03a: Renter starts contract, contract becomes ACTIVE
     * Conditions for starting contract: Must be APPROVED, & Start Date/Time must be <= current Date/Time
     */ 
     function activateRentalContract() external onlyRenter() onlyContractApproved() {
         //First we need to wake up the vehicle & obtain some values needed in the contract before the vehicle can be unlocked & started
         //do external adapter call to wake up vehicle & get vehicle data
         
         //Need to check start time has reached
         //require(startDateTime <= now ,'Start Date/Time has not been reached');
         
         //get vehicle ID of the vehicle, needed for the request
         uint vid = RentalAgreementFactory(dappWallet).getVehicleId(vehicleOwner);
         
         //call to chainlink node job to wake up the car, get starting vehicle data, then unlock the car
         Chainlink.Request memory req = buildChainlinkRequest(jobId, address(this), this.activeteRentalContractFallback.selector);
         req.add("apiToken", "");
         req.add("vehicleId", uint2str(vid));
         req.add("action", "unlock");
         sendChainlinkRequestTo(chainlinkOracleAddress(), req, oraclePaymentAmount);
         
     }
     
   /**
     * @dev Step 03b: Callback function for obtaining vehicle data as part of rental agreement beginning
     * If we get to this stage, it means the vehicle successfully returned the required data to start the agreement, & the vehicle has been unlocked
     * Only the contract should be able to call this function
     */ 
     function activeteRentalContractFallback(bytes32 _requestId, bytes32 _vehicleData) public recordChainlinkFulfillment(_requestId) {
        //Set contract variables to start the agreement
        
        //temp variables required for converting to signed integer
        uint tmpStartLongitude;
        uint tmpStartLatitude;
        bytes memory longitudeBytes;
        bytes memory latitudeBytes;
        
        
        //first split the results into individual strings based on the delimiter
        var s = bytes32ToString(_vehicleData).toSlice();
        var delim = ",".toSlice();
       
        //store each string in an array
        string[] memory splitResults = new string[](s.count(delim)+ 1);                  
        for (uint i = 0; i < splitResults.length; i++) {                              
           splitResults[i] = s.split(delim).toString();                              
        }                                                        
       
        //Now for each one, convert to uint
        startOdometer = stringToUint(splitResults[0]);
        startChargeState = stringToUint(splitResults[1]);
        tmpStartLongitude = stringToUint(splitResults[2]);
        tmpStartLatitude = stringToUint(splitResults[3]);
        
        //Now store location coordinates in signed variables. Will always be positive, but will check in the next step if need to make negative
        startVehicleLongitude =  int(tmpStartLongitude);
        startVehicleLatitude =  int(tmpStartLatitude);

        //Finally, check first bye in the string for the location variables. If it was a '-', then multiply location coordinate by -1
        //first get the first byte of each location coordinate string
        longitudeBytes = bytes(splitResults[2]);
        latitudeBytes = bytes(splitResults[3]);
        
        
        //First check longitude
        if (uint(longitudeBytes[0]) == 0x2d) {
            //first byte was a '-', multiply result by -1
            startVehicleLongitude = startVehicleLongitude * -1;
        }
        
        //Now check latitude
        if (uint(latitudeBytes[0]) == 0x2d) {
            //first byte was a '-', multiply result by -1
            startVehicleLatitude = startVehicleLatitude * -1;
        }
        

        //Values have been set, now set the contract to ACTIVE
        agreementStatus = RentalAgreementFactory.RentalAgreementStatus.ACTIVE;
        
        //Emit an event now that contract is now active
        emit contractActive(startOdometer,startChargeState,startVehicleLongitude,startVehicleLatitude);
     }
     
     
     
   /**
     * @dev Step 04a: Renter ends an active contract, contract becomes COMPLETED or ENDED_ERROR
     * Conditions for ending contract: Must be ACTIVE
     */ 
     function endRentalContract()  external onlyRenter() onlyContractActive()  {
         //First we need to check if vehicle can be accessed, if so then do a call to get vehicle data

         //get vehicle ID of the vehicle, needed for the request
         uint vid = RentalAgreementFactory(dappWallet).getVehicleId(vehicleOwner);
         
         //call to chainlink node job to wake up the car, get ending vehicle data, then lock the car
         Chainlink.Request memory req = buildChainlinkRequest(jobId, address(this), this.endRentalContractFallback.selector);
         req.add("apiToken", "");
         req.add("vehicleId", uint2str(vid));
         req.add("action", "lock");
         sendChainlinkRequestTo(chainlinkOracleAddress(), req, oraclePaymentAmount);
         
     }
     
   /**
     * @dev Step 04b: Callback for getting vehicle data on ending a rental agreement. Based on results Contract becomes COMPELTED or ENDED_ERROR
     * Conditions for ending contract: Must be ACTIVE. Only this contract should be able to call this function
     */ 
     function endRentalContractFallback(bytes32 _requestId, bytes32 _vehicleData) public recordChainlinkFulfillment(_requestId) {
        //Set contract variables to end the agreement
        
        //temp variables required for converting to signed integer
        uint tmpEndLongitude;
        uint tmpEndLatitude;
        bytes memory longitudeBytes;
        bytes memory latitudeBytes;
        
        
        //first split the results into individual strings based on the delimiter
        var s = bytes32ToString(_vehicleData).toSlice();
        var delim = ",".toSlice();
       
        //store each string in an array
        string[] memory splitResults = new string[](s.count(delim)+ 1);                  
        for (uint i = 0; i < splitResults.length; i++) {                              
           splitResults[i] = s.split(delim).toString();                              
        }                                                        
       
        //Now for each one, convert to uint
        endOdometer = stringToUint(splitResults[0]);
        endChargeState = stringToUint(splitResults[1]);
        tmpEndLongitude = stringToUint(splitResults[2]);
        tmpEndLatitude = stringToUint(splitResults[3]);
        
        //Now store location coordinates in signed variables. Will always be positive, but will check in the next step if need to make negative
        endVehicleLongitude =  int(tmpEndLongitude);
        endVehicleLatitude =  int(tmpEndLatitude);

        //Finally, check first bye in the string for the location variables. If it was a '-', then multiply location coordinate by -1
        //first get the first byte of each location coordinate string
        longitudeBytes = bytes(splitResults[2]);
        latitudeBytes = bytes(splitResults[3]);
        
        
        //First check longitude
        if (uint(longitudeBytes[0]) == 0x2d) {
            //first byte was a '-', multiply result by -1
            endVehicleLongitude = endVehicleLongitude * -1;
        }
        
        //Now check latitude
        if (uint(latitudeBytes[0]) == 0x2d) {
            //first byte was a '-', multiply result by -1
            endVehicleLatitude = endVehicleLatitude * -1;
        }
        
        //Set the end time of the contract
        rentalAgreementEndDateTime = now;
        

        //Now that we have all values in contract, we can calculate final fees & penalties payable
        
        //First calculate and send platform fee 
        //Total to go to platform = base fee / platform fee %
        totalPlatformFee = totalRentCost.div(uint(100).div(PLATFORM_FEE));
        
        //now total rent payable is original amount minus calculated platform fee above
        totalRentPayable = totalRentCost - totalPlatformFee;
        
        //Total to go to car owner = (base fee - platform fee from above) + time penalty + location penalty + charge penalty
        
        //Now calculate penalties to be used for amount to go to car owner
       
        //Odometer penalty. Number of miles over agreed total miles * odometer penalty per mile.
        //Eg if only 10 miles allowed but agreement logged 20 miles, with a penalty of 1% per extra mile
        //then penalty is 20-10 = 10 * 1% = 10% of Bond
        totalMiles = endOdometer.sub(startOdometer);
        if (totalMiles > ODOMETER_BUFFER) { 
        
            totalOdometerPenalty = totalMiles.mul(ODOMETER_FINE).mul(totalBond);  
            totalOdometerPenalty = (totalMiles.sub(ODOMETER_BUFFER)).mul(totalBond.div(uint(100).div(ODOMETER_FINE)));
        }
        
        //Time penalty. Number of hours past agreed end date/time + buffer * time penalty per hour
        //eg TIME_FINE buffer set to 1 = 1% of bond for each hour past the end date + buffer (buffer currently set to 3 hours)
        if (rentalAgreementEndDateTime > endDateTime) {
             secsPastEndDate = rentalAgreementEndDateTime.sub(endDateTime);
             //if retuned later than the the grace period, incur penalty
            if (secsPastEndDate > TIME_BUFFER) { //penalty incurred
                //penalty TIME_FINE is a % per hour over. So if over by less than an hour, round up to an hour
                if (secsPastEndDate.sub(TIME_BUFFER) < 3600) {
                    totalTimePenalty = uint(1).mul(totalBond.div(uint(100).div(TIME_FINE)));
                } else {
                    //do normal penlaty calculation in hours
                    totalTimePenalty = secsPastEndDate.sub(TIME_BUFFER).div(3600).mul(totalBond.div(uint(100).div(TIME_FINE)));
                }
            }
        }
        
        //Charge penalty. Simple comparison of charge at start & end. If it isn't at least what it was at agreement start, then a static fee is paid of
        //CHARGE_FINE, which is a % of bond. Currently set to 1%
        if (startChargeState > endChargeState) { 
            totalChargePenalty = totalBond.div(uint(100).div(CHARGE_FINE));
        }
        
        

        //Location penalty. If the vehicle is not returned to around the same spot, then a penalty is incurred.
        //Allowed distance from original spot is stored in the LOCATION_BUFFER param, currently set to 100m
        //Penalty incurred is stored in LOCATION_FINE, and applies per km off from the original location
        //Penalty applies to either location coordinates
        //eg if LOCATION_BUFFER set to 100m, fee set to 1% per 1km, and renter returns vehicle 2km from original place
        //fee payable is 2 * 1 = 2% of bond
        
        
        longitudeDifference = abs(abs(startVehicleLongitude) - abs(endVehicleLongitude));
        latitudeDifference = abs(abs(startVehicleLatitude) - abs(endVehicleLatitude));

        
        if (longitudeDifference > LOCATION_BUFFER) { //If difference in longitude is > 100m
            totalLocationPenalty = uint(longitudeDifference).div(10000).mul(totalBond.div(uint(100).div(LOCATION_FINE))); 
        } else  if (latitudeDifference > LOCATION_BUFFER) { //If difference in latitude is > 100m
            totalLocationPenalty = uint(latitudeDifference).div(10000).mul(totalBond.div(uint(100).div(LOCATION_FINE)));
        } 

        
        //Final amount of bond to go to owner = sum of all penalties above. Then renter gets rest
        bondForfeited = totalOdometerPenalty.add(totalTimePenalty).add(totalChargePenalty).add(totalLocationPenalty);
        uint bondKept = totalBond.sub(bondForfeited);

        
        //Now that we have all fees & charges calculated, perform necessary transfers & then end contract
        //first pay platform fee
        dappWallet.transfer(totalPlatformFee);
        
        //then pay vehicle owner rent amount
        vehicleOwner.transfer(totalRentPayable);
        
        //pay Owner  any bond penalties. Only if > 0
        if (bondForfeited > 0) {
            owner.transfer(bondForfeited);
        }
        
        //finally, pay renter back any remaining bond
        totalBondReturned = address(this).balance;
        renter.transfer(totalBondReturned);
        
        //Transfers all completed, now we just need to set contract status to successfully completed 
        agreementStatus = RentalAgreementFactory.RentalAgreementStatus.COMPLETED;
        
        //Emit an event with all the payments
        emit agreementPayments(totalPlatformFee, totalRentPayable, bondKept, bondForfeited, totalTimePenalty, totalChargePenalty, totalLocationPenalty, totalOdometerPenalty);
         
         
        //Emit an event now that contract is now ended
        emit contractCompleted(endOdometer,endChargeState,endVehicleLongitude,endVehicleLatitude);
         
     }
    
   /**
     * @dev Step 04c: Car Owner ends an active contract due to the Renter not ending it, contract becomes ENDED_ERROR
     * Conditions for ending contract: Must be ACTIVE, & End Date must be in the past more than the current defined TIME_BUFFER value
     */ 
     function forceEndRentalContract() external onlyOwner() onlyContractActive() {
         
         //don't allow unless contract still active & current time is > contract end date + TIME_BUFFER
         require(now > endDateTime + TIME_BUFFER,
                 "Agreement not eligible for forced cancellation yet");
                 
          //get vehicle ID of the vehicle, needed for the request
         uint vid = RentalAgreementFactory(dappWallet).getVehicleId(vehicleOwner);
         
         //call to chainlink node job to wake up the car, get ending vehicle data
         Chainlink.Request memory req = buildChainlinkRequest(jobId, address(this), this.forceEndRentalContractFallback.selector);
         req.add("apiToken", "");
         req.add("vehicleId", uint2str(vid));
         req.add("action", "vehicle_data");
         sendChainlinkRequestTo(chainlinkOracleAddress(), req, oraclePaymentAmount);
     }
     
    /**
     * @dev Step 04d: Callback for force ending a vehicle agreement. Based on results Contract becomes ENDED_ERROR
     */ 
     function forceEndRentalContractFallback(bytes32 _requestId, bytes32 _vehicleData) public recordChainlinkFulfillment(_requestId) {
        
        totalPlatformFee = totalRentCost.div(uint(100).div(PLATFORM_FEE));

        //now total rent payable is original amount minus calculated platform fee above
        totalRentPayable = totalRentCost - totalPlatformFee;
        
        bondForfeited = totalBondReturned;
        totalBondReturned = 0;
       
        
        //Now that we have all fees & charges calculated, perform necessary transfers & then end contract
        //first pay platform fee
        dappWallet.transfer(totalPlatformFee);
        
        //then pay vehicle owner rent payable
        vehicleOwner.transfer(totalRentPayable);
        
        //pay owner the bond owed
        vehicleOwner.transfer(bondForfeited);
        

        //Transfers all completed, now we just need to set contract status to successfully completed 
        agreementStatus = RentalAgreementFactory.RentalAgreementStatus.ENDED_ERROR;
        
        //Emit an event now that contract is now ended
        emit contractCompletedError(endOdometer,endChargeState,endVehicleLongitude,endVehicleLatitude);
         
     }
    

    
    /**
     * @dev Get address of the chainlink token
     */ 
    function getChainlinkToken() public view returns (address) {
        return chainlinkTokenAddress();
    }
    
    /**
     * @dev Get address of vehicle owner
     */ 
    function getVehicleOwner() public view returns (address) {
        return vehicleOwner;
    }
    
    /**
     * @dev Get address of vehicle renter
     */ 
    function getVehicleRenter() public view returns (address) {
        return renter;
    }
    
    /**
     * @dev Get status of the agreement
     */ 
    function getAgreementStatus() public view returns (RentalAgreementFactory.RentalAgreementStatus) {
        return agreementStatus;
    }
    
    /**
     * @dev Get start date/time
     */ 
    function getAgreementStartTime() public view returns (uint) {
        return startDateTime;
    }
    
    /**
     * @dev Get end date/time
     */ 
    function getAgreementEndTime() public view returns (uint) {
        return endDateTime;
    }
    

    /**
     * @dev Return All Details about a Vehicle Rental Agreement
     */ 
    function getAgreementDetails() public view returns (address,address,uint,uint,uint,uint,RentalAgreementFactory.RentalAgreementStatus) {
        return (vehicleOwner,renter,startDateTime,endDateTime,totalRentCost,totalBond,agreementStatus);
    }
    
    /**
     * @dev Return All Vehicle Data from a Vehicle Rental Agreement
     */ 
    function getAgreementData() public view returns (uint, uint, int, int, uint, uint, int, int) {
        return (startOdometer,startChargeState,startVehicleLongitude, startVehicleLatitude,endOdometer,endChargeState, endVehicleLongitude,endVehicleLatitude);
    }
    
    /**
     * @dev Return All Payment & fee Details about a Vehicle Rental Agreement
     */ 
    function getPaymentDetails() public view returns (uint, uint, uint, uint, uint, uint, uint, uint) {
        return (rentalAgreementEndDateTime,totalLocationPenalty,totalOdometerPenalty,totalChargePenalty,totalTimePenalty,totalPlatformFee,totalRentPayable,totalBondReturned);
    }
    
    /**
     * @dev Helper function to get absolute value of an int
     */ 
    function abs(int x) private pure returns (int) {
        return x >= 0 ? x : -x;
    }
    
    /**
     * @dev Helper function for converting uint to a string
     */ 
    function uint2str(uint _i) internal pure returns (string memory _uintAsString) {
        if (_i == 0) {
            return "0";
        }
        uint j = _i;
        uint len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint k = len - 1;
        while (_i != 0) {
            bstr[k--] = byte(uint8(48 + _i % 10));
            _i /= 10;
        }
        return string(bstr);
    }
    
    function bytes32ToString(bytes32 x) constant returns (string) {
        bytes memory bytesString = new bytes(32);
        uint charCount = 0;
        for (uint j = 0; j < 32; j++) {
            byte char = byte(bytes32(uint(x) * 2 ** (8 * j)));
            if (char != 0) {
                bytesString[charCount] = char;
                charCount++;
            }
        }
        bytes memory bytesStringTrimmed = new bytes(charCount);
        for (j = 0; j < charCount; j++) {
            bytesStringTrimmed[j] = bytesString[j];
        }
        return string(bytesStringTrimmed);
    }
    
    function stringToUint(string s) constant returns (uint result) {
        bytes memory b = bytes(s);
        uint i;
        result = 0;
       
        for (i = 0; i < b.length; i++) {
            uint c = uint(b[i]);
            if (c >= 48 && c <= 57) {
                result = result * 10 + (c - 48);
            }
        }
    }
	
   
    
}
