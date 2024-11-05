import { loadFixture } from '@nomicfoundation/hardhat-toolbox/network-helpers';
import { expect } from "chai";
import hre from 'hardhat';
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";

describe('Election', function() {
  async function deploy() {
    const signers = await hre.ethers.getSigners();
    const [owner] = signers;

    const Election = await hre.ethers.getContractFactory('Election');

    const election = await Election.deploy(owner);

    return { election, owner, signers };
  }

  describe('Deployment', () => {
    it('should save owner address', async () => {
      const { election, owner } = await loadFixture(deploy);

      const electionOwner = await election.owner();

      expect(electionOwner).to.equal(owner.address)
    });

    it('should have zero parties registered', async () => {
      const { election } = await loadFixture(deploy);

      const counter = await election.partySize();

      expect(counter).to.equal(0)
    })
  })

  describe('Register Party', () => {
    it('should register a new party', async () => {
      const { election, signers } = await loadFixture(deploy);

      const [ acc1 ] = signers;

      let result = await election.registerParty('RedSocks');
      
      await expect(result)
        .to.emit(election, 'PartyRegistered')
        .withArgs(anyValue, acc1.address, anyValue);

      expect(await election.partySize()).to.be.equal(1);

      result = await election.registerParty('BlueLake');

      expect(await election.partySize()).to.be.equal(2);

      expect(await election.parties(1)).to.be.equal('RedSocks');
      expect(await election.partyId('RedSocks')).to.be.equal(1);

      expect(await election.parties(2)).to.be.equal('BlueLake');
      expect(await election.partyId('BlueLake')).to.be.equal(2);
    })

    it('should not register a party with the same name', async () => {
      const { election } = await loadFixture(deploy);

      await election.registerParty('RedSocks');

      await expect(election.registerParty('RedSocks')).to.be.reverted;
      expect(await election.partySize()).to.be.equal(1);
    })
  })

  describe('Voting', () => {
    it('should vote', async () => {
      const { election, signers } = await loadFixture(deploy);
      const [ owner, acc2, acc3 ] = signers;

      // register first party
      await election.registerParty('RedSocks');

      // vote from acc2
      let tx = await election.connect(acc2).vote('RedSocks');

      await expect(tx).to.emit(election, 'Voted').withArgs(acc2.address, 1);

      // vote from acc3
      tx = await election.connect(acc3).vote('RedSocks');

      await expect(tx).to.emit(election, 'Voted').withArgs(acc3.address, 1);

      // register another party
      await election.registerParty('BlueLake');

      // cannot vote if already voted
      await expect(election.connect(acc2).vote('BlueLake')).to.be.reverted;
    })

    it('should unvote', async () => {
      const { election, signers } = await loadFixture(deploy);
      const [ owner, acc2, acc3 ] = signers;

      // register first party
      await election.registerParty('Fake');
      await election.registerParty('RedSocks');

      // vote from acc2
      let tx = await election.connect(acc2).vote('RedSocks');

      // get party id and check votes count
      const partyId = await election.partyId('RedSocks');
      expect(await election.votes(partyId)).to.be.equal(1);

      // unvote
      tx = await election.connect(acc2).unvote();

      // check votes reduced after unvote
      expect(await election.votes(partyId)).to.be.equal(0);

      // check "Unvoted()" event with correct args
      await expect(tx).to.emit(election, 'Unvoted').withArgs(acc2.address, partyId);

      // reverted if no voted and try to unvote
      await expect(election.connect(acc3).unvote()).to.be.reverted;
    })
  })
});