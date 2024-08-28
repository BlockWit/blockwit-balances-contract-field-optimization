import {loadFixture,} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import {expect} from "chai";
import hre from "hardhat";

describe("BlockwitEmptyContractBytecodeOptimized", function () {

    async function deploy() {
        const [owner, otherAccount] = await hre.ethers.getSigners();

        const bytecode = "0x" +
            // constructor
            // - pointer to empty memory initialization
            "6080604052" +
            // - checks whether sent ether
            "348015600e575f80fd" +
            // - copy code to memory and return
            "5B50607280601a5f395ff3fe" +

            // smart-contract
            // - pointer to empty memory initialization
            "6080604052" +
            // - checks whether sent ether
             "348015600e575f80fd" +
            // - checks whether it 4-bytes function identifier call or not
            "5b5060043610602e57" +
            // - methods selector
            // -- load 4-bytes identifier from msg.data
            "5f3560e01c" +

            // is getBalance(address) ?
            "8063" + "f8b2cb4f" + "1460" + "51" + "57" +
            // is setBalance(address,uint256) ?
            "8063" + "e30443bc" + "1460" + "32" + "57" +
            // - revert in case of eth sent or 4-bytes function selector not found
            "5b5f80fd" +

            // - functions code
            // -- setBalance
            // --- read arguments size
            "5b3660049003" +
            // --- check size equals 0x40
            "60" + "40" + "141560" + "2e" + "57" +
            // --- read first argument from msg.data to stack
            "600435" +
            // --- calculate in where in storage write argument
            "5f525f60205220" +
            // --- read balance from msg.data to stack
            "602435" +
            // --- write balance to calculated address in storage
            "9055" +
            // --- return
            "5f80f3" +
            // -- getBalance
            // --- read arguments size
            "5b3660049003" +
            // --- check size equals 0x20
            "60" + "20" + "141560" + "2e" + "57" +
            // --- read first argument from msg.data to stack
            "600435" +
            // --- calculate from where in storage going to read balance
            "5f525f60205220" +
            // --- read balance from storage to stack
            "54" +
            // --- write balance from stack to memory
            "60405180919052" +
            // --- return with balance from memory
            "602090f3";


            /*

                        // metadata
                        "a2646970667358221220" +
                        "7b810610924a3e37878cfb5808a2dbf281ce1da8327dd4a672b13ccdfae4ab0f" +
                        "64736f6c6343" +
                        // - major version
                        "0008" +
                        // - minor version
                        "19" +
                        "0033";
            */
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