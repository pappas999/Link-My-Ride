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


contract RentalAgreementFactory {
    
    using SafeMath_Chainlink for uint;
    
    address public dappWallet = msg.sender;
    enum RentalAgreementStatus {PROPOSED, APPROVED, REJECTED, ACTIVE, COMPLETED, ENDED_ERROR}
    uint public constant DAY_IN_SECONDS = 60; //How many seconds in a day. 60 for testing, 86400 for Production
    bytes32 job_id = "abcdef"; //jobID of oracle to use for gets & posts?
    address public constant LINK_ROPSTEN = 0x20fE562d797A42Dcb3399062AE9546cd06f63280; //address of LINK token on Ropsten
    address public constant ORACLE_CONTRACT = 0x4a3fbbb385b5efeb4bc84a25aaadcd644bd09721;
    uint256 constant private ORACLE_PAYMENT = 0.1 * 1 ether;
    
    
    enum VehicleModels { Model_S, Model_3, Model_X, Model_Y, Cybertruck, Roadster}

    
    //struct to represent a car on the platform to be rented
    struct Vehicle {
        uint vehicleId;                // Tesla assigned ID of vehicle
        address ownerAddress;          // Wallet address of vehicle owner
        string apiTokenHash;           // Hashed version of the token  
        uint baseHireFee;              // Base fee for hire 
        uint bondRequired;             // Bond required for each rental contract
        VehicleModels vehicleModel;    // Model of the vehicle
        string renterDescription;      // Basic description of renter
    }
    
    //here is where all the cars to rent are stored. Currently each vehicle must have a unique wallet tied to it.
    mapping (address => Vehicle) vehicles; 
    
    //here is where all the rental agreements are stored. 
    RentalAgreement[] rentalAgreements;
    //mapping (address => RentalAgreement) rentalAgreements; 
    
    constructor() public payable {
        //this code adds a vehicle so we don't have to keep doing it manually as part of development, then it creates a simple contract for the vehicle
        newVehicle(0x54a47c5e6a6CEc35eEB23E24C6b3659eE205eE35,123,'sadfasfasdfsda',0.1 * 1 ether,1 ether,VehicleModels.Model_S,'harrys car');
        newRentalAgreement(0x54a47c5e6a6CEc35eEB23E24C6b3659eE205eE35,0xaF9aA280435E8C13cf8ebE1827CBB402CE65bBf7,1599565516,1599569916,100000000000000000,1000000000000000000);
    }
    
    /**
     * @dev Prevents a function being run unless it's called by DAPP owner
     */
    modifier onlyOwner() {
        require(dappWallet == msg.sender,'Only Insurance provider can do this');
        _;
    }
    
    //List of events
    event rentalAgreementCreated(address _newAgreement, uint _totalFundsHeld);
    event vehicleAdded( uint _vehicleId, address _vehicleOwner, string _apiTokenHash, uint _baseHireFee, uint _bondRequired, VehicleModels _vehicleModel, string _description);
    
    /**
     * @dev Create a new Rental Agreement. Once it's created, all logic & flow is handled from within the RentalAgreement Contract
     */ 
    function newRentalAgreement(address _vehicleOwner, address _renter, uint _startDateTime, uint _endDateTime, uint _totalRentCost, uint _totalBond) public payable returns(address) {
       //vehicle owner must be different to renter
       require (_vehicleOwner != _renter,'Owner & Renter must be different');
       
       //start date must be < end date and must be at least 1 hour (3600 seconds)
       require (_endDateTime >= _startDateTime.add(3600),'Vehicle Agreement must be for a minimum of 1 hour');
       
       //ensure start date is now or in the future
       //require (_startDateTime >= now,'Vehicle Agreement cannot be in the past');
       
       //Ensure correct amount of ETH has been sent for total rent cost & bond
       //require (msg.value >= _totalRentCost.add(_totalBond),'Incorrect rent & bond paid');
        
       //create new Rental Agreement
       RentalAgreement a = new RentalAgreement(_vehicleOwner, _renter, _startDateTime, _endDateTime, _totalRentCost, _totalBond,  
                                                 LINK_ROPSTEN, ORACLE_CONTRACT, ORACLE_PAYMENT, job_id);
       
       //get price of ETH from price feeds to be used in calculations. or do it in web3 before solidity
       
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
    function newVehicle(address _vehicleOwner, uint _vehicleId, string _apiTokenHash, uint _baseHireFee, uint _bondRequired, VehicleModels _vehicleModel, 
                        string _description) public  {
           
      //adds a vehicle and stores it in the vehicles mapping. Each vehicle is represented by 1 Ethereum address
        
      var v = vehicles[_vehicleOwner];
      v.vehicleId = _vehicleId;
      v.ownerAddress = _vehicleOwner;
      v.apiTokenHash = _apiTokenHash;
      v.baseHireFee = _baseHireFee;
      v.bondRequired = _bondRequired;
      v.vehicleModel = _vehicleModel;
      v.renterDescription = _description;
      
        
      emit vehicleAdded(_vehicleId, _vehicleOwner, _apiTokenHash, _baseHireFee, _bondRequired, _vehicleModel, _description);
        
    }
    
    /**
     * @dev Return a particular Vehicle struct based on a wallet address
     */
    function getVehicle(address _walletOwner) external view returns (Vehicle) {
        return vehicles[_walletOwner];
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
    function getRentalContracts() external view returns (address) {
        //loop through list of contracts, and find any belonging to the address & type (renter or vehicle owner)
        //address[] addresses;
        
       // for (uint i = 0; i < rentalAgreements.length; i++) {
           //addresses.push(address(rentalAgreements[i]));
       // }
        
        return address(rentalAgreements[0]);
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
        
       //first ensure insurer has fully funded the contract
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
     function approveContract() external returns (uint) {
         //Vehicle Owner simply looks at proposed agreement & either approves or denies it.
         //In this case, we approve. Contract becomes Approved and sits waiting until start time reaches
         agreementStatus = RentalAgreementFactory.RentalAgreementStatus.APPROVED;
         //do we transfer $ now or at star time? prob at start time
         //prob easiest to pay at this stage
     }
     
   /**
     * @dev Step 02b: Owner REJECTS proposal, contract becomes REJECTED. This is the end of the line for the Contract
     */ 
     function rejectContract() external returns (uint) {
         //Vehicle Owner simply looks at proposed agreement & either approves or denies it.
         //In this case, we approve. Contract becomes Rejected. No more actions should be possible on the contract in this status
         //return money to renter
         agreementStatus = RentalAgreementFactory.RentalAgreementStatus.REJECTED;
     }
     
   /**
     * @dev Step 03a: Renter starts contract, contract becomes ACTIVE
     * Conditions for starting contract: Must be APPROVED, & Start Date/Time must be <= current Date/Time
     */ 
     function activeteRentalContract() external returns (uint) {
         //First we need to wake up the vehicle & obtain some values needed in the contract before the vehicle can be unlocked & started
         //do external adapter call to wake up vehicle & get vehicle data
     }
     
   /**
     * @dev Step 03b: Callback function for obtaining vehicle data as part of rental agreement beginning
     * If we get to this stage, it means the vehicle successfully returned the required data to start the agreement, & the vehicle has been unlocked
     * Only the contract should be able to call this function
     */ 
     function activeteRentalContractFallback(string _vehicleData) public returns (uint) {
        //Set contract variables to start the agreement
        //ask on discord how to get 3 int values, is best way to have a delimited string?
        startOdometer = 0; 
        startVehicleLongitude = 0; 
        startVehicleLatitide = 0; 
        
        //Values have been set, now set the contract to ACTIVE
        agreementStatus = RentalAgreementFactory.RentalAgreementStatus.ACTIVE;
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
     * @dev Return All Details about a Vehicle Rental Agreement
     */ 
    function getAgreementDetails() public view returns (address,address,uint,uint,uint,uint,RentalAgreementFactory.RentalAgreementStatus ) {
        return (vehicleOwner,renter,startDateTime,endDateTime,totalRentCost,totalBond,agreementStatus);
    }
    
    
}




    
    