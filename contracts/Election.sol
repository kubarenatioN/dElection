// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity >=0.8.27;

contract Election {
  address public owner;

  mapping(uint => string) public parties;

  mapping(string => uint) public partyId;

  mapping(address => uint) public partyOf;

  mapping(address => uint) public voters; 

  mapping(uint => uint) public votes;

  uint public partySize = 0;

  uint partyCounter = 1;

  event PartyRegistered(string _name, address _owner, uint _id);
  event Voted(address _address, uint _partyId);
  event Unvoted(address _address, uint _partyId);

  constructor(address _owner) {
    owner = _owner;
  }

  function registerParty(string calldata _name) public returns(bool) {
    // check if party already exists
    bool partyExists = false;
    for (uint i = 0; i < partyCounter; i++) {
      if (keccak256(bytes(parties[i])) == keccak256(bytes(_name))) {
        partyExists = true;
        break;
      }
    }

    // if such party exists, revert
    if (partyExists) {
      revert('Such party name already exists');
    }

    // register new party and party owner
    partyId[_name] = partyCounter;

    parties[partyCounter] = _name;

    address partyOwner = msg.sender;
    partyOf[partyOwner] = partyCounter;

    // emit event
    emit PartyRegistered(_name, partyOwner, partyCounter);
    
    partySize++;
    partyCounter++;

    // return success
    return true;
  }

  // function getAllParties() public view {
    
  // }

  function vote(string calldata _partyName) public returns(bool success) {
    uint id = partyId[_partyName];
    if (id == 0) {
      revert('No party found by given name');
    }

    address voter = msg.sender;
    if (voter == owner) {
      revert('You cannot vote for yourself');
    }

    uint lastVote = voters[voter];
    if (lastVote > 0) {
      revert('You already voted');
    }

    voters[voter] = id;
    votes[id] += 1;
    emit Voted(voter, id);

    return true;
  }

  function unvote() public returns(bool success) {
    address voter = msg.sender;
    if (voters[voter] == 0) {
      revert('You have no vote');
    }

    uint _partyId = voters[voter];
    voters[voter] = 0;
    votes[_partyId] -= 1;
    emit Unvoted(voter, _partyId);

    return true;
  }
}