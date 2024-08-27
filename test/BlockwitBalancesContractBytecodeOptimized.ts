import {loadFixture,} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import {expect} from "chai";
import hre from "hardhat";

describe("BlockwitBalancesContractOptimized", function () {

    async function deploy() {
        const [owner, otherAccount] = await hre.ethers.getSigners();

        const BlockwitBalancesContract = await hre.ethers.getContractFactory("BlockwitBalancesContract");
        const blockwitBalancesContract = await BlockwitBalancesContract.deploy();

        return {blockwitBalancesContract, owner, otherAccount};
    }

    describe("SmokyTests", function () {
        it("Write and read balance", async function () {
            const {blockwitBalancesContract, owner, otherAccount} = await loadFixture(deploy);

            const balance = 777;

            await blockwitBalancesContract.setBalance(otherAccount, balance);
            expect(await blockwitBalancesContract.getBalance(otherAccount)).to.equal(balance);
        });
    });

});