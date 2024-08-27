import {loadFixture,} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import {expect} from "chai";
import hre from "hardhat";

describe("BlockwitEmptyContractBytecodeNotOptimized", function () {

    async function deploy() {
        const [owner, otherAccount] = await hre.ethers.getSigners();

        const bytecode = "0x" +
            // constructor
            // - pointer to empty memory initialization
            "6080604052" +
            // - checks whether sent ether
            "348015600e575f80fd" +
            // - copy code to memory and return
            "5b506102b58061001c5f395ff3fe" +

            // smart-contract
            // - pointer to empty memory initialization
            "6080604052" +
            // - checks whether sent ether
            "34801561000f575f80fd" +
            // - checks whether it 4-bytes function identifier call or not
            "5b506004361061003f57" +
            // - methods selector
            // -- load 4-bytes identifier from msg.data
            "5f3560e01c" +
            // is balances(address) ?
            "8063" + "27e235e3" + "146100" + "43" + "57" +
            // is setBalance(address,uint256) ?
            "8063" + "e30443bc" + "146100" + "73" + "57" +
            // is getBalance(address) ?
            "8063" + "f8b2cb4f" + "146100" + "8f" + "57" +
            // - revert in case of eth sent or 4-bytes function selector not found
            "5b5f80fd" +
            // - functions code
            "5b61005d600480360381019061005891906101bb565b6100bf565b60405161006a91906101fe565b60405180910390f35b61008d60048036038101906100889190610241565b6100d3565b005b6100a960048036038101906100a491906101bb565b610118565b6040516100b691906101fe565b60405180910390f35b5f602052805f5260405f205f915090505481565b805f808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f20819055505050565b5f805f8373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f20549050919050565b5f80fd5b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f61018a82610161565b9050919050565b61019a81610180565b81146101a4575f80fd5b50565b5f813590506101b581610191565b92915050565b5f602082840312156101d0576101cf61015d565b5b5f6101dd848285016101a7565b91505092915050565b5f819050919050565b6101f8816101e6565b82525050565b5f6020820190506102115f8301846101ef565b92915050565b610220816101e6565b811461022a575f80fd5b50565b5f8135905061023b81610217565b92915050565b5f80604083850312156102575761025661015d565b5b5f610264858286016101a7565b92505060206102758582860161022d565b915050925092905056fe" +

            // metadata
            "a2646970667358221220" +
            "7b810610924a3e37878cfb5808a2dbf281ce1da8327dd4a672b13ccdfae4ab0f" +
            "64736f6c6343" +
            // - major version
            "0008" +
            // - minor version
            "19" +
            "0033";

        console.log(bytecode);
        console.log("Bytecode size: " + bytecode.length/2);

        const txReceipt = await owner.sendTransaction({data: bytecode})
        const txResult = await txReceipt.wait();

        if (txResult?.contractAddress == null)
            throw "Returned empty address";

        console.log("Gas used: " + txResult.gasUsed);

        const contractAddress = txResult.contractAddress;

        const BlockwitBalancesContract = await hre.ethers.getContractFactory("BlockwitBalancesContract");
        const blockwitBalancesContract = await BlockwitBalancesContract.attach(contractAddress);

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