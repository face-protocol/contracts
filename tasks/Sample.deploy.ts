import { task } from "hardhat/config";

task("deploy:sample", "Deploy Sample contract").setAction(async function (
    { _ },
    { getNamedAccounts, deployments: { deploy } }
) {
    const { deployer } = await getNamedAccounts();

    return await deploy("Sample", {
        from: deployer,
        args: [],
        log: true,
    });
});
