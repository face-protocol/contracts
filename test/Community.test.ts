import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumberish } from "ethers";
import { deployments, ethers, network, run } from "hardhat";

import { Community, CommunityFactory } from "../typechain-types";
import { expectEvent, mineBlock } from "./shared/utils";

const { getContract, getContractAt, getSigners } = ethers;
const { MaxUint256 } = ethers.constants;
const { parseUnits } = ethers.utils;

describe("Test Community", function () {
    let owner: SignerWithAddress,
        other: SignerWithAddress,
        third: SignerWithAddress;
    let factory: CommunityFactory, community: Community;
    let snapshotId: any;

    before(async function () {
        [owner, other, third] = await getSigners();

        await deployments.fixture();

        // Make setup
        factory = await getContract("CommunityFactory");
        const tx = await factory.createCommunity(
            {
                name: "Stanford Community",
                symbol: "SC",
                rulesURI: "ipfs://uri",
                membershipDeposit: parseUnits("0.1"),
                membershipVotesThreshold: 300,
                votingDuration: 30,
                initialMembers: [owner.address, other.address],
                initialMembersDatas: ["data1", "data2"],
            },
            { value: parseUnits("0.2") }
        );
        const event = expectEvent(
            await tx.wait(),
            factory.address,
            "NewCommunity",
            {}
        )!;
        community = await getContractAt("Community", event.community);

        await community.delegateReputation(other.address, parseUnits("0.07"));
        await community
            .connect(other)
            .delegateReputation(owner.address, parseUnits("0.07"));
    });

    beforeEach(async function () {
        snapshotId = await network.provider.request({
            method: "evm_snapshot",
            params: [],
        });
    });

    afterEach(async function () {
        snapshotId = await network.provider.request({
            method: "evm_revert",
            params: [snapshotId],
        });
    });

    it("Initial community members are correcrt", async function () {
        expect(await community.balanceOf(owner.address)).to.equal(1);
        expect(await community.balanceOf(other.address)).to.equal(1);

        expect(await community.unusedDepositOf(owner.address)).to.equal(
            parseUnits("0.02")
        );
        expect(await community.unusedDepositOf(owner.address)).to.equal(
            parseUnits("0.02")
        );

        expect(await community.reputationOf(owner.address)).to.equal(
            parseUnits("0.07")
        );
        expect(await community.reputationOf(other.address)).to.equal(
            parseUnits("0.07")
        );

        expect((await community.applications(owner.address)).dataURI).to.equal(
            "data1"
        );
        expect((await community.applications(other.address)).dataURI).to.equal(
            "data2"
        );
    });

    it("New member should provide corect deposit", async function () {
        await expect(
            community.connect(third).applyForMembership("uri")
        ).to.be.revertedWith("Community: incorrect deposit");
    });

    it("Existing member shouldn't be able to apply", async function () {
        await expect(
            community.applyForMembership("uri", { value: parseUnits("0.1") })
        ).to.be.revertedWith("Community: already a member");
    });

    it("New member shuld be able to apply with deposit", async function () {
        const tx = await community
            .connect(third)
            .applyForMembership("uri", { value: parseUnits("0.1") });
        const receipt = await tx.wait();

        const application = await community.applications(third.address);
        expect(application.dataURI).to.equal("uri");
        expect(application.blockNumber).to.equal(receipt.blockNumber);
        expect(application.votesFor).to.equal(0);
    });

    it("Shouldn't be able to apply twice", async function () {
        await community
            .connect(third)
            .applyForMembership("uri", { value: parseUnits("0.1") });

        await expect(
            community
                .connect(third)
                .applyForMembership("uri", { value: parseUnits("0.1") })
        ).to.be.revertedWith("Community: already applied");
    });

    it("Should be able to start membership with successful vote", async function () {
        await community
            .connect(third)
            .applyForMembership("uri", { value: parseUnits("0.1") });

        await community.approveMembership(third.address);

        await community.connect(third).startMembership();

        expect(await community.balanceOf(third.address)).to.equal(1);
    });

    it("Shouldn't be able to start on failed vote", async function () {
        await community
            .connect(third)
            .applyForMembership("uri", { value: parseUnits("0.1") });
        await mineBlock(50);

        await expect(
            community.connect(third).startMembership()
        ).to.be.revertedWith("Community: not enough votes");
    });

    it("Shouldn't be able to start membership twice", async function () {
        await community
            .connect(third)
            .applyForMembership("uri", { value: parseUnits("0.1") });

        await community.approveMembership(third.address);

        await community.connect(third).startMembership();

        await expect(
            community.connect(third).startMembership()
        ).be.be.revertedWith("Community: already a member");
    });

    it("Should be able to delegate and revoke reputation", async function () {
        await community
            .connect(third)
            .applyForMembership("uri", { value: parseUnits("0.1") });

        await community.approveMembership(third.address);

        await community.connect(third).startMembership();

        expect(await community.unusedDepositOf(third.address)).to.equal(
            parseUnits("0.09")
        );
        expect(await community.reputationOf(owner.address)).to.equal(
            parseUnits("0.07")
        );

        const blockNumber = await ethers.provider.getBlockNumber();

        await community
            .connect(third)
            .delegateReputation(owner.address, parseUnits("0.09"));

        expect(await community.unusedDepositOf(third.address)).to.equal(0);
        expect(await community.reputationOf(owner.address)).to.equal(
            parseUnits("0.16")
        );
        expect(
            await community.pastReputationOf(owner.address, blockNumber)
        ).to.equal(parseUnits("0.07"));

        await community.connect(third).revokeReputation(owner.address);
        expect(await community.unusedDepositOf(third.address)).to.equal(
            parseUnits("0.09")
        );
        expect(await community.reputationOf(owner.address)).to.equal(
            parseUnits("0.07")
        );
    });
});
