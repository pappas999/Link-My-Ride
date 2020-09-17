pragma solidity 0.4.24;
pragma experimental ABIEncoderV2;

//Truffle Imports
//import "chainlink/contracts/ChainlinkClient.sol";
//import "chainlink/contracts/vendor/Ownable.sol";
//import "chainlink/contracts/interfaces/LinkTokenInterface.sol";

//Remix imports - used when testing in remix 
import "https://github.com/smartcontractkit/chainlink/blob/develop/evm-contracts/src/v0.4/ChainlinkClient.sol";
import "https://github.com/smartcontractkit/chainlink/blob/develop/evm-contracts/src/v0.4/vendor/Ownable.sol";
import "https://github.com/smartcontractkit/chainlink/blob/develop/evm-contracts/src/v0.4/LinkToken.sol";
import "https://github.com/smartcontractkit/chainlink/blob/master/evm-contracts/src/v0.4/interfaces/AggregatorV3Interface.sol";

contract RentalAgreementFactory {
    
    using SafeMath_Chainlink for uint;
    
    address public dappWallet = msg.sender;
    enum RentalAgreementStatus {PROPOSED, APPROVED, REJECTED, ACTIVE, COMPLETED, ENDED_ERROR}
    uint public constant DAY_IN_SECONDS = 60; //How many seconds in a day. 60 for testing, 86400 for Production
    
    bytes32 JOB_ID = "521205a00d644341a6ccb4ee99afcf63"; //jobID of oracle to use for gets & posts?
    
    address public constant LINK_ROPSTEN = 0x20fE562d797A42Dcb3399062AE9546cd06f63280; //address of LINK token on Ropsten
    address public constant ORACLE_CONTRACT = 0x4a3fbbb385b5efeb4bc84a25aaadcd644bd09721;
    address public constant NODE_ADDRESS = 0xDC92b2B1C731d07dC9bd8D30D0B1A69F266f2A8A;
    uint256 constant private ORACLE_PAYMENT = 0.1 * 1 ether;
    
    
    address public constant ETH_USD_CONTRACT = 0x9326BFA02ADD2366b30bacB125260Af641031331;
    address public constant AUD_USD_CONTRACT = 0x5813A90f826e16dB392abd2aF7966313fc1fd5B8;
    address public constant GBP_USD_CONTRACT = 0x28b0061f44E6A9780224AA61BEc8C3Fcb0d37de9;
    
    enum VehicleModels { Model_S, Model_3, Model_X, Model_Y, Cybertruck, Roadster}
    enum VehicleStatus {PENDING, APPROVED}
    enum Currency { ETH, USD, GBP, AUD }

    
    //struct to represent a car on the platform to be rented
    struct Vehicle {
        uint vehicleId;                // Tesla assigned ID of vehicle
        address ownerAddress;          // Wallet address of vehicle owner
        string apiTokenHash;           // Hashed version of the token  
        uint baseHireFee;              // Base fee for hire in the smallest denomination of owner's chosen currency
        uint bondRequired;             // Bond required for each rental contract in the smallest denomination of owner's chosen currency
        Currency ownerCurrency;        // The vehicle owner's chosen currency
        VehicleModels vehicleModel;    // Model of the vehicle
        string renterDescription;      // Basic description of renter
        VehicleStatus status;          // Has the vehicle been validated against Tesla servers or not
        
    }
    
    address[] internal keyList;

    AggregatorV3Interface internal ethUsdPriceFeed;
    AggregatorV3Interface internal audUsdPriceFeed;
    AggregatorV3Interface internal gbpUsdPriceFeed;
    
    //here is where all the cars to rent are stored. Currently each vehicle must have a unique wallet tied to it.
    mapping (address => Vehicle) vehicles; 
    
    //here is where all the rental agreements are stored. 
    RentalAgreement[] rentalAgreements;
    //mapping (address => RentalAgreement) rentalAgreements; 
    
    constructor() public payable {
        //this code adds a vehicle so we don't have to keep doing it manually as part of development
        newVehicle(0x54a47c5e6a6CEc35eEB23E24C6b3659eE205eE35,123,'sadfasfasdfsda',0.01 * 0.01 ether,0.01 ether,Currency.ETH,VehicleModels.Model_S,'harrys car');
        newVehicle(0x20442A67128F4a2d9eb123e353893c8f05429AcB,567,'test',0.01 * 0.1 ether,0.01 ether,Currency.ETH,VehicleModels.Model_X,'second car');
        

        ethUsdPriceFeed = AggregatorV3Interface(ETH_USD_CONTRACT);
        audUsdPriceFeed = AggregatorV3Interface(AUD_USD_CONTRACT);
        gbpUsdPriceFeed = AggregatorV3Interface(GBP_USD_CONTRACT);
    }
    
    function test() public {
        this.newRentalAgreement.value(10100000000000000)(0x54a47c5e6a6CEc35eEB23E24C6b3659eE205eE35,0xaF9aA280435E8C13cf8ebE1827CBB402CE65bBf7,1600314221,1600317821);
    }
    

    /**
     * @dev Prevents a function being run unless it's called by DAPP owner
     */
    modifier onlyOwner() {
        require(dappWallet == msg.sender,'Only Insurance provider can do this');
        _;
    }
    
    /**
     * @dev Prevents a function being run unless it's called by the specified Node
     */
    modifier onlyNode() {
        require(NODE_ADDRESS == msg.sender,'Only Node can call this function');
        _;
    }
    
    //List of events
    event rentalAgreementCreated(address _newAgreement, uint _totalFundsHeld);
    event vehicleAdded( uint _vehicleId, address _vehicleOwner, string _apiTokenHash, uint _baseHireFee, uint _bondRequired, Currency _ownerCurrency, VehicleModels _vehicleModel, string _description);
    
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

    function getEthUsdPriceDecimals() public view returns (uint8) {
        return ethUsdPriceFeed.decimals();
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

    function getAudUsdPriceDecimals() public view returns (uint8) {
        return audUsdPriceFeed.decimals();
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

    function getGbpUsdPriceDecimals() public view returns (uint8) {
        return gbpUsdPriceFeed.decimals();
    }

    function _convertEthToFiat(uint _value, Currency _toCurrency) public view returns (uint) {
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

    function _convertFiatToEth(uint _value, Currency _fromCurrency) public view returns (uint) {
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
       uint convertedMsgValue = _convertEthToFiat(msg.value, vehicles[_vehicleOwner].ownerCurrency);
       uint totalRentCost = vehicles[_vehicleOwner].baseHireFee * ((_endDateTime - _startDateTime) / 3600);
       uint bondRequired = vehicles[_vehicleOwner].bondRequired;
       

       require (convertedMsgValue >= totalRentCost.add(bondRequired),'Insufficient rent & bond paid');

       // Now that we've determined the ETH passed in is correct, we need to calculate bond + fee values in ETH to send to contract
       uint bondRequiredETH = _convertFiatToEth(bondRequired, vehicles[_vehicleOwner].ownerCurrency);
       
       // Fee value is total value minus bond. We've already validated enough ETH has been sent
       uint totalRentCostETH = msg.value - bondRequiredETH; 
      
       //create new Rental Agreement
       RentalAgreement a = (new RentalAgreement).value(totalRentCostETH.add(bondRequiredETH))(_vehicleOwner, _renter, _startDateTime, _endDateTime, totalRentCostETH, bondRequiredETH, 
                                                 LINK_ROPSTEN, ORACLE_CONTRACT, ORACLE_PAYMENT, JOB_ID);
       
       //store new agreement in array of agreements
       rentalAgreements.push(a);
        
       emit rentalAgreementCreated(address(a), msg.value);
        
       //now that contract has been created, we need to fund it with enough LINK tokens to fulfil 1 Oracle request per day
       //LinkTokenInterface link = LinkTokenInterface(a.getChainlinkToken());
       //link.transfer(address(a), 1 ether);
        
        
       return address(a);
        
    }
    
      /**
     * @dev Create a new Vehicle. 
     */ 
    function newVehicle(address _vehicleOwner, uint _vehicleId, string _apiTokenHash, uint _baseHireFee, uint _bondRequired, Currency _ownerCurrency, VehicleModels _vehicleModel, 
                        string _description) public  {
           
      //adds a vehicle and stores it in the vehicles mapping. Each vehicle is represented by 1 Ethereum address
        
      var v = vehicles[_vehicleOwner];
      v.vehicleId = _vehicleId;
      v.ownerAddress = _vehicleOwner;
      v.apiTokenHash = _apiTokenHash;
      v.baseHireFee = _baseHireFee;
      v.bondRequired = _bondRequired;
      v.ownerCurrency = _ownerCurrency;
      v.vehicleModel = _vehicleModel;
      v.renterDescription = _description;
      v.status = VehicleStatus.PENDING;
      
        
      emit vehicleAdded(_vehicleId, _vehicleOwner, _apiTokenHash, _baseHireFee, _bondRequired, _ownerCurrency, _vehicleModel, _description);
      

        
    }
    
    /**
     * @dev Approves a vehicle for use in the app. Only a Chainlink node can call this, as it knows if the test to the tesla servers was 
     * successful or not
     */
    function approveVehicle(address _walletOwner) external  /*onlyNode()*/ {
        vehicles[_walletOwner].status = VehicleStatus.APPROVED;
        //store the key in an array where we can loop through
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
              if (rentalAgreements[0].getVehicleOwner() == _address) {
                 finalResultCount = finalResultCount + 1;
              }
            } else {  //renter scenario
               if (rentalAgreements[0].getVehicleRenter() == _address) {
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
              }
            } else {  //renter scenario
               if (rentalAgreements[j].getVehicleRenter() == _address) {
                  addresses[addrCountInserted] = address(rentalAgreements[j]);
                }
            }
            addrCountInserted = addrCountInserted + 1;
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
        LinkTokenInterface link = LinkTokenInterface(LINK_ROPSTEN);
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
    
    enum RentalAgreementStatus {PROPOSED, APPROVED, REJECTED, ACTIVE, COMPLETED, ENDED_ERROR}
    
    uint256 constant private LOCATION_BUFFER = 1000; //Buffer for how far from start position end position can be without incurring fine
    uint256 constant private ODOMETER_BUFFER = 1; //Buffer for how many miles past agreed total miles allowed without incurring fine
    uint256 constant private CHARGE_BUFFER = 0; //Buffer for how much % of TOTAL CHARGE allowed without incurring fine. 0 means vehicle must be fully charged
    uint256 constant private TIME_BUFFER = 1; //Buffer for how many hours past agreed end time can the renter end the contrat without incurring a penalty
    
    
    uint256 constant private LOCATION_FINE = 10; //What percentage of bond goes to vehicle owner if vehicle isn't returned at the correct location + buffer
    uint256 constant private ODOMETER_FINE = 10; //What percentage of bond goes to vehicle owner if vehicle incurs more than allowed miles + buffer
    uint256 constant private CHARGE_FINE = 1; //What percentage of bond goes to vehicle owner if vehicle isn't charged at the expected level + buffer
    uint256 constant private TIME_FINE = 5; //What percentage of bond goes to vehicle owner if contract ends past the agreed end date/time + buffer
    
    
    uint256 constant private PLATFORM_FEE = 1; //What percentage of the base fee goes to the Platform. To be used to fund data requests etc
    bytes32 constant JOB_ID = "JOB_ID";
    
    uint256 private oraclePaymentAmount;
    bytes32 private jobId;
    address dappWallet = msg.sender;
    
    address vehicleOwner;
    address renter;
    uint startDateTime; 
    uint endDateTime;
    uint totalRentCost; 
    uint totalBond;
    RentalAgreementFactory.RentalAgreementStatus agreementStatus;
    uint startOdometer = 0; 
    int startVehicleLongitude = 0; 
    int startVehicleLatitide = 0; 
    uint endOdometer = 0;
    int endVehicleLongitude = 0; 
    int endVehicleLatitude = 0;
    uint rentalAgreementEndDateTime = 0;
    int endChargeState = 0;
    
    //variables for calulating final fee payable
    int totalMiles = 0;
    int totalHoursPastEndDate = 0;
    int longitudeDifference = 0;
    int latitudeDifference = 0;
    uint totalLocationPenalty = 0;
    uint totalOdometerPenalty = 0;
    uint totalChargePenalty = 0;
    uint totalTimePenalty = 0;
    uint totalPlatformFee = 0;
    uint totalRentPayable = 0;
    uint totalBondReturned = 0;
    
    //List of events
    event rentalAgreementCreated(address vehicleOwner, address renter,uint startDateTime,uint endDateTime,uint totalRentCost, uint totalBond);
    event contractActive(uint _startOdometer, int _startVehicleLongitude, int _startVehicleLatitide);
    event contractCompleted(uint _endOdometer, int _endVehicleLongitude, int _endVehicleLatitide);
    
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
     * @dev Prevents a function being run unless the Vehicle Contract has ended
     */
    modifier onContractEnded() {
        if (endDateTime < now && agreementStatus == RentalAgreementFactory.RentalAgreementStatus.COMPLETED) {
          _;  
        } 
    }
    
    /**
     * @dev Prevents a function being run unless contract is still active
     */
    modifier onContractActive() {
        require(agreementStatus == RentalAgreementFactory.RentalAgreementStatus.ACTIVE ,'Contract is not active');
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
       jobId = _jobId;
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
     function approveContract() external onlyVehicleOwner()  {
         //Vehicle Owner simply looks at proposed agreement & either approves or denies it.
         //Only vehicle owner can run this
         //In this case, we approve. Contract becomes Approved and sits waiting until start time reaches
         agreementStatus = RentalAgreementFactory.RentalAgreementStatus.APPROVED;
     }
     
   /**
     * @dev Step 02b: Owner REJECTS proposal, contract becomes REJECTED. This is the end of the line for the Contract
     */ 
     function rejectContract() external onlyVehicleOwner() {
         //Vehicle Owner simply looks at proposed agreement & either approves or denies it.
         //Only vehicle owner can call this function
         //In this case, we approve. Contract becomes Rejected. No more actions should be possible on the contract in this status
         //return money to renter
         renter.transfer(address(this).balance);
         //return any LINK tokens in here back to the DAPP wallet
         agreementStatus = RentalAgreementFactory.RentalAgreementStatus.REJECTED;
         
     }
     
   /**
     * @dev Step 03a: Renter starts contract, contract becomes ACTIVE
     * Conditions for starting contract: Must be APPROVED, & Start Date/Time must be <= current Date/Time
     */ 
     function activateRentalContract() external onlyRenter()  {
         //First we need to wake up the vehicle & obtain some values needed in the contract before the vehicle can be unlocked & started
         //do external adapter call to wake up vehicle & get vehicle data
         
         //Need to check start time has reached
         require(startDateTime <= now ,'Start Date/Time has not been reached');
         
         //get vehicle ID of the vehicle, needed for the request
         uint vid = RentalAgreementFactory(dappWallet).getVehicleId(vehicleOwner);
         
         //call to chainlink node job to wake up the car, get starting vehicle data, then unlock the car
         Chainlink.Request memory req = buildChainlinkRequest(JOB_ID, address(this), this.activeteRentalContractFallback.selector);
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
     function activeteRentalContractFallback(string _vehicleData) public returns (uint) {
        //Set contract variables to start the agreement
        //ask on discord how to get 3 int values, is best way to have a delimited string?
        
        string[] memory returnValues = split(_vehicleData,',');
        //startOdometer = parseI
        
        //TO DO - convert each value to a uint or integer
        
        startOdometer = 0; 
        startVehicleLongitude = 0; 
        startVehicleLatitide = 0; 
        
        //Values have been set, now set the contract to ACTIVE
        agreementStatus = RentalAgreementFactory.RentalAgreementStatus.ACTIVE;
        
        //Emit an event now that contract is now active
        emit contractActive(startOdometer,startVehicleLongitude,startVehicleLatitide);
     }
     
     
     
   /**
     * @dev Step 04a: Renter ends an active contract, contract becomes COMPELTED or ENDED_ERROR
     * Conditions for ending contract: Must be ACTIVE
     */ 
     function endRentalContract() external returns (uint) {
         //First we need to check if vehicle can be accessed, if so then do a call to get vehicle data
         //external adapter call to get endrental data
         
         
     }
     
   /**
     * @dev Step 04b: Callback for getting vehicle data on ending a rental agreement. Based on results Contract becomes COMPELTED or ENDED_ERROR
     * Conditions for ending contract: Must be ACTIVE. Only this contract should be able to call this function
     */ 
     function endRentalContractFallback(string _vehicleData) external returns (uint) {
         //Store obtained vales into contract. Once again need to probably parse a delimited string
        endOdometer = 0; 
        endVehicleLongitude = 0; 
        endVehicleLatitude = 0; 
        endChargeState = 0;
        rentalAgreementEndDateTime = now;
         
        //Now that we have all values in contract, we can calculate final fee payable
        
        //First calculate and send platform fee 
        //Total to go to platform = base fee / platform fee %
        //totalPlatformFee = totalRentCost.mult(PLATFORM_FEE.div(100));
        
        //Total to go to car owner = (base fee - platform fee from above) + time penalty + location penalty + charge penalty
        
        //Now calculate penalties to be used for amount to go to car owner
       
        //Odometer penalty. Number of miles over agreed total miles * odometer penalty per mile
        //totalOdometerPenalty = ((endOdometer - startOdometer) - ODOMETER_BUFFER) * ODOMETER_FINE;
        
        //Time penalty. Number of hours past agreed end date/time + buffer * time penalty per hour
        //totalTimePenalty = ((rentalAgreementEndDateTime - endDateTime) - TIME_BUFFER) * TIME_FINE
        
        //Location penalty. Number of metres away from vehicle start location * location penalty per m. Applies to both Longitude & latitude
        //Penalty is incurred if vehicle is more than buffer in m for each position (longitude & latitude)
        //So if buffer is 10m, and vehicle is off by 10m for both longitude & latitude, a double penalty will be incurred
        //longitudeDifference = abs(startVehicleLongitude - endVehicleLongitude);
        //latitudeDifference = abs(startVehicleLatitude - endVehicleLatitude);
        //totalLocationPenalty =  ((longitudeDifference - LOCATION_BUFFER) + (latitudeDifference - LOCATION_BUFFER)) * LOCATION_FINE;
        
        //Charge penalty. % of vehicle charge vehicle is off by based on required charge level * charge fine per % level
        //totalChargePenalty = (100 - endChargeState) - CHARGE_BUFFER * CHARGE_FINE;
        
        
        //Total to go to car owner = (base fee - platform fee from above) + time penalty + location penalty + charge penalty + location penalty
        //If total amount payable exceeds available bond funds, just send whole bond amount - platform fee
     //  if ((totalRentCost - totalPlatformFee) + totalOdometerPenalty + totalTimePenalty + totalTimePenalty + totalLocationPenalty > (totalRentCost + totalBond)) {
     //      totalRentPayable = totalRentCost + totalBond - platformFee;
      //      totalBondReturned = 0;
     //   } else { //we have enough funds in bond to pay car owner proper amount & send renter the remainng bond back
      //      totalRentPayable = (totalRentCost - totalPlatformFee) + totalOdometerPenalty + totalTimePenalty + totalTimePenalty + totalLocationPenalty;
            //total bond going back to renter is leftover from money in - money out from base fee + platform fee + penalties
      //      totalBondReturned = (totalRentCost + totalBond) - (totalRentPayable + totalPlatformFee) ;
       // }
        
        //Now that we have all fees & charges calculated, perform necessary transfers & then end contract
        //first pay platform fee
        dappWallet.transfer(totalPlatformFee);
        
        //then pay vehicle owner
        vehicleOwner.transfer(totalRentPayable);
        
        //finally, pay renter any bond returned. Only if > 0
        if (totalBondReturned > 0) {
            renter.transfer(totalBondReturned);
        }
        
        //Transfers all completed, now we just need to set contract status to successfully completed 
        agreementStatus = RentalAgreementFactory.RentalAgreementStatus.COMPLETED;
         
     }
    
   /**
     * @dev Step 04c: Car Owner ends an active contract due to the Renter not ending it, contract becomes ENDED_ERROR
     * Conditions for ending contract: Must be ACTIVE
     */ 
     function forceEndRentalContract() external returns (uint) {
         //error conditions
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
    function getAgreementDetails() public view returns (address,address,uint,uint,uint,uint,RentalAgreementFactory.RentalAgreementStatus ) {
        return (vehicleOwner,renter,startDateTime,endDateTime,totalRentCost,totalBond,agreementStatus);
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
    
/**
     * String Split 
     *
     * Splits a string into an array of strings based off the delimiter value.
     * Please note this can be quite a gas expensive function due to the use of
     * storage so only use if really required.
     *
     * @param _base When being used for a data type this is the extended object
     *               otherwise this is the string value to be split.
     * @param _value The delimiter to split the string on which must be a single
     *               character
     * @return string[] An array of values split based off the delimiter, but
     *                  do not container the delimiter.
     */
    function split(string memory _base, string memory _value)
        internal
        pure
        returns (string[] memory splitArr) {
        bytes memory _baseBytes = bytes(_base);

        uint _offset = 0;
        uint _splitsCount = 1;
        while (_offset < _baseBytes.length - 1) {
            int _limit = _indexOf(_base, _value, _offset);
            if (_limit == -1)
                break;
            else {
                _splitsCount++;
                _offset = uint(_limit) + 1;
            }
        }

        splitArr = new string[](_splitsCount);

        _offset = 0;
        _splitsCount = 0;
        while (_offset < _baseBytes.length - 1) {

             _limit = _indexOf(_base, _value, _offset);
            if (_limit == - 1) {
                _limit = int(_baseBytes.length);
            }

            string memory _tmp = new string(uint(_limit) - _offset);
            bytes memory _tmpBytes = bytes(_tmp);

            uint j = 0;
            for (uint i = _offset; i < uint(_limit); i++) {
                _tmpBytes[j++] = _baseBytes[i];
            }
            _offset = uint(_limit) + 1;
            splitArr[_splitsCount++] = string(_tmpBytes);
        }
        return splitArr;
    }
    
    /**
     * Index Of
     *
     * Locates and returns the position of a character within a string
     * 
     * @param _base When being used for a data type this is the extended object
     *              otherwise this is the string acting as the haystack to be
     *              searched
     * @param _value The needle to search for, at present this is currently
     *               limited to one character
     * @return int The position of the needle starting from 0 and returning -1
     *             in the case of no matches found
     */
    function indexOf(string memory _base, string memory _value)
        internal
        pure
        returns (int) {
        return _indexOf(_base, _value, 0);
    }

    /**
     * Index Of
     *
     * Locates and returns the position of a character within a string starting
     * from a defined offset
     * 
     * @param _base When being used for a data type this is the extended object
     *              otherwise this is the string acting as the haystack to be
     *              searched
     * @param _value The needle to search for, at present this is currently
     *               limited to one character
     * @param _offset The starting point to start searching from which can start
     *                from 0, but must not exceed the length of the string
     * @return int The position of the needle starting from 0 and returning -1
     *             in the case of no matches found
     */
    function _indexOf(string memory _base, string memory _value, uint _offset)
        internal
        pure
        returns (int) {
        bytes memory _baseBytes = bytes(_base);
        bytes memory _valueBytes = bytes(_value);

        assert(_valueBytes.length == 1);

        for (uint i = _offset; i < _baseBytes.length; i++) {
            if (_baseBytes[i] == _valueBytes[0]) {
                return int(i);
            }
        }

        return -1;
    }
    
    
}