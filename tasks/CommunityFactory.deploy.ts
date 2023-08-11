import { task } from "hardhat/config";

task("deploy:factory", "Deploy CommunityFactory contract").setAction(
    async function ({ _ }, { getNamedAccounts, deployments: { deploy } }) {
        const { deployer } = await getNamedAccounts();

        const communityImplementation = await deploy("Community", {
            from: deployer,
            args: [],
            log: true,
        });

        return await deploy("CommunityFactory", {
            from: deployer,
            args: [communityImplementation.address, deployer],
            log: true,
        });
    }
);
